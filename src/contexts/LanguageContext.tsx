"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type T, translations } from "@/lib/i18n";

const LS_KEY = "tlc:locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: T;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) as Locale | null;
    if (stored && translations[stored]) setLocaleState(stored);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(LS_KEY, l);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
