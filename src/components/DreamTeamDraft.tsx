import { useMemo, useState } from 'react';
import type { Player, Sport } from '../lib/sportsData';
import './DreamTeamDraft.css';
import './DreamTeamComparison.css';
import './DraftPositions.css';
import { LineupPicker } from './LineupPicker';
import { lineupSlots, type LineupSlot } from '../lib/lineupSlots';
import { saveDreamTeam } from '../lib/sportdexDb';

const rosterSizes: Record<string, number> = {
  football: 11, basketball: 5, tennis: 2, f1: 2, baseball: 9,
  'american-football': 11, ufc: 2, swimming: 2, volleyball: 6, 'track-sprint': 4,
};

const footballNations = ['Spain', 'Italy', 'France', 'Argentina', 'Portugal', 'Germany', 'Netherlands', 'Brazil', 'Morocco', 'England', 'Norway', 'Cape Verde', 'Japan'];
const footballNationSet = new Set(footballNations);
const clubDraftSports = new Set(['football', 'basketball', 'baseball', 'american-football']);
const individualDraftSports = new Set(['f1', 'swimming', 'ufc']);
const minimumGroupPlayers = 8;
const nationalityLimit = 10;
const firstDraftDecade = 1950;
const lastDraftDecade = 2020;

function availableThreshold(poolSizes: number[], lineupSize: number) {
  for (const threshold of [minimumGroupPlayers, 4]) {
    const available = poolSizes.filter((size) => size >= threshold).reduce((total, size) => total + size, 0);
    if (available >= lineupSize) return threshold;
  }
  return 1;
}
const eliteFootballRatings = new Set([
  'Lionel Messi', 'Cristiano Ronaldo', 'Pelé', 'Johan Cruyff', 'Michel Platini',
  'Marco van Basten', 'Ronaldo Nazário', 'Garrincha', 'Cafu',
]);
const highFootballRatings = new Set([
  'Alfredo Di Stéfano', 'Franz Beckenbauer', 'Paolo Maldini', 'Xavi Hernández', 'Andrés Iniesta', 'Gerd Müller',
  'Iker Casillas', 'Sergio Ramos', 'Sergio Busquets', 'Raúl González', 'Carles Puyol', 'Xabi Alonso',
  'Franco Baresi', 'Andrea Pirlo', 'Alessandro Nesta', 'Karim Benzema', 'Didier Deschamps',
  'Javier Mascherano', 'Pepe', 'Deco', 'Manuel Neuer', 'Toni Kroos', 'Thomas Müller',
  'Karl-Heinz Rummenigge', 'Ruud Gullit', 'Frank Rijkaard', 'Ronald Koeman', 'Roberto Carlos', 'Paul Scholes',
]);
const exceptionalSkillRatings: Record<string, number> = {
  'Diego Maradona': 95, 'Ronaldinho': 94, 'Zinedine Zidane': 95, 'Neymar': 94,
  'Zico': 94, 'Romário': 94, 'Rivaldo': 93, 'Kaká': 93, 'Dennis Bergkamp': 92,
  'Juan Román Riquelme': 92, 'Sócrates': 91, 'Thierry Henry': 94, 'Kylian Mbappé': 94,
  'Luís Figo': 93, 'Eusébio': 95, 'Bobby Charlton': 94, 'Roberto Baggio': 93,
};

function nationality(player: Player) {
  const parts = player.detail.split('·');
  const rawNationality = parts[parts.length - 1]?.trim() ?? player.team;
  return rawNationality.split('/').map((value) => value.trim()).find((value) => footballNationSet.has(value)) ?? rawNationality;
}

function draftGroup(player: Player, _sport: Sport, clubMode: boolean) {
  if (!clubMode) return nationality(player);
  return player.team;
}

function position(player: Player, sportId = '') {
  const role = player.detail.split('·')[0].trim();
  if (sportId === 'basketball') return ({ 'Point Guard': 'PG', 'Shooting Guard': 'SG', 'Small Forward': 'SF', 'Power Forward': 'PF', Center: 'C' } as Record<string, string>)[role] ?? role;
  if (sportId !== 'football') return role.toLowerCase().includes('midfielder') ? 'CM' : role;
  if (role === 'Goalkeeper') return 'GK';
  if (role.toLowerCase().includes('defender')) return 'DEF';
  if (role.toLowerCase().includes('midfielder')) return 'CM';
  if (role === 'Winger') return 'WG';
  return 'ST';
}

