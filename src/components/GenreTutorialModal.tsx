"use client";

import type { GenreName } from "@/lib/genres";
import { useT } from "@/contexts/LanguageContext";
import { GenreTutorialBody } from "@/components/GenreTutorialCard";

export default function GenreTutorialModal({
  genre,
  title,
  description,
  ctaLabel,
  onContinue,
}: {
  genre: GenreName;
  title: string;
  description: string;
  ctaLabel: string;
  onContinue: () => void;
}) {
  const { t } = useT();

  return (
    <div className="fixed inset-0 z-[80] bg-ink/88 backdrop-blur px-4 py-8 overflow-auto">
      <div className="mx-auto max-w-3xl">
        <div className="card">
          <div className="text-center">
            <div className="text-accent text-[11px] uppercase tracking-[0.35em]">{title}</div>
            <p className="mt-3 text-parchment/70 max-w-2xl mx-auto">{description}</p>
          </div>

          <div className="mt-6">
            <GenreTutorialBody genre={genre} t={t} />
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={onContinue} className="btn-primary !py-3 !px-6">
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
