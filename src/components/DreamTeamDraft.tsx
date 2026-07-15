import { useMemo, useState } from 'react';
import type { Player, Sport } from '../lib/sportsData';
import './DreamTeamDraft.css';

const rosterSizes: Record<string, number> = {
  football: 5, basketball: 5, tennis: 4, f1: 2, baseball: 5,
  'american-football': 5, ufc: 5, swimming: 4, volleyball: 6, 'track-sprint': 4,
};

function nationality(player: Player) {
  const parts = player.detail.split('·');
  return parts[parts.length - 1]?.trim() ?? player.team;
}

function careerBounds(player: Player) {
  const values = player.years?.match(/\d{4}/g)?.map(Number) ?? [];
  return { start: values[0] ?? 1980, end: player.years?.includes('present') ? 2029 : values[1] ?? values[0] ?? 1989 };
}

function overlaps(player: Player, decade: number) {
  const { start, end } = careerBounds(player);
  return start <= decade + 9 && end >= decade;
}

export function DreamTeamDraft({ sport }: { sport: Sport }) {
  const pool = sport.quizPlayers ?? sport.players;
  const teamSize = rosterSizes[sport.id] ?? 5;
  const [drafted, setDrafted] = useState<Player[]>([]);
  const round = drafted.length;
  const complete = round >= teamSize;
  const ratings = useMemo(() => new Map(pool.map((player, index) => [player.name, 100 - Math.round(index * 20 / Math.max(pool.length - 1, 1))])), [pool]);
  const available = pool.filter((player) => !drafted.some((pick) => pick.name === player.name));
  const anchor = available[(round * 3) % available.length];
  const anchorBounds = careerBounds(anchor);
  const anchorDecades = Array.from({ length: Math.floor(anchorBounds.end / 10) - Math.floor(anchorBounds.start / 10) + 1 }, (_, index) => (Math.floor(anchorBounds.start / 10) + index) * 10);
  const decade = anchorDecades[round % anchorDecades.length];
  const choices = useMemo(() => {
    const used = new Set(drafted.map((player) => player.name));
    const eraPlayers = pool.filter((player) => !used.has(player.name) && overlaps(player, decade));
    const rest = pool.filter((player) => !used.has(player.name) && !eraPlayers.includes(player));
    return [...eraPlayers, ...rest].sort((a, b) => ((ratings.get(b.name) ?? 80) + round) % 7 - ((ratings.get(a.name) ?? 80) + round) % 7).slice(0, 4);
  }, [decade, drafted, pool, ratings, round]);
  const average = drafted.length ? Math.round(drafted.reduce((total, player) => total + (ratings.get(player.name) ?? 80), 0) / drafted.length) : 0;

  if (complete) return <section className="draft-game draft-result">
    <p className="eyebrow">DRAFT COMPLETE</p><h3>Your {sport.name} dream team</h3>
    <div className="team-rating"><span>TEAM RATING</span><strong>{average}</strong><small>/100</small></div>
    <div className="drafted-roster">{drafted.map((player) => <article key={player.name}><span>{player.badge}</span><div><b>{player.name}</b><small>{player.years}</small></div><strong>{ratings.get(player.name)}</strong></article>)}</div>
    <button className="restart-draft" onClick={() => setDrafted([])}>Draft another team</button>
  </section>;

  return <section className="draft-game">
    <div className="draft-header"><div><p className="eyebrow">ROUND {round + 1} OF {teamSize}</p><h3>Build the greatest team</h3></div><div className="draft-score"><span>TEAM</span><strong>{average || '—'}</strong></div></div>
    <div className="scouting-brief"><span>SCOUTING BRIEF</span><strong>{nationality(anchor)}</strong><i /> <strong>{decade}s</strong><p>Choose one legend from this era. Higher ratings reflect greater all-time impact and trophies.</p></div>
    <div className="draft-choices">{choices.map((player) => <button key={player.name} onClick={() => setDrafted((team) => [...team, player])}>
      <div className="draft-rating"><strong>{ratings.get(player.name)}</strong><small>OVR</small></div>
      <span className="draft-years">{player.years}</span><h4>{player.name}</h4><p>{nationality(player)} · {player.detail.split('·')[0]}</p><em>🏆 {player.stat}</em><b>Draft player →</b>
    </button>)}</div>
    <div className="roster-progress">{Array.from({ length: teamSize }, (_, index) => <span key={index} className={index < drafted.length ? 'filled' : ''}>{drafted[index]?.badge ?? index + 1}</span>)}</div>
  </section>;
}
