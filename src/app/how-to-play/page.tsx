"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GENRES } from "@/lib/genres";
import { DIFFICULTIES } from "@/lib/difficulties";
import { useT } from "@/contexts/LanguageContext";
import { getGenreDisplay, getDifficultyDisplay } from "@/lib/i18n";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45 },
};

function ScreenShell({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  return (
    <motion.section {...fade} className="relative min-h-screen w-full px-6 py-12 flex flex-col items-center">
      <Link href="/" className="absolute top-6 left-6 text-parchment/60 hover:text-parchment text-sm">
        {t.home}
      </Link>
      {children}
    </motion.section>
  );
}

export default function HowToPlayPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { t } = useT();

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <ScreenShell key="step-1">
            <h2 className="text-3xl text-accent font-display mt-6">{t.howToPlayStep(1, 4)}</h2>
            <p className="mt-6 text-center max-w-2xl text-parchment/90 text-lg">{t.howToPlayDesc1}</p>
            <div className="mt-10 grid md:grid-cols-2 gap-5 max-w-3xl w-full">
              <div className="card text-center">
                <div className="text-accent text-xs uppercase tracking-widest">{t.soloCardTitle}</div>
                <p className="mt-3 text-parchment/85">{t.soloCardDesc}</p>
              </div>
              <div className="card text-center">
                <div className="text-accent text-xs uppercase tracking-widest">{t.groupCardTitle}</div>
                <p className="mt-3 text-parchment/85">{t.groupCardDesc}</p>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 text-base">
              {t.next}
            </button>
          </ScreenShell>
        )}

        {step === 2 && (
          <ScreenShell key="step-2">
            <h2 className="text-3xl text-accent font-display mt-6">{t.howToPlayStep(2, 4)}</h2>
            <p className="mt-6 text-center max-w-2xl text-parchment/90 text-lg">{t.howToPlayDesc2}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
              {GENRES.map((genre) => {
                const display = getGenreDisplay(genre.name, t);
                return (
                  <div key={genre.name} className="card">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{genre.emoji}</div>
                      <div>
                        <div className="text-parchment font-medium">{display.name}</div>
                        <div className="text-parchment/60 text-sm">{display.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setStep(3)} className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 text-base">
              {t.next}
            </button>
          </ScreenShell>
        )}

        {step === 3 && (
          <ScreenShell key="step-3">
            <h2 className="text-3xl text-accent font-display mt-6">{t.howToPlayStep(3, 4)}</h2>
            <p className="mt-6 text-center max-w-2xl text-parchment/90 text-lg">{t.howToPlayDesc3}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
              {DIFFICULTIES.map((difficulty) => {
                const display = getDifficultyDisplay(difficulty.value, t);
                return (
                  <div key={difficulty.value} className="card">
                    <div className="text-accent text-xs uppercase tracking-widest">{display.label}</div>
                    <p className="mt-3 text-parchment/85">{display.tagline}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-parchment/60 text-center max-w-xl">{t.morePts}</p>
            <button onClick={() => setStep(4)} className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 text-base">
              {t.next}
            </button>
          </ScreenShell>
        )}

        {step === 4 && (
          <ScreenShell key="step-4">
            <h2 className="text-3xl text-accent font-display mt-6">{t.howToPlayStep(4, 4)}</h2>
            <p className="mt-6 text-center max-w-2xl text-parchment/90 text-lg">{t.howToPlayDesc4}</p>
            <div className="mt-10 card max-w-2xl w-full text-center">
              <div className="text-accent text-xs uppercase tracking-widest">{t.readyTitle}</div>
              <p className="mt-3 text-parchment/85">{t.readyDesc}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 text-base"
            >
              {t.iUnderstand}
            </button>
          </ScreenShell>
        )}
      </AnimatePresence>
    </div>
  );
}
