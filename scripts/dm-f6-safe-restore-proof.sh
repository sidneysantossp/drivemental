#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_ROOT="$(mktemp -d /tmp/dm-f6-restore-proof.XXXXXX)"
PG_ROOT="$(sudo -u postgres mktemp -d /var/lib/postgresql/dm-f6-restore-proof.XXXXXX)"
PGDATA="$PG_ROOT/pgdata"
PGSOCK="$PG_ROOT/pgsock"
PGLOG="$PG_ROOT/postgres.log"
PORT="55432"
BACKUPS="$ARTIFACT_ROOT/backups"
mkdir -p "$BACKUPS"
chmod 700 "$ARTIFACT_ROOT" "$BACKUPS"
sudo -u postgres mkdir "$PGDATA" "$PGSOCK"
sudo chmod 700 "$PGDATA" "$PGSOCK"
cleanup() {
  sudo -u postgres /usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" -m fast stop >/dev/null 2>&1 || true
  sudo rm -rf "$PG_ROOT"
  rm -rf "$ARTIFACT_ROOT"
}
trap cleanup EXIT

sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D "$PGDATA" -A trust --no-locale >/dev/null
sudo -u postgres /usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" -o "-p $PORT -k $PGSOCK" -l "$PGLOG" start >/dev/null
until pg_isready -h 127.0.0.1 -p "$PORT" >/dev/null 2>&1; do sleep 0.2; done
createdb -h 127.0.0.1 -p "$PORT" -U postgres dm_f6_source
createdb -h 127.0.0.1 -p "$PORT" -U postgres dm_f6_restore

psql -h 127.0.0.1 -p "$PORT" -U postgres -d dm_f6_source -v ON_ERROR_STOP=1 <<'SQL'
create table public.f6_restore_fixture (
  id integer primary key,
  control_value text not null
);
insert into public.f6_restore_fixture values (1, 'restore-proof-ok'), (2, 'second-row');
create index f6_restore_fixture_control_idx on public.f6_restore_fixture(control_value);
SQL

SOURCE_URL="postgresql://postgres@127.0.0.1:${PORT}/dm_f6_source"
RESTORE_URL="postgresql://postgres@127.0.0.1:${PORT}/dm_f6_restore"
export PGSSLMODE=disable
export SUPABASE_DB_URL="$SOURCE_URL"
export DM_BACKUP_DIR="$BACKUPS"
"$ROOT/scripts/backup-supabase.sh" dump > "$ARTIFACT_ROOT/backup.out"
BUNDLE="$(sed -n 's/^artifact_dir=//p' "$ARTIFACT_ROOT/backup.out")"
[[ -d "$BUNDLE" ]]
"$ROOT/scripts/verify-backup-bundle.sh" "$BUNDLE" > "$ARTIFACT_ROOT/verify.out"
export DM_BACKUP_BUNDLE="$BUNDLE"
export SUPABASE_RESTORE_DB_URL="$RESTORE_URL"
export SUPABASE_RESTORE_CONFIRM=YES_ISOLATED_TARGET
"$ROOT/scripts/restore-supabase.sh" > "$ARTIFACT_ROOT/restore.out"
COUNT="$(psql -h 127.0.0.1 -p "$PORT" -U postgres -d dm_f6_restore -Atqc 'select count(*) from public.f6_restore_fixture')"
VALUE="$(psql -h 127.0.0.1 -p "$PORT" -U postgres -d dm_f6_restore -Atqc "select control_value from public.f6_restore_fixture where id=1")"
[[ "$COUNT" == "2" ]]
[[ "$VALUE" == "restore-proof-ok" ]]
if (DM_BACKUP_BUNDLE="$BUNDLE" SUPABASE_RESTORE_DB_URL="postgresql://postgres@127.0.0.1:${PORT}/qgvlkpaociypyxduvsqm" SUPABASE_RESTORE_CONFIRM=YES_ISOLATED_TARGET "$ROOT/scripts/restore-supabase.sh" > "$ARTIFACT_ROOT/prod-block.out" 2>&1); then
  printf 'production_guard=FAILED\n' >&2
  exit 1
fi
printf 'safe_restore_proof=passed\nsource=local_ephemeral_postgres\ntarget=local_ephemeral_postgres\nrow_count=%s\ncontrol_value=%s\nproduction_guard=passed\n' "$COUNT" "$VALUE"
