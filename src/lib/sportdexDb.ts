import { supabase } from './supabase';
import type { Player, Sport } from './sportsData';

export async function loadSportsCatalog(fallback: Sport[]) {
  const [{ data, error }, rankingsResult] = await Promise.all([
    supabase.from('sports_catalog').select('payload').order('sport_id'),
    supabase.from('sport_rankings').select('sport_id,all_time_teams,all_time_players,current_teams,current_players'),
  ]);
  if (error || !data?.length) return fallback;
  const byId = new Map(data.map((row) => [(row.payload as Sport).id, row.payload as Sport]));
  const rankings = new Map((rankingsResult.data ?? []).map((row) => [row.sport_id, row]));
  return fallback.map((sport) => {
    const stored = byId.get(sport.id);
    const order = rankings.get(sport.id);
    const rankingOrders = order ? {
      allTimeTeams: order.all_time_teams as string[], allTimePlayers: order.all_time_players as string[],
      currentTeams: order.current_teams as string[], currentPlayers: order.current_players as string[],
    } : undefined;
    if (!stored) return { ...sport, rankingOrders };
    const localPlayers = new Map(sport.players.map((player) => [player.name, player]));
    return {
      ...stored,
      players: stored.players.map((player) => ({ ...player, ...localPlayers.get(player.name) })),
      quizPlayers: sport.quizPlayers,
      draftPlayers: sport.draftPlayers,
      rankingOrders,
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
    supabase.from('quiz_leaderboard').select('id,nickname,difficulty,score,rounds').eq('sport_id', sportId).order('score', { ascending: false }).limit(5),
    supabase.from('draft_leaderboard').select('id,nickname,overall').eq('sport_id', sportId).order('overall', { ascending: false }).limit(5),
  ]);
  return {
    quiz: (quizResult.data ?? []) as QuizResult[],
    drafts: (draftResult.data ?? []) as DraftResult[],
  };
}
