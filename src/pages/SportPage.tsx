import { useMemo, useState } from 'react';
import { AccountPanel } from '../components/AccountPanel';
import { DreamTeamDraft } from '../components/DreamTeamDraft';
import { Leaderboards } from '../components/Leaderboards';
import { Rankings } from '../components/Rankings';
import { SearchHero } from '../components/SearchHero';
import { SportsQuiz } from '../components/SportsQuiz';
import type { Sport } from '../lib/sportsData';

type View = 'rankings' | 'quiz' | 'draft';

export function SportPage({ sport }: { sport: Sport }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'teams' | 'players'>('teams');
  const [view, setView] = useState<View>('rankings');
  const [edition, setEdition] = useState<'all-time' | 'current'>('all-time');
  const organisations = sport.id === 'fortnite' || sport.id === 'counter-strike-2';
  const editionSport = useMemo(() => {
    if (edition === 'all-time') return sport;
    const active = (sport.quizPlayers ?? sport.players).filter((player) => player.status === 'active');
    const activeNames = new Set(active.map((player) => player.name));
    return { ...sport, players: sport.players.filter((player) => activeNames.has(player.name)), quizPlayers: active, draftPlayers: (sport.draftPlayers ?? active).filter((player) => player.status === 'active') };
  }, [edition, sport]);
  const currentGameUnavailable = edition === 'current' && (editionSport.quizPlayers?.length ?? 0) < 3;

  return <main className="sport-app" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
    <a className="sport-home-link" href="/">← Back to all sports</a>
    <SearchHero sport={editionSport} query={query} edition={edition} onQuery={setQuery} onEdition={(next) => { setEdition(next); setQuery(''); setView('rankings'); }} />
    <section className="dashboard" id={sport.id}>
      <AccountPanel />
      <div className="section-heading"><div><p className="eyebrow">ALL-TIME RECORD BOOK</p><h2>{sport.icon} {sport.name} hub</h2><p>Ranked by major titles, championships, medals and official records.</p></div>
        <div className="game-actions"><button className="quiz-button" onClick={() => setView(view === 'quiz' ? 'rankings' : 'quiz')}>{view === 'quiz' ? 'Close quiz' : '⚡ Quiz'}</button><button className="quiz-button draft-button" onClick={() => setView(view === 'draft' ? 'rankings' : 'draft')}>{view === 'draft' ? 'Close draft' : '★ Dream Team Draft'}</button></div>
      </div>
      {currentGameUnavailable && view !== 'rankings' ? <div className="empty-state"><b>Current game roster coming soon</b><span>Current rankings remain available, or choose All-Time Edition to play.</span></div> : view === 'quiz' ? <SportsQuiz sport={editionSport} /> : view === 'draft' ? <DreamTeamDraft key={`${sport.id}-${edition}`} sport={editionSport} /> : <><div className="tabs" role="tablist" aria-label="Rankings type"><button className={tab === 'teams' ? 'active' : ''} onClick={() => setTab('teams')}>{organisations ? 'Top 10 organisations' : 'Top teams'}</button><button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>{edition === 'current' ? 'Current players' : 'Top 10 players'}</button></div><Rankings sport={editionSport} type={tab} /></>}
      <Leaderboards sportId={sport.id} />
    </section>
  </main>;
}
