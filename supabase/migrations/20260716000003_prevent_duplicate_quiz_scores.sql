delete from public.quiz_scores duplicate
using public.quiz_scores original
where duplicate.user_id = original.user_id
  and duplicate.sport_id = original.sport_id
  and duplicate.difficulty = original.difficulty
  and duplicate.score = original.score
  and duplicate.rounds = original.rounds
  and (duplicate.created_at, duplicate.id) > (original.created_at, original.id);

create unique index quiz_scores_unique_result_idx
on public.quiz_scores (user_id, sport_id, difficulty, score, rounds);
