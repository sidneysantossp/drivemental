#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/dm-f6-observability.XXXXXX")"
PORT="8000"
LOG="$TMP/deno.log"
cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill -- -"$SERVER_PID" >/dev/null 2>&1 || true
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP"
}
trap cleanup EXIT

# Intentionally omit all Supabase secrets and URLs. POST must stop at the
# configuration guard and return a controlled synthetic 5xx.
unset SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_PUBLISHABLE_KEY SUPABASE_SERVICE_ROLE_KEY
setsid npx --yes deno run --node-modules-dir=auto --allow-net --allow-env "$ROOT/supabase/functions/delete-account/index.ts" >"$LOG" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 60); do
  if curl -sS --max-time 1 "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then break; fi
  sleep 0.25
done

probe() {
  local label="$1" method="$2" expected="$3"; shift 3
  local request_id="dm-f6-local-${label}" headers="$TMP/${label}.headers" body="$TMP/${label}.body" status returned_id
  status="$(curl -sS --max-time 10 -X "$method" -H "x-request-id: $request_id" "$@" -D "$headers" -o "$body" -w '%{http_code}' "http://127.0.0.1:${PORT}/")" || {
    cat "$LOG" >&2
    exit 1
  }
  [[ "$status" == "$expected" ]] || { echo "unexpected_status=${label}:${status}" >&2; cat "$LOG" >&2; exit 1; }
  returned_id="$(sed -n 's/^x-request-id:[[:space:]]*//Ip' "$headers" | tr -d '\r' | head -1)"
  [[ "$returned_id" == "$request_id" ]] || { echo "request_id_mismatch=${label}" >&2; exit 1; }
  grep -qi '^access-control-expose-headers:.*x-request-id' "$headers" || { echo "request_id_not_exposed=${label}" >&2; exit 1; }
}

probe options OPTIONS 200
probe get GET 405
probe post_config_error POST 500 -H 'Content-Type: application/json' --data '{"confirmation":true}'
sleep 0.5
grep -q 'function_configuration_invalid' "$TMP/post_config_error.body"
grep -Eq '"event"[[:space:]]*:[[:space:]]*"configuration_invalid"' "$LOG"
grep -Eq '"request_id"[[:space:]]*:[[:space:]]*"dm-f6-local-post_config_error"' "$LOG"
audit_lines="$(grep -E '^\{' "$LOG" || true)"
[[ -n "$audit_lines" ]] || { echo 'structured_audit_log_missing' >&2; cat "$LOG" >&2; exit 1; }
if printf '%s\\n' "$audit_lines" | grep -Eiq 'authorization|cookie|access_token|refresh_token|service_role|password|user_id|email'; then
  echo 'log_secret_or_pii_pattern=FOUND' >&2
  printf '%s\\n' "$audit_lines" >&2
  exit 1
fi
printf 'observability_local_proof=passed\nexpected_4xx=GET_405\nsynthetic_5xx=POST_500_configuration_invalid\nrequest_id=echoed_and_exposed\nlogs=structured_redacted\n'
