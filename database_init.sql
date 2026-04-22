/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
create table customers (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  -- The user's customer ID in Stripe. User must not be able to update this.
  stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.

/** 
* PRODUCTS
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create table products (
  -- Product ID from Stripe, e.g. prod_1234.
  id text primary key,
  -- Whether the product is currently available for purchase.
  active boolean,
  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  name text,
  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  description text,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  image text,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb,
  marketing_features jsonb
);
alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table prices (
  -- Price ID from Stripe, e.g. price_1234.
  id text primary key,
  -- The ID of the prduct that this price belongs to.
  product_id text references products, 
  -- Whether the price can be used for new purchases.
  active boolean,
  -- A brief description of the price.
  description text,
  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unit_amount bigint,
  -- Three-letter ISO currency code, in lowercase.
  currency text check (char_length(currency) = 3),
  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pricing_type,
  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval pricing_plan_interval,
  -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
  interval_count integer,
  -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trial_period_days integer,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
create table subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id text primary key,
  user_id uuid references auth.users not null,
  -- The status of the subscription object, one of subscription_status type above.
  status subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb,
  -- ID of the price that created this subscription.
  price_id text references prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  quantity integer,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancel_at_period_end boolean,
  -- Time at which the subscription was created.
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Start of the current period that the subscription has been invoiced for.
  current_period_start timestamp with time zone default timezone('utc'::text, now()),
  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  current_period_end timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;


CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
alter table customers enable row level security;

/**
* CREDITS
* Note: this table manages user credits/points system for the application.
* Credits can be earned through various activities and used for purchases.
*/
create type credit_transaction_type as enum ('signup_bonus', 'purchase_bonus', 'spend', 'refund', 'expire');

create table credits (
  -- Auto-increment primary key
  id SERIAL PRIMARY KEY,
  trans_no VARCHAR(255) UNIQUE NOT NULL,
  -- When the credit transaction was created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Reference to the user (UUID from auth.users)
  user_id uuid REFERENCES auth.users NOT NULL,
  -- Type of transaction: 'signup_bonus', 'purchase_bonus', 'spend', 'refund', 'expire'
  trans_type credit_transaction_type NOT NULL,
  -- Amount of credits (positive for earning, negative for spending)
  credits integer,
  -- Optional plan name for purchase bonus (pro, standard, lite)
  plan_name VARCHAR(50),
  -- Optional expiration date for credits
  expired_at TIMESTAMP WITH TIME ZONE,
  -- Description of the transaction
  description TEXT
);
alter table credits enable row level security;
-- Users can only view their own credit transactions
create policy "Can only view own credits data." on credits for select using (auth.uid() = user_id);

/**
* USER_CREDITS_BALANCE
* Note: this is a view that calculates the current credit balance for each user.
* It sums up all credits for each user, excluding expired credits.
*/
create or replace view user_credits_balance as
select 
  user_id,
  coalesce(sum(credits), 0) as balance
from credits
where expired_at is null or expired_at > now()
group by user_id;

/**
* ATOMIC CREDIT SPEND
* Note: reserve credits inside the database to avoid race conditions under concurrent requests.
*/
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
as $$
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
$$;

/**
* AI GENERATIONS
* Note: stores completed generation records and the corresponding storage object paths.
*/
create table ai_generations (
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
create index ai_generations_user_created_idx on ai_generations (user_id, created_at desc);
alter table ai_generations enable row level security;
create policy "Can only view own generations." on ai_generations for select using (auth.uid() = user_id);

/**
* STORAGE BUCKET
* Note: bucket is private; files are served through signed URLs generated on the server.
*/
insert into storage.buckets (id, name, public)
values ('ai-generated-images', 'ai-generated-images', false)
on conflict (id) do nothing;
