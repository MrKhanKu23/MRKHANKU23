import type { Sport } from '../lib/sportsData';
import { FactFileSearch } from './FactFileSearch';
import './SportBackground.css';

type Props = { sport: Sport; query: string; onQuery: (value: string) => void };

export function SearchHero({ sport, query, onQuery }: Props) {
  return <header className="hero sport-background" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
    <nav><a className="brand" href="#top"><span>SPORT</span>IFY</a><span className="live"><i /> ALL-TIME EDITION</span></nav>
    <div className="hero-copy">
      <p className="kicker">YOUR SPORTS KNOWLEDGE HUB</p>
      <h1>Know the game.<br /><em>Own the stats.</em></h1>
      <p>Search a sport. Meet the teams. Learn the stars. Then prove what you know.</p>
      <div className="search-fact-wrap"><label className="search"><span>⌕</span><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder={`Search ${sport.name.toLowerCase()} teams or players...`} /></label>{query.trim() && <FactFileSearch sport={sport} query={query} />}</div>
    </div>
    <div className="sport-scene" aria-hidden="true"><span>{sport.icon}</span></div>
    <div className="hero-number">10</div>
  </header>;
}
