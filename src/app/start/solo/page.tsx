"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api, apiGet, getPlayerId, subscribeRoom } from "@/lib/client";
import { GENRES, type GenreName } from "@/lib/genres";
import { useT } from "@/contexts/LanguageContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import type { Difficulty, RoomState } from "@/types/game";
import { getDifficultyDisplay, getGenreDisplay } from "@/lib/i18n";
import { getFlowCopy, getGuideSlides } from "@/lib/genreGuides";
import { hasSeenGenreTutorial, markGenreTutorialSeen } from "@/lib/tutorials";
import { clearActiveSession, readActiveSession, writeActiveSession } from "@/lib/activeSession";
import {
  getGenreProgress,
  recordGenreFailure,
  recordGenreWin,
  setInitialDifficulty,
  type VisibleDifficulty,
} from "@/lib/progression";

type Hint = { askerName: string; question: string; hint: string };
type AnswerResult = {
  askerName: string;
  answer: string;
  verdict: "correct" | "not_true" | "unknown";
  message: string;
};

export default function StartPage() {
  const router = useRouter();
  const { t, locale } = useT();
  const copy = getFlowCopy(locale);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [currentGenre, setCurrentGenre] = useState<GenreName | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<GenreName | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState("");
  const [answerDraft, setAnswerDraft] = useState("");
  const [hints, setHints] = useState<Hint[]>([]);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [imageProgress, setImageProgress] = useState({ done: 0, total: 0 });
  const [hideWinOverlay, setHideWinOverlay] = useState(false);
  const [startDifficulty, setStartDifficulty] = useState<VisibleDifficulty>("easy");
  const [roundOutcome, setRoundOutcome] = useState<{
    won: boolean;
    score: number;
    difficultyAfter: Difficulty;
    streakAfter: number;
  } | null>(null);
  const loadingRoundRef = useRef(0);
  const handledRoundKeyRef = useRef<string | null>(null);
  const { settings, recordCompletedGame } = useUserSettings();

  const playerId = typeof window !== "undefined" ? getPlayerId() : "";

  useEffect(() => {
    if (!room?.code) return;
    const subs = subscribeRoom(room.code, null, playerId, {
      onState: setRoom,
      onHint: (hint) => setHints((prev) => [hint, ...prev].slice(0, 20)),
      onAnswerResult: (result) => setResults((prev) => [result, ...prev].slice(0, 20)),
    });
    return () => subs.unsubscribe();
  }, [room?.code, playerId]);

  const myScore = useMemo(() => {
    if (!room) return 0;
    const me = room.players.find((player) => player.id === playerId);
    return me?.score ?? 0;
  }, [playerId, room]);

  useEffect(() => {
    if (room?.storedPhase === "ended") setHideWinOverlay(false);
  }, [room?.storedPhase]);

  useEffect(() => {
    const session = readActiveSession();
    if (!session || session.role !== "solo" || room) return;
    apiGet<{ room: RoomState }>(`/api/room/${session.code}`)
      .then(({ room: savedRoom }) => {
        const me = savedRoom.players.find((player) => player.id === playerId);
        if (!me || savedRoom.storedPhase === "ended") {
          clearActiveSession();
          return;
        }
        setRoom(savedRoom);
        setCurrentGenre((savedRoom.genre as GenreName | null) || null);
      })
      .catch(() => {});
  }, [playerId, room]);

  useEffect(() => {
    if (!room) return;
    if (room.storedPhase === "ended") {
      clearActiveSession();
      return;
    }
    writeActiveSession({ code: room.code, path: "/start/solo", role: "solo" });
  }, [room]);

  useEffect(() => {
    if (!room || room.storedPhase !== "ended" || !currentGenre) return;
    const roundKey = `${room.code}:${room.startedAt}:${room.winner ?? "none"}`;
    if (handledRoundKeyRef.current === roundKey) return;
    handledRoundKeyRef.current = roundKey;

    const won = room.winner === playerId;
    recordCompletedGame(room, playerId);
    const nextProgress = won ? recordGenreWin(currentGenre) : recordGenreFailure(currentGenre);
    setRoundOutcome({
      won,
      score: room.players.find((player) => player.id === playerId)?.score ?? 0,
      difficultyAfter: nextProgress.currentDifficulty,
      streakAfter: nextProgress.streak,
    });
  }, [currentGenre, playerId, recordCompletedGame, room]);

  async function ensureRoom(): Promise<RoomState> {
    if (room) return room;
    const created = await api<{ room: RoomState }>("/api/room/create", {
      hostName: settings.displayName,
      mode: "solo",
    });
    setRoom(created.room);
    return created.room;
  }

  async function loadImages(code: string, photosCount: number, roundId: number) {
    if (photosCount === 0) {
      setImageProgress({ done: 0, total: 0 });
      return;
    }
    setImageProgress({ done: 0, total: photosCount });
    let done = 0;
    await Promise.allSettled(
      Array.from({ length: photosCount }, (_, photoIndex) =>
        api("/api/room/image", { code, photoIndex }).finally(() => {
          if (loadingRoundRef.current !== roundId) return;
          done += 1;
          setImageProgress({ done, total: photosCount });
        })
      )
    );
  }

  async function startRound(genre: GenreName, difficulty: Difficulty) {
    setHideWinOverlay(true);
    setError(null);
    setLoading(true);
    setCurrentGenre(genre);
    setRoundOutcome(null);
    setHints([]);
    setResults([]);
    setQuestionDraft("");
    setAnswerDraft("");

    const roundId = Date.now();
    loadingRoundRef.current = roundId;

    try {
      const activeRoom = await ensureRoom();
      const response = await api<{ room: RoomState | null }>("/api/scenario", {
        code: activeRoom.code,
        genre,
        difficulty,
      });
      const nextRoom = response.room || (await apiGet<{ room: RoomState }>(`/api/room/${activeRoom.code}`)).room;
      setRoom(nextRoom);
      setLoading(false);
      const totalPhotos = nextRoom.scenario?.photos.length ?? 0;
      void loadImages(nextRoom.code, totalPhotos, roundId);
    } catch (e: any) {
      setLoading(false);
      setError(String(e?.message || e));
    }
  }

  function beginGenre(genre: GenreName) {
    setSelectedGenre(genre);
    setTutorialStep(0);
    setInitialDifficulty(genre, startDifficulty);
    const progress = getGenreProgress(genre);
    if (hasSeenGenreTutorial(genre)) {
      void startRound(genre, progress.currentDifficulty);
      return;
    }
    setTutorialOpen(true);
  }

  const tutorialSlides = selectedGenre ? getGuideSlides(locale, selectedGenre) : [];
  const inGame = !!room?.scenario && (room.storedPhase === "playing" || room.storedPhase === "ended");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/start" className="text-parchment/60 hover:text-parchment text-sm">
            {t.back}
          </Link>
        </header>

        {!inGame && !loading && (
          <section className="mt-16">
            <div className="max-w-2xl">
              <div className="text-accent text-xs uppercase tracking-[0.35em]">The Last Crown</div>
              <h1 className="mt-4 text-4xl md:text-5xl font-display text-parchment">{copy.pickTitle}</h1>
              <p className="mt-4 text-lg text-parchment/70">{copy.pickDesc}</p>
            </div>

            <div className="mt-8">
              <div className="text-accent text-[10px] uppercase tracking-widest">{copy.chooseDifficulty}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["easy", "medium", "hard"] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setStartDifficulty(difficulty)}
                    className={
                      "px-4 py-2 rounded-full text-sm border transition " +
                      (startDifficulty === difficulty
                        ? "bg-accent text-ink border-accent"
                        : "bg-parchment/5 text-parchment/80 border-parchment/15 hover:border-accent/45")
                    }
                  >
                    {getDifficultyDisplay(difficulty, t).label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {GENRES.map((genre, index) => {
                const display = getGenreDisplay(genre.name, t);
                const progress = getGenreProgress(genre.name);
                return (
                  <button
                    key={genre.name}
                    onClick={() => beginGenre(genre.name)}
                    className="group text-left rounded-[28px] border border-parchment/10 bg-parchment/5 p-6 transition hover:border-accent/45 hover:bg-parchment/10"
                  >
                    <div
                      className="rounded-[22px] border border-parchment/10 p-5 min-h-[220px]"
                      style={{
                        background:
                          index === 0
                            ? "radial-gradient(circle at top left, rgba(255,210,120,0.22), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))"
                            : index === 1
                            ? "radial-gradient(circle at top right, rgba(255,120,120,0.2), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))"
                            : index === 2
                            ? "radial-gradient(circle at center, rgba(120,210,255,0.22), transparent 46%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))"
                            : "radial-gradient(circle at bottom left, rgba(170,255,190,0.18), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-4xl">{genre.emoji}</div>
                          <div className="mt-5 text-2xl font-display text-parchment">{display.name}</div>
                          <p className="mt-3 text-parchment/68 leading-relaxed">{display.description}</p>
                          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-parchment/70">
                            <span className="rounded-full border border-parchment/15 px-3 py-1">
                              {copy.currentLevel}: {getDifficultyDisplay(progress.currentDifficulty, t).label}
                            </span>
                            <span className="rounded-full border border-parchment/15 px-3 py-1">
                              {copy.streakLabel}: {progress.streak}
                            </span>
                            <span className="rounded-full border border-parchment/15 px-3 py-1">
                              {copy.missesLabel}: {progress.consecutiveFailures}
                            </span>
                          </div>
                        </div>
                        <div className="text-accent/50 text-xs uppercase tracking-[0.35em]">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-6 text-sm text-crimson">{error}</p>}
          </section>
        )}

        {loading && (
          <section className="min-h-[70vh] flex items-center justify-center">
            <div className="card max-w-xl w-full text-center">
              <div className="mx-auto w-20 h-20 rounded-full border border-accent/35 bg-accent/10 flex items-center justify-center text-4xl">
                ✦
              </div>
              <h2 className="mt-6 text-3xl font-display text-parchment">{copy.loading}</h2>
              <p className="mt-3 text-parchment/70">{copy.loadingSub}</p>
              <div className="mt-8 h-2 rounded-full bg-parchment/10 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{
                    width:
                      imageProgress.total > 0
                        ? `${Math.max(12, Math.round((imageProgress.done / imageProgress.total) * 100))}%`
                        : "28%",
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {inGame && room?.scenario && (
          <section className="mt-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="text-accent text-xs uppercase tracking-[0.35em]">{getGenreDisplay(currentGenre || room.genre || "", t).name}</div>
                <h2 className="mt-3 text-3xl font-display text-parchment">{room.scenario.question}</h2>
                <p className="mt-3 max-w-3xl text-parchment/70 italic">{room.scenario.briefing}</p>
              </div>
              <div className="rounded-2xl border border-accent/25 bg-accent/8 px-5 py-4 min-w-[180px]">
                <div className="text-accent text-[10px] uppercase tracking-widest">{copy.currentScore}</div>
                <div className="mt-2 text-4xl font-display text-parchment">{myScore}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
              <div className="card">
                <div className="text-accent text-xs uppercase tracking-widest">{copy.clues}</div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.scenario.photos.map((photo, index) => (
                    <div key={photo.keyword + index} className="rounded-2xl border border-parchment/10 bg-parchment/5 p-3">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-parchment/12 to-parchment/5 border border-parchment/10">
                        {photo.imageUrl ? (
                          <img src={photo.imageUrl} alt={photo.keyword} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-accent/60 text-3xl">✦</div>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-accent">{photo.keyword}</div>
                    </div>
                  ))}
                  {room.scenario.bonusKeywords.map((keyword) => (
                    <div key={keyword} className="rounded-2xl border border-accent/25 bg-accent/8 p-4 flex items-center justify-center text-center">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-accent/70">{t.bonusClue}</div>
                        <div className="mt-2 text-lg font-display text-parchment">{keyword}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {room.scenario.choices?.length ? (
                  <div className="mt-5 grid gap-2">
                    {room.scenario.choices.map((choice) => (
                      <div key={choice} className="rounded-xl border border-parchment/10 bg-parchment/5 px-4 py-3 text-parchment/82">
                        {choice}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="card">
                  <div className="text-accent text-xs uppercase tracking-widest">{copy.hintPrompt}</div>
                  <textarea
                    value={questionDraft}
                    onChange={(e) => setQuestionDraft(e.target.value)}
                    rows={3}
                    className="mt-3 w-full bg-parchment/10 rounded px-3 py-2 text-parchment text-sm outline-none border border-parchment/15"
                    placeholder={copy.hintPrompt}
                  />
                  <div className="mt-2 text-xs text-parchment/55">{copy.scoreHint}</div>
                  <button
                    onClick={async () => {
                      try {
                        await api("/api/game/question", { code: room.code, question: questionDraft });
                        setQuestionDraft("");
                      } catch (e: any) {
                        setError(String(e?.message || e));
                      }
                    }}
                    disabled={!questionDraft.trim()}
                    className="mt-4 btn-pill disabled:opacity-40"
                  >
                    {copy.askHint}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await api("/api/game/giveup", { code: room.code });
                      } catch (e: any) {
                        setError(String(e?.message || e));
                      }
                    }}
                    className="mt-3 btn-pill"
                  >
                    {copy.giveUp}
                  </button>
                </div>

                <div className="card">
                  <div className="text-accent text-xs uppercase tracking-widest">{copy.answerPrompt}</div>
                  <textarea
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    rows={4}
                    className="mt-3 w-full bg-parchment/10 rounded px-3 py-2 text-parchment text-sm outline-none border border-parchment/15"
                    placeholder={copy.answerPrompt}
                  />
                  <button
                    onClick={async () => {
                      try {
                        await api("/api/game/answer", { code: room.code, answer: answerDraft });
                        setAnswerDraft("");
                      } catch (e: any) {
                        setError(String(e?.message || e));
                      }
                    }}
                    disabled={!answerDraft.trim()}
                    className="mt-4 btn-primary disabled:opacity-40"
                  >
                    {copy.submitAnswer}
                  </button>
                </div>

                <div className="card max-h-[320px] overflow-auto">
                  <div className="text-accent text-xs uppercase tracking-widest">{copy.feed}</div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {results.map((result, index) => (
                      <li
                        key={`result-${index}`}
                        className={
                          result.verdict === "correct"
                            ? "text-emerald-400"
                            : result.verdict === "not_true"
                            ? "text-crimson"
                            : "text-parchment/70"
                        }
                      >
                        <b>{result.askerName}:</b> {result.answer} → {result.message}
                      </li>
                    ))}
                    {hints.map((hint, index) => (
                      <li key={`hint-${index}`} className="text-parchment/80">
                        <b>{hint.askerName}:</b> {hint.question} → <i>{hint.hint}</i>
                      </li>
                    ))}
                  </ul>
                </div>
                {error && <div className="text-sm text-crimson">{error}</div>}
              </div>
            </div>
          </section>
        )}
      </div>

      {tutorialOpen && selectedGenre && (
        <GenreTutorialDeck
          genre={selectedGenre}
          step={tutorialStep}
          slides={tutorialSlides}
          copy={copy}
          onNext={() => setTutorialStep((step) => Math.min(step + 1, tutorialSlides.length - 1))}
          onBack={() => setTutorialStep((step) => Math.max(step - 1, 0))}
          onClose={() => setTutorialOpen(false)}
          onPlay={() => {
            markGenreTutorialSeen(selectedGenre);
            setTutorialOpen(false);
            void startRound(selectedGenre, getGenreProgress(selectedGenre).currentDifficulty);
          }}
        />
      )}

      {room?.storedPhase === "ended" && currentGenre && roundOutcome && !hideWinOverlay && (
        <WinOverlay
          won={roundOutcome.won}
          score={roundOutcome.score}
          scoreLabel={copy.currentScore}
          title={roundOutcome.won ? copy.winTitle : copy.lossTitle}
          body={roundOutcome.won ? copy.winBody : copy.lossBody}
          levelLabel={copy.currentLevel}
          levelValue={getDifficultyDisplay(roundOutcome.difficultyAfter, t).label}
          streakLabel={copy.streakLabel}
          streakValue={roundOutcome.streakAfter}
          playSameLabel={copy.playSame}
          homeLabel={copy.trySomethingElse}
          onPlaySame={() => void startRound(currentGenre, getGenreProgress(currentGenre).currentDifficulty)}
          onHome={() => {
            setHideWinOverlay(true);
            router.push("/");
          }}
        />
      )}
    </main>
  );
}

function GenreTutorialDeck({
  genre,
  step,
  slides,
  copy,
  onNext,
  onBack,
  onClose,
  onPlay,
}: {
  genre: GenreName;
  step: number;
  slides: Array<{ icon: string; title: string; body: string; accent: string }>;
  copy: ReturnType<typeof getFlowCopy>;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onPlay: () => void;
}) {
  const slide = slides[step]!;
  const last = step === slides.length - 1;
  const backgrounds = [
    "radial-gradient(circle at top left, rgba(255,210,120,0.26), transparent 36%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    "radial-gradient(circle at top right, rgba(120,220,255,0.22), transparent 38%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    "radial-gradient(circle at bottom left, rgba(134,239,172,0.22), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  ];

  return (
    <div className="fixed inset-0 z-[90] bg-ink/90 backdrop-blur px-4 py-6 overflow-auto">
      <div className="mx-auto max-w-4xl">
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div className="text-accent text-xs uppercase tracking-[0.35em]">{genre}</div>
            <button onClick={onClose} className="text-parchment/55 hover:text-parchment text-sm">
              {copy.back}
            </button>
          </div>

          <div className="mt-6 rounded-[28px] border border-parchment/10 overflow-hidden">
            <div
              className="min-h-[360px] p-8 flex flex-col justify-between"
              style={{ background: backgrounds[step % backgrounds.length] }}
            >
              <div className="text-6xl">{slide.icon}</div>
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-display text-parchment">{slide.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-parchment/80">{slide.body}</p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={"h-2 rounded-full transition-all " + (index === step ? "w-10 bg-accent" : "w-2 bg-parchment/25")}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button onClick={onBack} disabled={step === 0} className="btn-pill disabled:opacity-35">
              {copy.back}
            </button>
            {last ? (
              <button onClick={onPlay} className="btn-primary !py-3 !px-6">
                {copy.letsPlay}
              </button>
            ) : (
              <button onClick={onNext} className="btn-primary !py-3 !px-6">
                {copy.next}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WinOverlay({
  won,
  score,
  scoreLabel,
  title,
  body,
  levelLabel,
  levelValue,
  streakLabel,
  streakValue,
  playSameLabel,
  homeLabel,
  onPlaySame,
  onHome,
}: {
  won: boolean;
  score: number;
  scoreLabel: string;
  title: string;
  body: string;
  levelLabel: string;
  levelValue: string;
  streakLabel: string;
  streakValue: number;
  playSameLabel: string;
  homeLabel: string;
  onPlaySame: () => void;
  onHome: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[95] bg-ink/86 backdrop-blur flex items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {won &&
          Array.from({ length: 28 }, (_, index) => (
            <span
              key={index}
              className="absolute top-[-10%] h-4 w-2 rounded-full opacity-80 animate-[fall_4.6s_linear_infinite]"
              style={{
                left: `${(index * 13) % 100}%`,
                background:
                  index % 4 === 0 ? "#f3d17c" : index % 4 === 1 ? "#7dd3fc" : index % 4 === 2 ? "#fca5a5" : "#86efac",
                animationDelay: `${index * 0.12}s`,
                transform: `rotate(${index * 19}deg)`,
              }}
            />
          ))}
      </div>

      <div className="card max-w-xl w-full text-center relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-4xl shadow-glow">
          {won ? "♛" : "✦"}
        </div>
        <div className="mt-6 text-3xl font-display text-parchment">{title}</div>
        <div className="mt-3 text-parchment/75">{body}</div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-accent/20 bg-accent/8 px-4 py-4">
            <div className="text-accent text-[10px] uppercase tracking-widest">{scoreLabel}</div>
            <div className="mt-2 text-4xl font-display text-parchment">{score}</div>
          </div>
          <div className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
            <div className="text-accent text-[10px] uppercase tracking-widest">{levelLabel}</div>
            <div className="mt-2 text-2xl font-display text-parchment">{levelValue}</div>
          </div>
          <div className="rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4">
            <div className="text-accent text-[10px] uppercase tracking-widest">{streakLabel}</div>
            <div className="mt-2 text-2xl font-display text-parchment">{streakValue}</div>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onPlaySame} className="btn-primary !py-3 !px-6">
            {playSameLabel}
          </button>
          <button onClick={onHome} className="btn-pill !py-3 !px-6">
            {homeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
