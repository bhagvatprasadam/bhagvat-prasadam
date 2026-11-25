import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', short: 'English' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', short: 'ગુજરાતી' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', short: 'हिन्दी' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('bhagvat_prasadam_lang');
      return saved && ['en', 'gu', 'hi'].includes(saved) ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    if (['en', 'gu', 'hi'].includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem('bhagvat_prasadam_lang', lang);
      } catch (e) {
        console.error('Failed to save language to localStorage:', e);
      }
    }
  };

  const t = (key, fallback = '') => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const enDict = translations.en;
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback || key;
  };

  // Always preserve and display the full original product title across all languages without modification
  const formatTitle = (product) => {
    if (!product) return '';
    if (typeof product === 'string') return product;
    return product.title || product.product_title || product.name || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatTitle, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
