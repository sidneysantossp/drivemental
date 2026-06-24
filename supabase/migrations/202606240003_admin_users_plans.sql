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
    'Drive Astral',
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
