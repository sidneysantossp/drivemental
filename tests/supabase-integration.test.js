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
const adminMigration = fs.readFileSync(
  "supabase/migrations/202606240002_admin_foundation.sql",
  "utf8",
);
const deleteAccount = fs.readFileSync(
  "supabase/functions/delete-account/index.ts",
  "utf8",
);
const supabaseConfig = fs.readFileSync("supabase/config.toml", "utf8");
const clientSource = fs.readFileSync("supabase-client.js", "utf8");
const deployScript = fs.readFileSync("scripts/deploy-supabase.ps1", "utf8");
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
assert.ok(adminMigration.includes("create table if not exists public.admin_roles"));
assert.ok(adminMigration.includes("create table if not exists public.app_settings"));
assert.ok(adminMigration.includes("create table if not exists public.admin_audit_logs"));
assert.ok(adminMigration.includes("alter table public.admin_roles enable row level security"));
assert.ok(adminMigration.includes("alter table public.app_settings enable row level security"));
assert.ok(adminMigration.includes("create policy admin_roles_select_own"));
assert.ok(adminMigration.includes("create policy app_settings_select_admin"));
assert.ok(adminMigration.includes("create policy app_settings_update_admin"));
assert.ok(adminMigration.includes("grant select, update on public.app_settings to authenticated"));
assert.ok(adminMigration.includes("'plans.display'"));
assert.ok(adminMigration.includes('"premiumPrice": "29,90"'));
assert.ok(adminMigration.includes('"mentorPrice": "97,00"'));

assert.ok(deleteAccount.includes("auth.admin.deleteUser"));
assert.ok(deleteAccount.includes("auth.getUser"));
assert.ok(!supabaseConfig.includes("[functions.payment-webhook]"));
assert.ok(supabaseConfig.includes("[functions.delete-account]"));
assert.ok(supabaseConfig.includes("verify_jwt = true"));

assert.ok(clientSource.includes("signInWithPassword"));
assert.ok(clientSource.includes("resetPasswordForEmail"));
assert.ok(clientSource.includes('functions.invoke("delete-account"'));
assert.ok(!clientSource.includes('from("access_entitlements")'));
assert.ok(clientSource.includes("getAdminRole"));
assert.ok(clientSource.includes("loadAdminSettings"));
assert.ok(clientSource.includes("saveAdminSettings"));
assert.ok(clientSource.includes('from("admin_roles")'));
assert.ok(clientSource.includes('from("app_settings")'));
assert.ok(deployScript.includes("npx.cmd"));
assert.ok(deployScript.includes("--db-url"));
assert.ok(runtimeExample.includes('authMode: "supabase"'));
assert.ok(runtimeExample.includes("supabasePublishableKey"));
assert.ok(runtimeExample.includes('paymentProvider: "hotmart"'));

assert.ok(workflow.includes("permissions:"));
assert.ok(workflow.includes("contents: read"));
assert.ok(workflow.includes("npm test"));

console.log("supabase integration tests passed");
