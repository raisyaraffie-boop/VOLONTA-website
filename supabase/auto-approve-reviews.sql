-- Run in Supabase Dashboard > SQL Editor to enable automatic review approval.

alter table public.reviews alter column status set default 'approved';

drop policy if exists "Anyone can submit pending reviews" on public.reviews;
drop policy if exists "Anyone can submit approved reviews" on public.reviews;
create policy "Anyone can submit approved reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'approved');
