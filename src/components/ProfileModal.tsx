import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Player, RankedItem, Sport } from '../lib/sportsData';
import { loadCompleteHonours } from '../lib/completeHonours';
import './ProfileModal.css';

type Props = {
  sport: Sport;
  type: 'teams' | 'players';
  item: RankedItem | Player;
  rank?: number;
  onClose: () => void;
};

export function ProfileModal({ sport, type, item, rank, onClose }: Props) {
  const player = type === 'players' ? item as Player : undefined;
  const storedHonours = item.honours ?? [item.stat];
  const [honours, setHonours] = useState(player ? [] : storedHonours);
  const [loadingHonours, setLoadingHonours] = useState(true);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.body.classList.add('profile-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.classList.remove('profile-open'); window.removeEventListener('keydown', closeOnEscape); };
  }, [onClose]);
  useEffect(() => {
    let current = true;
    setHonours(player ? [] : storedHonours); setLoadingHonours(true);
    loadCompleteHonours(item.name, sport.name, player ? 'player' : 'team', storedHonours).then((results) => {
      if (current) { setHonours(results); setLoadingHonours(false); }
    });
    return () => { current = false; };
  }, [item.name, sport.name]);

  return createPortal(<div className="profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="profile-modal" role="dialog" aria-modal="true" aria-label={`${item.name} profile`}>
      <button className="profile-close" onClick={onClose} aria-label="Close profile">×</button>
      <div className="profile-identity">
        <div className="profile-badge" style={{ background: sport.accent }}>{item.badge}</div>
        <div><p className="eyebrow">{sport.icon} {sport.name} · {rank ? `#${rank} ALL-TIME` : 'FACT FILE'}</p><h2>{item.name}</h2><p>{item.detail}</p></div>
      </div>
      {player && <div className={`status-pill ${player.status}`}><i />{player.status === 'retired' ? 'Retired' : 'Active player'}</div>}
      <div className="profile-stats">
        <article className="trophy-list"><span>🏆 {player ? 'TROPHIES & AWARDS WON' : 'COMPLETE TROPHIES, AWARDS & RECORDS'}</span>{honours.length ? <ul>{honours.map((honour) => <li key={honour}>{honour}</li>)}</ul> : !loadingHonours && <small>No named trophies or awards recorded.</small>}{loadingHonours && <small>Loading the complete honours list…</small>}</article>
        <article><span>ALL-TIME SPORTIFY RANK</span><strong>{rank ? `#${rank}` : 'Extended roster'}</strong></article>
        {player && <article><span>{player.status === 'retired' ? 'CAREER / MOST RECENT TEAM' : 'CURRENT TEAM / ACTIVE YEARS'}</span><strong>{player.status === 'retired' ? 'Retired' : player.currentTeam ?? player.team}</strong><small>{player.status === 'retired' ? `${player.team} · ${player.years}` : player.teamYears ?? player.years?.replace('present', 'current')}</small></article>}
        {!player && <article><span>COMPETITION / REGION</span><strong>{item.detail}</strong></article>}
      </div>
      <p className="profile-note">Profiles summarize the all-time record used in this ranking. Active-team information reflects the latest curated Sportify roster.</p>
    </section>
  </div>, document.body);
}
