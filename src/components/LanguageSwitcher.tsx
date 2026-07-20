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

  useEffect(() => {
    const initialize = () => {
      const Constructor = window.google?.translate?.TranslateElement;
      const host = document.getElementById('sportify-google-translate');
      if (!Constructor || !host || host.childElementCount) return;
      new Constructor({ pageLanguage: 'en', includedLanguages: 'en,ru', autoDisplay: false }, 'sportify-google-translate');
      window.setTimeout(() => selectLanguage(language), 250);
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

  function changeLanguage() {
    const next: Language = language === 'en' ? 'ru' : 'en';
    setLanguage(next);
    localStorage.setItem('sportify-language', next);
    if (!selectLanguage(next)) window.setTimeout(() => selectLanguage(next), 500);
  }

  return <>
    <div id="sportify-google-translate" aria-hidden="true" />
    <button className="language-switcher notranslate" onClick={changeLanguage} aria-label={language === 'en' ? 'Translate Sportify to Russian' : 'Перевести Sportify на английский'}>
      <span>{language === 'en' ? 'RU' : 'EN'}</span>{language === 'en' ? ' Русский' : ' English'}
    </button>
  </>;
}
