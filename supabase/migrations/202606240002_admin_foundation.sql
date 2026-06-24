create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'mentor', 'support', 'content')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  setting_key text primary key,
  category text not null,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.admin_audit_logs (
  audit_id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text not null,
  target_key text,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists admin_roles_set_updated_at on public.admin_roles;
create trigger admin_roles_set_updated_at
before update on public.admin_roles
for each row execute function public.set_updated_at();

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
before update on public.app_settings
for each row execute function public.set_updated_at();

alter table public.admin_roles enable row level security;
alter table public.app_settings enable row level security;
alter table public.admin_audit_logs enable row level security;

drop policy if exists admin_roles_select_own on public.admin_roles;
create policy admin_roles_select_own
on public.admin_roles
for select
to authenticated
using ((select auth.uid()) = user_id and is_active = true);

drop policy if exists app_settings_select_admin on public.app_settings;
create policy app_settings_select_admin
on public.app_settings
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  )
);

drop policy if exists app_settings_update_admin on public.app_settings;
create policy app_settings_update_admin
on public.app_settings
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  )
);

drop policy if exists admin_audit_logs_select_admin on public.admin_audit_logs;
create policy admin_audit_logs_select_admin
on public.admin_audit_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  )
);

drop policy if exists admin_audit_logs_insert_admin on public.admin_audit_logs;
create policy admin_audit_logs_insert_admin
on public.admin_audit_logs
for insert
to authenticated
with check (
  actor_user_id = (select auth.uid())
  and exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  )
);

revoke all on public.admin_roles from anon, authenticated;
revoke all on public.app_settings from anon, authenticated;
revoke all on public.admin_audit_logs from anon, authenticated;

grant select on public.admin_roles to authenticated;
grant select, update on public.app_settings to authenticated;
grant select, insert on public.admin_audit_logs to authenticated;

insert into public.app_settings (setting_key, category, setting_value)
values
  (
    'platform.general',
    'general',
    '{
      "platformName": "Drive Astral",
      "supportEmail": "contato@driveastral.com",
      "environmentStatus": "producao",
      "maintenanceMode": false,
      "globalNotice": ""
    }'::jsonb
  ),
  (
    'plans.display',
    'plans',
    '{
      "premiumBadge": "PREMIUM",
      "premiumPrice": "29,90",
      "mentorBadge": "MENTOR",
      "mentorPrice": "97,00",
      "ctaText": "INICIAR A MINHA JORNADA",
      "premiumVisible": true,
      "mentorVisible": true
    }'::jsonb
  ),
  (
    'checkout.external',
    'checkout',
    '{
      "provider": "hotmart",
      "premiumCheckoutUrl": "",
      "mentorCheckoutUrl": "",
      "accessInstruction": "Enviar usuario e senha por e-mail apos confirmacao do pagamento."
    }'::jsonb
  ),
  (
    'methodology.lunar',
    'methodology',
    '{
      "activeVersion": "2026.06",
      "draftVersion": "",
      "leapDayPolicy": "blocked",
      "dailyPhraseEnabled": true,
      "mantraEnabled": true
    }'::jsonb
  )
on conflict (setting_key) do update
set
  category = excluded.category,
  setting_value = public.app_settings.setting_value || excluded.setting_value;
