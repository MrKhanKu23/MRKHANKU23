import { useEffect, useState } from 'react';
import { sports, type Sport } from './lib/sportsData';
import { loadSportsCatalog } from './lib/sportdexDb';
import { LandingPage } from './pages/LandingPage';
import { SportPage } from './pages/SportPage';
import './components/BlueWhiteTheme.css';
import './components/SportLinks.css';
import './components/Mobile.css';

export default function App() {
  const [catalog, setCatalog] = useState<Sport[]>(sports);
  useEffect(() => { loadSportsCatalog(sports).then(setCatalog); }, []);
  const sportId = window.location.pathname.match(/^\/sports\/([^/]+)\/?$/)?.[1];
  const sport = catalog.find((item) => item.id === sportId);

  if (!sportId) return <LandingPage sports={catalog} />;
  if (!sport) return <main className="landing-page"><section className="landing-hero"><p className="eyebrow">404</p><h1>Sport not found.</h1><a href="/">← Return to all sports</a></section></main>;
  return <SportPage sport={sport} sports={catalog} />;
}
