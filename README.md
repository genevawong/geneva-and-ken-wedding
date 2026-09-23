create table if not exists public.wedding_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.update_wedding_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger wedding_settings_updated_at
before update on public.wedding_settings
for each row
execute procedure public.update_wedding_settings_updated_at();

alter table public.wedding_settings enable row level security;

create policy if not exists "Anyone can read wedding settings"
on public.wedding_settings
for select
using (true);

create policy if not exists "Authenticated users can insert wedding settings"
on public.wedding_settings
for insert
with check (auth.role() = 'authenticated');

create policy if not exists "Authenticated users can update wedding settings"
on public.wedding_settings
for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.wedding_settings (id, data)
values (
  'main',
  '{
    "coupleNameZh": "Geneva & Ken",
    "coupleNameEn": "Geneva & Ken",
    "date": "12.12.2026",
    "venueName": "WM Hotel",
    "venueAddress": "28 Wai Man Rd, Sai Kung, New Territories",
    "venueAddressZh": "西貢惠民路 28 號",
    "venueMapUrl": "https://maps.google.com/?q=28+Wai+Man+Rd+Sai+Kung+Hong+Kong",
    "parkingInfoZh": "泊車資料將於稍後更新。",
    "parkingInfoEn": "Parking details will be shared soon.",
    "timeline": [
      {"time":"16:00","titleZh":"證婚","titleEn":"Ceremony","descriptionZh":"開放入場，見證婚禮儀式。","descriptionEn":"Guest arrival and wedding ceremony."},
      {"time":"18:00","titleZh":"恭候","titleEn":"Welcome","descriptionZh":"賓客落座，迎接新郎新娘。","descriptionEn":"Welcome guests and await the newlyweds."},
      {"time":"19:00","titleZh":"入席","titleEn":"Dinner Seating","descriptionZh":"晚宴入席，開席用餐。","descriptionEn":"Dinner seating and reception begins."}
    ],
    "tables": [
      {"number":1,"seats":13,"labelZh":"桌 1","labelEn":"Table 1"},
      {"number":2,"seats":12,"labelZh":"桌 2","labelEn":"Table 2"}
    ],
    "guests": [
      {"id":"g1","nameZh":"陳大文","nameEn":"Chan Tai Man","tableNumber":1},
      {"id":"g2","nameZh":"李小明","nameEn":"Lee Siu Ming","tableNumber":1}
    ]
  }'::jsonb
)
on conflict (id) do nothing;
