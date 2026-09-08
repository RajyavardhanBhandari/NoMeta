-- Phase 25 security hardening
-- Pin SECURITY DEFINER functions to an empty search_path and explicitly qualify objects.
-- This prevents caller-controlled search_path resolution from reaching privileged code.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id,email)
  values(new.id,new.email)
  on conflict(id) do update set email=excluded.email;
  return new;
end;
$$;

create or replace function public.get_usage_summary(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  used_count integer := 0;
begin
  if (select auth.uid()) <> p_user_id then
    raise exception 'UNAUTHORIZED';
  end if;

  select coalesce(free_cleanings,0)
    into used_count
    from public.daily_usage
   where user_id = p_user_id
     and usage_date = current_date;

  return jsonb_build_object(
    'configured', true,
    'limit', 5,
    'used', used_count,
    'remaining', greatest(5-used_count,0)
  );
end;
$$;

create or replace function public.get_credit_balance(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  balance integer;
begin
  if (select auth.uid()) <> p_user_id then
    raise exception 'UNAUTHORIZED';
  end if;

  select coalesce(sum(amount),0)
    into balance
    from public.credit_ledger
   where user_id = p_user_id;

  return balance;
end;
$$;

create or replace function public.complete_cleaning(
  p_user_id uuid,
  p_reference_id text,
  p_mode text,
  p_format text default null,
  p_file_size_bytes bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  used_count integer;
  balance integer;
  entitlement text;
begin
  if (select auth.uid()) <> p_user_id then
    raise exception 'UNAUTHORIZED';
  end if;

  if exists (
    select 1
      from public.cleaning_history
     where reference_id = p_reference_id
       and user_id = p_user_id
  ) then
    select entitlement
      into entitlement
      from public.cleaning_history
     where reference_id = p_reference_id;

    return jsonb_build_object(
      'ok', true,
      'entitlement', entitlement,
      'idempotent', true
    );
  end if;

  insert into public.daily_usage(user_id,usage_date,free_cleanings)
  values(p_user_id,current_date,0)
  on conflict(user_id,usage_date) do nothing;

  select free_cleanings
    into used_count
    from public.daily_usage
   where user_id = p_user_id
     and usage_date = current_date
   for update;

  if used_count < 5 then
    update public.daily_usage
       set free_cleanings = free_cleanings + 1
     where user_id = p_user_id
       and usage_date = current_date;
    entitlement := 'free';
  else
    select coalesce(sum(amount),0)
      into balance
      from public.credit_ledger
     where user_id = p_user_id;

    if balance < 1 then
      raise exception 'NO_ENTITLEMENT';
    end if;

    insert into public.credit_ledger(user_id,amount,type,reference_id)
    values(p_user_id,-1,'consume',p_reference_id);
    entitlement := 'credit';
  end if;

  insert into public.cleaning_history(
    user_id,reference_id,mode,entitlement,format,file_size_bytes
  )
  values(
    p_user_id,p_reference_id,p_mode,entitlement,p_format,p_file_size_bytes
  );

  return jsonb_build_object(
    'ok', true,
    'entitlement', entitlement,
    'idempotent', false
  );
end;
$$;

-- SECURITY DEFINER functions should not be executable by the public role by default.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.get_usage_summary(uuid) from public, anon;
revoke execute on function public.get_credit_balance(uuid) from public, anon;
revoke execute on function public.complete_cleaning(uuid,text,text,text,bigint) from public, anon;

grant execute on function public.get_usage_summary(uuid) to authenticated;
grant execute on function public.get_credit_balance(uuid) to authenticated;
grant execute on function public.complete_cleaning(uuid,text,text,text,bigint) to authenticated;

-- Keep payment credit granting server-only.
revoke execute on function public.grant_payment_credit(text,text) from public, anon, authenticated;
