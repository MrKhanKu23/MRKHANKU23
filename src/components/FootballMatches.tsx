import { useEffect, useMemo, useState } from 'react';
import {
  footballLeagues,
  fullTimeScore,
  loadFootballCompetition,
  type FootballCompetition,
  type FootballLeagueId,
} from '../lib/openFootball';
import { loadFootballMatchDetails, type FootballMatchDetails } from '../lib/footballMatchDetails';
import './FootballMatches.css';
import './FootballMatchDetails.css';

type MatchFilter = 'all' | 'fixtures' | 'results';

function readableDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function FootballMatches() {
  const [league, setLeague] = useState<FootballLeagueId>('en.1');
  const [competition, setCompetition] = useState<FootballCompetition>();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [team, setTeam] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [details, setDetails] = useState<FootballMatchDetails>();
  const [detailsError, setDetailsError] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);

  function openMatch(key: string, match: FootballCompetition['matches'][number]) {
    if (selected === key) { setSelected(undefined); return; }
    setSelected(key); setDetails(undefined); setDetailsError(''); setDetailsLoading(true);
    loadFootballMatchDetails(league, match).then(setDetails)
      .catch((reason: unknown) => setDetailsError(reason instanceof Error ? reason.message : 'Match details are unavailable.'))
      .finally(() => setDetailsLoading(false));
  }

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    loadFootballCompetition(league)
      .then((data) => { if (active) setCompetition(data); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Could not load football data.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [league, retry]);

  const matches = useMemo(() => {
    const needle = team.trim().toLowerCase();
    return (competition?.matches ?? [])
      .filter((match) => {
        const hasResult = Boolean(fullTimeScore(match.score));
        const correctType = filter === 'all' || (filter === 'results' ? hasResult : !hasResult);
        const correctTeam = !needle || match.team1.toLowerCase().includes(needle) || match.team2.toLowerCase().includes(needle);
        return correctType && correctTeam;
      })
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 50);
  }, [competition, filter, team]);

  return <section className="football-data" aria-live="polite">
    <div className="football-data-head">
      <div><p className="eyebrow">OPENFOOTBALL · CC0 DATA</p><h3>Fixtures &amp; results</h3><p>Free, open football data with no account or API key.</p></div>
      <label>Competition<select value={league} onChange={(event) => setLeague(event.target.value as FootballLeagueId)}>{footballLeagues.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <div className="football-controls">
      <div className="football-filters">{(['all', 'fixtures', 'results'] as MatchFilter[]).map((value) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div>
      <input value={team} onChange={(event) => setTeam(event.target.value)} placeholder="Filter by team…" aria-label="Filter matches by team" />
    </div>
    {loading ? <div className="football-message">Loading OpenFootball data…</div>
      : error ? <div className="football-message football-error"><b>Could not load the dataset.</b><span>{error}</span><button onClick={() => setRetry((value) => value + 1)}>Try again</button></div>
      : <>
        <div className="football-season"><b>{competition?.name}</b><span>{matches.length} of {competition?.matches.length ?? 0} matches shown</span></div>
        {matches.length ? <div className="match-list">{matches.map((match, index) => {
          const score = fullTimeScore(match.score);
          const key = `${match.date}-${match.team1}-${match.team2}-${index}`;
          return <article key={key} className={selected === key ? 'match-card selected' : 'match-card'}>
            <button className="match-summary" onClick={() => openMatch(key, match)} aria-expanded={selected === key}>
              <div className="match-meta"><b>{match.round || 'Match'}</b><span>{readableDate(match.date)}{match.time ? ` · ${match.time}` : ''}</span></div>
              <div className="match-teams"><span>{match.team1}</span><strong>{score ? `${score[0]} — ${score[1]}` : match.time || 'TBC'}</strong><span>{match.team2}</span></div>
              <small className={score ? 'is-result' : 'is-fixture'}>{score ? 'FULL TIME' : 'FIXTURE'} · {selected === key ? 'CLOSE' : 'DETAILS'}</small>
            </button>
            {selected === key && <div className="match-details">{detailsLoading ? <p>Loading scorers and match stats…</p> : detailsError ? <p>{detailsError}</p> : details && <>
              <div className="match-scorers"><h4>Scorers</h4>{details.scorers.length ? <ul>{details.scorers.map((goal, goalIndex) => <li key={`${goal.player}-${goal.minute}-${goalIndex}`}><b>{goal.minute}</b><span>{goal.player}{goal.penalty ? ' (pen.)' : goal.ownGoal ? ' (own goal)' : ''}<small>{goal.team}{goal.assist ? ` · Assist: ${goal.assist}` : ''}</small></span></li>)}</ul> : <p>{score ? 'No scorer details available.' : 'Scorers will appear after the match.'}</p>}</div>
              <div className="match-statistics"><h4>Match stats</h4>{details.stats.length ? details.stats.map((stat) => <div key={stat.label}><b>{stat.home}</b><span>{stat.label}</span><b>{stat.away}</b></div>) : <p>Statistics will appear when available.</p>}</div>
            </>}</div>}
          </article>;
        })}</div> : <div className="football-message">No matches match these filters.</div>}
      </>}
    <p className="football-credit">Data: <a href="https://github.com/openfootball/football.json" target="_blank" rel="noreferrer">OpenFootball football.json</a> · Public domain (CC0) · Dataset, not live scores</p>
  </section>;
}
