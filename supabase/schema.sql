-- VOLONTA public reviews. Run in Supabase Dashboard > SQL Editor as project owner.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null check (char_length(reviewer_name) between 1 and 60),
  product_key text not null check (product_key in ('denim', 'blouson', 'leather')),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 1 and 1200),
  status text not null default 'approved' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now()
);

alter table public.reviews alter column status set default 'approved';
alter table public.reviews drop constraint if exists reviews_status_check;
alter table public.reviews add constraint reviews_status_check check (status in ('pending', 'approved', 'hidden'));

alter table public.reviews enable row level security;
revoke all on table public.reviews from public, anon, authenticated;
grant select, insert on table public.reviews to anon, authenticated;

drop policy if exists "Anyone can read approved reviews" on public.reviews;
create policy "Anyone can read approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Anyone can submit pending reviews" on public.reviews;
drop policy if exists "Anyone can submit approved reviews" on public.reviews;
create policy "Anyone can submit approved reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'approved');

-- Orders belong to a customer account. Admins retain their separate access.
create table if not exists public.order_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  order_number text primary key,
  user_id uuid references auth.users(id) on delete set null,
  buyer_name text not null check (char_length(buyer_name) between 1 and 120),
  buyer_phone text not null check (char_length(buyer_phone) between 6 and 40),
  buyer_address text not null check (char_length(buyer_address) between 5 and 1000),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 30),
  subtotal integer not null check (subtotal >= 0),
  shipping_fee integer not null default 0 check (shipping_fee >= 0),
  total integer not null default 0 check (total >= 0),
  status text not null default 'new' check (status in ('new', 'awaiting_payment', 'paid', 'processing', 'shipped', 'completed', 'rejected')),
  admin_note text not null default '',
  tracking_number text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.order_admins enable row level security;
alter table public.orders enable row level security;
revoke all on table public.order_admins, public.orders from public, anon, authenticated;
grant select on table public.order_admins to authenticated;
grant select, update, insert on table public.orders to authenticated;

drop policy if exists "Admins can read their own admin record" on public.order_admins;
create policy "Admins can read their own admin record"
  on public.order_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can submit a new order" on public.orders;
drop policy if exists "Customers can submit their own orders" on public.orders;
create policy "Customers can submit their own orders"
  on public.orders for insert to authenticated
  with check (status = 'new' and user_id = (select auth.uid()));

drop policy if exists "Admins can create manual orders" on public.orders;
create policy "Admins can create manual orders"
  on public.orders for insert to authenticated
  with check (exists (select 1 from public.order_admins where user_id = (select auth.uid())));

drop policy if exists "Customers can view their own orders" on public.orders;
create policy "Customers can view their own orders"
  on public.orders for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders"
  on public.orders for select to authenticated
  using (exists (select 1 from public.order_admins where user_id = (select auth.uid())));

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update to authenticated
  using (exists (select 1 from public.order_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.order_admins where user_id = (select auth.uid())));

create index if not exists orders_user_created_at_idx on public.orders (user_id, created_at desc);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- Admin moderation (optional):
-- update public.reviews set status = 'hidden' where id = 'PASTE-REVIEW-UUID-HERE';

