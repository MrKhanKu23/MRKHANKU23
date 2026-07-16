import { supabase } from './supabase';
import type { Player, Sport } from './sportsData';

export async function loadSportsCatalog(fallback: Sport[]) {
  const { data, error } = await supabase.from('sports_catalog').select('payload').order('sport_id');
  if (error || !data?.length) return fallback;
  const byId = new Map(data.map((row) => [(row.payload as Sport).id, row.payload as Sport]));
  return fallback.map((sport) => {
    const stored = byId.get(sport.id);
    if (!stored) return sport;
    const localPlayers = new Map(sport.players.map((player) => [player.name, player]));
    return {
      ...stored,
      players: stored.players.map((player) => ({ ...player, ...localPlayers.get(player.name) })),
      quizPlayers: sport.quizPlayers,
      draftPlayers: sport.draftPlayers,
    };
  });
}

async function signedIn() {
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user);
}

export async function loadNickname() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return '';
  const { data } = await supabase.from('profiles').select('nickname').eq('user_id', auth.user.id).single();
  return data?.nickname ?? auth.user.user_metadata.nickname ?? 'Player';
}

export async function updateNickname(nickname: string) {
  const value = nickname.trim();
  if (value.length < 2 || value.length > 24) throw new Error('Username must be 2–24 characters.');
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sign in before changing your username.');
  const { error } = await supabase.from('profiles').update({ nickname: value }).eq('user_id', auth.user.id);
  if (error) throw error;
  const { error: metadataError } = await supabase.auth.updateUser({ data: { nickname: value } });
  if (metadataError) throw metadataError;
  window.dispatchEvent(new Event('leaderboard-updated'));
  return value;
}

export async function saveQuizScore(sportId: string, difficulty: string, score: number, rounds: number) {
  if (!(await signedIn())) return 'signed-out' as const;
  const { error } = await supabase.from('quiz_scores').insert({ sport_id: sportId, difficulty, score, rounds });
  if (error?.code === '23505') return 'duplicate' as const;
  if (error) throw error;
  window.dispatchEvent(new Event('leaderboard-updated'));
  return 'saved' as const;
}

export async function saveDreamTeam(sportId: string, overall: number, players: Player[]) {
  if (!(await signedIn())) return false;
  const { error } = await supabase.from('dream_teams').insert({ sport_id: sportId, overall, players });
  if (error) throw error;
  window.dispatchEvent(new Event('leaderboard-updated'));
  return true;
}

export type QuizResult = { id: string; nickname: string; difficulty: string; score: number; rounds: number };
export type DraftResult = { id: string; nickname: string; overall: number };

export async function loadLeaderboards(sportId: string) {
  const [quizResult, draftResult] = await Promise.all([
    supabase.from('quiz_leaderboard').select('id,nickname,difficulty,score,rounds').eq('sport_id', sportId).order('score', { ascending: false }).limit(10),
    supabase.from('draft_leaderboard').select('id,nickname,overall').eq('sport_id', sportId).order('overall', { ascending: false }).limit(10),
  ]);
  return {
    quiz: (quizResult.data ?? []) as QuizResult[],
    drafts: (draftResult.data ?? []) as DraftResult[],
  };
}
