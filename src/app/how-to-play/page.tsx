"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GENRES, type GenreName } from "@/lib/genres";
import { useT } from "@/contexts/LanguageContext";
import { getGenreDisplay } from "@/lib/i18n";
import { GenreTutorialBody } from "@/components/GenreTutorialCard";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45 },
};

function isGenreName(value: string | null): value is GenreName {
  return GENRES.some((genre) => genre.name === value);
}

export default function HowToPlayPage() {
  const { t } = useT();

  return (
    <Suspense fallback={<HowToPlayFallback title={t.tutorialLibraryTitle} description={t.tutorialLibraryDesc} />}>
      <HowToPlayContent />
    </Suspense>
  );
}

function HowToPlayContent() {
  const searchParams = useSearchParams();
  const { t } = useT();
  const genreParam = searchParams.get("genre");
  const selectedGenre = isGenreName(genreParam) ? genreParam : null;

  return <HowToPlayLayout selectedGenre={selectedGenre} title={t.tutorialLibraryTitle} description={t.tutorialLibraryDesc} homeLabel={t.home} t={t} />;
}

function HowToPlayFallback({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <HowToPlayLayout
      selectedGenre={null}
      title={title}
      description={description}
      homeLabel="← Home"
    />
  );
}

function HowToPlayLayout({
  selectedGenre,
  title,
  description,
  homeLabel,
  t,
}: {
  selectedGenre: GenreName | null;
  title: string;
  description: string;
  homeLabel: string;
  t?: ReturnType<typeof useT>["t"];
}) {
  const tutorialText = t?.howToPlay ?? title;

  return (
    <motion.main {...fade} className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <Link href="/" className="text-parchment/60 hover:text-parchment text-sm">
        {homeLabel}
      </Link>

      <div className="mt-8">
        <div className="text-accent text-xs uppercase tracking-[0.35em]">{title}</div>
        <h1 className="mt-3 text-4xl font-display text-parchment">{title}</h1>
        <p className="mt-3 max-w-2xl text-parchment/70">{description}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="card h-fit">
          <div className="space-y-2">
            {GENRES.map((genre) => {
              const display = getGenreDisplay(
                genre.name,
                t ?? {
                  genreRiddles: "Riddles",
                  genreRiddlesDesc: "",
                  genreGuess: "Final Pick",
                  genreGuessDesc: "",
                  genreVisualMatch: "Visual Match",
                  genreVisualMatchDesc: "",
                  genreNumberToLetter: "Codebreaker",
                  genreNumberToLetterDesc: "",
                } as any
              );
              const active = selectedGenre === genre.name;
              return (
                <Link
                  key={genre.name}
                  href={`/how-to-play?genre=${encodeURIComponent(genre.name)}`}
                  className={
                    "block rounded-2xl border px-4 py-3 transition " +
                    (active
                      ? "border-accent bg-accent/10 shadow-glow"
                      : "border-parchment/10 bg-parchment/5 hover:border-accent/35")
                  }
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{genre.emoji}</span>
                    <div>
                      <div className="text-parchment font-medium">{display.name}</div>
                      <div className="mt-1 text-sm text-parchment/60">{display.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        <section className="card">
          {selectedGenre && t ? (
            <GenreTutorialBody genre={selectedGenre} t={t} />
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-center">
              <div>
                <div className="text-accent text-xs uppercase tracking-widest">{tutorialText}</div>
                <p className="mt-3 max-w-md text-parchment/70">{description}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </motion.main>
  );
}
