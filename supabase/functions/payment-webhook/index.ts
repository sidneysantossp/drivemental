import { createClient } from "npm:@supabase/supabase-js@2";
import { jsonResponse } from "../_shared/responses.ts";

type JsonRecord = Record<string, unknown>;

const activeEvents = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "SUBSCRIPTION_ACTIVATED",
  "SUBSCRIPTION_RENEWED",
]);

const inactiveEvents: Record<string, string> = {
  PURCHASE_CANCELED: "canceled",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  CHARGEBACK: "chargeback",
  REFUND: "refunded",
  SUBSCRIPTION_CANCELLATION: "canceled",
  SUBSCRIPTION_CANCELED: "canceled",
};

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return "";
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function secretsMatch(expected: string, received: string): Promise<boolean> {
  if (!expected || !received) {
    return false;
  }
  return (await sha256(expected)) === (await sha256(received));
}

function parseProductPlanMap(): Record<string, string> {
  try {
    const parsed = JSON.parse(Deno.env.get("PAYMENT_PRODUCT_PLAN_MAP") || "{}");
    return asRecord(parsed) as Record<string, string>;
  } catch {
    return {};
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("PAYMENT_WEBHOOK_SECRET") || "";
  const url = new URL(request.url);
  const authorization = request.headers.get("authorization") || "";
  const receivedSecret = firstText(
    request.headers.get("x-hotmart-hottok"),
    request.headers.get("hottok"),
    url.searchParams.get("hottok"),
    authorization.replace(/^Bearer\s+/i, ""),
  );

  if (!(await secretsMatch(expectedSecret, receivedSecret))) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const rawBody = await request.text();
  let payload: JsonRecord;
  try {
    payload = asRecord(JSON.parse(rawBody));
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const data = asRecord(payload.data);
  const buyer = asRecord(data.buyer);
  const purchase = asRecord(data.purchase);
  const product = asRecord(data.product);
  const subscription = asRecord(data.subscription);

  const eventType = firstText(payload.event, payload.event_type, data.event).toUpperCase();
  const buyerEmail = firstText(
    buyer.email,
    data.email,
    payload.email,
  ).toLowerCase();
  const productId = firstText(
    product.id,
    data.product_id,
    payload.product_id,
  );
  const transactionRef = firstText(
    purchase.transaction,
    purchase.order_id,
    data.transaction,
    payload.transaction,
  );
  const subscriptionRef = firstText(
    subscription.subscriber_code,
    subscription.id,
    data.subscription_id,
  );
  const buyerRef = firstText(
    buyer.id,
    buyer.ucode,
    data.buyer_id,
  );
  const providerEventId = firstText(
    payload.id,
    payload.event_id,
    request.headers.get("x-hotmart-event-id"),
    await sha256(rawBody),
  );

  if (!eventType || !productId || !buyerEmail) {
    return jsonResponse({ error: "unsupported_payload" }, 422);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sanitizedPayload = {
    buyer_email_hash: await sha256(buyerEmail),
    product_id: productId,
    transaction_ref: transactionRef || null,
    subscription_ref: subscriptionRef || null,
  };

  const { error: eventInsertError } = await admin
    .from("payment_webhook_events")
    .insert({
      provider: "hotmart",
      provider_event_id: providerEventId,
      event_type: eventType,
      payload: sanitizedPayload,
    });

  if (eventInsertError?.code === "23505") {
    return jsonResponse({ ok: true, duplicate: true });
  }
  if (eventInsertError) {
    return jsonResponse({ error: "event_persistence_failed" }, 500);
  }

  const planId = parseProductPlanMap()[productId];
  if (!planId) {
    await admin
      .from("payment_webhook_events")
      .update({
        processing_status: "ignored_product",
        processed_at: new Date().toISOString(),
      })
      .eq("provider", "hotmart")
      .eq("provider_event_id", providerEventId);
    return jsonResponse({ ok: true, ignored: true });
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("user_id")
    .eq("email", buyerEmail)
    .maybeSingle();

  if (profileError || !profile) {
    await admin
      .from("payment_webhook_events")
      .update({
        processing_status: "pending_user",
        processing_error: "No account matches the purchase email.",
      })
      .eq("provider", "hotmart")
      .eq("provider_event_id", providerEventId);
    return jsonResponse({ ok: true, pending_user: true }, 202);
  }

  const entitlementStatus = activeEvents.has(eventType)
    ? "active"
    : inactiveEvents[eventType];

  if (!entitlementStatus) {
    await admin
      .from("payment_webhook_events")
      .update({
        processing_status: "ignored_event",
        processed_at: new Date().toISOString(),
      })
      .eq("provider", "hotmart")
      .eq("provider_event_id", providerEventId);
    return jsonResponse({ ok: true, ignored: true });
  }

  const { error: entitlementError } = await admin
    .from("access_entitlements")
    .upsert({
      user_id: profile.user_id,
      provider: "hotmart",
      provider_customer_ref: buyerRef || null,
      provider_transaction_ref: transactionRef || null,
      provider_subscription_ref: subscriptionRef || null,
      product_id: productId,
      plan_id: planId,
      status: entitlementStatus,
    }, {
      onConflict: "user_id,provider,product_id",
    });

  await admin
    .from("payment_webhook_events")
    .update({
      processing_status: entitlementError ? "failed" : "processed",
      processing_error: entitlementError?.message || null,
      processed_at: new Date().toISOString(),
    })
    .eq("provider", "hotmart")
    .eq("provider_event_id", providerEventId);

  if (entitlementError) {
    return jsonResponse({ error: "entitlement_update_failed" }, 500);
  }

  return jsonResponse({ ok: true });
});
