"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";
import { getEntryCopy } from "@/lib/entryCopy";

export default function StartHubPage() {
  const { locale, t } = useT();
  const copy = getEntryCopy(locale);

  const cards = [
    {
      href: "/start/solo",
      icon: "✦",
      title: copy.soloTitle,
      desc: copy.soloDesc,
      bg: "radial-gradient(circle at top left, rgba(255,210,120,0.22), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
    },
    {
      href: "/start/online",
      icon: "◎",
      title: copy.onlineTitle,
      desc: copy.onlineDesc,
      bg: "radial-gradient(circle at top right, rgba(120,210,255,0.22), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
    },
    {
      href: "/start/group",
      icon: "◌",
      title: copy.groupTitle,
      desc: copy.groupDesc,
      bg: "radial-gradient(circle at bottom left, rgba(170,255,190,0.2), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen px-6 py-10"
    >
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-parchment/60 hover:text-parchment text-sm">
          {t.home}
        </Link>

        <div className="mt-12 max-w-3xl">
          <div className="text-accent text-xs uppercase tracking-[0.35em]">The Last Crown</div>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-parchment">{copy.modeTitle}</h1>
          <p className="mt-4 text-lg text-parchment/70">{copy.modeDesc}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-[28px] border border-parchment/10 bg-parchment/5 p-6 hover:border-accent/45 transition"
            >
              <div className="rounded-[22px] border border-parchment/10 p-6 min-h-[240px]" style={{ background: card.bg }}>
                <div className="text-5xl text-accent">{card.icon}</div>
                <div className="mt-8 text-2xl font-display text-parchment">{card.title}</div>
                <p className="mt-3 text-parchment/68 leading-relaxed">{card.desc}</p>
                <div className="mt-8 text-accent text-sm">{copy.continueLabel}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
