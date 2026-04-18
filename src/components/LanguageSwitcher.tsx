"use client";
import { useState } from "react";
import { LOCALES } from "@/lib/i18n";
import { useT } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <div className="fixed bottom-16 right-4 z-[70]">
      {open && (
        <div className="mb-2 flex flex-col items-end gap-1">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition " +
                (l.code === locale
                  ? "bg-accent text-ink border-accent"
                  : "bg-ink/80 text-parchment/80 border-parchment/20 hover:border-accent/50")
              }
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-parchment/10 border border-parchment/20 hover:bg-parchment/20 flex items-center justify-center text-lg shadow-lg"
        aria-label="Change language"
      >
        {current.flag}
      </button>
    </div>
  );
}
