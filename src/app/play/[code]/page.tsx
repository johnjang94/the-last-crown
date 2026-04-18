"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api, apiGet, getPlayerId, speakOpenAI, subscribeRoom } from "@/lib/client";
import { derivePhase, fmt, type TimerDisplay } from "@/lib/phase";
import type { RoomState } from "@/types/game";
import { GENRES } from "@/lib/genres";
import { DIFFICULTIES } from "@/lib/difficulties";
import { useT } from "@/contexts/LanguageContext";
import { getGenreDisplay, getDifficultyDisplay } from "@/lib/i18n";

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
  const [exitOpen, setExitOpen] = useState(false);
  const { t } = useT();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pre-fetch the current room state so the player can see who's there.
  // Also auto-rejoin if this player's ID is already in the room (e.g. after
  // accidentally navigating away mid-game).
  useEffect(() => {
    apiGet<{ room: RoomState }>(`/api/room/${code}`)
      .then((r) => {
        setRoom(r.room);
        const playerId = getPlayerId();
        const alreadyIn = r.room.players.some((p) => p.id === playerId);
        if (alreadyIn) setJoined(true);
      })
      .catch(() => {});
  }, [code]);

  // Subscribe (after join) for state + hints + answer results.
  const myPlayerId = typeof window !== "undefined" ? getPlayerId() : "";
  const myTeamValue = room?.players.find((p) => p.id === myPlayerId)?.team ?? null;
  useEffect(() => {
    if (!joined || !room) return;
    const playerId = getPlayerId();
    const subs = subscribeRoom(code, myTeamValue, playerId, {
      onState: setRoom,
      onHint: (h) => setHints((arr) => [h, ...arr].slice(0, 20)),
      onAnswerResult: (r) => setResults((arr) => [r, ...arr].slice(0, 20)),
    });
    return () => subs.unsubscribe();
  }, [joined, code, myTeamValue, room?.mode]);

  useEffect(() => {
    if (!room || !joined) return;
    if (room.storedPhase !== "playing") return;
    const d = derivePhase(room, now);
    const key = d.timer.kind + (d.timer.kind === "bonus_reveal" ? String(d.timer.nth) : "");
    if (announcedRef.current.has(key)) return;
    announcedRef.current.add(key);
    if (d.timer.kind === "thinking") speakOpenAI("Five minute countdown begins now.");
    if (d.timer.kind === "next_keyword" && d.timer.nth === 1)
      speakOpenAI("You may now ask questions and attempt answers.");
    if (d.timer.kind === "bonus_reveal" && d.timer.nth === 1)
      speakOpenAI(`An additional keyword is now revealed: ${d.timer.keyword}.`);
    if (d.timer.kind === "bonus_reveal" && d.timer.nth === 2)
      speakOpenAI(`The final keyword is now revealed: ${d.timer.keyword}.`);
  }, [room, joined, now]);

  if (!joined) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <Link href="/" className="absolute top-6 left-6 text-parchment/60 text-sm">{t.home}</Link>
        <h2 className="text-3xl text-accent font-display">{t.joinRoomTitle}</h2>
        <div className="mt-2 text-accent text-2xl tracking-[0.4em]">{code}</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.yourName}
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
          {t.join}
        </button>
      </main>
    );
  }

  if (!room) return <main className="min-h-screen flex items-center justify-center text-parchment/60">{t.connecting}</main>;

  const playerId = getPlayerId();
  const me = room.players.find((p) => p.id === playerId);
  const myTeam = me?.team;
  const d = derivePhase(room, now);
  const buttonsActive = d.buttonsUnlocked;

  return (
    <div className="min-h-screen w-full px-5 py-6">
      <AnimatePresence mode="wait">
        {room.storedPhase === "lobby" && (
          <motion.section key="lobby" {...fade} className="mt-12 text-center">
            <div className="text-parchment/60 text-xs uppercase tracking-widest">{t.waitingForHost}</div>
            <div className="mt-2 text-2xl text-accent">{t.playersInRoom(room.players.length)}</div>
            <ul className="mt-6 space-y-1 text-parchment/80">
              {room.players.map((p) => <li key={p.id}>{p.name}</li>)}
            </ul>
          </motion.section>
        )}

        {room.storedPhase === "genre" && (
          <motion.section key="genre" {...fade} className="flex flex-col items-center px-4 pt-16 pb-10">
            <div className="text-parchment/50 text-xs uppercase tracking-widest">
              {t.hostChoosingType}
            </div>
            <div className="mt-1 text-parchment/40 text-xs">
              {room.mode === "solo" ? t.soloMode : `${t.group} ${myTeam == null ? "?" : myTeam + 1}`}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 w-full max-w-lg pointer-events-none">
              {GENRES.map((genre) => {
                const display = getGenreDisplay(genre.name, t);
                return (
                  <div
                    key={genre.name}
                    className={
                      "card text-left transition " +
                      (room.genre === genre.name
                        ? "ring-2 ring-accent shadow-glow"
                        : "opacity-50")
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{genre.emoji}</div>
                      <div>
                        <div className="text-parchment font-medium">{display.name}</div>
                        <p className="mt-1 text-parchment/65 text-sm">{display.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {room.genre && (
              <p className="mt-5 text-accent text-sm">
                {t.selectedLabel(getGenreDisplay(room.genre, t).name)}
              </p>
            )}
          </motion.section>
        )}

        {room.storedPhase === "difficulty" && (
          <motion.section key="difficulty" {...fade} className="flex flex-col items-center px-4 pt-16 pb-10">
            <div className="text-parchment/50 text-xs uppercase tracking-widest">
              {t.hostChoosingDiff}
            </div>
            {room.genre && (
              <div className="mt-1 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-accent text-ink text-xs uppercase tracking-widest">
                  {getGenreDisplay(room.genre, t).name}
                </span>
              </div>
            )}
            <div className="mt-6 grid grid-cols-1 gap-3 w-full max-w-lg pointer-events-none">
              {DIFFICULTIES.map((diff) => {
                const display = getDifficultyDisplay(diff.value, t);
                return (
                  <div
                    key={diff.value}
                    className={
                      "card text-left transition " +
                      (room.difficulty === diff.value
                        ? "ring-2 ring-accent shadow-glow"
                        : "opacity-50")
                    }
                  >
                    <div className="text-accent text-xs uppercase tracking-widest">{display.label}</div>
                    <p className="mt-2 text-parchment/80 text-sm">{display.tagline}</p>
                  </div>
                );
              })}
            </div>
            {room.difficulty && (
              <p className="mt-5 text-accent text-sm">
                {t.selectedLabel(getDifficultyDisplay(room.difficulty, t).label)}
              </p>
            )}
          </motion.section>
        )}

        {(room.storedPhase === "playing" || room.storedPhase === "ended") && (
          <motion.section key="game" {...fade} className="mt-2 pb-20">
            <div className="flex items-center justify-between mb-3">
              <div className="text-parchment/50 text-sm">
                {room.mode === "solo" ? me?.name || "Player" : `${t.group} ${myTeam == null ? "?" : myTeam + 1}`}
                {" · "}
                <span className="text-parchment/70">
                  {room.mode === "solo" ? me?.score : (myTeam != null ? room.scores[myTeam] : "")} {t.pts}
                </span>
              </div>
              <PlayerTimerBadge timer={d.timer} />
            </div>

            {d.revealedBonus > 0 && room.scenario && (
              <div className="card mb-3 border-accent/50">
                <div className="text-accent text-[10px] uppercase tracking-widest">
                  {d.timer.kind === "bonus_reveal" && d.timer.nth === 1 ? t.additionalRevealed :
                   d.timer.kind === "bonus_reveal" && d.timer.nth === 2 ? t.finalRevealed :
                   t.bonusKeywords}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {room.scenario.bonusKeywords.slice(0, d.revealedBonus).map((k) => (
                    <span key={k} className="px-3 py-1 rounded-full bg-accent text-ink text-sm font-semibold">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {room.scenario && (
              <div className="card mt-4">
                <div className="flex flex-wrap gap-2">
                  {room.genre && (
                    <span className="px-2 py-1 rounded-full bg-accent text-ink text-[10px] uppercase tracking-widest">
                      {getGenreDisplay(room.genre, t).name}
                    </span>
                  )}
                  {room.difficulty && (
                    <span className="px-2 py-1 rounded-full border border-accent/35 text-accent text-[10px] uppercase tracking-widest">
                      {getDifficultyDisplay(room.difficulty, t).label}
                    </span>
                  )}
                </div>
                <div className="text-accent text-[10px] uppercase tracking-widest">{t.briefing}</div>
                <p className="mt-1 text-parchment/90 text-sm italic">{room.scenario.briefing}</p>
                <p className="mt-2 text-parchment/80 text-sm">{room.scenario.question}</p>
                {room.genre === "Visual Match" && (
                  <p className="mt-2 text-parchment/60 text-xs">
                    Match the OpenAI-generated 3D maze scene to the labeled 2D maze board.
                  </p>
                )}
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
                {room.scenario.choices?.length ? (
                  <div className="mt-3 space-y-2">
                    <div className="text-accent text-[10px] uppercase tracking-widest">{t.possibleAnswers}</div>
                    {room.scenario.choices.map((choice) => (
                      <div key={choice} className="rounded-md border border-parchment/10 bg-parchment/5 px-3 py-2 text-sm text-parchment/80">
                        {choice}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-4 card">
              <div className="text-accent text-[10px] uppercase tracking-widest">{t.askQuestion}</div>
              <textarea
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                disabled={!buttonsActive}
                rows={2}
                className="mt-2 w-full bg-parchment/10 rounded px-3 py-2 text-parchment text-sm outline-none border border-parchment/15 disabled:opacity-50"
                placeholder={t.questionPlaceholder}
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
                {t.askQuestionBtn}
              </button>
            </div>

            <div className="mt-4 card">
              <div className="text-accent text-[10px] uppercase tracking-widest">{t.attemptAnswer}</div>
              <div className="mt-2 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] text-parchment/80 leading-relaxed">
                <div className="text-accent text-[10px] uppercase tracking-widest mb-1">{t.howToAnswer}</div>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>{t.howToAnswerLine1}</li>
                  <li>{t.howToAnswerLine2}</li>
                  <li>{t.howToAnswerLine3}</li>
                </ul>
              </div>
              <textarea
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                disabled={!buttonsActive}
                rows={3}
                className="mt-2 w-full bg-parchment/10 rounded px-3 py-2 text-parchment text-sm outline-none border border-parchment/15 disabled:opacity-50"
                placeholder={t.answerPlaceholder}
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
                {t.attemptAnswerBtn}
              </button>
            </div>

            <div className="mt-4 card max-h-64 overflow-auto">
              <div className="text-accent text-[10px] uppercase tracking-widest">
                {room.mode === "solo" ? t.yourFeed : t.teamFeed}
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

      {(room.storedPhase === "playing" || room.storedPhase === "ended") && (
        <>
          <button
            onClick={() => setExitOpen(true)}
            className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-parchment/10 hover:bg-parchment/20 border border-parchment/25 text-parchment/80 text-xs uppercase tracking-widest"
          >
            {t.lobbyBtn}
          </button>
          {exitOpen && (
            <div className="fixed inset-0 bg-ink/80 backdrop-blur flex items-center justify-center z-[60]">
              <div className="card max-w-sm w-[90%] text-center">
                <div className="text-accent text-xs uppercase tracking-widest">{t.exitGameTitle}</div>
                <p className="mt-3 text-parchment/90">{t.leaveConfirm}</p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={() => setExitOpen(false)} className="btn-pill">{t.stay}</button>
                  <Link href="/" className="btn-primary !py-2 !px-4">{t.leaveGame}</Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlayerTimerBadge({ timer }: { timer: TimerDisplay }) {
  const { t } = useT();
  if (timer.kind === "thinking")
    return <span className="text-accent text-sm tabular-nums font-display">{fmt(timer.remainingMs)}</span>;
  if (timer.kind === "next_keyword")
    return (
      <span className="text-parchment/70 text-xs text-right">
        {t.nextKeywordIn}<br />
        <span className="text-parchment font-display tabular-nums">{fmt(timer.remainingMs)}</span>
      </span>
    );
  if (timer.kind === "bonus_reveal")
    return (
      <span className="text-accent text-xs animate-pulse">
        {timer.nth === 1 ? t.bonusKeywordExcl : t.finalKeywordExcl}
      </span>
    );
  return null;
}
