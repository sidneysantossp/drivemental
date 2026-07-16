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
