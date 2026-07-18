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
