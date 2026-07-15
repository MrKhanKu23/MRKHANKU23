import { useMemo, useState } from 'react';
import type { Player, Sport } from '../lib/sportsData';
import './DreamTeamDraft.css';
import './DraftPositions.css';
import { LineupPicker } from './LineupPicker';
import { lineupSlots, type LineupSlot } from '../lib/lineupSlots';

const rosterSizes: Record<string, number> = {
  football: 11, basketball: 5, tennis: 2, f1: 2, baseball: 9,
  'american-football': 11, ufc: 2, swimming: 4, volleyball: 6, 'track-sprint': 4,
};

const footballNations = ['Spain', 'Italy', 'France', 'Argentina', 'Portugal', 'Germany', 'Netherlands', 'Brazil', 'Morocco', 'England', 'Norway', 'Cape Verde', 'Japan'];
const footballNationSet = new Set(footballNations);

function nationality(player: Player) {
  const parts = player.detail.split('·');
  const rawNationality = parts[parts.length - 1]?.trim() ?? player.team;
  return rawNationality.split('/').map((value) => value.trim()).find((value) => footballNationSet.has(value)) ?? rawNationality;
}

function position(player: Player, sportId = '') {
  const role = player.detail.split('·')[0].trim();
  if (sportId !== 'football') return role.toLowerCase().includes('midfielder') ? 'CM' : role;
  if (role === 'Goalkeeper') return 'GK';
  if (role.toLowerCase().includes('defender')) return 'DEF';
  if (role.toLowerCase().includes('midfielder')) return 'CM';
  if (role === 'Winger') return 'WG';
  return 'ST';
}

function allowedSlots(player: Player, sportId: string, slots: LineupSlot[]) {
  if (sportId !== 'football') return slots.map((slot) => slot.id);
  const role = player.detail.split('·')[0].trim().toLowerCase();
  if (role.includes('goalkeeper')) return ['GK'];
  if (role.includes('defender')) return ['LCB', 'CB', 'RCB'];
  if (role.includes('midfielder')) return ['LM', 'LCM', 'RCM', 'RM'];
  return ['LW', 'ST', 'RW'];
}

function careerBounds(player: Player) {
  const values = player.years?.match(/\d{4}/g)?.map(Number) ?? [];
  return { start: values[0] ?? 1980, end: player.years?.includes('present') ? 2029 : values[1] ?? values[0] ?? 1989 };
}

function overlaps(player: Player, decade: number) {
  const { start, end } = careerBounds(player);
  return start <= decade + 9 && end >= decade;
}

