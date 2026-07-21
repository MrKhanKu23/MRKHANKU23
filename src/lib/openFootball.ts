export type FootballScore = { ft?: [number, number]; ht?: [number, number] } | [number, number];

export type FootballMatch = {
  round?: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: FootballScore;
};

export type FootballCompetition = {
  name: string;
  matches: FootballMatch[];
};

export const footballLeagues = [
  { id: 'en.1', label: 'Premier League' },
  { id: 'es.1', label: 'La Liga' },
  { id: 'de.1', label: 'Bundesliga' },
  { id: 'it.1', label: 'Serie A' },
  { id: 'fr.1', label: 'Ligue 1' },
] as const;

export type FootballLeagueId = typeof footballLeagues[number]['id'];

const SEASON = '2025-26';
const SOURCE = 'https://raw.githubusercontent.com/openfootball/football.json/master';
const cache = new Map<FootballLeagueId, FootballCompetition>();

export function fullTimeScore(score?: FootballScore) {
  if (Array.isArray(score)) return score;
  return score?.ft;
}

export async function loadFootballCompetition(league: FootballLeagueId) {
  const saved = cache.get(league);
  if (saved) return saved;

  const response = await fetch(`${SOURCE}/${SEASON}/${league}.json`);
  if (!response.ok) throw new Error(`OpenFootball returned HTTP ${response.status}.`);
  const competition = await response.json() as FootballCompetition;
  if (!competition.name || !Array.isArray(competition.matches)) {
    throw new Error('OpenFootball returned an unexpected data format.');
  }

  cache.set(league, competition);
  return competition;
}
