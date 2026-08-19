#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/drivemental}"
HTML_FILE="${HTML_FILE:-/home/ubuntu/upload/supabase.com_dashboard_project_qgvlkpaociypyxduvsqm_functions_delete-account_details_1787174593036.html}"
CONFIG_FILE="$REPO_DIR/runtime-config.js"
NEW_URL="https://qgvlkpaociypyxduvsqm.supabase.co"

if [[ ! -r "$HTML_FILE" ]]; then
  echo "missing dashboard HTML: $HTML_FILE" >&2
  exit 1
fi
if [[ ! -w "$CONFIG_FILE" ]]; then
  echo "runtime config is not writable: $CONFIG_FILE" >&2
  exit 1
fi

key="$(grep -oE 'sb_publishable_[A-Za-z0-9_-]+' "$HTML_FILE" | head -n 1 || true)"
if [[ ! "$key" =~ ^sb_publishable_[A-Za-z0-9_-]+$ ]]; then
  echo "public publishable key was not found in dashboard HTML" >&2
  exit 1
fi

before_url_count="$(grep -c 'horsbnzwozvpboejsbww\.supabase\.co' "$CONFIG_FILE" || true)"
before_key_count="$(grep -c 'sb_publishable_' "$CONFIG_FILE" || true)"
if [[ "$before_url_count" -ne 1 || "$before_key_count" -ne 1 ]]; then
  echo "unexpected runtime-config shape; refusing blind replacement" >&2
  exit 1
fi

cp "$CONFIG_FILE" "$CONFIG_FILE.migration-backup"
sed -i "s#https://horsbnzwozvpboejsbww\.supabase\.co#$NEW_URL#g; s#sb_publishable_[A-Za-z0-9_-]*#$key#g" "$CONFIG_FILE"

if ! grep -q "$NEW_URL" "$CONFIG_FILE" || grep -q 'horsbnzwozvpboejsbww\.supabase\.co' "$CONFIG_FILE"; then
  echo "runtime-config URL replacement failed" >&2
  exit 1
fi
if [[ "$(grep -c 'sb_publishable_' "$CONFIG_FILE")" -ne 1 ]]; then
  echo "runtime-config key replacement failed" >&2
  exit 1
fi

chmod 600 "$CONFIG_FILE.migration-backup"
sha256sum "$CONFIG_FILE" | awk '{print "runtime_config_sha256=" $1}'
echo "runtime_config_updated=true"
echo "supabase_url=$NEW_URL"
echo "publishable_key=redacted"
