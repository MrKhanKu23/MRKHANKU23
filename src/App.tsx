import { useEffect, useMemo, useState } from 'react';
import { sports, type Sport } from './lib/sportsData';
import { loadSportsCatalog } from './lib/sportdexDb';
import { LandingPage } from './pages/LandingPage';
import { SportPage } from './pages/SportPage';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import './components/BlueWhiteTheme.css';
import './components/SportLinks.css';
import './components/Mobile.css';

export default function App() {
  const [catalog, setCatalog] = useState<Sport[]>(sports);
  const [language, setLanguage] = useState<'en' | 'ru'>(() => localStorage.getItem('sportify-language') === 'ru' ? 'ru' : 'en');
  useEffect(() => { loadSportsCatalog(sports).then(setCatalog); }, []);
  useEffect(() => {
    const update = (event: Event) => setLanguage((event as CustomEvent<'en' | 'ru'>).detail);
    window.addEventListener('sportify-language-change', update);
    return () => window.removeEventListener('sportify-language-change', update);
  }, []);
  const translatedCatalog = useMemo(() => catalog.map((item) => language !== 'ru' ? item : {
    ...item,
    name: item.id === 'fortnite' ? 'Фортнайт' : item.id === 'counter-strike-2' ? 'Контр-Страйк 2' : item.name,
  }), [catalog, language]);
  const sportId = window.location.pathname.match(/^\/sports\/([^/]+)\/?$/)?.[1];
  const sport = translatedCatalog.find((item) => item.id === sportId);

  if (!sportId) return <><LandingPage sports={translatedCatalog} /><LanguageSwitcher /></>;
  if (!sport) return <main className="landing-page"><section className="landing-hero"><p className="eyebrow">404</p><h1>Sport not found.</h1><a href="/">← Return to all sports</a></section></main>;
  return <><SportPage sport={sport} /><LanguageSwitcher /></>;
}
