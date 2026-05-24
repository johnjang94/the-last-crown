"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getResumableSession } from "@/lib/activeSession";
import { useT } from "@/contexts/LanguageContext";

export default function HomePage() {
  const { t } = useT();
  const [resumePath, setResumePath] = useState<string | null>(null);

  useEffect(() => {
    getResumableSession().then((session) => setResumePath(session?.path || null));
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6"
    >
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none">
        <div className="text-accent/70 tracking-[0.4em] text-xs uppercase">The Last Crown</div>
      </div>

      <h1 className="text-4xl md:text-6xl text-center font-display text-parchment leading-tight max-w-3xl">
        The <span className="text-accent">Last Crown</span>
      </h1>

      <p className="mt-6 text-parchment/60 text-center max-w-xl">{t.tagline}</p>

      <Link href="/start" className="btn-primary mt-12 text-lg">
        {t.getStarted}
      </Link>

      {resumePath && (
        <Link href={resumePath} className="mt-4 btn-pill !py-3 !px-6 text-sm">
          Resume Game
        </Link>
      )}
    </motion.main>
  );
}
