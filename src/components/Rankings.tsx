import type { Sport } from '../lib/sportsData';

export function Rankings({ sport, type }: { sport: Sport; type: 'teams' | 'players' }) {
  const items = sport[type];
  if (!items.length) return <div className="empty-state"><b>No results found</b><span>Try another player or team name.</span></div>;
  return <div className="rankings">{items.map((item, index) => {
    const team = 'team' in item ? item.team : undefined;
    return <article className="rank-card" key={item.name}>
      <span className="rank">{String(index + 1).padStart(2, '0')}</span>
      <span className="badge" style={{ background: sport.accent }}>{item.badge}</span>
      <div className="rank-info"><h3>{item.name}</h3><p>{item.detail}{team ? ` · ${team}` : ''}</p></div>
      <strong>{item.stat}</strong><span className="arrow">↗</span>
    </article>;
  })}</div>;
}
