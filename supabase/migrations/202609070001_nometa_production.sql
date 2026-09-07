create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.daily_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null,
  free_cleanings integer not null default 0 check (free_cleanings between 0 and 2),
  primary key (user_id, usage_date)
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  type text not null check (type in ('purchase','consume','refund','adjustment')),
  reference_id text,
  created_at timestamptz not null default now()
);
create index if not exists credit_ledger_user_idx on public.credit_ledger(user_id, created_at desc);
create unique index if not exists credit_ledger_reference_idx on public.credit_ledger(reference_id) where reference_id is not null;

create table if not exists public.cleaning_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference_id text not null unique,
  mode text not null check (mode in ('standard','maximum')),
  entitlement text not null check (entitlement in ('free','credit')),
  format text,
  file_size_bytes bigint,
  created_at timestamptz not null default now()
);
create index if not exists cleaning_history_user_idx on public.cleaning_history(user_id, created_at desc);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  product_id text not null,
  credits integer not null check (credits > 0),
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  receipt text not null unique,
  status text not null default 'created' check (status in ('created','captured','failed','refunded')),
  created_at timestamptz not null default now(),
  captured_at timestamptz
);
create index if not exists payment_orders_user_idx on public.payment_orders(user_id, created_at desc);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,email) values(new.id,new.email) on conflict(id) do update set email=excluded.email;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.get_usage_summary(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare used_count integer := 0; begin
  if auth.uid() <> p_user_id then raise exception 'UNAUTHORIZED'; end if;
  select coalesce(free_cleanings,0) into used_count from public.daily_usage where user_id=p_user_id and usage_date=current_date;
  return jsonb_build_object('configured',true,'limit',2,'used',used_count,'remaining',greatest(2-used_count,0));
end; $$;

create or replace function public.get_credit_balance(p_user_id uuid)
returns integer language plpgsql security definer set search_path = public as $$
declare balance integer; begin
  if auth.uid() <> p_user_id then raise exception 'UNAUTHORIZED'; end if;
  select coalesce(sum(amount),0) into balance from public.credit_ledger where user_id=p_user_id;
  return balance;
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
  if used_count < 2 then
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

create or replace function public.grant_payment_credit(p_order_id text,p_payment_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o public.payment_orders%rowtype; begin
  select * into o from public.payment_orders where razorpay_order_id=p_order_id for update;
  if not found then raise exception 'PAYMENT_ORDER_NOT_FOUND'; end if;
  if o.status='captured' then return jsonb_build_object('ok',true,'already_granted',true,'credits_granted',o.credits); end if;
  if exists(select 1 from public.payment_orders where razorpay_payment_id=p_payment_id) then return jsonb_build_object('ok',true,'already_granted',true); end if;
  update public.payment_orders set status='captured',razorpay_payment_id=p_payment_id,captured_at=now() where id=o.id;
  insert into public.credit_ledger(user_id,amount,type,reference_id) values(o.user_id,o.credits,'purchase',p_payment_id);
  return jsonb_build_object('ok',true,'already_granted',false,'credits_granted',o.credits);
end; $$;

alter table public.profiles enable row level security;
alter table public.daily_usage enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.cleaning_history enable row level security;
alter table public.payment_orders enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles for select using (auth.uid()=id);
drop policy if exists usage_self on public.daily_usage;
create policy usage_self on public.daily_usage for select using (auth.uid()=user_id);
drop policy if exists credits_self on public.credit_ledger;
create policy credits_self on public.credit_ledger for select using (auth.uid()=user_id);
drop policy if exists history_self on public.cleaning_history;
create policy history_self on public.cleaning_history for select using (auth.uid()=user_id);
drop policy if exists orders_self on public.payment_orders;
create policy orders_self on public.payment_orders for select using (auth.uid()=user_id);

revoke all on public.payment_events from anon, authenticated;
grant execute on function public.get_usage_summary(uuid) to authenticated;
grant execute on function public.get_credit_balance(uuid) to authenticated;
grant execute on function public.complete_cleaning(uuid,text,text) to authenticated;
revoke execute on function public.grant_payment_credit(text,text) from public, anon, authenticated;
