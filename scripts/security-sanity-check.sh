#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fail() { printf 'security_sanity_error=%s\n' "$1" >&2; exit 1; }

PUBLIC_PATHS=(
  "$ROOT/index.html"
  "$ROOT/app.js"
  "$ROOT/platform.js"
  "$ROOT/supabase-client.js"
  "$ROOT/runtime-config.js"
  "$ROOT/src"
  "$ROOT/dist/index.html"
  "$ROOT/dist/app.js"
  "$ROOT/dist/platform.js"
  "$ROOT/dist/supabase-client.js"
  "$ROOT/dist/runtime-config.js"
  "$ROOT/dist/src"
)
existing=()
for path in "${PUBLIC_PATHS[@]}"; do [[ -e "$path" ]] && existing+=("$path"); done
(( ${#existing[@]} > 0 )) || fail no_public_artifacts

matches="$(grep -RInE \
  --exclude='security-sanity-check.sh' \
  --exclude='*.map' \
  'SUPABASE_SERVICE_ROLE_KEY|service[_-]?role[[:space:]]*[:=]|BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' \
  "${existing[@]}" 2>/dev/null || true)"
[[ -z "$matches" ]] || { printf '%s\n' "$matches" >&2; fail privileged_pattern_in_public_artifact; }

if git -C "$ROOT" ls-files | grep -Eiq '(^|/)(\.env$|.*\.(pem|key|p12|pfx|crt)$|.*(credential|secret).*)'; then
  git -C "$ROOT" ls-files | grep -Ei '(^|/)(\.env$|.*\.(pem|key|p12|pfx|crt)$|.*(credential|secret).*)' >&2
  fail secret_like_path_tracked
fi

for required in vercel.json runtime-config.js supabase/config.toml supabase/functions/delete-account/index.ts; do
  [[ -f "$ROOT/$required" ]] || fail "critical_file_missing:$required"
done

printf 'security_sanity=passed\npublic_artifacts_scanned=%s\nprivileged_patterns=clear\ntracked_secret_like_paths=clear\n' "${#existing[@]}"
