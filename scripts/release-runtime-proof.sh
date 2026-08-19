#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL="${DM_PRODUCTION_URL:-https://drivemental.vercel.app}"
EDGE_URL="${DM_DELETE_ACCOUNT_URL:-https://horsbnzwozvpboejsbww.supabase.co/functions/v1/delete-account}"
EXPECTED_RELEASE="${DM_EXPECTED_RELEASE:-2026.08.19-f5}"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/dm-release-proof.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

fail() { printf 'runtime_proof_error=%s\n' "$1" >&2; exit 1; }

header_present() {
  local file="$1" name="$2"
  grep -qi "^${name}:" "$file" || fail "missing_header:${name}"
}

probe_asset() {
  local label="$1" path="$2" expected_type="$3"
  local headers="$TMP/${label}.headers" body="$TMP/${label}.body" status
  status="$(curl -fsS --max-time 25 -D "$headers" -o "$body" -w '%{http_code}' "$BASE_URL$path")" || fail "curl:${path}"
  [[ "$status" == "200" ]] || fail "status:${path}:${status}"
  grep -qi "^content-type:.*${expected_type}" "$headers" || fail "content_type:${path}"
  for header in Strict-Transport-Security Content-Security-Policy X-Content-Type-Options Referrer-Policy Permissions-Policy X-Frame-Options; do
    header_present "$headers" "$header"
  done
  if grep -Eiq 'SUPABASE_SERVICE_ROLE_KEY|service[_-]?role|BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' "$body"; then
    fail "public_secret_pattern:${path}"
  fi
}

probe_asset home / 'text/html'
probe_asset manifest /manifest.webmanifest 'application/manifest'
probe_asset service_worker /sw.js 'application/javascript'
probe_asset runtime_config /runtime-config.js 'application/javascript'

runtime_body="$TMP/runtime.body"
curl -fsS --max-time 25 "$BASE_URL/runtime-config.js" -o "$runtime_body" || fail runtime_config_download
grep -q "release: \"${EXPECTED_RELEASE}\"" "$runtime_body" || fail "release_mismatch:${EXPECTED_RELEASE}"
grep -q 'environment: "production"' "$runtime_body" || fail environment_not_production
grep -q 'authMode: "supabase"' "$runtime_body" || fail auth_mode_mismatch
key="$(sed -nE 's/.*supabasePublishableKey:[[:space:]]*"([^"]+)".*/\1/p' "$runtime_body")"
[[ -n "$key" ]] || fail publishable_key_not_found

edge_request() {
  local label="$1" method="$2" expected="$3"; shift 3
  local body="$TMP/${label}.body" headers="$TMP/${label}.headers" status
  status="$(curl -sS --max-time 25 -X "$method" "$@" -D "$headers" -o "$body" -w '%{http_code}' "$EDGE_URL")" || fail "edge_curl:${label}"
  [[ "$status" == "$expected" ]] || fail "edge_status:${label}:${status}:expected_${expected}"
  grep -qi '^access-control-allow-origin:' "$headers" || fail "edge_cors_origin:${label}"
}

edge_request edge_get GET 405 -H "apikey: $key"
edge_request edge_options OPTIONS 200 -H "apikey: $key" -H "Origin: $BASE_URL" -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: authorization, apikey, content-type'
edge_request edge_post_without_jwt POST 401 -H "apikey: $key" -H 'Content-Type: application/json' --data '{"confirmation":true}'

printf 'runtime_proof=passed\nbase_url=%s\nexpected_release=%s\nassets=home,manifest,service_worker,runtime_config\nedge_guardrails=GET_405,OPTIONS_200,POST_NO_JWT_401\nsecret_scan=clear\n' "$BASE_URL" "$EXPECTED_RELEASE"
