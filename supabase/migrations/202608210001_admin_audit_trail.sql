-- F7.3 Audit Trail
-- Authorized scope: transactional auditability for existing admin mutations only.
-- No RLS, methodology, engine, checkout, role bootstrap, or client-flow changes.

alter table public.admin_audit_logs
  add column if not exists actor_role text;

alter table public.admin_audit_logs
  add column if not exists result text not null default 'success';

alter table public.admin_audit_logs
  add column if not exists request_id text;

create or replace function public.audit_admin_mutation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid;
  actor_role_value text;
  request_id_value text;
  old_row jsonb;
  new_row jsonb;
  before_summary jsonb;
  after_summary jsonb;
  target_key_value text;
  action_value text;
begin
  actor_id := auth.uid();
  request_id_value := nullif(current_setting('request.jwt.claim.request_id', true), '');

  if tg_op in ('UPDATE', 'DELETE') then
    old_row := to_jsonb(old);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    new_row := to_jsonb(new);
  end if;

  select role
    into actor_role_value
  from public.admin_roles
  where user_id = actor_id
    and is_active = true
  order by case role
    when 'owner' then 1
    when 'admin' then 2
    when 'support' then 3
    when 'mentor' then 4
    when 'content' then 5
    else 99
  end
  limit 1;

  if actor_id is null or actor_role_value is null then
    raise exception 'ADMIN_AUDIT_ACTOR_NOT_AUTHORIZED';
  end if;

  if tg_table_name = 'app_settings' then
    target_key_value := coalesce(old_row ->> 'setting_key', new_row ->> 'setting_key');
    action_value := 'admin_app_settings_' || lower(tg_op);
    before_summary := case
      when old_row is null then null
      else jsonb_build_object('setting_key', old_row ->> 'setting_key', 'redacted', true)
    end;
    after_summary := case
      when new_row is null then null
      else jsonb_build_object('setting_key', new_row ->> 'setting_key', 'redacted', true)
    end;
  elsif tg_table_name = 'plan_catalog' then
    target_key_value := coalesce(old_row ->> 'plan_id', new_row ->> 'plan_id');
    action_value := 'admin_plan_catalog_' || lower(tg_op);
    before_summary := case
      when old_row is null then null
      else jsonb_build_object(
        'plan_id', old_row ->> 'plan_id',
        'is_visible', (old_row ->> 'is_visible')::boolean,
        'sort_order', (old_row ->> 'sort_order')::integer
      )
    end;
    after_summary := case
      when new_row is null then null
      else jsonb_build_object(
        'plan_id', new_row ->> 'plan_id',
        'is_visible', (new_row ->> 'is_visible')::boolean,
        'sort_order', (new_row ->> 'sort_order')::integer
      )
    end;
  elsif tg_table_name = 'user_access_plans' then
    target_key_value := coalesce(old_row ->> 'assignment_id', new_row ->> 'assignment_id');
    action_value := 'admin_user_access_plans_' || lower(tg_op);
    before_summary := case
      when old_row is null then null
      else jsonb_build_object(
        'assignment_id', old_row ->> 'assignment_id',
        'plan_id', old_row ->> 'plan_id',
        'status', old_row ->> 'status',
        'source', old_row ->> 'source'
      )
    end;
    after_summary := case
      when new_row is null then null
      else jsonb_build_object(
        'assignment_id', new_row ->> 'assignment_id',
        'plan_id', new_row ->> 'plan_id',
        'status', new_row ->> 'status',
        'source', new_row ->> 'source'
      )
    end;
  else
    raise exception 'ADMIN_AUDIT_UNSUPPORTED_TABLE: %', tg_table_name;
  end if;

  insert into public.admin_audit_logs (
    actor_user_id,
    actor_role,
    action,
    target_table,
    target_key,
    before_value,
    after_value,
    result,
    request_id
  )
  values (
    actor_id,
    actor_role_value,
    action_value,
    tg_table_name,
    target_key_value,
    before_summary,
    after_summary,
    'success',
    request_id_value
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function public.audit_admin_mutation() from public, anon, authenticated;
grant execute on function public.audit_admin_mutation() to postgres;

drop trigger if exists admin_audit_app_settings on public.app_settings;
create trigger admin_audit_app_settings
after insert or update or delete on public.app_settings
for each row execute function public.audit_admin_mutation();

drop trigger if exists admin_audit_plan_catalog on public.plan_catalog;
create trigger admin_audit_plan_catalog
after insert or update or delete on public.plan_catalog
for each row execute function public.audit_admin_mutation();

drop trigger if exists admin_audit_user_access_plans on public.user_access_plans;
create trigger admin_audit_user_access_plans
after insert or update or delete on public.user_access_plans
for each row execute function public.audit_admin_mutation();

comment on function public.audit_admin_mutation() is
  'F7.3: transactional audit trigger for existing administrative mutations; summaries are redacted.';
