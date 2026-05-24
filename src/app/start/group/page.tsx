"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/contexts/LanguageContext";
import { getEntryCopy } from "@/lib/entryCopy";

export default function GroupStartPage() {
  const router = useRouter();
  const { locale, t } = useT();
  const copy = getEntryCopy(locale);
  const [code, setCode] = useState("");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/start" className="text-parchment/60 hover:text-parchment text-sm">
          {t.back}
        </Link>

        <div className="mt-10 max-w-3xl">
          <div className="text-accent text-xs uppercase tracking-[0.35em]">{copy.groupTitle}</div>
          <h1 className="mt-4 text-4xl font-display text-parchment">{copy.groupTitle}</h1>
          <p className="mt-4 text-lg text-parchment/70">{copy.groupDesc}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-parchment/10 bg-parchment/5 p-6">
            <div className="rounded-[22px] border border-parchment/10 p-6 min-h-[260px]">
              <div className="text-5xl text-accent">◌</div>
              <div className="mt-8 text-2xl font-display text-parchment">{copy.groupHostTitle}</div>
              <p className="mt-3 text-parchment/68">{copy.groupHostDesc}</p>
              <Link href="/host" className="mt-8 inline-flex btn-primary">
                {copy.continueLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-parchment/10 bg-parchment/5 p-6">
            <div className="rounded-[22px] border border-parchment/10 p-6 min-h-[260px]">
              <div className="text-5xl text-accent">◎</div>
              <div className="mt-8 text-2xl font-display text-parchment">{copy.groupJoinTitle}</div>
              <p className="mt-3 text-parchment/68">{copy.groupJoinDesc}</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-5 w-full bg-parchment/10 rounded px-4 py-3 text-parchment outline-none border border-parchment/15"
                placeholder={copy.roomCode}
              />
              <button
                disabled={!code.trim()}
                onClick={() => router.push(`/play/${code.trim()}`)}
                className="mt-5 btn-primary disabled:opacity-40"
              >
                {copy.joinRoom}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
