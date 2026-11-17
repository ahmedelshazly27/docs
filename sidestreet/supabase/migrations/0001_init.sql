-- side street: waiting list and campaign requests.
-- The site's server inserts rows with the project's publishable (anon) key.
-- RLS allows anon to INSERT only — no SELECT, UPDATE or DELETE — so the
-- list can't be read back with the public key. Read the data in the
-- Supabase dashboard (or with the service-role key, server-side only).

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (role in ('advertiser', 'partner')),
  name text not null check (char_length(name) between 1 and 120),
  company text not null check (char_length(company) between 1 and 160),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  interests text[] not null default '{}',
  message text check (char_length(message) <= 2000),
  user_agent text check (char_length(user_agent) <= 300)
);
create unique index if not exists waitlist_email_role_idx on public.waitlist (lower(email), role);
alter table public.waitlist enable row level security;

create table if not exists public.campaigns (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'submitted'
    check (status in ('draft', 'submitted', 'in_review', 'approved', 'live', 'completed', 'rejected')),
  contact_email text not null check (char_length(contact_email) between 3 and 200),
  name text not null check (char_length(name) between 1 and 120),
  objective text check (char_length(objective) <= 60),
  vehicles jsonb not null,
  areas text[] not null default '{}',
  routes text[] not null default '{}',
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  schedule jsonb not null,
  static_only boolean not null default true,
  creative_name text check (char_length(creative_name) <= 200),
  estimate_kwd numeric(12, 3),
  notes text check (char_length(notes) <= 2000)
);
create index if not exists campaigns_email_idx on public.campaigns (lower(contact_email));
alter table public.campaigns enable row level security;

-- Insert-only access for the public key; new campaigns always start as 'submitted'.
revoke all on public.waitlist, public.campaigns from anon, authenticated;
grant insert on public.waitlist, public.campaigns to anon;

drop policy if exists "anon can join waitlist" on public.waitlist;
create policy "anon can join waitlist" on public.waitlist
  for insert to anon with check (true);

drop policy if exists "anon can submit campaigns" on public.campaigns;
create policy "anon can submit campaigns" on public.campaigns
  for insert to anon with check (status = 'submitted');
