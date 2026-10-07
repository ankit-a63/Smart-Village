import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

const LanguageContext = createContext();

const translations = { en, hi };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('svms_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('svms_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  // Nested translation key retriever e.g. t('hero.title')
  const t = (keyPath, fallback = '') => {
    const keys = keyPath.split('.');
    let current = translations[lang];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if missing in current locale
        let enCurrent = translations['en'];
        for (const k of keys) {
          if (enCurrent && enCurrent[k] !== undefined) {
            enCurrent = enCurrent[k];
          } else {
            return fallback || keyPath;
          }
        }
        return enCurrent;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