function allowedSlots(player: Player, sportId: string, slots: LineupSlot[]) {
  if (sportId === 'basketball') return [position(player, sportId)];
  if (sportId !== 'football') return slots.map((slot) => slot.id);
  const role = player.detail.split('·')[0].trim().toLowerCase();
  if (role.includes('goalkeeper')) return ['GK'];
  if (role.includes('defender')) return ['LCB', 'CB', 'RCB'];
  if (role.includes('midfielder')) return ['LM', 'LCM', 'RCM', 'RM'];
  return ['LW', 'ST', 'RW'];
}

function careerBounds(player: Player) {
  const values = player.years?.match(/\d{4}/g)?.map(Number) ?? [];
  return { start: values[0] ?? 1980, end: player.years?.toLowerCase().includes('present') ? new Date().getFullYear() : values[1] ?? values[0] ?? 1989 };
}

function primaryDecade(player: Player) {
  const { start, end } = careerBounds(player);
  let bestDecade = Math.floor(start / 10) * 10;
  let mostYears = 0;
  for (let decade = bestDecade; decade <= Math.floor(end / 10) * 10; decade += 10) {
    const years = Math.min(end, decade + 9) - Math.max(start, decade) + 1;
    if (years > mostYears) { bestDecade = decade; mostYears = years; }
  }
  return bestDecade;
}

