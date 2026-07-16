create view public.quiz_leaderboard as
select id, sport_id, difficulty, score, rounds, created_at
from public.quiz_scores;

create view public.draft_leaderboard as
select id, sport_id, overall, created_at
from public.dream_teams;

grant select on public.quiz_leaderboard to anon, authenticated;
grant select on public.draft_leaderboard to anon, authenticated;
