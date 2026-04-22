do $$
begin
  alter type credit_transaction_type add value if not exists 'refund';
exception
  when duplicate_object then null;
end $$;

create or replace function spend_user_credits_atomic(
  p_user_id uuid,
  p_amount integer,
  p_description text default null
)
returns table (
  success boolean,
  balance integer,
  trans_no text
)
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_balance integer;
  v_trans_no text;
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'Spend amount must be positive';
  end if;

  perform pg_advisory_xact_lock(hashtext('credits'), hashtext(p_user_id::text));

  select coalesce(sum(credits), 0)
    into v_balance
  from credits
  where user_id = p_user_id
    and (expired_at is null or expired_at > now());

  if v_balance < p_amount then
    return query
    select false, v_balance, null::text;
    return;
  end if;

  v_trans_no := 'SPEND_' || extract(epoch from clock_timestamp())::bigint || '_' || substr(md5(random()::text), 1, 8);

  insert into credits (
    trans_no,
    user_id,
    trans_type,
    credits,
    description
  )
  values (
    v_trans_no,
    p_user_id,
    'spend',
    -p_amount,
    coalesce(p_description, '花费积分')
  );

  return query
  select true, v_balance - p_amount, v_trans_no;
end;
$function$;

create table if not exists ai_generations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default current_timestamp not null,
  user_id uuid references auth.users not null,
  prompt text not null,
  model text not null,
  mode varchar(50) not null check (mode in ('text-to-image', 'image-to-image')),
  size varchar(50),
  credit_cost integer not null check (credit_cost > 0),
  output_image_path text not null,
  output_mime_type varchar(100) not null default 'image/png',
  source_image_path text,
  metadata jsonb default '{}'::jsonb
);

create index if not exists ai_generations_user_created_idx
  on ai_generations (user_id, created_at desc);

alter table ai_generations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_generations'
      and policyname = 'Can only view own generations.'
  ) then
    create policy "Can only view own generations."
      on ai_generations
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('ai-generated-images', 'ai-generated-images', false)
on conflict (id) do nothing;
