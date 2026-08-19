#!/usr/bin/env bash
set -Eeuo pipefail

REPOSITORY="${GITHUB_REPOSITORY:-sidneysantossp/drivemental}"
SHA="${GITHUB_SHA:-$(git rev-parse HEAD)}"
API_ROOT="https://api.github.com/repos/${REPOSITORY}"

fail() { printf 'deployment_check_error=%s\n' "$1" >&2; exit 1; }

command -v curl >/dev/null || fail curl_required
[[ -n "${GITHUB_TOKEN:-}" ]] || fail GITHUB_TOKEN_required

headers=(
  -H "Authorization: Bearer ${GITHUB_TOKEN}"
  -H 'Accept: application/vnd.github+json'
  -H 'X-GitHub-Api-Version: 2022-11-28'
)

deployments="$(curl -fsS --max-time 25 "${headers[@]}" "$API_ROOT/deployments?sha=$SHA&environment=Production&per_page=10")" || fail deployments_request
ids="$(printf '%s' "$deployments" | python3 -c 'import json,sys; print("\n".join(str(x["id"]) for x in json.load(sys.stdin)))')"
[[ -n "$ids" ]] || fail "no_production_deployment_for_sha:$SHA"

success=false
while IFS= read -r id; do
  [[ -n "$id" ]] || continue
  statuses="$(curl -fsS --max-time 25 "${headers[@]}" "$API_ROOT/deployments/$id/statuses")" || fail "statuses_request:$id"
  state="$(printf '%s' "$statuses" | python3 -c 'import json,sys; data=json.load(sys.stdin); print(data[0].get("state", "") if data else "")')"
  environment_url="$(printf '%s' "$statuses" | python3 -c 'import json,sys; data=json.load(sys.stdin); print(data[0].get("environment_url", "") if data else "")')"
  if [[ "$state" == "success" ]]; then
    success=true
    printf 'deployment_check=passed\nsha=%s\nenvironment=Production\nstate=%s\nenvironment_url=%s\n' "$SHA" "$state" "$environment_url"
    break
  fi
done <<< "$ids"

[[ "$success" == true ]] || fail "production_deployment_not_successful_for_sha:$SHA"
