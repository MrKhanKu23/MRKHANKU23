import type { Sport } from '../lib/sportsData';
import { FactFileSearch } from './FactFileSearch';
import './SportBackground.css';

type Edition = 'all-time' | 'current';
type Props = { sport: Sport; query: string; edition: Edition; onQuery: (value: string) => void; onEdition: (edition: Edition) => void };

export function SearchHero({ sport, query, edition, onQuery, onEdition }: Props) {
  return <header className="hero sport-background" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
    <nav><a className="brand" href="#top"><span>SPORT</span>IFY</a><div className="edition-toggle" aria-label="Choose rankings edition"><button className={edition === 'all-time' ? 'active' : ''} onClick={() => onEdition('all-time')}>All-Time Edition</button><button className={edition === 'current' ? 'active' : ''} onClick={() => onEdition('current')}>Current Edition</button></div></nav>
    <div className="hero-copy">
      <p className="kicker">YOUR SPORTS KNOWLEDGE HUB</p>
      <h1>Know the game.<br /><em>Own the stats.</em></h1>
      <p>Search a sport. Meet the teams. Learn the stars. Then prove what you know.</p>
      <div className="search-fact-wrap"><label className="search"><span>⌕</span><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder={`Search ${sport.name.toLowerCase()} teams or players...`} /></label>{query.trim() && <FactFileSearch sport={sport} query={query} edition={edition} />}</div>
    </div>
    <div className="sport-scene" aria-hidden="true"><span>{sport.icon}</span></div>
    <div className="hero-number">10</div>
  </header>;
}
