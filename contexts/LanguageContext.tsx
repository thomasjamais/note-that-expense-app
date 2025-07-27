// src/contexts/LanguageContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'fr';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: async () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n: i18nInstance } = useTranslation();
  const [language, setLanguageState] = useState<Language>(i18nInstance.language as Language);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('appLanguage');
      if (saved && saved !== language) {
        i18nInstance.changeLanguage(saved);
        setLanguageState(saved as Language);
      }
    })();
  }, []);

  const setLanguage = async (lang: Language) => {
    await i18nInstance.changeLanguage(lang);
    setLanguageState(lang);
    await AsyncStorage.setItem('appLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
