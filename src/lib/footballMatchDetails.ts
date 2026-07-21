import type { FootballLeagueId, FootballMatch } from './openFootball';

export type FootballMatchDetails = {
  scorers: Array<{ player: string; team: string; minute: string; assist?: string; penalty?: boolean; ownGoal?: boolean }>;
  stats: Array<{ label: string; home: string; away: string }>;
};

type Athlete = { athlete?: { displayName?: string } };
type Detail = { scoringPlay?: boolean; team?: { displayName?: string }; clock?: { displayValue?: string }; participants?: Athlete[]; penaltyKick?: boolean; ownGoal?: boolean };
type Statistic = { name?: string; label?: string; displayValue?: string };
type TeamStats = { team?: { displayName?: string }; statistics?: Statistic[] };
type Event = { id?: string; competitions?: Array<{ competitors?: Array<{ team?: { displayName?: string } }> }> };
type Scoreboard = { events?: Event[] };
type Summary = { header?: { competitions?: Array<{ details?: Detail[] }> }; boxscore?: { teams?: TeamStats[] } };

const codes: Record<FootballLeagueId, string> = { 'en.1': 'eng.1', 'es.1': 'esp.1', 'de.1': 'ger.1', 'it.1': 'ita.1', 'fr.1': 'fra.1' };
const wanted = ['possessionPct', 'totalShots', 'shotsOnTarget', 'cornerKicks', 'foulsCommitted', 'yellowCards', 'redCards', 'saves'];
const cache = new Map<string, FootballMatchDetails>();

function normalized(value = '') {
  return value.toLowerCase().replace(/\b(afc|fc|cf|calcio)\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function sameTeam(first?: string, second?: string) {
  const a = normalized(first); const b = normalized(second);
  return a === b || a.includes(b) || b.includes(a);
}

export async function loadFootballMatchDetails(league: FootballLeagueId, match: FootballMatch) {
  const key = `${league}:${match.date}:${match.team1}:${match.team2}`;
  const saved = cache.get(key); if (saved) return saved;
  const code = codes[league]; const date = match.date.replace(/-/g, '');
  const boardResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/scoreboard?dates=${date}`);
  if (!boardResponse.ok) throw new Error('Detailed match data is unavailable.');
  const board = await boardResponse.json() as Scoreboard;
  const event = board.events?.find((candidate) => {
    const teams = candidate.competitions?.[0]?.competitors?.map((entry) => entry.team?.displayName) ?? [];
    return teams.some((name) => sameTeam(name, match.team1)) && teams.some((name) => sameTeam(name, match.team2));
  });
  if (!event?.id) throw new Error('No detailed report was found for this fixture.');
  const summaryResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/summary?event=${event.id}`);
  if (!summaryResponse.ok) throw new Error('The detailed match report could not be loaded.');
  const summary = await summaryResponse.json() as Summary;
  const scorers = (summary.header?.competitions?.[0]?.details ?? []).filter((detail) => detail.scoringPlay).map((detail) => ({
    player: detail.participants?.[0]?.athlete?.displayName ?? 'Unknown scorer', team: detail.team?.displayName ?? '', minute: detail.clock?.displayValue ?? '',
    assist: detail.participants?.[1]?.athlete?.displayName, penalty: detail.penaltyKick, ownGoal: detail.ownGoal,
  }));
  const teams = summary.boxscore?.teams ?? [];
  const home = teams.find((entry) => sameTeam(entry.team?.displayName, match.team1));
  const away = teams.find((entry) => sameTeam(entry.team?.displayName, match.team2));
  const stats = wanted.flatMap((name) => {
    const homeStat = home?.statistics?.find((stat) => stat.name === name); const awayStat = away?.statistics?.find((stat) => stat.name === name);
    return homeStat || awayStat ? [{ label: homeStat?.label ?? awayStat?.label ?? name, home: homeStat?.displayValue ?? '—', away: awayStat?.displayValue ?? '—' }] : [];
  });
  const result = { scorers, stats }; cache.set(key, result); return result;
}
