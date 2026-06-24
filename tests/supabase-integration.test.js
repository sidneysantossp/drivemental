const assert = require("assert");
const fs = require("fs");

const migration = fs.readFileSync(
  "supabase/migrations/202606130001_initial_schema.sql",
  "utf8",
);
const paymentRemovalMigration = fs.readFileSync(
  "supabase/migrations/202606240001_remove_payment_integration.sql",
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
assert.ok(paymentRemovalMigration.includes("drop table if exists public.payment_webhook_events"));
assert.ok(paymentRemovalMigration.includes("drop table if exists public.access_entitlements"));
assert.ok(!fs.existsSync("supabase/functions/payment-webhook/index.ts"));

assert.ok(deleteAccount.includes("auth.admin.deleteUser"));
assert.ok(deleteAccount.includes("auth.getUser"));
assert.ok(!supabaseConfig.includes("[functions.payment-webhook]"));
assert.ok(supabaseConfig.includes("[functions.delete-account]"));
assert.ok(supabaseConfig.includes("verify_jwt = true"));

assert.ok(clientSource.includes("signInWithPassword"));
assert.ok(clientSource.includes("resetPasswordForEmail"));
assert.ok(clientSource.includes('functions.invoke("delete-account"'));
assert.ok(!clientSource.includes('from("access_entitlements")'));
assert.ok(runtimeExample.includes('authMode: "supabase"'));
assert.ok(runtimeExample.includes("supabasePublishableKey"));
assert.ok(runtimeExample.includes('paymentProvider: "hotmart"'));

assert.ok(workflow.includes("permissions:"));
assert.ok(workflow.includes("contents: read"));
assert.ok(workflow.includes("npm test"));

console.log("supabase integration tests passed");
