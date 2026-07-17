import { useMemo, useState } from 'react';
import type { Player, RankedItem, Sport } from '../lib/sportsData';
import { ProfileModal } from './ProfileModal';
import './FactFileSearch.css';

type Match = { item: RankedItem | Player; type: 'teams' | 'players'; rank?: number };

export function FactFileSearch({ sport, query }: { sport: Sport; query: string }) {
  const [selected, setSelected] = useState<Match>();
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    const results: Match[] = [];
    sport.teams.forEach((team, index) => {
      if (`${team.name} ${team.detail} ${team.stat}`.toLowerCase().includes(value)) results.push({ item: team, type: 'teams', rank: index + 1 });
    });
    const names = new Set<string>();
    (sport.quizPlayers ?? sport.players).forEach((player) => {
      if (names.has(player.name)) return;
      names.add(player.name);
      if (`${player.name} ${player.team} ${player.detail} ${player.stat}`.toLowerCase().includes(value)) {
        const index = sport.players.findIndex((item) => item.name === player.name);
        results.push({ item: player, type: 'players', rank: index >= 0 ? index + 1 : undefined });
      }
    });
    return results.sort((first, second) => {
      const firstExact = first.item.name.toLowerCase() === value ? 1 : 0;
      const secondExact = second.item.name.toLowerCase() === value ? 1 : 0;
      return secondExact - firstExact;
    }).slice(0, 4);
  }, [query, sport]);

  if (!matches.length) return <section className="fact-search"><p className="eyebrow">FACT FILE SEARCH</p><h3>No player or team found</h3><p>Try a name, team, nationality, role, trophy, or record.</p></section>;
  return <section className="fact-search"><p className="eyebrow">FACT FILE SEARCH</p><h3>{matches.length} result{matches.length === 1 ? '' : 's'} found</h3><div className="fact-results">
    {matches.map((match) => <button key={`${match.type}-${match.item.name}`} onClick={() => setSelected(match)}><span style={{ background: sport.accent }}>{match.item.badge}</span><div><small>{match.type === 'players' ? 'PLAYER FACT FILE' : 'TEAM FACT FILE'}</small><strong>{match.item.name}</strong><p>{match.item.detail}</p></div><b>Open →</b></button>)}
  </div>{selected && <ProfileModal sport={sport} type={selected.type} item={selected.item} rank={selected.rank} onClose={() => setSelected(undefined)} />}</section>;
}
