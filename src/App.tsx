import { useMemo, useState } from 'react';
import { Rankings } from './components/Rankings';
import { SearchHero } from './components/SearchHero';
import { SportsQuiz } from './components/SportsQuiz';
import { sports, type Sport } from './lib/sportsData';

export default function App() {
  const [sport, setSport] = useState<Sport>(sports[0]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'teams' | 'players'>('teams');
  const [quizOpen, setQuizOpen] = useState(false);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return sport;
    return {
      ...sport,
      teams: sport.teams.filter((team) => team.name.toLowerCase().includes(value)),
      players: sport.players.filter((player) =>
        `${player.name} ${player.team}`.toLowerCase().includes(value),
      ),
    };
  }, [query, sport]);

  function chooseSport(next: Sport) {
    setSport(next);
    setQuery('');
    setQuizOpen(false);
  }

  return (
    <main className="sport-app" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
      <SearchHero
        sport={sport}
        sports={sports}
        query={query}
        onQuery={setQuery}
        onSport={chooseSport}
      />
      <section className="dashboard">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ALL-TIME RECORD BOOK</p>
            <h2>{sport.icon} {sport.name} hub</h2>
            <p>Ranked by major titles, championships, medals and official records.</p>
          </div>
          <button className="quiz-button" onClick={() => setQuizOpen((open) => !open)}>
            {quizOpen ? 'Close quiz' : '⚡ Play the quiz'}
          </button>
        </div>

        {quizOpen ? (
          <SportsQuiz sport={sport} />
        ) : (
          <>
            <div className="tabs" role="tablist" aria-label="Rankings type">
              <button className={tab === 'teams' ? 'active' : ''} onClick={() => setTab('teams')}>
                Top teams
              </button>
              <button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>
                Top players
              </button>
            </div>
            <Rankings sport={filtered} type={tab} />
          </>
        )}
      </section>
    </main>
  );
}
