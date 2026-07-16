create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 24),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "update own profile" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create function public.create_player_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, nickname)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''), 'Player-' || left(new.id::text, 6)), 24));
  return new;
end;
$$;

create trigger create_profile_after_signup
after insert on auth.users
for each row execute function public.create_player_profile();

insert into public.profiles (user_id, nickname)
select id, left(coalesce(nullif(trim(raw_user_meta_data ->> 'nickname'), ''), 'Player-' || left(id::text, 6)), 24)
from auth.users
on conflict (user_id) do nothing;

drop view public.quiz_leaderboard;
drop view public.draft_leaderboard;

create view public.quiz_leaderboard as
select scores.id, scores.sport_id, profiles.nickname, scores.difficulty, scores.score, scores.rounds, scores.created_at
from public.quiz_scores scores
join public.profiles profiles on profiles.user_id = scores.user_id;

create view public.draft_leaderboard as
select teams.id, teams.sport_id, profiles.nickname, teams.overall, teams.created_at
from public.dream_teams teams
join public.profiles profiles on profiles.user_id = teams.user_id;

grant select on public.quiz_leaderboard to anon, authenticated;
grant select on public.draft_leaderboard to anon, authenticated;
