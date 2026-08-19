create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  birth_date date,
  primary_area_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_email_lower_idx on public.profiles (lower(email));

create table public.consent_records (
  consent_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('privacy', 'terms')),
  document_version text not null,
  accepted_at timestamptz not null default now(),
  unique (user_id, document_type, document_version)
);

create index consent_records_user_idx
  on public.consent_records (user_id, accepted_at desc);

create table public.readings (
  reading_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null,
  focus_area_id text not null,
  birth_date date not null,
  reading_date date not null,
  engine_version text not null,
  knowledge_version text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create index readings_user_created_idx
  on public.readings (user_id, created_at desc);

create table public.journey_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  context_key text not null,
  start_date date not null,
  completed_days integer[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, context_key),
  check (completed_days <@ array[
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
    16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
  ])
);

create table public.protocol_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_date date not null,
  completed_moments text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, practice_date),
  check (completed_moments <@ array['morning', 'day', 'night']::text[])
);

create table public.timeline_events (
  event_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_date date not null,
  category text not null,
  note text not null default '',
  coordinates jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index timeline_events_user_date_idx
  on public.timeline_events (user_id, event_date desc);

create table public.access_entitlements (
  entitlement_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_customer_ref text,
  provider_transaction_ref text,
  provider_subscription_ref text,
  product_id text not null,
  plan_id text not null,
  status text not null check (status in ('active', 'inactive', 'refunded', 'chargeback', 'canceled')),
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider, product_id)
);

create index access_entitlements_user_idx
  on public.access_entitlements (user_id, status);

create table public.payment_webhook_events (
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processing_status text not null default 'received',
  processing_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  primary key (provider, provider_event_id)
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger journey_progress_set_updated_at
before update on public.journey_progress
for each row execute function public.set_updated_at();

create trigger protocol_progress_set_updated_at
before update on public.protocol_progress
for each row execute function public.set_updated_at();

create trigger timeline_events_set_updated_at
before update on public.timeline_events
for each row execute function public.set_updated_at();

create trigger access_entitlements_set_updated_at
before update on public.access_entitlements
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (user_id) do update
    set email = excluded.email,
        display_name = case
          when public.profiles.display_name = '' then excluded.display_name
          else public.profiles.display_name
        end;

  if coalesce(new.raw_user_meta_data ->> 'privacy_version', '') <> '' then
    insert into public.consent_records (
      user_id,
      document_type,
      document_version,
      accepted_at
    )
    values (
      new.id,
      'privacy',
      new.raw_user_meta_data ->> 'privacy_version',
      now()
    )
    on conflict do nothing;
  end if;

  if coalesce(new.raw_user_meta_data ->> 'terms_version', '') <> '' then
    insert into public.consent_records (
      user_id,
      document_type,
      document_version,
      accepted_at
    )
    values (
      new.id,
      'terms',
      new.raw_user_meta_data ->> 'terms_version',
      now()
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.consent_records enable row level security;
alter table public.readings enable row level security;
alter table public.journey_progress enable row level security;
alter table public.protocol_progress enable row level security;
alter table public.timeline_events enable row level security;
alter table public.access_entitlements enable row level security;
alter table public.payment_webhook_events enable row level security;

create policy "profiles_select_own"
on public.profiles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "consents_select_own"
on public.consent_records for select to authenticated
using ((select auth.uid()) = user_id);

create policy "consents_insert_own"
on public.consent_records for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "readings_select_own"
on public.readings for select to authenticated
using ((select auth.uid()) = user_id);

create policy "readings_insert_own"
on public.readings for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "readings_delete_own"
on public.readings for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "journey_progress_select_own"
on public.journey_progress for select to authenticated
using ((select auth.uid()) = user_id);

create policy "journey_progress_insert_own"
on public.journey_progress for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "journey_progress_update_own"
on public.journey_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "protocol_progress_select_own"
on public.protocol_progress for select to authenticated
using ((select auth.uid()) = user_id);

create policy "protocol_progress_insert_own"
on public.protocol_progress for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "protocol_progress_update_own"
on public.protocol_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "timeline_events_select_own"
on public.timeline_events for select to authenticated
using ((select auth.uid()) = user_id);

create policy "timeline_events_insert_own"
on public.timeline_events for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "timeline_events_update_own"
on public.timeline_events for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "timeline_events_delete_own"
on public.timeline_events for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "access_entitlements_select_own"
on public.access_entitlements for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.profiles from anon, authenticated;
revoke all on public.consent_records from anon, authenticated;
revoke all on public.readings from anon, authenticated;
revoke all on public.journey_progress from anon, authenticated;
revoke all on public.protocol_progress from anon, authenticated;
revoke all on public.timeline_events from anon, authenticated;
revoke all on public.access_entitlements from anon, authenticated;
revoke all on public.payment_webhook_events from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, birth_date, primary_area_id) on public.profiles to authenticated;
grant select, insert on public.consent_records to authenticated;
grant select, insert, delete on public.readings to authenticated;
grant select, insert, update on public.journey_progress to authenticated;
grant select, insert, update on public.protocol_progress to authenticated;
grant select, insert, update, delete on public.timeline_events to authenticated;
grant select on public.access_entitlements to authenticated;
drop table if exists public.payment_webhook_events;
drop table if exists public.access_entitlements;
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
      "platformName": "Drive Mental",
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
create table if not exists public.plan_catalog (
  plan_id text primary key,
  display_name text not null,
  badge text not null default '',
  price_label text not null default '',
  billing_label text not null default '',
  description text not null default '',
  cta_text text not null default '',
  checkout_url text not null default '',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_access_plans (
  assignment_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.plan_catalog(plan_id) on update cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'expired', 'canceled', 'courtesy')),
  source text not null default 'manual',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create index if not exists user_access_plans_user_idx
  on public.user_access_plans (user_id, status);

drop trigger if exists plan_catalog_set_updated_at on public.plan_catalog;
create trigger plan_catalog_set_updated_at
before update on public.plan_catalog
for each row execute function public.set_updated_at();

drop trigger if exists user_access_plans_set_updated_at on public.user_access_plans;
create trigger user_access_plans_set_updated_at
before update on public.user_access_plans
for each row execute function public.set_updated_at();

alter table public.plan_catalog enable row level security;
alter table public.user_access_plans enable row level security;

drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin', 'support', 'mentor')
  )
);

