import type { Sport } from '../lib/sportsData';
import './SportBackground.css';

type Props = { sport: Sport; sports: Sport[]; query: string; onQuery: (value: string) => void; onSport: (sport: Sport) => void };

const sportLegends: Record<string, [string, string]> = {
  football: ['Lionel Messi', 'Pelé'],
  basketball: ['Michael Jordan', 'LeBron James'],
  tennis: ['Serena Williams', 'Novak Djokovic'],
  f1: ['Lewis Hamilton', 'Michael Schumacher'],
  baseball: ['Babe Ruth', 'Willie Mays'],
  'american-football': ['Tom Brady', 'Jerry Rice'],
  ufc: ['Georges St-Pierre', 'Anderson Silva'],
  swimming: ['Michael Phelps', 'Katie Ledecky'],
  volleyball: ['Karch Kiraly', 'Giba'],
  'track-sprint': ['Usain Bolt', 'Allyson Felix'],
};

function legendPhoto(name: string) {
  const slug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/legends/${slug}.${name === 'Anderson Silva' ? 'png' : 'jpg'}`;
}

export function SearchHero({ sport, sports, query, onQuery, onSport }: Props) {
  const legends = sportLegends[sport.id] ?? sport.players.slice(0, 2).map((player) => player.name) as [string, string];
  return <header className="hero sport-background" data-sport={sport.id} style={{ '--accent': sport.accent } as React.CSSProperties}>
    <nav><a className="brand" href="#top"><span>SP</span>ORTDEX</a><span className="live"><i /> ALL-TIME EDITION</span></nav>
    <div className="hero-copy">
      <p className="kicker">YOUR SPORTS KNOWLEDGE HUB</p>
      <h1>Know the game.<br /><em>Own the stats.</em></h1>
      <p>Search a sport. Meet the teams. Learn the stars. Then prove what you know.</p>
      <label className="search"><span>⌕</span><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder={`Search ${sport.name.toLowerCase()} teams or players...`} /></label>
      <div className="sport-pills">{sports.map((item) => <button key={item.id} className={item.id === sport.id ? 'selected' : ''} onClick={() => onSport(item)}>{item.icon} {item.name}</button>)}</div>
    </div>
    <div className="sport-scene" aria-hidden="true"><span>{sport.icon}</span></div>
    <aside className="sport-legends" aria-label={`${sport.name} legends`}>
      {legends.map((legend) => <article key={legend} aria-label={legend} title={legend} style={{ '--legend-photo': `url("${legendPhoto(legend)}")` } as React.CSSProperties} />)}
    </aside>
    <div className="hero-number">10</div>
  </header>;
}
