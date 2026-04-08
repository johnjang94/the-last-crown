"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6"
    >
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none">
        <div className="text-accent/70 tracking-[0.4em] text-xs uppercase">Mystery Champion</div>
      </div>

      <h1 className="text-4xl md:text-6xl text-center font-display text-parchment leading-tight max-w-3xl">
        Are you the <span className="text-accent">Mystery Champion</span>?
      </h1>

      <p className="mt-6 text-parchment/60 text-center max-w-xl">
        A cooperative deduction game for one solo sleuth or many. Read the case, study the clues,
        and ask the right questions before time runs out.
      </p>

      <Link href="/host" className="btn-primary mt-12 text-lg">
        Start Game
      </Link>

      <Link
        href="/how-to-play"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 btn-ghost"
      >
        How to Play
      </Link>

      {/* Settings page (/settings) is intentionally not linked from the home UI.
          API keys are read from environment variables. The page still exists
          as an escape hatch for runtime key rotation if you ever need it. */}
    </motion.main>
  );
}
