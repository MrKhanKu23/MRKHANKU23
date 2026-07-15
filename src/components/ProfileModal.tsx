import { useEffect } from 'react';
import type { Player, RankedItem, Sport } from '../lib/sportsData';
import './ProfileModal.css';

type Props = {
  sport: Sport;
  type: 'teams' | 'players';
  item: RankedItem | Player;
  rank: number;
  onClose: () => void;
};

export function ProfileModal({ sport, type, item, rank, onClose }: Props) {
  const player = type === 'players' ? item as Player : undefined;
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return <div className="profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="profile-modal" role="dialog" aria-modal="true" aria-label={`${item.name} profile`}>
      <button className="profile-close" onClick={onClose} aria-label="Close profile">×</button>
      <div className="profile-identity">
        <div className="profile-badge" style={{ background: sport.accent }}>{item.badge}</div>
        <div><p className="eyebrow">{sport.icon} {sport.name} · #{rank} ALL-TIME</p><h2>{item.name}</h2><p>{item.detail}</p></div>
      </div>
      {player && <div className={`status-pill ${player.status}`}><i />{player.status === 'retired' ? 'Retired' : 'Active player'}</div>}
      <div className="profile-stats">
        <article className="trophy-list"><span>🏆 NAMED TROPHIES & RECORDS</span><ul>{(item.honours ?? [item.stat]).map((honour) => <li key={honour}>{honour}</li>)}</ul></article>
        <article><span>ALL-TIME SPORTDEX RANK</span><strong>#{rank}</strong></article>
        {player && <article><span>{player.status === 'retired' ? 'CAREER TEAM / NATION' : 'CURRENT / MOST RECENT TEAM'}</span><strong>{player.status === 'retired' ? 'Retired' : player.team}</strong>{player.status === 'retired' && <small>{player.team}</small>}</article>}
        {!player && <article><span>COMPETITION / REGION</span><strong>{item.detail}</strong></article>}
      </div>
      <p className="profile-note">Profiles summarize the all-time record used in this ranking. Active-team information reflects the latest curated Sportdex roster.</p>
    </section>
  </div>;
}
