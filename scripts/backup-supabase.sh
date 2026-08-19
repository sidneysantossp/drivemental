#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-qgvlkpaociypyxduvsqm}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${DM_BACKUP_DIR:-}"
DB_URL="${SUPABASE_DB_URL:-}"
MODE="${1:-dump}"

fail() {
  printf 'backup_supabase_error=%s\n' "$1" >&2
  exit 1
}

redact_log() {
  sed -E \
    -e 's#postgres(ql)?://[^[:space:]]+#postgresql://<REDACTED>#g' \
    -e 's/(SUPABASE_DB_URL|SUPABASE_DB_PASSWORD|PGPASSWORD|access_token|refresh_token|service_role|apikey)[^[:space:]]*/\1=<REDACTED>/Ig'
}

show_plan() {
  cat <<EOF
mode=dump
project_ref=$PROJECT_REF
backup_dir_required=outside_repository
backup_files=roles.sql,schema.sql,data.sql,manifest.txt
included_schema=public
included_migration_metadata=optional_manual_step
excluded_managed_schemas=auth,storage,extensions,realtime,graphql,vault
credentials_source=SUPABASE_DB_URL_environment_only
backup_tool=pg_dump_and_pg_dumpall
artifact_protection=umask_077_and_directory_mode_700
EOF
}

if [[ "$MODE" == "--dry-run" ]]; then
  show_plan
  exit 0
fi

[[ "$MODE" == "dump" ]] || fail "use 'dump' or '--dry-run'"
[[ -n "$BACKUP_DIR" ]] || fail "DM_BACKUP_DIR must point to secure storage outside the repository"
[[ -n "$DB_URL" ]] || fail "SUPABASE_DB_URL must be provided through the environment"

BACKUP_DIR="$(mkdir -p "$BACKUP_DIR" && cd "$BACKUP_DIR" && pwd)"
[[ "$BACKUP_DIR" != "$REPO_ROOT" && "$BACKUP_DIR" != "$REPO_ROOT"/* ]] || fail "DM_BACKUP_DIR cannot be inside the repository"
chmod 700 "$BACKUP_DIR"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET="$BACKUP_DIR/$PROJECT_REF/$STAMP"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/dm-supabase-backup.XXXXXX")"
chmod 700 "$TMP"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT
mkdir -p "$TARGET"
chmod 700 "$TARGET"

export PGSSLMODE="${PGSSLMODE:-require}"
run_pg_dump() {
  local name="$1"
  local log="$TMP/${name}.log"
  case "$name" in
    roles.sql)
      if ! pg_dumpall --roles-only --no-role-passwords --database "$DB_URL" > "$TMP/$name" 2>"$log"; then
        printf 'dump_step_failed=%s\n' "$name" >&2
        redact_log < "$log" | tail -30 >&2
        exit 1
      fi
      ;;
    schema.sql)
      if ! pg_dump --dbname "$DB_URL" --schema public --schema-only --no-owner --no-privileges --file "$TMP/$name" >"$log" 2>&1; then
        printf 'dump_step_failed=%s\n' "$name" >&2
        redact_log < "$log" | tail -30 >&2
        exit 1
      fi
      ;;
    data.sql)
      if ! pg_dump --dbname "$DB_URL" --schema public --data-only --no-owner --no-privileges --inserts --file "$TMP/$name" >"$log" 2>&1; then
        printf 'dump_step_failed=%s\n' "$name" >&2
        redact_log < "$log" | tail -30 >&2
        exit 1
      fi
      ;;
    *) fail "unknown dump artifact: $name" ;;
  esac
}

run_pg_dump roles.sql
run_pg_dump schema.sql
run_pg_dump data.sql

cat > "$TMP/manifest.txt" <<EOF
backup_format=dm-supabase-logical-v1
project_ref=$PROJECT_REF
created_at_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)
schema_included=public
managed_schemas_excluded=auth,storage,extensions,realtime,graphql,vault
migration_history=restore_from_versioned_repository_or_separate_supabase_migrations_dump
storage_objects=excluded_storage_api_objects_are_not_in_postgresql_backup
passwords=not_included_in_roles_dump
EOF
(
  cd "$TMP"
  sha256sum roles.sql schema.sql data.sql >> manifest.txt
)

cp "$TMP/roles.sql" "$TARGET/roles.sql"
cp "$TMP/schema.sql" "$TARGET/schema.sql"
cp "$TMP/data.sql" "$TARGET/data.sql"
cp "$TMP/manifest.txt" "$TARGET/manifest.txt"
chmod 600 "$TARGET"/*

printf 'backup_created=true\nproject_ref=%s\nartifact_dir=%s\nmanifest_sha256=%s\n' \
  "$PROJECT_REF" "$TARGET" "$(sha256sum "$TARGET/manifest.txt" | awk '{print $1}')"
