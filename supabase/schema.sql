-- Supabase schema for ALX Polly: polls and votes
-- How to apply:
-- 1) In Supabase SQL editor, paste this file and run.
-- 2) Or use: supabase db push (if using Supabase CLI with migrations)

-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Schema objects
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default true,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  label text not null,
  position integer not null,
  created_at timestamptz not null default now(),
  unique (poll_id, position)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  voter_id uuid references auth.users(id) on delete set null,
  voter_fingerprint text,
  created_at timestamptz not null default now(),
  -- ensure a voter (by auth or fingerprint) can vote once per poll
  constraint one_vote_per_poll check (
    (voter_id is not null) or (voter_fingerprint is not null)
  )
);

-- Indexes
create index if not exists idx_polls_owner on public.polls(owner_id);
create index if not exists idx_options_poll on public.poll_options(poll_id);
create index if not exists idx_votes_poll on public.votes(poll_id);
create index if not exists idx_votes_option on public.votes(option_id);
create index if not exists idx_votes_voter on public.votes(voter_id);
create index if not exists idx_votes_fingerprint on public.votes(voter_fingerprint);

-- Uniqueness: one vote per poll per voter (auth users)
create unique index if not exists uniq_vote_per_poll_user
  on public.votes(poll_id, voter_id)
  where voter_id is not null;

-- Uniqueness: one vote per poll per fingerprint (anonymous)
create unique index if not exists uniq_vote_per_poll_fingerprint
  on public.votes(poll_id, voter_fingerprint)
  where voter_fingerprint is not null;

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;

-- Profiles policies
drop policy if exists "Public profiles are viewable" on public.profiles;
create policy "Public profiles are viewable" on public.profiles
  for select to authenticated,anon using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Polls policies
drop policy if exists "Polls are viewable by anyone" on public.polls;
create policy "Polls are viewable by anyone" on public.polls
  for select using (true);

drop policy if exists "Authenticated users can create polls" on public.polls;
create policy "Authenticated users can create polls" on public.polls
  for insert with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their polls" on public.polls;
create policy "Owners can update their polls" on public.polls
  for update using (auth.uid() = owner_id);

drop policy if exists "Owners can delete their polls" on public.polls;
create policy "Owners can delete their polls" on public.polls
  for delete using (auth.uid() = owner_id);

-- Poll options policies
drop policy if exists "Options are viewable by anyone" on public.poll_options;
create policy "Options are viewable by anyone" on public.poll_options
  for select using (true);

drop policy if exists "Owners can manage options for their polls" on public.poll_options;
create policy "Owners can manage options for their polls" on public.poll_options
  for all using (
    exists (
      select 1 from public.polls p
      where p.id = poll_options.poll_id and p.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.polls p
      where p.id = poll_options.poll_id and p.owner_id = auth.uid()
    )
  );

-- Votes policies
drop policy if exists "Votes are viewable by anyone" on public.votes;
create policy "Votes are viewable by anyone" on public.votes
  for select using (true);

drop policy if exists "Anyone can insert a vote (auth or anon)" on public.votes;
create policy "Anyone can insert a vote (auth or anon)" on public.votes
  for insert with check (
    -- If authenticated, allow
    (auth.uid() is not null and (voter_id is null or voter_id = auth.uid()))
    -- If anonymous, ensure fingerprint set
    or (auth.uid() is null and voter_fingerprint is not null)
  );

-- Optional: allow authenticated users to delete their own votes
drop policy if exists "Users can delete their own votes" on public.votes;
create policy "Users can delete their own votes" on public.votes
  for delete using (auth.uid() is not null and voter_id = auth.uid());

-- Helpers: ensure profile row exists on signup (optional)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


