"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/contexts/LanguageContext";

export default function SettingsMenu({ tutorialHref = "/how-to-play" }: { tutorialHref?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useT();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 btn-ghost"
        aria-label={t.settingsMenu}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.7 1.7 0 0 0-1.82-.33 1.7 1.7 0 0 0-1 1.54V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.54 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.54-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.7 1.7 0 0 0 8.95 4.6h.09A1.7 1.7 0 0 0 10 3.06V3a2 2 0 0 1 4 0v.09A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.09A1.7 1.7 0 0 0 20.94 10H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
        </svg>
        {t.settingsMenu}
      </button>

      {open && (
        <div className="fixed inset-0 z-[75] bg-ink/82 backdrop-blur flex items-center justify-center px-4">
          <div className="card max-w-sm w-full text-center">
            <div className="text-accent text-xs uppercase tracking-widest">{t.settingsMenu}</div>
            <div className="mt-5 grid gap-3">
              <Link href={tutorialHref} onClick={() => setOpen(false)} className="btn-pill !py-3 !px-4">
                {t.openHowToPlay}
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="btn-pill !py-3 !px-4">
                {t.openSettings}
              </Link>
            </div>
            <button onClick={() => setOpen(false)} className="mt-5 text-parchment/60 hover:text-parchment text-sm">
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
