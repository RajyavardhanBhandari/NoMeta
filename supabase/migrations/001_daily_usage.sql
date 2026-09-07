-- NoMeta Phase 7 — server-side daily free usage
-- Supabase/Postgres. Images and metadata are never stored here.

create table if not exists public.daily_cleaning_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  successful_cleanings integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date),
  constraint successful_cleanings_nonnegative check (successful_cleanings >= 0),
  constraint successful_cleanings_daily_cap check (successful_cleanings <= 2)
);

alter table public.daily_cleaning_usage enable row level security;

create policy "users can read their own daily usage"
on public.daily_cleaning_usage
for select
using (auth.uid() = user_id);

-- Do not expose a client-side INSERT/UPDATE policy. Successful-cleaning
-- increments should happen through trusted server-side code/RPC only.

create or replace function public.record_free_cleaning(p_user_id uuid, p_usage_date date)
returns public.daily_cleaning_usage
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.daily_cleaning_usage;
begin
  insert into public.daily_cleaning_usage(user_id, usage_date, successful_cleanings)
  values (p_user_id, p_usage_date, 1)
  on conflict (user_id, usage_date)
  do update set
    successful_cleanings = public.daily_cleaning_usage.successful_cleanings + 1,
    updated_at = now()
  where public.daily_cleaning_usage.successful_cleanings < 2
  returning * into result;

  if result.user_id is null then
    raise exception 'FREE_DAILY_LIMIT_REACHED';
  end if;

  return result;
end;
$$;

revoke all on function public.record_free_cleaning(uuid, date) from public;
