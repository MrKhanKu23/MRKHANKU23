import { useState } from 'react';
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
  const organisations = sport.id === 'fortnite' || sport.id === 'counter-strike-2';

  return <main className="sport-app" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
    <a className="sport-home-link" href="/">← Back to all sports</a>
    <SearchHero sport={sport} query={query} onQuery={setQuery} />
    <section className="dashboard" id={sport.id}>
      <AccountPanel />
      <div className="section-heading"><div><p className="eyebrow">ALL-TIME RECORD BOOK</p><h2>{sport.icon} {sport.name} hub</h2><p>Ranked by major titles, championships, medals and official records.</p></div>
        <div className="game-actions"><button className="quiz-button" onClick={() => setView(view === 'quiz' ? 'rankings' : 'quiz')}>{view === 'quiz' ? 'Close quiz' : '⚡ Quiz'}</button><button className="quiz-button draft-button" onClick={() => setView(view === 'draft' ? 'rankings' : 'draft')}>{view === 'draft' ? 'Close draft' : '★ Dream Team Draft'}</button></div>
      </div>
      {view === 'quiz' ? <SportsQuiz sport={sport} /> : view === 'draft' ? <DreamTeamDraft key={sport.id} sport={sport} /> : <><div className="tabs" role="tablist" aria-label="Rankings type"><button className={tab === 'teams' ? 'active' : ''} onClick={() => setTab('teams')}>{organisations ? 'Top 10 organisations' : 'Top teams'}</button><button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>Top 10 players</button></div><Rankings sport={sport} type={tab} /></>}
      <Leaderboards sportId={sport.id} />
    </section>
  </main>;
}
