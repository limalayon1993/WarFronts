import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_TRANSLATIONS } from '../i18n/translations/ui';
import { RULES_TRANSLATIONS } from '../i18n/translations/rules';
import { GUIDE_TRANSLATIONS } from '../i18n/translations/guide';
import { MANUAL_TRANSLATIONS } from '../i18n/translations/manual';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('wf_language');
      return saved === 'en' || saved === 'es' ? saved : 'es';
    } catch (_) {
      return 'es';
    }
  });

  const setLanguage = (lang) => {
    const nextLang = lang === 'en' ? 'en' : 'es';
    setLanguageState(nextLang);
    try {
      localStorage.setItem('wf_language', nextLang);
      document.documentElement.lang = nextLang;
    } catch (_) {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (_) {}
  }, [language]);

  const t = (keyPath, fallback = '') => {
    const keys = keyPath.split('.');
    let curr = UI_TRANSLATIONS[language];
    for (const k of keys) {
      if (!curr || typeof curr !== 'object') return fallback;
      curr = curr[k];
    }
    return curr !== undefined ? curr : fallback;
  };

  const value = {
    language,
    isEn: language === 'en',
    isEs: language === 'es',
    setLanguage,
    toggleLanguage,
    t,
    ui: UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es,
    rulesT: RULES_TRANSLATIONS[language] || RULES_TRANSLATIONS.es,
    guideT: GUIDE_TRANSLATIONS[language] || GUIDE_TRANSLATIONS.es,
    manualT: MANUAL_TRANSLATIONS[language] || MANUAL_TRANSLATIONS.es,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
