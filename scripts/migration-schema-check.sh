#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS="$ROOT/supabase/migrations"
fail() { printf 'migration_check_error=%s\n' "$1" >&2; exit 1; }

[[ -d "$MIGRATIONS" ]] || fail migrations_directory_missing
mapfile -t files < <(find "$MIGRATIONS" -maxdepth 1 -type f -name '*.sql' -printf '%f\n' | sort)
(( ${#files[@]} > 0 )) || fail no_migrations

previous=""
for file in "${files[@]}"; do
  [[ "$file" =~ ^[0-9]{12}_[a-z0-9_]+\.sql$ ]] || fail "invalid_migration_filename:$file"
  prefix="${file:0:12}"
  [[ "$prefix" != "$previous" ]] || fail "duplicate_migration_timestamp:$prefix"
  previous="$prefix"
  grep -qiE '(^|[[:space:]])(create|alter|drop|insert|update|delete|grant|revoke|do|comment|begin|commit)[[:space:]]' "$MIGRATIONS/$file" || fail "migration_has_no_sql_statement:$file"
done

for critical in \
  202606130001_initial_schema.sql \
  202606240001_remove_payment_integration.sql \
  202606240002_admin_foundation.sql \
  202606240003_admin_users_plans.sql \
  202607160001_first_reading_flow.sql \
  202607170001_consultation_guardrails.sql; do
  [[ -f "$MIGRATIONS/$critical" ]] || fail "critical_migration_missing:$critical"
done

node -e "JSON.parse(require('fs').readFileSync('$ROOT/vercel.json','utf8'))" || fail vercel_json_invalid
grep -q 'verify_jwt = false' "$ROOT/supabase/config.toml" || fail edge_verify_jwt_policy_missing
grep -q 'environment: \"production\"' "$ROOT/runtime-config.js" || fail runtime_environment_not_production
grep -q 'authMode: \"supabase\"' "$ROOT/runtime-config.js" || fail runtime_auth_mode_mismatch

printf 'migration_schema_check=passed\nfiles=%s\n' "${#files[@]}"
