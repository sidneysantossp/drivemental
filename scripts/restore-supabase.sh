#!/usr/bin/env bash
set -Eeuo pipefail

PRODUCTION_REF="qgvlkpaociypyxduvsqm"
BUNDLE="${DM_BACKUP_BUNDLE:-}"
TARGET_URL="${SUPABASE_RESTORE_DB_URL:-}"
CONFIRM="${SUPABASE_RESTORE_CONFIRM:-}"

fail() {
  printf 'restore_supabase_error=%s\n' "$1" >&2
  exit 1
}

[[ -n "$BUNDLE" ]] || fail "DM_BACKUP_BUNDLE must point to an extracted backup directory"
[[ -d "$BUNDLE" ]] || fail "backup bundle directory does not exist"
[[ -n "$TARGET_URL" ]] || fail "SUPABASE_RESTORE_DB_URL must be provided through the environment"
[[ "$CONFIRM" == "YES_ISOLATED_TARGET" ]] || fail "set SUPABASE_RESTORE_CONFIRM=YES_ISOLATED_TARGET"

if [[ "$TARGET_URL" == *"$PRODUCTION_REF"* || "$TARGET_URL" == *"drivemental.vercel.app"* ]]; then
  fail "production target is prohibited; restore only into a disposable or isolated project"
fi

for file in schema.sql data.sql; do
  [[ -s "$BUNDLE/$file" ]] || fail "missing or empty $file"
done

if [[ -f "$BUNDLE/manifest.txt" ]]; then
  (cd "$BUNDLE" && sha256sum -c <(grep -E '^[0-9a-f]{64}  (roles|schema|data)\.sql$' manifest.txt)) || fail "backup hash verification failed"
fi

export PGSSLMODE="${PGSSLMODE:-require}"
# The isolated target must be empty or disposable. Recreate only public there;
# the production URL guard above prevents this operation against production.
psql --single-transaction --set ON_ERROR_STOP=1 \
  --command 'drop schema if exists public cascade;' \
  --dbname "$TARGET_URL"
# roles.sql is intentionally not executed automatically: managed Supabase roles
# require review in the target project and may not be recreated by a normal user.
psql --single-transaction --set ON_ERROR_STOP=1 \
  --file "$BUNDLE/schema.sql" \
  --file "$BUNDLE/data.sql" \
  --dbname "$TARGET_URL" \
  >/tmp/dm-supabase-restore.log 2>&1 || {
    tail -40 /tmp/dm-supabase-restore.log >&2
    exit 1
  }

printf 'restore_completed=true\ntarget_class=isolated\nroles_sql=manual_review_required\n'
