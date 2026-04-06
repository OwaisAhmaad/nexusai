'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LangCode, Translations, TRANSLATIONS } from '@/lib/translations';

interface LanguageContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'EN',
  setLang: () => {},
  t: TRANSLATIONS.EN,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('EN');

  /* Restore persisted preference on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexusai_lang') as LangCode | null;
      if (saved && TRANSLATIONS[saved]) setLangState(saved);
    } catch {}
  }, []);

  function setLang(code: LangCode) {
    setLangState(code);
    try { localStorage.setItem('nexusai_lang', code); } catch {}
    /* RTL support for Arabic */
    document.documentElement.dir = code === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = code.toLowerCase();
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
