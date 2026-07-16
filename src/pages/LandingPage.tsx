import type { Sport } from '../lib/sportsData';
import './Pages.css';

export function LandingPage({ sports }: { sports: Sport[] }) {
  return <main className="landing-page">
    <section className="landing-hero"><p className="eyebrow">SPORTDEX</p><h1>Choose your <em>sport.</em></h1><p>Open a dedicated world of all-time rankings, quizzes, Dream Team drafts and leaderboards.</p></section>
    <nav className="sport-site-grid" aria-label="Sport websites">
      {sports.map((sport) => <a key={sport.id} href={`/sports/${sport.id}`} style={{ '--sport-accent': sport.accent } as React.CSSProperties}>
        <span>{sport.icon}</span><div><small>ENTER SPORT</small><h2>{sport.name}</h2><p>Rankings · Quiz · Dream Draft</p></div><b>→</b>
      </a>)}
    </nav>
  </main>;
}
