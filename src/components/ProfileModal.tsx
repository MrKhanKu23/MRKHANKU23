import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Player, RankedItem, Sport } from '../lib/sportsData';
import { dedupeHonours, loadCompleteHonours } from '../lib/completeHonours';
import { researchFactFile, researchTeamTopPlayers } from '../lib/playerResearch';
import { teamCompetition } from '../lib/teamCompetition';
import './ProfileModal.css';

type Props = {
  sport: Sport;
  type: 'teams' | 'players';
  item: RankedItem | Player;
  rank?: number;
  edition?: 'all-time' | 'current';
  onClose: () => void;
};

function teamMatches(player: Player, teamName: string, current: boolean) {
  const team = teamName.toLowerCase();
  if (current) return (player.currentTeam ?? player.team).toLowerCase() === team;
  return [player.team, player.currentTeam, player.detail].some((value) => value?.toLowerCase().includes(team));
}

export function ProfileModal({ sport, type, item, rank, edition = 'all-time', onClose }: Props) {
  const player = type === 'players' ? item as Player : undefined;
  const storedHonours = item.honours ?? [item.stat];
  const [honours, setHonours] = useState(player ? [] : storedHonours);
  const [loadingHonours, setLoadingHonours] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [researchedStars, setResearchedStars] = useState<string[]>([]);
  const teamStars = useMemo(() => {
    if (player) return [];
    const pool = sport.draftPlayers ?? sport.quizPlayers ?? sport.players;
    const unique = pool.filter((candidate, index) => pool.findIndex((entry) => entry.name === candidate.name) === index);
    const topNames = new Set(sport.players.map((candidate) => candidate.name));
    const extended = unique.filter((candidate) => !topNames.has(candidate.name))
      .sort((first, second) => (second.rating ?? 0) - (first.rating ?? 0));
    const fullRanking = [...sport.players, ...extended];
    const ranks = new Map(fullRanking.map((candidate, index) => [candidate.name, index + 1]));
    return unique.filter((candidate) => teamMatches(candidate, item.name, edition === 'current') && (edition !== 'current' || candidate.status === 'active'))
      .sort((first, second) => (ranks.get(first.name) ?? 999) - (ranks.get(second.name) ?? 999))
      .slice(0, 3).map((candidate) => ({ name: candidate.name, rank: ranks.get(candidate.name) }));
  }, [edition, item.name, player, sport]);
  const displayedStars = useMemo(() => {
    const known = new Set(teamStars.map((star) => star.name.toLowerCase()));
    const additions = researchedStars.filter((name) => {
      const key = name.toLowerCase();
      if (known.has(key)) return false;
      known.add(key); return true;
    }).map((name, index) => ({ name, rank: sport.players.length + index + 1 }));
    return [...teamStars, ...additions].slice(0, 3);
  }, [researchedStars, sport.players.length, teamStars]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.body.classList.add('profile-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.classList.remove('profile-open'); window.removeEventListener('keydown', closeOnEscape); };
  }, [onClose]);
  useEffect(() => {
    let current = true;
    const minimumYear = edition === 'current' ? 2020 : undefined;
    setResearchedStars([]);
    setHonours(minimumYear ? dedupeHonours(storedHonours, minimumYear) : player ? [] : storedHonours); setLoadingHonours(true); setAiLoading(true);
    if (!player) researchTeamTopPlayers(item.name, sport.name, edition === 'current').then((names) => {
      if (current && names.length === 3) setResearchedStars(names);
    }).catch(() => undefined);
    loadCompleteHonours(item.name, sport.name, player ? 'player' : 'team', storedHonours).then((results) => {
      if (!current) return;
      const visibleResults = dedupeHonours(results, minimumYear);
      setHonours(visibleResults); setLoadingHonours(false);
      researchFactFile(item.name, sport.name, player ? 'player' : 'team', visibleResults, minimumYear).then((research) => {
        if (!current) return;
        setHonours((existing) => dedupeHonours([...existing, ...research.trophiesWon], minimumYear));
        if (!player && research.topPlayers.length === 3) setResearchedStars(research.topPlayers);
      }).catch(() => undefined).finally(() => { if (current) setAiLoading(false); });
    });
    return () => { current = false; };
  }, [edition, item.name, sport.name]);

  return createPortal(<div className="profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="profile-modal" role="dialog" aria-modal="true" aria-label={`${item.name} profile`}>
      <button className="profile-close" onClick={onClose} aria-label="Close profile">×</button>
      <div className="profile-identity">
        <div className="profile-badge" style={{ background: sport.accent }}>{item.badge}</div>
        <div><p className="eyebrow">{sport.icon} {sport.name} · {rank ? `#${rank} ${edition === 'current' ? 'CURRENT' : 'ALL-TIME'}` : 'FACT FILE'}</p><h2>{item.name}</h2><p>{item.detail}</p></div>
      </div>
      {player && <div className={`status-pill ${player.status}`}><i />{player.status === 'retired' ? 'Retired' : 'Active player'}</div>}
      <div className="profile-stats">
        <article className="trophy-list"><span>🏆 {edition === 'current' ? 'TROPHIES & AWARDS WON SINCE 2020' : 'COMPETITIONS, TROPHIES & AWARDS WON'}</span>{honours.length ? <ul>{honours.map((honour) => <li key={honour}>{honour}</li>)}</ul> : !loadingHonours && !aiLoading && <small>No verified wins found.</small>}{(loadingHonours || aiLoading) && <small>AI is checking the complete wins list…</small>}</article>
        <article><span>{edition === 'current' ? 'CURRENT SPORTIFY RANK' : 'ALL-TIME SPORTIFY RANK'}</span><strong>{rank ? `#${rank}` : 'Extended roster'}</strong>{!player && <div className="team-top-players"><span>{edition === 'current' ? 'CURRENT TOP 3 PLAYERS' : 'ALL-TIME TOP 3 PLAYERS'}</span>{displayedStars.length === 3 ? <ol>{displayedStars.map((star) => <li key={star.name}><b>{star.name}</b><em>#{star.rank}</em></li>)}</ol> : <small>AI is checking the team’s top three…</small>}</div>}</article>
        {player && <article><span>{player.status === 'retired' ? 'CAREER / MOST RECENT TEAM' : 'CURRENT TEAM / ACTIVE YEARS'}</span><strong>{player.status === 'retired' ? 'Retired' : player.currentTeam ?? player.team}</strong><small>{player.status === 'retired' ? `${player.team} · ${player.years}` : player.teamYears ?? player.years?.replace('present', 'current')}</small></article>}
        {!player && <article><span>LEAGUE / COMPETITION</span><strong>{teamCompetition(sport.id, item.name, item.detail)}</strong></article>}
      </div>
      <p className="profile-note">Profiles summarize the all-time record used in this ranking. Active-team information reflects the latest curated Sportify roster.</p>
    </section>
  </div>, document.body);
}
