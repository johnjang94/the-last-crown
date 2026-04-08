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

      <Link
        href="/settings"
        aria-label="Game Settings"
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full border border-parchment/30 flex items-center justify-center hover:bg-parchment/10 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      </Link>
    </motion.main>
  );
}
