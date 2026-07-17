import { useState } from 'react';
import type { Player, RankedItem, Sport } from '../lib/sportsData';
import { ProfileModal } from './ProfileModal';

export function Rankings({ sport, type }: { sport: Sport; type: 'teams' | 'players' }) {
  const [profile, setProfile] = useState<{ item: RankedItem | Player; rank: number }>();
  const items = sport[type].slice(0, 5);
  if (!items.length) return <div className="empty-state"><b>No results found</b><span>Try another player or team name.</span></div>;
  return <div className="rankings">{items.map((item, index) => {
    const team = 'team' in item ? item.team : undefined;
    return <button className="rank-card" key={item.name} onClick={() => setProfile({ item, rank: index + 1 })}>
      <span className="rank">{String(index + 1).padStart(2, '0')}</span>
      <span className="badge" style={{ background: sport.accent }}>{item.badge}</span>
      <div className="rank-info"><h3>{item.name}</h3><p>{item.detail}{team ? ` · ${team}` : ''}</p></div>
      <strong>{item.stat}</strong><span className="arrow">View ↗</span>
    </button>;
  })}{profile && <ProfileModal sport={sport} type={type} item={profile.item} rank={profile.rank} onClose={() => setProfile(undefined)} />}</div>;
}
