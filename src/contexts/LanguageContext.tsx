"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type T, translations } from "@/lib/i18n";

const LS_KEY = "tlc:locale";

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const languages = [...(navigator.languages || []), navigator.language].filter(Boolean);
  for (const value of languages) {
    const normalized = value.toLowerCase();
    if (normalized.startsWith("ko")) return "ko";
    if (normalized.startsWith("fr")) return "fr";
    if (normalized === "zh-hk" || normalized === "zh-mo" || normalized.startsWith("yue")) return "zh-HK";
    if (normalized.startsWith("zh")) return "zh-CN";
    if (normalized.startsWith("es")) return "es";
    if (normalized.startsWith("en")) return "en";
  }
  return "en";
}

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
    if (stored && translations[stored]) {
      setLocaleState(stored);
      return;
    }
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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
