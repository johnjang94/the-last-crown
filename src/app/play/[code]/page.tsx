"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api, apiGet, getPlayerId, speakOpenAI, subscribeRoom } from "@/lib/client";
import { derivePhase } from "@/lib/phase";
import type { RoomState } from "@/types/game";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

type Hint = { askerName: string; question: string; hint: string };
type AnswerResult = {
  askerName: string;
  answer: string;
  verdict: "correct" | "not_true" | "unknown";
  message: string;
};

export default function PlayPage() {
  const params = useParams<{ code: string }>();
  const code = (params.code || "").toUpperCase();
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hints, setHints] = useState<Hint[]>([]);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [questionDraft, setQuestionDraft] = useState("");
  const [answerDraft, setAnswerDraft] = useState("");
  const announcedRef = useRef<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Pre-fetch the current room state so the player can see who's there.
  useEffect(() => {
    apiGet<{ room: RoomState }>(`/api/room/${code}`)
      .then((r) => setRoom(r.room))
      .catch(() => {});
  }, [code]);

  // Subscribe (after join) for state + hints + answer results.
  useEffect(() => {
    if (!joined || !room) return;
    const playerId = getPlayerId();
    const me = room.players.find((p) => p.id === playerId);
    const team = me?.team ?? null;
    const subs = subscribeRoom(code, team, playerId, {
      onState: setRoom,
      onHint: (h) => setHints((arr) => [h, ...arr].slice(0, 20)),
      onAnswerResult: (r) => setResults((arr) => [r, ...arr].slice(0, 20)),
    });
    return () => subs.unsubscribe();
  }, [joined, code, room?.players.length, room?.mode]);

  // Voice announcements
  useEffect(() => {
    if (!room || !joined) return;
    const d = derivePhase(room, now);
    const key = d.phase + ":" + d.revealedBonus;
    if (announcedRef.current.has(key)) return;
    announcedRef.current.add(key);
    if (room.storedPhase === "playing" && d.phase === "thinking")
      speakOpenAI("Five minute countdown begins now.");
    if (d.phase === "active") speakOpenAI("You may now ask questions and attempt answers.");
    if (d.phase === "bonus1") speakOpenAI("A bonus keyword is now revealed.");
    if (d.phase === "bonus2") speakOpenAI("The final bonus keyword is now revealed.");
  }, [room, joined, now]);

  if (!joined) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <Link href="/" className="absolute top-6 left-6 text-parchment/60 text-sm">← Home</Link>
        <h2 className="text-3xl text-accent font-display">Join Room</h2>
        <div className="mt-2 text-accent text-2xl tracking-[0.4em]">{code}</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-8 bg-parchment/10 rounded px-4 py-3 text-parchment outline-none border border-parchment/15 w-64"
        />
        {error && <div className="mt-3 text-crimson text-sm">{error}</div>}
        <button
          onClick={async () => {
            try {
              const { room: r } = await api<{ room: RoomState }>("/api/room/join", { code, name });
              setRoom(r);
              setJoined(true);
            } catch (e: any) {
              setError(String(e?.message || e));
            }
          }}
          disabled={!name.trim()}
          className="mt-6 btn-primary disabled:opacity-40"
        >
          Join
        </button>
      </main>
    );
  }

  if (!room) return <main className="min-h-screen flex items-center justify-center text-parchment/60">Connecting…</main>;

  const playerId = getPlayerId();
  const me = room.players.find((p) => p.id === playerId);
  const myTeam = me?.team;
  const d = derivePhase(room, now);
  const buttonsActive = room.storedPhase === "playing" && d.phase !== "thinking";

  return (
    <div className="min-h-screen w-full px-5 py-6">
      <AnimatePresence mode="wait">
        {room.storedPhase === "lobby" && (
          <motion.section key="lobby" {...fade} className="mt-12 text-center">
            <div className="text-parchment/60 text-xs uppercase tracking-widest">Waiting for host</div>
            <div className="mt-2 text-2xl text-accent">{room.players.length} players in room</div>
            <ul className="mt-6 space-y-1 text-parchment/80">
              {room.players.map((p) => <li key={p.id}>{p.name}</li>)}
            </ul>
          </motion.section>
        )}

        {room.storedPhase === "teams" && (
          <motion.section key="teams" {...fade} className="mt-12 text-center">
            <div className="text-parchment/60 text-xs uppercase tracking-widest">
              {room.mode === "solo" ? "Solo mode" : "Your team"}
            </div>
            <div className="mt-2 text-4xl text-accent font-display">
              {room.mode === "solo" ? me?.name || "Player" : `Team ${myTeam == null ? "?" : myTeam + 1}`}
            </div>
            <p className="mt-4 text-parchment/70">Wait for host to choose a genre.</p>
          </motion.section>
        )}

        {room.storedPhase === "genre" && (
          <motion.section key="genre" {...fade} className="mt-12 text-center">
            <div className="text-parchment/70">The host is preparing the case…</div>
          </motion.section>
        )}

        {(room.storedPhase === "playing" || room.storedPhase === "ended") && (
          <motion.section key="game" {...fade} className="mt-2">
            <div className="text-center">
              <div className="text-parchment/50 text-xs uppercase tracking-widest">
                {room.mode === "solo" ? me?.name || "Player" : `Team ${myTeam == null ? "?" : myTeam + 1}`}
              </div>
              <div className="text-parchment/70 mt-1 text-sm">
                {d.phase} · {room.mode === "solo" ? me?.score : (myTeam != null ? room.scores[myTeam] : "")} pts
              </div>
            </div>

            {room.scenario && (
              <div className="card mt-4">
                <div className="text-accent text-[10px] uppercase tracking-widest">Briefing</div>
                <p className="mt-1 text-parchment/90 text-sm italic">{room.scenario.briefing}</p>
                <p className="mt-2 text-parchment/80 text-sm">{room.scenario.question}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.scenario.photos.map((p) => (
                    <span key={p.keyword} className="px-2 py-1 rounded bg-accent/15 border border-accent/40 text-accent text-xs">
                      {p.keyword}
                    </span>
                  ))}
                  {room.scenario.bonusKeywords.slice(0, d.revealedBonus).map((k) => (
                    <span key={k} className="px-2 py-1 rounded bg-crimson/20 border border-crimson text-parchment text-xs">
                      {k} ★
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 card">
              <div className="text-accent text-[10px] uppercase tracking-widest">Ask a question</div>
              <textarea
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                disabled={!buttonsActive}
                rows={2}
                className="mt-2 w-full bg-parchment/10 rounded px-3 py-2 text-parchment text-sm outline-none border border-parchment/15 disabled:opacity-50"
                placeholder="What would you like to know?"
              />
              <button
                disabled={!buttonsActive || !questionDraft.trim()}
                onClick={async () => {
                  try {
                    await api("/api/game/question", { code, question: questionDraft });
                    setQuestionDraft("");
                  } catch (e: any) {
                    setError(String(e?.message || e));
                  }
                }}
                className="mt-2 btn-pill disabled:opacity-40"
              >
                Ask question (-1 pt)
              </button>
            </div>

            <div className="mt-4 card">
              <div className="text-accent text-[10px] uppercase tracking-widest">Attempt an answer</div>
              <textarea
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                disabled={!buttonsActive}
                rows={3}
                className="mt-2 w-full bg-parchment/10 rounded px-3 py-2 text-parchment text-sm outline-none border border-parchment/15 disabled:opacity-50"
                placeholder="Phrase your answer as a question, using the keywords."
              />
              <button
                disabled={!buttonsActive || !answerDraft.trim()}
                onClick={async () => {
                  try {
                    await api("/api/game/answer", { code, answer: answerDraft });
                    setAnswerDraft("");
                  } catch (e: any) {
                    setError(String(e?.message || e));
                  }
                }}
                className="mt-2 btn-primary !py-2 !px-4 disabled:opacity-40"
              >
                Attempt answer
              </button>
            </div>

            <div className="mt-4 card max-h-64 overflow-auto">
              <div className="text-accent text-[10px] uppercase tracking-widest">
                {room.mode === "solo" ? "Your feed" : "Team feed"}
              </div>
              <ul className="mt-2 text-sm space-y-2">
                {results.map((r, i) => (
                  <li
                    key={"r" + i}
                    className={
                      r.verdict === "correct"
                        ? "text-emerald-400"
                        : r.verdict === "not_true"
                        ? "text-crimson"
                        : "text-parchment/70"
                    }
                  >
                    <b>{r.askerName}:</b> {r.answer} → {r.message}
                  </li>
                ))}
                {hints.map((h, i) => (
                  <li key={"h" + i} className="text-parchment/80">
                    <b>{h.askerName}:</b> {h.question} → <i>{h.hint}</i>
                  </li>
                ))}
              </ul>
            </div>
            {error && <div className="mt-3 text-crimson text-sm">{error}</div>}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