function randomFromSeed(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function randomAllowance(maximum: number) {
  return Math.floor(Math.random() * maximum) + 1;
}

function weightedSample(players: Player[], count: number, ratings: Map<string, number>, seed: number) {
  const available = [...players];
  const selected: Player[] = [];
  while (available.length && selected.length < count) {
    const weights = available.map((player) => {
      const rating = ratings.get(player.name) ?? 80;
      return Math.pow(101 - rating, 2.25);
    });
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

function trophyScore(player: Player) {
  const honours = player.stat.toLowerCase();
  let trophyPoints = 0;
  if (honours.includes('ballon d’or')) trophyPoints += 3;
  if (honours.includes('world cup')) trophyPoints += 3;
  const europeanTitles = Number(honours.match(/(\d+)\s+(?:champions league|european cup)/)?.[1] ?? 0);
  if (honours.includes('champions league') || honours.includes('european cup')) trophyPoints += Math.max(1, Math.min(4, europeanTitles));
  if (honours.includes('league title') || honours.includes('premier league') || honours.includes('serie a') || honours.includes('bundesliga')) trophyPoints += 2;
  if (honours.includes('euro') || honours.includes('copa américa') || honours.includes('copa america')) trophyPoints += 2;
  if (honours.includes('cup') || honours.includes('domestic')) trophyPoints += 1;
  return trophyPoints;
}

function lowerTierRating(player: Player, baseRating: number) {
  const skillPoints = Math.max(0, Math.min(4, Math.round((baseRating - 80) / 5)));
  const trophyPoints = trophyScore(player);
  return Math.min(89, 80 + skillPoints + Math.min(5, trophyPoints));
}

function highTierRating(player: Player, baseRating: number) {
  const skillPoints = Math.max(0, Math.min(3, Math.round((baseRating - 90) / 2)));
  const honours = trophyScore(player);
  const trophyPoints = honours >= 4 ? 2 : honours > 0 ? 1 : 0;
  return Math.min(95, 90 + skillPoints + trophyPoints);
}

function playerRating(player: Player, index: number, poolSize: number, sportId: string) {
  const baseRating = player.rating ?? 100 - Math.round(index * 20 / Math.max(poolSize - 1, 1));
  if (sportId !== 'football') return baseRating;
  if (baseRating >= 96 && eliteFootballRatings.has(player.name)) return baseRating;
  if (baseRating >= 90 && highFootballRatings.has(player.name)) return highTierRating(player, baseRating);
  if (exceptionalSkillRatings[player.name]) return highTierRating(player, Math.max(baseRating, exceptionalSkillRatings[player.name]));
  return lowerTierRating(player, baseRating);
}

type EligibleBrief = { group: string; decade: number };

function DraftGame({ sport, pool, clubMode, eligibleBriefs }: { sport: Sport; pool: Player[]; clubMode: boolean; eligibleBriefs: EligibleBrief[] }) {
  const teamSize = sport.id === 'ufc' ? 1 : rosterSizes[sport.id] ?? 5;
  const [drafted, setDrafted] = useState<Player[]>([]);
  const [pending, setPending] = useState<Player>();
  const [pendingSlot, setPendingSlot] = useState<string>();
  const [assigned, setAssigned] = useState<Record<string, Player>>({});
  const [firstTeam, setFirstTeam] = useState<{ drafted: Player[]; assigned: Record<string, Player>; average: number }>();
  const [draftSeed, setDraftSeed] = useState(() => Date.now());
  const [choiceSeed, setChoiceSeed] = useState(() => Date.now() + 1);
  const [nationOffset, setNationOffset] = useState(0);
  const [rerolls, setRerolls] = useState(() => randomAllowance(10));
  const [refreshes, setRefreshes] = useState(() => randomAllowance(8));
  const [saveMessage, setSaveMessage] = useState('');
  const headToHead = sport.id === 'tennis' || sport.id === 'ufc';
  const slots = lineupSlots[sport.id] ?? [];
  const round = drafted.length;
  const complete = round >= teamSize;
  const ratings = useMemo(() => new Map(pool.map((player, index) => [player.name, playerRating(player, index, pool.length, sport.id)])), [pool, sport.id]);
  const briefOrder = useMemo(() => {
    const used = new Set([...drafted, ...(firstTeam?.drafted ?? [])].map((player) => player.name));
    const briefs = eligibleBriefs.filter((brief) => pool.some((player) =>
      !used.has(player.name)
      && draftGroup(player, sport, clubMode) === brief.group
      && primaryDecade(player) === brief.decade
      && allowedSlots(player, sport.id, slots).some((slot) => !assigned[slot]),
    ));
    for (let index = briefs.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(randomFromSeed(draftSeed + index * 71) * (index + 1));
      [briefs[index], briefs[swapIndex]] = [briefs[swapIndex], briefs[index]];
    }
    return briefs;
  }, [assigned, clubMode, draftSeed, drafted, eligibleBriefs, firstTeam, pool, slots, sport]);
  const brief = briefOrder[(round + nationOffset) % briefOrder.length];
  const scoutingNation = brief?.group ?? '';
  const decade = brief?.decade ?? firstDraftDecade;
  const choices = useMemo(() => {
    const used = new Set([...drafted, ...(firstTeam?.drafted ?? [])].map((player) => player.name));
    const unused = pool.filter((player) => !used.has(player.name) && allowedSlots(player, sport.id, slots).some((slot) => !assigned[slot]));
    const exact = unused.filter((player) => draftGroup(player, sport, clubMode) === scoutingNation && primaryDecade(player) === decade);
    return weightedSample(exact, 4, ratings, choiceSeed + round * 997 + 11);
  }, [assigned, choiceSeed, clubMode, decade, drafted, firstTeam, pool, ratings, round, scoutingNation, slots, sport]);
  const average = drafted.length ? Math.round(drafted.reduce((total, player) => total + (ratings.get(player.name) ?? 80), 0) / drafted.length) : 0;
  const teamNumber = firstTeam ? 2 : 1;

  function confirmPick() {
    if (!pending || !pendingSlot) return;
    setDrafted((team) => [...team, pending]);
    setAssigned((lineup) => ({ ...lineup, [pendingSlot]: pending }));
    setPending(undefined);
    setPendingSlot(undefined);
  }

  function resetCurrentTeam() {
    setDrafted([]);
    setPending(undefined);
    setPendingSlot(undefined);
    setAssigned({});
    setDraftSeed(Date.now());
    setChoiceSeed(Date.now() + 1);
    setNationOffset(0);
    setRerolls(randomAllowance(10));
    setRefreshes(randomAllowance(8));
  }

  function rerollBrief() {
    if (!rerolls || pending) return;
    setRerolls((value) => value - 1);
    setNationOffset((value) => value + 1);
    setChoiceSeed(Date.now() + rerolls * 101);
  }

  function refreshPlayers() {
    if (!refreshes || pending) return;
    setRefreshes((value) => value - 1);
    setChoiceSeed(Date.now() + refreshes * 211);
  }

  function roster(team: Player[], lineup: Record<string, Player>) {
    return <div className="drafted-roster">{team.map((player) => <article key={player.name}><span>{player.badge}</span><div><b>{player.name}</b><small>{Object.entries(lineup).find(([, pick]) => pick.name === player.name)?.[0]} · {player.years}</small></div><strong>{ratings.get(player.name)}</strong></article>)}</div>;
  }

  async function saveTeams(teams: { players: Player[]; overall: number }[]) {
    setSaveMessage('Saving…');
    try {
      const results = await Promise.all(teams.map((team) => saveDreamTeam(sport.id, team.overall, team.players)));
      setSaveMessage(results.every(Boolean) ? 'Dream Team saved to your account.' : 'Sign in above to save Dream Teams.');
    } catch { setSaveMessage('The team could not be saved. Try again.'); }
  }

  if (complete && headToHead && !firstTeam) return <section className="draft-game draft-result">
    <p className="eyebrow">TEAM 1 COMPLETE</p><h3>Your first {sport.name} team</h3>
    <div className="team-rating"><span>TEAM 1 OVR</span><strong>{average}</strong><small>/100</small></div>
    {roster(drafted, assigned)}
    <button className="restart-draft" onClick={() => { setFirstTeam({ drafted: [...drafted], assigned: { ...assigned }, average }); resetCurrentTeam(); }}>Draft Team 2 →</button>
  </section>;

  if (complete && headToHead && firstTeam) {
    const difference = firstTeam.average - average;
    const verdict = difference === 0 ? 'The teams are evenly matched' : difference > 0 ? `Team 1 is better by ${difference} OVR` : `Team 2 is better by ${Math.abs(difference)} OVR`;
    return <section className="draft-game draft-result">
      <p className="eyebrow">HEAD-TO-HEAD COMPLETE</p><h3>{verdict}</h3>
      <div className="team-comparison">
        <div className={difference >= 0 ? 'comparison-team winner' : 'comparison-team'}><span>TEAM 1</span><strong>{firstTeam.average}</strong><small> OVR</small>{roster(firstTeam.drafted, firstTeam.assigned)}</div>
        <div className="comparison-versus">VS</div>
        <div className={difference <= 0 ? 'comparison-team winner' : 'comparison-team'}><span>TEAM 2</span><strong>{average}</strong><small> OVR</small>{roster(drafted, assigned)}</div>
      </div>
      <button className="restart-draft" onClick={() => saveTeams([{ players: firstTeam.drafted, overall: firstTeam.average }, { players: drafted, overall: average }])}>Save both teams</button>
      {saveMessage && <p className="draft-save-message">{saveMessage}</p>}
      <button className="restart-draft" onClick={() => { setFirstTeam(undefined); resetCurrentTeam(); }}>Draft two new teams</button>
    </section>;
  }

  if (complete) return <section className="draft-game draft-result">
    <p className="eyebrow">MULTI-NATION · MULTI-ERA DRAFT COMPLETE</p><h3>Your {sport.name} dream team</h3>
    <div className="team-rating"><span>TEAM RATING</span><strong>{average}</strong><small>/100</small></div>
    <div className="drafted-roster">{drafted.map((player) => <article key={player.name}><span>{player.badge}</span><div><b>{player.name}</b><small>{Object.entries(assigned).find(([, pick]) => pick.name === player.name)?.[0]} · {player.years}</small></div><strong>{ratings.get(player.name)}</strong></article>)}</div>
    <button className="restart-draft" onClick={() => saveTeams([{ players: drafted, overall: average }])}>Save Dream Team</button>
    {saveMessage && <p className="draft-save-message">{saveMessage}</p>}
    <button className="restart-draft" onClick={resetCurrentTeam}>Draft another team</button>
  </section>;

  return <section className="draft-game">
    <div className="draft-header"><div><p className="eyebrow">{headToHead ? `TEAM ${teamNumber} · ` : ''}ROUND {round + 1} OF {teamSize}</p><h3>{headToHead ? `Build Team ${teamNumber}` : 'Build the greatest team'}</h3></div><div className="draft-score"><span>{headToHead ? `TEAM ${teamNumber}` : 'TEAM'}</span><strong>{average || '—'}</strong></div></div>
    <div className="scouting-brief"><div className="brief-copy"><span>THIS ROUND'S {clubMode ? 'TEAM' : 'NATIONALITY'} + ERA</span><strong>{scoutingNation}</strong><i /> <strong>{decade}s</strong><p>{pending ? `${pending.name}${pendingSlot ? ` · ${pendingSlot}` : ' · choose a position below'}` : 'Choose a player, then place them in the lineup.'}</p></div><div className="brief-actions"><button className="scout-control" disabled={!rerolls || Boolean(pending)} onClick={rerollBrief}>Reroll brief <b>{rerolls}</b></button><button className="scout-control" disabled={!refreshes || Boolean(pending)} onClick={refreshPlayers}>Refresh players <b>{refreshes}</b></button><button className="top-roll" disabled={!pending || !pendingSlot} onClick={confirmPick}>{round + 1 === teamSize ? 'Complete team →' : 'Roll next round ↻'}</button></div></div>
    {!pending && <div className="draft-choices">{choices.map((player) => <button key={player.name} onClick={() => { setPending(player); setPendingSlot(undefined); }}>
      <div className="draft-rating"><strong>{ratings.get(player.name)}</strong><small>OVR</small></div>
      <span className="draft-years">{player.years}</span><span className="position-tag">{position(player, sport.id)}</span><h4>{player.name}</h4><p>{nationality(player)}</p><em>🏆 {player.stat}</em><b>Select player →</b>
    </button>)}</div>}
    {pending && <div className="lineup-stage"><button className="change-pick" onClick={() => { setPending(undefined); setPendingSlot(undefined); }}>← Choose a different player</button><LineupPicker slots={slots} assigned={assigned} pending={pending} selected={pendingSlot} allowed={allowedSlots(pending, sport.id, slots).filter((slot) => !assigned[slot])} onSelect={setPendingSlot} /></div>}
    <div className="roster-progress">{Array.from({ length: teamSize }, (_, index) => <span key={index} className={index < drafted.length ? 'filled' : ''}>{drafted[index]?.badge ?? index + 1}</span>)}</div>
  </section>;
}

export function DreamTeamDraft({ sport }: { sport: Sport }) {
  const allPlayers = sport.draftPlayers ?? sport.quizPlayers ?? sport.players;
  const clubMode = clubDraftSports.has(sport.id) && sport.teams.length >= 10;
  const rankedNationalityMode = !clubMode && !individualDraftSports.has(sport.id);
  const requiredLineupSize = sport.id === 'ufc' ? 1 : rosterSizes[sport.id] ?? 5;
  const countryPlayers = new Map<string, Player[]>();
  if (rankedNationalityMode) allPlayers.forEach((player) => {
    const decade = primaryDecade(player);
    if (decade < firstDraftDecade || decade > lastDraftDecade) return;
    const country = nationality(player);
    countryPlayers.set(country, [...(countryPlayers.get(country) ?? []), player]);
  });
  const countryThreshold = availableThreshold([...countryPlayers.values()].map((players) => players.length), requiredLineupSize);
  const eligibleCountries = new Set([...countryPlayers]
    .filter(([, players]) => players.length >= countryThreshold)
    .map(([country, players]) => ({
      country,
      caliber: players.map((player) => playerRating(player, allPlayers.indexOf(player), allPlayers.length, sport.id)).sort((a, b) => b - a).slice(0, countryThreshold).reduce((total, rating) => total + rating, 0) / countryThreshold,
    }))
    .sort((a, b) => b.caliber - a.caliber)
    .slice(0, nationalityLimit)
    .map(({ country }) => country));
  const counts = new Map<string, number>();
  allPlayers.forEach((player) => {
    const group = draftGroup(player, sport, clubMode);
    if (!group || (rankedNationalityMode && !eligibleCountries.has(group))) return;
    const decade = primaryDecade(player);
    if (decade < firstDraftDecade || decade > lastDraftDecade) return;
    const key = `${group}\u0000${decade}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const teamEraThreshold = clubMode ? availableThreshold([...counts.values()], requiredLineupSize) : 1;
  const eligibleBriefs = [...counts].filter(([, count]) => count >= teamEraThreshold).map(([key]) => {
    const [group, decade] = key.split('\u0000');
    return { group, decade: Number(decade) };
  });
  const pool = allPlayers.filter((player) => eligibleBriefs.some((brief) => draftGroup(player, sport, clubMode) === brief.group && primaryDecade(player) === brief.decade));

  if (!pool.length) return <section className="draft-game draft-unavailable">
    <p className="eyebrow">DRAFT POOL REQUIREMENT</p>
    <h3>No eligible {clubMode ? 'teams' : 'nationalities'} yet</h3>
    <p>{clubMode ? `The draft prefers eight players per team and era, then uses the strongest available pool of at least four when the dataset is smaller.` : rankedNationalityMode ? `The draft prefers eight athletes per country, falls back to at least four when needed, and selects up to ${nationalityLimit} of the strongest eligible countries.` : 'Every represented nationality can enter this individual-sport draft.'}</p>
  </section>;

  return <DraftGame sport={sport} pool={pool} clubMode={clubMode} eligibleBriefs={eligibleBriefs} />;
}
