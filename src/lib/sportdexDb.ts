import { supabase } from './supabase';
import type { Player, Sport } from './sportsData';

export async function loadSportsCatalog(fallback: Sport[]) {
  const { data, error } = await supabase.from('sports_catalog').select('payload').order('sport_id');
  if (error || !data?.length) return fallback;
  const byId = new Map(data.map((row) => [(row.payload as Sport).id, row.payload as Sport]));
  return fallback.map((sport) => byId.get(sport.id) ?? sport);
}

async function signedIn() {
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user);
}

export async function saveQuizScore(sportId: string, difficulty: string, score: number, rounds: number) {
  if (!(await signedIn())) return false;
  const { error } = await supabase.from('quiz_scores').insert({ sport_id: sportId, difficulty, score, rounds });
  if (error) throw error;
  window.dispatchEvent(new Event('leaderboard-updated'));
  return true;
}

export async function saveDreamTeam(sportId: string, overall: number, players: Player[]) {
  if (!(await signedIn())) return false;
  const { error } = await supabase.from('dream_teams').insert({ sport_id: sportId, overall, players });
  if (error) throw error;
  window.dispatchEvent(new Event('leaderboard-updated'));
  return true;
}

export type QuizResult = { id: string; difficulty: string; score: number; rounds: number };
export type DraftResult = { id: string; overall: number };

export async function loadLeaderboards(sportId: string) {
  const [quizResult, draftResult] = await Promise.all([
    supabase.from('quiz_leaderboard').select('id,difficulty,score,rounds').eq('sport_id', sportId).order('score', { ascending: false }).limit(10),
    supabase.from('draft_leaderboard').select('id,overall').eq('sport_id', sportId).order('overall', { ascending: false }).limit(10),
  ]);
  return {
    quiz: (quizResult.data ?? []) as QuizResult[],
    drafts: (draftResult.data ?? []) as DraftResult[],
  };
}
