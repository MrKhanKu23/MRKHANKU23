create table public.sports_catalog (
  sport_id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.sports_catalog enable row level security;

create policy "public can read sports catalog"
  on public.sports_catalog for select
  to anon, authenticated
  using (true);

create table public.quiz_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sport_id text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  score integer not null check (score >= 0),
  rounds integer not null check (rounds > 0),
  created_at timestamptz not null default now()
);

alter table public.quiz_scores enable row level security;
create policy "read own quiz scores" on public.quiz_scores for select using (auth.uid() = user_id);
create policy "insert own quiz scores" on public.quiz_scores for insert with check (auth.uid() = user_id);
create policy "delete own quiz scores" on public.quiz_scores for delete using (auth.uid() = user_id);

create table public.dream_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  sport_id text not null,
  overall integer not null check (overall between 0 and 100),
  players jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.dream_teams enable row level security;
create policy "read own dream teams" on public.dream_teams for select using (auth.uid() = user_id);
create policy "insert own dream teams" on public.dream_teams for insert with check (auth.uid() = user_id);
create policy "delete own dream teams" on public.dream_teams for delete using (auth.uid() = user_id);

create index quiz_scores_user_created_idx on public.quiz_scores (user_id, created_at desc);
create index dream_teams_user_created_idx on public.dream_teams (user_id, created_at desc);
