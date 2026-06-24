const assert = require("assert");
const fs = require("fs");

const migration = fs.readFileSync(
  "supabase/migrations/202606130001_initial_schema.sql",
  "utf8",
);
const paymentWebhook = fs.readFileSync(
  "supabase/functions/payment-webhook/index.ts",
  "utf8",
);
const deleteAccount = fs.readFileSync(
  "supabase/functions/delete-account/index.ts",
  "utf8",
);
const supabaseConfig = fs.readFileSync("supabase/config.toml", "utf8");
const clientSource = fs.readFileSync("supabase-client.js", "utf8");
const runtimeExample = fs.readFileSync("runtime-config.example.js", "utf8");
const workflow = fs.readFileSync(".github/workflows/ci.yml", "utf8");

assert.ok(migration.includes("references auth.users(id) on delete cascade"));
assert.strictEqual(
  (migration.match(/enable row level security/g) || []).length,
  8,
);
for (const table of [
  "profiles",
  "consent_records",
  "readings",
  "journey_progress",
  "protocol_progress",
  "timeline_events",
  "access_entitlements",
  "payment_webhook_events",
]) {
  assert.ok(
    migration.includes(`alter table public.${table} enable row level security`),
    table,
  );
}
assert.ok(migration.includes('(select auth.uid()) = user_id'));
assert.ok(migration.includes("grant select on public.access_entitlements to authenticated"));
assert.ok(!migration.includes("grant insert on public.access_entitlements to authenticated"));
assert.ok(!migration.includes("grant update on public.access_entitlements to authenticated"));
assert.ok(!migration.includes("grant select on public.payment_webhook_events to authenticated"));

assert.ok(paymentWebhook.includes('Deno.env.get("PAYMENT_WEBHOOK_SECRET")'));
assert.ok(paymentWebhook.includes('Deno.env.get("PAYMENT_PRODUCT_PLAN_MAP")'));
assert.ok(paymentWebhook.includes('Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")'));
assert.ok(paymentWebhook.includes('processing_status: "pending_user"'));
assert.ok(paymentWebhook.includes('eventInsertError?.code === "23505"'));
assert.ok(paymentWebhook.includes("buyer_email_hash"));
assert.ok(!paymentWebhook.includes("payload: payload"));

assert.ok(deleteAccount.includes("auth.admin.deleteUser"));
assert.ok(deleteAccount.includes("auth.getUser"));
assert.ok(supabaseConfig.includes("[functions.payment-webhook]"));
assert.ok(supabaseConfig.includes("verify_jwt = false"));
assert.ok(supabaseConfig.includes("[functions.delete-account]"));
assert.ok(supabaseConfig.includes("verify_jwt = true"));

assert.ok(clientSource.includes("signInWithPassword"));
assert.ok(clientSource.includes("resetPasswordForEmail"));
assert.ok(clientSource.includes('functions.invoke("delete-account"'));
assert.ok(clientSource.includes('from("access_entitlements")'));
assert.ok(runtimeExample.includes('authMode: "supabase"'));
assert.ok(runtimeExample.includes("supabasePublishableKey"));
assert.ok(runtimeExample.includes('paymentProvider: "hotmart"'));

assert.ok(workflow.includes("permissions:"));
assert.ok(workflow.includes("contents: read"));
assert.ok(workflow.includes("npm test"));

console.log("supabase integration tests passed");
