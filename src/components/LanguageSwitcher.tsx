import { useEffect, useState } from 'react';
import './LanguageSwitcher.css';

type Language = 'en' | 'ru';
type TranslateElement = new (options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean }, elementId: string) => unknown;

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: TranslateElement } };
    sportifyTranslateReady?: () => void;
  }
}

function selectLanguage(language: Language) {
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (!select) return false;
  select.value = language;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  document.documentElement.lang = language;
  return true;
}

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('sportify-language') === 'ru' ? 'ru' : 'en');
  const [translating, setTranslating] = useState(() => localStorage.getItem('sportify-language') === 'ru');

  useEffect(() => {
    const initialize = () => {
      const Constructor = window.google?.translate?.TranslateElement;
      const host = document.getElementById('sportify-google-translate');
      if (!Constructor || !host || host.childElementCount) return;
      new Constructor({ pageLanguage: 'en', includedLanguages: 'en,ru', autoDisplay: false }, 'sportify-google-translate');
      window.setTimeout(() => {
        selectLanguage(language);
        window.setTimeout(() => setTranslating(false), 1200);
      }, 250);
    };
    window.sportifyTranslateReady = initialize;
    initialize();
    if (!document.querySelector('script[data-sportify-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=sportifyTranslateReady';
      script.async = true;
      script.dataset.sportifyTranslate = 'true';
      document.head.appendChild(script);
    }
  }, [language]);

  async function changeLanguage() {
    const next: Language = language === 'en' ? 'ru' : 'en';
    setTranslating(true);
    localStorage.setItem('sportify-language', next);
    if (next === 'en') {
      document.cookie = 'googtrans=; Max-Age=0; path=/';
      document.cookie = `googtrans=; Max-Age=0; path=/; domain=${window.location.hostname}`;
      window.location.reload();
      return;
    }
    for (let attempt = 0; attempt < 8 && !selectLanguage(next); attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    }
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    setLanguage(next);
    window.dispatchEvent(new CustomEvent<Language>('sportify-language-change', { detail: next }));
    setTranslating(false);
  }

  return <>
    <div id="sportify-google-translate" aria-hidden="true" />
    {translating && <div className="translation-cover notranslate" role="status"><span className="translation-spinner" />{language === 'en' ? 'Translating Sportify…' : 'Перевод Sportify…'}</div>}
    <button className="language-switcher notranslate" disabled={translating} onClick={changeLanguage} aria-label={language === 'en' ? 'Translate Sportify to Russian' : 'Перевести Sportify на английский'}>
      <span>{language === 'en' ? 'RU' : 'EN'}</span>{language === 'en' ? ' Русский' : ' English'}
    </button>
  </>;
}
