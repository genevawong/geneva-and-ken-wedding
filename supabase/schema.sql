create table if not exists public.wedding_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.wedding_settings enable row level security;

drop policy if exists "Anyone can read wedding settings" on public.wedding_settings;
create policy "Anyone can read wedding settings" on public.wedding_settings for select to anon, authenticated using (true);

drop policy if exists "Signed-in admin can insert wedding settings" on public.wedding_settings;
create policy "Signed-in admin can insert wedding settings" on public.wedding_settings for insert to authenticated with check (true);

drop policy if exists "Signed-in admin can update wedding settings" on public.wedding_settings;
create policy "Signed-in admin can update wedding settings" on public.wedding_settings for update to authenticated using (true) with check (true);

insert into public.wedding_settings (id, data) values ('main', '{}'::jsonb) on conflict (id) do nothing;
