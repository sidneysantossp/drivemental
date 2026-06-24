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
