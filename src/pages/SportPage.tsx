import { useMemo, useState } from 'react';
import { AccountPanel } from '../components/AccountPanel';
import { DreamTeamDraft } from '../components/DreamTeamDraft';
import { Leaderboards } from '../components/Leaderboards';
import { Rankings } from '../components/Rankings';
import { SearchHero } from '../components/SearchHero';
import { SportsQuiz } from '../components/SportsQuiz';
import type { Sport } from '../lib/sportsData';
import { currentPlayers, orderCurrentTeams } from '../lib/currentRankings';

type View = 'rankings' | 'quiz' | 'draft';

export function SportPage({ sport }: { sport: Sport }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'teams' | 'players'>('teams');
  const [view, setView] = useState<View>('rankings');
  const [edition, setEdition] = useState<'all-time' | 'current'>('all-time');
  const organisations = sport.id === 'fortnite' || sport.id === 'counter-strike-2';
  const editionSport = useMemo(() => {
    if (edition === 'all-time') return sport;
    const active = currentPlayers[sport.id] ?? (sport.quizPlayers ?? sport.players).filter((player) => player.status === 'active').slice(0, 10);
    const activeNames = new Set(active.map((player) => player.name));
    return { ...sport, teams: orderCurrentTeams(sport.teams, sport.id), players: active.slice(0, 10), quizPlayers: active, draftPlayers: active.filter((player) => activeNames.has(player.name)) };
  }, [edition, sport]);
  const currentGameUnavailable = edition === 'current' && (editionSport.quizPlayers?.length ?? 0) < 3;

  return <main className="sport-app" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
    <a className="sport-home-link" href="/">← Back to all sports</a>
    <SearchHero sport={editionSport} query={query} edition={edition} onQuery={setQuery} onEdition={(next) => { setEdition(next); setQuery(''); setView('rankings'); }} />
    <section className="dashboard" id={sport.id}>
      <AccountPanel />
      <div className="section-heading"><div><p className="eyebrow">{edition === 'current' ? 'CURRENT FORM LEADERBOARD' : 'ALL-TIME RECORD BOOK'}</p><h2>{sport.icon} {sport.name} hub</h2><p>{edition === 'current' ? 'Ranked by recent performance, current form and the latest major competitions.' : 'Ranked by major titles, championships, medals and official records.'}</p></div>
        <div className="game-actions"><button className="quiz-button" onClick={() => setView(view === 'quiz' ? 'rankings' : 'quiz')}>{view === 'quiz' ? 'Close quiz' : '⚡ Quiz'}</button><button className="quiz-button draft-button" onClick={() => setView(view === 'draft' ? 'rankings' : 'draft')}>{view === 'draft' ? 'Close draft' : '★ Dream Team Draft'}</button></div>
      </div>
      {currentGameUnavailable && view !== 'rankings' ? <div className="empty-state"><b>Current game roster coming soon</b><span>Current rankings remain available, or choose All-Time Edition to play.</span></div> : view === 'quiz' ? <SportsQuiz sport={editionSport} /> : view === 'draft' ? <DreamTeamDraft key={`${sport.id}-${edition}`} sport={editionSport} /> : <><div className="tabs" role="tablist" aria-label="Rankings type"><button className={tab === 'teams' ? 'active' : ''} onClick={() => setTab('teams')}>{organisations ? 'Top 10 organisations' : 'Top teams'}</button><button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>{edition === 'current' ? 'Current players' : 'Top 10 players'}</button></div><Rankings sport={editionSport} type={tab} /></>}
      <Leaderboards sportId={sport.id} />
    </section>
  </main>;
}
