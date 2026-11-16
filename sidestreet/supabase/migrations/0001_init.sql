-- side street: waiting list and campaign requests.
-- Writes come only from the Next.js server using the service-role key,
-- so RLS is enabled with no public policies (anon/auth clients get nothing).

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (role in ('advertiser', 'partner')),
  name text not null,
  company text not null,
  email text not null,
  phone text,
  interests text[] not null default '{}',
  message text,
  user_agent text
);
create unique index if not exists waitlist_email_role_idx on public.waitlist (lower(email), role);
alter table public.waitlist enable row level security;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'in_review', 'approved', 'live', 'completed', 'rejected')),
  contact_email text not null,
  name text not null,
  objective text,
  vehicles jsonb not null,          -- { truck: 2, bike: 20, car: 0 }
  areas text[] not null default '{}',
  routes text[] not null default '{}',
  start_date date not null,
  end_date date not null,
  schedule jsonb not null,          -- { Sun: ["evening"], ... }
  static_only boolean not null default true,
  creative_name text,
  estimate_kwd numeric(12, 3),
  notes text
);
create index if not exists campaigns_email_idx on public.campaigns (lower(contact_email));
alter table public.campaigns enable row level security;
