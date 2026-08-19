import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Request-ID",
};

const requestIdPattern = /^[A-Za-z0-9._:-]{1,128}$/;

type AuditEvent = {
  requestId: string;
  method: string;
  event: string;
  status: number;
};

function getRequestId(request: Request): string {
  const incoming = request.headers.get("x-request-id")?.trim() || "";
  return requestIdPattern.test(incoming) ? incoming : crypto.randomUUID();
}

function emitAuditEvent({ requestId, method, event, status }: AuditEvent): void {
  // Never log Authorization, cookies, payloads, user IDs, emails, or error details.
  console.info(JSON.stringify({
    service: "delete-account",
    event,
    request_id: requestId,
    method,
    status,
  }));
}

function jsonResponse(
  body: unknown,
  status: number,
  requestId: string,
  method: string,
  event: string,
): Response {
  emitAuditEvent({ requestId, method, event, status });
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "X-Request-ID": requestId,
    },
  });
}

function optionsResponse(requestId: string, method: string): Response {
  emitAuditEvent({ requestId, method, event: "preflight", status: 200 });
  return new Response("ok", {
    status: 200,
    headers: {
      ...corsHeaders,
      "X-Request-ID": requestId,
    },
  });
}

Deno.serve(async (request) => {
  const requestId = getRequestId(request);

  if (request.method === "OPTIONS") {
    return optionsResponse(requestId, request.method);
  }
  if (request.method !== "POST") {
    return jsonResponse(
      { error: "method_not_allowed" },
      405,
      requestId,
      request.method,
      "method_not_allowed",
    );
  }

  const authorization = request.headers.get("authorization") || "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY")
    || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")
    || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return jsonResponse(
      { error: "function_configuration_invalid" },
      500,
      requestId,
      request.method,
      "configuration_invalid",
    );
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return jsonResponse(
      { error: "unauthorized" },
      401,
      requestId,
      request.method,
      "unauthorized",
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);

  if (deleteError) {
    return jsonResponse(
      { error: "account_deletion_failed" },
      500,
      requestId,
      request.method,
      "account_deletion_failed",
    );
  }

  return jsonResponse(
    { ok: true },
    200,
    requestId,
    request.method,
    "account_deleted",
  );
});