drop policy if exists plan_catalog_select_authenticated on public.plan_catalog;
create policy plan_catalog_select_authenticated
on public.plan_catalog
for select
to authenticated
using (
  is_visible = true
  or exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin', 'support', 'content')
  )
);

drop policy if exists plan_catalog_insert_admin on public.plan_catalog;
create policy plan_catalog_insert_admin
on public.plan_catalog
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  )
);

drop policy if exists plan_catalog_update_admin on public.plan_catalog;
create policy plan_catalog_update_admin
on public.plan_catalog
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

drop policy if exists user_access_plans_select_own on public.user_access_plans;
create policy user_access_plans_select_own
on public.user_access_plans
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists user_access_plans_select_admin on public.user_access_plans;
create policy user_access_plans_select_admin
on public.user_access_plans
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin', 'support', 'mentor')
  )
);

drop policy if exists user_access_plans_insert_admin on public.user_access_plans;
create policy user_access_plans_insert_admin
on public.user_access_plans
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin', 'support')
  )
);

drop policy if exists user_access_plans_update_admin on public.user_access_plans;
create policy user_access_plans_update_admin
on public.user_access_plans
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin', 'support')
  )
)
with check (
  exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = (select auth.uid())
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin', 'support')
  )
);

revoke all on public.plan_catalog from anon, authenticated;
revoke all on public.user_access_plans from anon, authenticated;

grant select, insert, update on public.plan_catalog to authenticated;
grant select, insert, update on public.user_access_plans to authenticated;

