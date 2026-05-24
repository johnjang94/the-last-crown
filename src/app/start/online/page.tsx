"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GENRES, type GenreName } from "@/lib/genres";
import type { Difficulty } from "@/types/game";
import { api } from "@/lib/client";
import { useT } from "@/contexts/LanguageContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { getDifficultyDisplay, getGenreDisplay } from "@/lib/i18n";
import { getEntryCopy } from "@/lib/entryCopy";

export default function OnlineStartPage() {
  const router = useRouter();
  const { locale, t } = useT();
  const { settings } = useUserSettings();
  const copy = getEntryCopy(locale);
  const [genre, setGenre] = useState<GenreName | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/start" className="text-parchment/60 hover:text-parchment text-sm">
          {t.back}
        </Link>

        <div className="mt-10 max-w-3xl">
          <div className="text-accent text-xs uppercase tracking-[0.35em]">{copy.onlineTitle}</div>
          <h1 className="mt-4 text-4xl font-display text-parchment">{copy.onlineTitle}</h1>
          <p className="mt-4 text-lg text-parchment/70">{copy.onlineDesc}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="text-accent text-xs uppercase tracking-widest">{t.myProfile}</div>
            <div className="mt-3 rounded-2xl border border-parchment/15 bg-parchment/10 px-4 py-3 text-parchment">
              {settings.displayName}
            </div>
            <p className="mt-3 text-sm text-parchment/60">
              {t.displayNameHint}
            </p>
          </div>
          <div className="card">
            <div className="text-accent text-xs uppercase tracking-widest">{t.difficulty}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["easy", "medium", "hard"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value)}
                  className={
                    "px-4 py-2 rounded-full text-sm border transition " +
                    (difficulty === value
                      ? "bg-accent text-ink border-accent"
                      : "bg-parchment/5 text-parchment/80 border-parchment/15 hover:border-accent/45")
                  }
                >
                  {getDifficultyDisplay(value, t).label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {GENRES.map((item) => {
            const display = getGenreDisplay(item.name, t);
            return (
              <button
                key={item.name}
                onClick={() => setGenre(item.name)}
                className={
                  "text-left rounded-[24px] border p-5 transition " +
                  (genre === item.name
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-parchment/10 bg-parchment/5 hover:border-accent/35")
                }
              >
                <div className="text-3xl">{item.emoji}</div>
                <div className="mt-4 text-2xl font-display text-parchment">{display.name}</div>
                <p className="mt-2 text-parchment/68">{display.description}</p>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-5 text-sm text-crimson">{error}</p>}

        <button
          disabled={!genre || loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);
              const { room } = await api<{ room: { code: string } }>("/api/matchmake", {
                name: settings.displayName,
                genre,
                difficulty,
              });
              router.push(`/play/${room.code}`);
            } catch (e: any) {
              setError(String(e?.message || e));
              setLoading(false);
            }
          }}
          className="mt-8 btn-primary disabled:opacity-40"
        >
          {copy.onlineButton}
        </button>
      </div>
    </main>
  );
}
