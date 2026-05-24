"use client";

import { getGenreDisplay, type T } from "@/lib/i18n";
import type { GenreName } from "@/lib/genres";

type TutorialCopy = {
  goal: string;
  howItWorks: string;
  tip: string;
  scoring: string;
};

function getTutorialCopy(genre: GenreName): TutorialCopy {
  switch (genre) {
    case "Riddles":
      return {
        goal: "Hear the clue, spot the twist, and land on the hidden answer before the room does.",
        howItWorks:
          "The round gives you a short setup and clue words. Use them to pressure-test the obvious answer until only one explanation still holds up.",
        tip: "Riddle rounds usually turn on wordplay or a change in perspective, so challenge the first answer that feels too easy.",
        scoring: "Questions cost a point. A correct answer ends the round and crowns whoever solved it first.",
      };
    case "Final Pick":
      return {
        goal: "Choose the answer that best fits every clue currently on the table.",
        howItWorks:
          "Start with the passage, compare it against the options, and keep narrowing the field as bonus keywords appear. The right pick should still make sense after every reveal.",
        tip: "Eliminate aggressively. In this format, winning usually comes from spotting which option breaks under the new clue.",
        scoring: "You can ask for help at a cost, but the biggest swing comes from being the first to lock in the correct choice.",
      };
    case "Visual Match":
      return {
        goal: "Match the scene to the correct maze layout before anyone else calls it.",
        howItWorks:
          "Study the 3D view, then compare turns, dead ends, and landmarks against the labeled 2D board. You are looking for the one map that preserves the same structure from a different angle.",
        tip: "Do not chase every tiny detail. Anchor on a few unmistakable shapes first, then verify the path around them.",
        scoring: "Fast, accurate reads matter most. Spending points on hints can still be worth it if the board is close.",
      };
    case "Codebreaker":
      return {
        goal: "Decode the clue system and turn it into the answer that truly fits the prompt.",
        howItWorks:
          "The round hides meaning behind a number-and-letter pattern. Figure out the conversion rule, apply it cleanly, then check which answer survives both the code and the story clue.",
        tip: "Test the pattern on a small piece first. If the rule works once but breaks on the next clue, it is probably the wrong conversion.",
        scoring: "This mode rewards precision. A clean solve is worth more than firing off shaky guesses.",
      };
  }
}

export function GenreTutorialBody({ genre, t }: { genre: GenreName; t: T }) {
  const display = getGenreDisplay(genre, t);
  const tutorial = getTutorialCopy(genre);

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="text-3xl">
          {genre === "Riddles"
            ? "🧩"
            : genre === "Final Pick"
            ? "🎯"
            : genre === "Visual Match"
            ? "🌀"
            : "🔐"}
        </div>
        <div>
          <div className="text-accent text-xs uppercase tracking-widest">{t.tutorialLibraryTitle}</div>
          <div className="text-2xl font-display text-parchment">{display.name}</div>
        </div>
      </div>

      <p className="mt-4 text-parchment/70">{display.description}</p>

      <div className="mt-6 grid gap-3">
        <section className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
          <div className="text-accent text-[10px] uppercase tracking-widest">{t.tutorialGoalLabel}</div>
          <p className="mt-2 text-parchment/90">{tutorial.goal}</p>
        </section>
        <section className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
          <div className="text-accent text-[10px] uppercase tracking-widest">{t.tutorialHowItWorksLabel}</div>
          <p className="mt-2 text-parchment/90">{tutorial.howItWorks}</p>
        </section>
        <section className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
          <div className="text-accent text-[10px] uppercase tracking-widest">{t.tutorialTipLabel}</div>
          <p className="mt-2 text-parchment/90">{tutorial.tip}</p>
        </section>
        <section className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
          <div className="text-accent text-[10px] uppercase tracking-widest">{t.tutorialScoringLabel}</div>
          <p className="mt-2 text-parchment/90">{tutorial.scoring}</p>
        </section>
      </div>
    </div>
  );
}
