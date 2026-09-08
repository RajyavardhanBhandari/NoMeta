alter table public.daily_usage drop constraint if exists daily_usage_free_cleanings_check;
alter table public.daily_usage add constraint daily_usage_free_cleanings_check check (free_cleanings between 0 and 5);

create or replace function public.get_usage_summary(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare used_count integer := 0; begin
  if auth.uid() <> p_user_id then raise exception 'UNAUTHORIZED'; end if;
  select coalesce(free_cleanings,0) into used_count from public.daily_usage where user_id=p_user_id and usage_date=current_date;
  return jsonb_build_object('configured',true,'limit',5,'used',used_count,'remaining',greatest(5-used_count,0));
end; $$;

create or replace function public.complete_cleaning(p_user_id uuid,p_reference_id text,p_mode text,p_format text default null,p_file_size_bytes bigint default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare used_count integer; balance integer; entitlement text; begin
  if auth.uid() <> p_user_id then raise exception 'UNAUTHORIZED'; end if;
  if exists(select 1 from public.cleaning_history where reference_id=p_reference_id and user_id=p_user_id) then
    select entitlement into entitlement from public.cleaning_history where reference_id=p_reference_id;
    return jsonb_build_object('ok',true,'entitlement',entitlement,'idempotent',true);
  end if;
  insert into public.daily_usage(user_id,usage_date,free_cleanings) values(p_user_id,current_date,0) on conflict(user_id,usage_date) do nothing;
  select free_cleanings into used_count from public.daily_usage where user_id=p_user_id and usage_date=current_date for update;
  if used_count < 5 then
    update public.daily_usage set free_cleanings=free_cleanings+1 where user_id=p_user_id and usage_date=current_date;
    entitlement := 'free';
  else
    select coalesce(sum(amount),0) into balance from public.credit_ledger where user_id=p_user_id;
    if balance < 1 then raise exception 'NO_ENTITLEMENT'; end if;
    insert into public.credit_ledger(user_id,amount,type,reference_id) values(p_user_id,-1,'consume',p_reference_id);
    entitlement := 'credit';
  end if;
  insert into public.cleaning_history(user_id,reference_id,mode,entitlement,format,file_size_bytes) values(p_user_id,p_reference_id,p_mode,entitlement,p_format,p_file_size_bytes);
  return jsonb_build_object('ok',true,'entitlement',entitlement,'idempotent',false);
end; $$;