insert into public.plan_catalog (
  plan_id,
  display_name,
  badge,
  price_label,
  billing_label,
  description,
  cta_text,
  checkout_url,
  is_visible,
  sort_order,
  features
)
values
  (
    'free',
    'Consulta gratuita',
    'BASE',
    '0,00',
    'primeiro acesso',
    'Entrada inicial para gerar a primeira leitura e conhecer a plataforma.',
    'CRIAR MEU MAPA',
    '',
    true,
    10,
    '["Primeira consulta", "Mapa essencial", "Historico local"]'::jsonb
  ),
  (
    'premium',
    'Drive Mental',
    'PREMIUM',
    '29,90',
    'mensal',
    'Consultas recorrentes, historico e recursos premium da plataforma.',
    'INICIAR A MINHA JORNADA',
    '',
    true,
    20,
    '["Novas consultas mensais", "Historico e snapshots", "Protocolos pessoais"]'::jsonb
  ),
  (
    'mentor',
    'Jornada Guiada',
    'MENTOR',
    '97,00',
    'acompanhamento',
    'Plano acompanhado para transformar consultas em plano de acao.',
    'INICIAR A MINHA JORNADA',
    '',
    true,
    30,
    '["Dashboard de evolucao", "Check-ins", "Metas e alertas da jornada"]'::jsonb
  )
on conflict (plan_id) do update
set
  display_name = excluded.display_name,
  badge = excluded.badge,
  price_label = excluded.price_label,
  billing_label = excluded.billing_label,
  description = excluded.description,
  cta_text = excluded.cta_text,
  checkout_url = case
    when public.plan_catalog.checkout_url = '' then excluded.checkout_url
    else public.plan_catalog.checkout_url
  end,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order,
  features = excluded.features;
alter table public.readings
  add column if not exists reading_type text not null default 'consultation',
  add column if not exists reading_status text not null default 'completed';

alter table public.readings
  drop constraint if exists readings_reading_type_check,
  add constraint readings_reading_type_check
    check (reading_type in ('first-reading', 'consultation'));

alter table public.readings
  drop constraint if exists readings_reading_status_check,
  add constraint readings_reading_status_check
    check (reading_status in ('pending', 'processing', 'completed', 'failed'));

create index if not exists readings_first_reading_lookup_idx
  on public.readings (
    user_id,
    reading_type,
    focus_area_id,
    reading_date,
    engine_version,
    reading_status
  );

revoke update on public.readings from authenticated;
alter table public.readings
  drop constraint if exists readings_focus_area_id_check;

alter table public.readings
  add constraint readings_focus_area_id_check
  check (
    focus_area_id in (
      'general',
      'purpose',
      'work-prosperity',
      'love-relationships',
      'challenges-blocks',
      'energy-spirituality',
      'decisions-cycles'
    )
  );

create unique index if not exists readings_completed_cycle_unique_idx
  on public.readings (
    user_id,
    reading_type,
    focus_area_id,
    reading_date,
    engine_version
  )
  where reading_status = 'completed';

create or replace function public.enforce_reading_personal_base()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_birth date;
  profile_primary_area text;
  user_is_admin boolean;
  user_has_full_plan boolean;
begin
  if (select auth.uid()) is not null and new.user_id <> (select auth.uid()) then
    raise exception 'READING_USER_MISMATCH';
  end if;

  select profile.birth_date, profile.primary_area_id
    into profile_birth, profile_primary_area
  from public.profiles profile
  where profile.user_id = new.user_id;

  if profile_birth is null or profile_primary_area is null then
    raise exception 'PERSONAL_BASE_REQUIRED';
  end if;

  if new.birth_date <> profile_birth then
    raise exception 'READING_BIRTH_DATE_MISMATCH';
  end if;

  select exists (
    select 1
    from public.admin_roles role_check
    where role_check.user_id = new.user_id
      and role_check.is_active = true
      and role_check.role in ('owner', 'admin')
  ) into user_is_admin;

  select exists (
    select 1
    from public.user_access_plans access_check
    where access_check.user_id = new.user_id
      and access_check.status in ('active', 'courtesy')
      and (
        access_check.expires_at is null
        or access_check.expires_at > now()
      )
      and access_check.plan_id in (
        'premium',
        'mentor',
        'monthly',
        'guided',
        'drive',
        'drive-astral',
        'jornada-guiada'
      )
  ) into user_has_full_plan;

  if not user_is_admin
    and not user_has_full_plan
    and new.focus_area_id <> profile_primary_area then
    raise exception 'READING_AREA_NOT_AVAILABLE_FOR_PLAN';
  end if;

  return new;
end;
$$;

drop trigger if exists readings_enforce_personal_base on public.readings;
create trigger readings_enforce_personal_base
before insert on public.readings
for each row execute function public.enforce_reading_personal_base();
