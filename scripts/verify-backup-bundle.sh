#!/usr/bin/env bash
set -Eeuo pipefail

BUNDLE="${1:-${DM_BACKUP_BUNDLE:-}}"
[[ -n "$BUNDLE" ]] || { printf 'verify_error=bundle_required\n' >&2; exit 1; }
[[ -d "$BUNDLE" ]] || { printf 'verify_error=bundle_missing\n' >&2; exit 1; }
for file in manifest.txt roles.sql schema.sql data.sql; do
  [[ -f "$BUNDLE/$file" ]] || { printf 'verify_error=missing_%s\n' "$file" >&2; exit 1; }
done

(cd "$BUNDLE" && sha256sum -c <(grep -E '^[0-9a-f]{64}  (roles|schema|data)\.sql$' manifest.txt))
if grep -Eiq 'SUPABASE_SERVICE_ROLE_KEY|BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY|postgres(ql)?://[^[:space:]]+:[^@[:space:]]+@|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' "$BUNDLE"/*.sql "$BUNDLE"/manifest.txt; then
  printf 'verify_error=credential_pattern_detected\n' >&2
  exit 1
fi

printf 'bundle_verified=true\nmode=logical\nfiles=roles.sql,schema.sql,data.sql,manifest.txt\n'
