"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GENRES } from "@/lib/genres";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

function NextButton({ onClick, label = "Next" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 text-base"
    >
      {label}
    </button>
  );
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.section {...fade} className="relative min-h-screen w-full px-6 py-12 flex flex-col items-center">
      <Link
        href="/"
        className="absolute top-6 left-6 text-parchment/60 hover:text-parchment text-sm"
      >
        ← Home
      </Link>
      {children}
    </motion.section>
  );
}

// Mock 2D illustrations using inline SVG so the demo runs without image API.
function MockArt({ kind }: { kind: "solo-or-team" | "two-groups" | "case" }) {
  if (kind === "solo-or-team") {
    return (
      <svg viewBox="0 0 320 180" className="w-full max-w-md drop-shadow-glow">
        <rect width="320" height="180" rx="14" fill="#181828" stroke="#c8a24c" strokeOpacity=".35" />
        <circle cx="80" cy="100" r="22" fill="#c8a24c" />
        <rect x="58" y="120" width="44" height="40" rx="8" fill="#c8a24c" />
        <g opacity=".85">
          <circle cx="170" cy="100" r="18" fill="#f5efe1" />
          <rect x="152" y="118" width="36" height="34" rx="6" fill="#f5efe1" />
          <circle cx="210" cy="100" r="18" fill="#f5efe1" />
          <rect x="192" y="118" width="36" height="34" rx="6" fill="#f5efe1" />
          <circle cx="250" cy="100" r="18" fill="#f5efe1" />
          <rect x="232" y="118" width="36" height="34" rx="6" fill="#f5efe1" />
        </g>
      </svg>
    );
  }
  if (kind === "two-groups") {
    return (
      <svg viewBox="0 0 320 180" className="w-full max-w-md drop-shadow-glow">
        <rect width="320" height="180" rx="14" fill="#181828" stroke="#c8a24c" strokeOpacity=".35" />
        <line x1="160" y1="20" x2="160" y2="160" stroke="#c8a24c" strokeDasharray="4 4" />
        {[40, 80, 120].map((x, i) => (
          <g key={"L" + i}>
            <circle cx={x} cy="90" r="14" fill="#8a1c2b" />
            <rect x={x - 14} y="106" width="28" height="28" rx="6" fill="#8a1c2b" />
          </g>
        ))}
        {[200, 240, 280].map((x, i) => (
          <g key={"R" + i}>
            <circle cx={x} cy="90" r="14" fill="#c8a24c" />
            <rect x={x - 14} y="106" width="28" height="28" rx="6" fill="#c8a24c" />
          </g>
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 180" className="w-full max-w-md drop-shadow-glow">
      <rect width="320" height="180" rx="14" fill="#181828" stroke="#c8a24c" strokeOpacity=".35" />
      <rect x="40" y="40" width="60" height="80" rx="6" fill="#f5efe1" opacity=".85" />
      <rect x="110" y="40" width="60" height="80" rx="6" fill="#f5efe1" opacity=".85" />
      <rect x="180" y="40" width="60" height="80" rx="6" fill="#f5efe1" opacity=".85" />
      <rect x="250" y="40" width="60" height="80" rx="6" fill="#f5efe1" opacity=".85" />
      <text x="160" y="155" fontSize="12" textAnchor="middle" fill="#c8a24c">CASE FILE</text>
    </svg>
  );
}

export default function HowToPlayPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <ScreenShell key="s1">
            <h2 className="text-3xl text-accent font-display mt-6">How to Play — 1 / 5</h2>
            <p className="mt-6 text-center max-w-2xl text-parchment/90 text-lg">
              This game can be played solo, or together as teams of many.
            </p>
            <div className="mt-8"><MockArt kind="solo-or-team" /></div>
            <NextButton onClick={() => setStep(2)} />
          </ScreenShell>
        )}

        {step === 2 && (
          <ScreenShell key="s2">
            <h2 className="text-3xl text-accent font-display mt-6">How to Play — 2 / 5</h2>
            <p className="mt-6 text-center max-w-2xl text-parchment/90 text-lg">
              We will start the game with everyone currently connected. Since this is a team match,
              we will divide all of you into two groups.
            </p>
            <div className="mt-8"><MockArt kind="two-groups" /></div>
            <NextButton onClick={() => setStep(3)} />
          </ScreenShell>
        )}

        {step === 3 && (
          <ScreenShell key="s3">
            <h2 className="text-3xl text-accent font-display mt-6">How to Play — 3 / 5</h2>
            <p className="mt-3 text-center max-w-2xl text-parchment/80">
              The teams are formed. There are 8 genres to choose from.
            </p>

            <button
              className="absolute top-6 right-6 btn-pill"
              onClick={() => alert("Edit participants (preview)")}
            >
              Edit Participants
            </button>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
              {GENRES.map((g) => (
                <div key={g.name} className="card flex flex-col items-center">
                  <div className="text-3xl">{g.emoji}</div>
                  <div className="mt-2 text-parchment/90 text-sm">{g.name}</div>
                </div>
              ))}
            </div>

            <NextButton onClick={() => setStep(4)} label="Continue" />
          </ScreenShell>
        )}

        {step === 4 && (
          <ScreenShell key="s4">
            <h2 className="text-3xl text-accent font-display mt-6">How to Play — 4 / 5</h2>
            <p className="mt-4 text-center max-w-2xl text-parchment/90">
              The main game begins. Listen to a short briefing of the case (voice supported), then
              study the four photos beneath. Be ready to answer the question.
            </p>

            <div className="mt-6 card max-w-2xl w-full">
              <div className="text-accent text-xs uppercase tracking-widest">Case Briefing</div>
              <div className="mt-2 text-parchment/90 italic">
                &ldquo;The lighthouse keeper was found at dawn, the lantern still burning…&rdquo;
              </div>
              <div className="mt-3 text-parchment/70 text-sm">
                Question: <span className="text-parchment">What truly happened that night?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
              {["Compass", "Letter", "Lantern", "Knot"].map((kw) => (
                <div key={kw} className="card flex flex-col items-center">
                  <div className="w-full h-24 rounded-lg bg-gradient-to-br from-parchment/15 to-parchment/5 border border-parchment/15" />
                  <div className="mt-2 text-accent text-sm">{kw}</div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-parchment/50 text-xs max-w-xl text-center">
              Note: photos may or may not be tied to the case — but the keywords always are.
            </p>

            <NextButton onClick={() => setStep(5)} label="Continue" />
          </ScreenShell>
        )}

        {step === 5 && (
          <ScreenShell key="s5">
            <h2 className="text-3xl text-accent font-display mt-6">How to Play — 5 / 5</h2>
            <p className="mt-3 text-parchment/70 text-sm">The rules of the game.</p>

            <ul className="mt-6 max-w-3xl w-full space-y-3 text-parchment/90 text-sm leading-relaxed">
              <li>• You see <b>4 photos</b>, but you must use <b>6 keywords</b> to answer.</li>
              <li>• You have <b>5 minutes</b> from the moment the photos appear to think — solo or as a team — and craft a story using the keywords beneath each photo.</li>
              <li>• After the 5 minutes you have two options:
                <ul className="ml-5 mt-1 space-y-1 text-parchment/70">
                  <li>· <b>Ask a question</b> — get a hint, but lose 1 point each time.</li>
                  <li>· <b>Attempt an answer</b> — phrase it as a question.</li>
                </ul>
              </li>
              <li>• After the first 5 minutes, every <b>3 minutes</b> a bonus keyword is revealed. Solving with bonus keywords earns extra points.</li>
              <li>• Team mode: whichever team answers first with the most points wins.</li>
              <li>• Solo mode: PvP — most points wins.</li>
              <li className="pt-2 text-parchment/80">Answer rules:</li>
              <li className="ml-3">— Wrong answer using a keyword → &ldquo;That is not true.&rdquo;</li>
              <li className="ml-3">— Answer without using a keyword → &ldquo;That is still unknown.&rdquo;</li>
              <li className="ml-3">— Answers must be phrased as a <b>question</b>.</li>
              <li className="ml-3">— Use all required keywords in the correct question → &ldquo;Correct!&rdquo; — you win.</li>
            </ul>

            <button
              onClick={() => router.push("/")}
              className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 text-base"
            >
              I understand
            </button>
          </ScreenShell>
        )}
      </AnimatePresence>
    </div>
  );
}