function randomFromSeed(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function weightedSample(players: Player[], count: number, ratings: Map<string, number>, seed: number) {
  const available = [...players];
  const selected: Player[] = [];
  while (available.length && selected.length < count) {
    const weights = available.map((player) => Math.pow(101 - (ratings.get(player.name) ?? 80), 1.45));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let target = randomFromSeed(seed + selected.length * 97) * total;
    let index = 0;
    for (; index < weights.length - 1; index += 1) {
      target -= weights[index];
      if (target <= 0) break;
    }
    selected.push(available.splice(index, 1)[0]);
  }
  return selected;
}

export function DreamTeamDraft({ sport }: { sport: Sport }) {
  const allPlayers = sport.draftPlayers ?? sport.quizPlayers ?? sport.players;
  const pool = sport.id === 'football' ? allPlayers.filter((player) => footballNationSet.has(nationality(player))) : allPlayers;
  const teamSize = rosterSizes[sport.id] ?? 5;
  const [drafted, setDrafted] = useState<Player[]>([]);
  const [pending, setPending] = useState<Player>();
  const [pendingSlot, setPendingSlot] = useState<string>();
  const [assigned, setAssigned] = useState<Record<string, Player>>({});
  const [draftSeed, setDraftSeed] = useState(() => Date.now());
  const slots = lineupSlots[sport.id] ?? [];
  const round = drafted.length;
  const complete = round >= teamSize;
  const ratings = useMemo(() => new Map(pool.map((player, index) => [player.name, player.rating ?? 100 - Math.round(index * 20 / Math.max(pool.length - 1, 1))])), [pool]);
  const nationOrder = useMemo(() => {
    const nations = [...new Set(pool.map(nationality))];
    for (let index = nations.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(randomFromSeed(draftSeed + index * 71) * (index + 1));
      [nations[index], nations[swapIndex]] = [nations[swapIndex], nations[index]];
    }
    return nations;
  }, [draftSeed, pool]);
  const scoutingNation = nationOrder[round % nationOrder.length];
  const nationPlayers = pool.filter((player) => nationality(player) === scoutingNation);
  const anchor = nationPlayers[Math.abs(draftSeed + round * 13) % nationPlayers.length];
  const anchorBounds = careerBounds(anchor);
  const anchorDecades = Array.from({ length: Math.floor(anchorBounds.end / 10) - Math.floor(anchorBounds.start / 10) + 1 }, (_, index) => (Math.floor(anchorBounds.start / 10) + index) * 10);
  const decade = anchorDecades[Math.abs(draftSeed + round * 7) % anchorDecades.length];
  const choices = useMemo(() => {
    const used = new Set(drafted.map((player) => player.name));
    const unused = pool.filter((player) => !used.has(player.name) && allowedSlots(player, sport.id, slots).some((slot) => !assigned[slot]));
    const exact = unused.filter((player) => nationality(player) === scoutingNation && overlaps(player, decade));
    const sameNation = unused.filter((player) => nationality(player) === scoutingNation && !exact.includes(player));
    const sameEra = unused.filter((player) => overlaps(player, decade) && !exact.includes(player));
    const selections: Player[] = [];
    const addWeighted = (group: Player[], salt: number) => {
      const remaining = group.filter((player) => !selections.some((pick) => pick.name === player.name));
      selections.push(...weightedSample(remaining, 4 - selections.length, ratings, draftSeed + round * 997 + salt));
    };
    addWeighted(exact, 11); addWeighted(sameNation, 23); addWeighted(sameEra, 37); addWeighted(unused, 53);
    return selections.slice(0, 4);
  }, [assigned, decade, draftSeed, drafted, pool, ratings, round, scoutingNation, slots, sport.id]);
  const average = drafted.length ? Math.round(drafted.reduce((total, player) => total + (ratings.get(player.name) ?? 80), 0) / drafted.length) : 0;

  function confirmPick() {
    if (!pending || !pendingSlot) return;
    setDrafted((team) => [...team, pending]);
    setAssigned((lineup) => ({ ...lineup, [pendingSlot]: pending }));
    setPending(undefined);
    setPendingSlot(undefined);
  }

  if (complete) return <section className="draft-game draft-result">
    <p className="eyebrow">MULTI-NATION · MULTI-ERA DRAFT COMPLETE</p><h3>Your {sport.name} dream team</h3>
    <div className="team-rating"><span>TEAM RATING</span><strong>{average}</strong><small>/100</small></div>
    <div className="drafted-roster">{drafted.map((player) => <article key={player.name}><span>{player.badge}</span><div><b>{player.name}</b><small>{Object.entries(assigned).find(([, pick]) => pick.name === player.name)?.[0]} · {player.years}</small></div><strong>{ratings.get(player.name)}</strong></article>)}</div>
    <button className="restart-draft" onClick={() => { setDrafted([]); setPending(undefined); setPendingSlot(undefined); setAssigned({}); setDraftSeed(Date.now()); }}>Draft another team</button>
  </section>;

  return <section className="draft-game">
    <div className="draft-header"><div><p className="eyebrow">ROUND {round + 1} OF {teamSize}</p><h3>Build the greatest team</h3></div><div className="draft-score"><span>TEAM</span><strong>{average || '—'}</strong></div></div>
    <div className="scouting-brief"><div className="brief-copy"><span>THIS ROUND'S NATIONALITY + ERA</span><strong>{scoutingNation}</strong><i /> <strong>{decade}s</strong><p>{pending ? `${pending.name}${pendingSlot ? ` · ${pendingSlot}` : ' · choose a position below'}` : 'Choose a player, then place them in the lineup.'}</p></div><button className="top-roll" disabled={!pending || !pendingSlot} onClick={confirmPick}>{round + 1 === teamSize ? 'Complete team →' : 'Roll next round ↻'}</button></div>
    <div className="draft-choices">{choices.map((player) => <button key={player.name} className={pending ? (pending.name === player.name ? 'draft-selected' : 'draft-dimmed') : ''} onClick={() => { setPending(player); setPendingSlot(undefined); }}>
      <div className="draft-rating"><strong>{ratings.get(player.name)}</strong><small>OVR</small></div>
      <span className="draft-years">{player.years}</span><span className="position-tag">{position(player, sport.id)}</span><h4>{player.name}</h4><p>{nationality(player)}</p><em>🏆 {player.stat}</em><b>{pending?.name === player.name ? '✓ Selected' : 'Select player →'}</b>
    </button>)}</div>
    {pending && <LineupPicker slots={slots} assigned={assigned} pending={pending} selected={pendingSlot} allowed={allowedSlots(pending, sport.id, slots).filter((slot) => !assigned[slot])} onSelect={setPendingSlot} />}
    <div className="roster-progress">{Array.from({ length: teamSize }, (_, index) => <span key={index} className={index < drafted.length ? 'filled' : ''}>{drafted[index]?.badge ?? index + 1}</span>)}</div>
  </section>;
}
