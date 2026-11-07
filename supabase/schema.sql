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

-- Admin moderation (optional):
-- update public.reviews set status = 'hidden' where id = 'PASTE-REVIEW-UUID-HERE';

