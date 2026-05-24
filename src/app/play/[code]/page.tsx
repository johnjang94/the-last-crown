"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api, apiGet, getPlayerId, speakNarration, subscribeRoom } from "@/lib/client";
import { derivePhase, fmt, type TimerDisplay } from "@/lib/phase";
import type { ChatMessage, RoomState } from "@/types/game";
import { GENRES, type GenreName } from "@/lib/genres";
import { DIFFICULTIES } from "@/lib/difficulties";
import { useT } from "@/contexts/LanguageContext";
import { getGenreDisplay, getDifficultyDisplay } from "@/lib/i18n";
import CoronationModal from "@/components/CoronationModal";
import GenreTutorialModal from "@/components/GenreTutorialModal";
import { hasSeenGenreTutorial, markGenreTutorialSeen } from "@/lib/tutorials";
import { clearActiveSession, writeActiveSession } from "@/lib/activeSession";
import { useUserSettings } from "@/contexts/UserSettingsContext";

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

type MobilePanel = "players" | "game" | "feed" | "chat";

export default function PlayPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = (params.code || "").toUpperCase();
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hints, setHints] = useState<Hint[]>([]);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [roomChatMessages, setRoomChatMessages] = useState<ChatMessage[]>([]);
  const [teamChatMessages, setTeamChatMessages] = useState<ChatMessage[]>([]);
  const [roomChatDraft, setRoomChatDraft] = useState("");
  const [teamChatDraft, setTeamChatDraft] = useState("");
  const [questionDraft, setQuestionDraft] = useState("");
  const [answerDraft, setAnswerDraft] = useState("");
  const announcedRef = useRef<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());
  const [exitOpen, setExitOpen] = useState(false);
  const [waitingLeaveOpen, setWaitingLeaveOpen] = useState(false);
  const [tutorialGenre, setTutorialGenre] = useState<GenreName | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("players");
  const [activeChatScope, setActiveChatScope] = useState<"room" | "team">("room");
  const { t } = useT();
  const { settings, pushInboxNotification, recordCompletedGame } = useUserSettings();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    apiGet<{ room: RoomState }>(`/api/room/${code}`)
      .then((r) => {
        setRoom(r.room);
        setRoomChatMessages(r.room.roomChat || []);
        setTeamChatMessages((r.room.teamChat || []).filter((message) => message.team === myTeamValue));
        const playerId = getPlayerId();
        const alreadyIn = r.room.players.some((p) => p.id === playerId);
        if (alreadyIn) setJoined(true);
      })
      .catch(() => {});
  }, [code]);

  const myPlayerId = typeof window !== "undefined" ? getPlayerId() : "";
  const myTeamValue = room?.players.find((p) => p.id === myPlayerId)?.team ?? null;

  function handleIncomingChat(message: ChatMessage) {
    if (message.playerId === getPlayerId()) return;
    if (!settings.notifications.messages) return;
    pushInboxNotification({
      kind: "message",
      title: message.scope === "team" ? `Team chat from ${message.playerName}` : `Room chat from ${message.playerName}`,
      body: message.text,
      roomCode: code,
    });
  }

  useEffect(() => {
    if (!joined || !room) return;
    const playerId = getPlayerId();
    const subs = subscribeRoom(code, myTeamValue, playerId, {
      onState: (next) => {
        setRoom(next);
        setRoomChatMessages(next.roomChat || []);
        setTeamChatMessages(myTeamValue == null ? [] : (next.teamChat || []).filter((message) => message.team === myTeamValue));
      },
      onRoomChat: (message) => {
        setRoomChatMessages((prev) => [...prev, message].slice(-100));
        handleIncomingChat(message);
      },
      onTeamChat: (message) => {
        setTeamChatMessages((prev) => [...prev, message].slice(-100));
        handleIncomingChat(message);
      },
      onHint: (h) => setHints((arr) => [h, ...arr].slice(0, 20)),
      onAnswerResult: (r) => setResults((arr) => [r, ...arr].slice(0, 20)),
    });
    return () => subs.unsubscribe();
  }, [joined, code, myTeamValue, pushInboxNotification, settings.notifications.messages]);

  useEffect(() => {
    if (!room || !joined) return;
    if (room.storedPhase !== "playing") return;
    const d = derivePhase(room, now);
    const key = d.timer.kind + (d.timer.kind === "bonus_reveal" ? String(d.timer.nth) : "");
    if (announcedRef.current.has(key)) return;
    announcedRef.current.add(key);
    if (d.timer.kind === "thinking") speakNarration("Five minute countdown begins now.");
    if (d.timer.kind === "next_keyword" && d.timer.nth === 1)
      speakNarration("You may now ask questions and attempt answers.");
    if (d.timer.kind === "bonus_reveal" && d.timer.nth === 1)
      speakNarration(`An additional keyword is now revealed: ${d.timer.keyword}.`);
    if (d.timer.kind === "bonus_reveal" && d.timer.nth === 2)
      speakNarration(`The final keyword is now revealed: ${d.timer.keyword}.`);
  }, [room, joined, now]);

  useEffect(() => {
    if (!room?.genre || !joined) return;
    if (room.storedPhase !== "playing") return;
    const genre = room.genre as GenreName;
    if (hasSeenGenreTutorial(genre)) return;
    setTutorialGenre(genre);
  }, [joined, room?.genre, room?.storedPhase]);

  useEffect(() => {
    if (room?.storedPhase === "lobby") {
      setMobilePanel("players");
      return;
    }
    setMobilePanel("game");
  }, [room?.storedPhase]);

  useEffect(() => {
    if (myTeamValue == null) return;
    setTeamChatMessages((room?.teamChat || []).filter((message) => message.team === myTeamValue));
  }, [myTeamValue, room?.teamChat]);

  const showTeamChat = room?.mode === "team" && myTeamValue != null && room?.storedPhase !== "lobby";

  useEffect(() => {
    if (!showTeamChat && activeChatScope === "team") setActiveChatScope("room");
  }, [activeChatScope, showTeamChat]);

  useEffect(() => {
    if (!room || !joined) return;
    if (room.storedPhase === "ended") {
      clearActiveSession();
      recordCompletedGame(room, getPlayerId());
      return;
    }
    writeActiveSession({ code: room.code, path: `/play/${room.code}`, role: "player" });
  }, [joined, recordCompletedGame, room]);

  if (!joined) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl text-accent font-display">{t.joinRoomTitle}</h2>
        <div className="mt-2 text-accent text-2xl tracking-[0.4em]">{code}</div>
        <div className="mt-8 w-72 rounded-2xl border border-parchment/15 bg-parchment/10 px-4 py-3 text-center text-parchment">
          {settings.displayName}
        </div>
        <p className="mt-3 text-center text-sm text-parchment/60">
          Change your name from Setting → My Profile.
        </p>
        {error && <div className="mt-3 text-crimson text-sm">{error}</div>}
        <button
          onClick={async () => {
            try {
              const { room: r } = await api<{ room: RoomState }>("/api/room/join", { code, name: settings.displayName });
              setRoom(r);
              setJoined(true);
            } catch (e: any) {
              setError(String(e?.message || e));
            }
          }}
          className="mt-6 btn-primary"
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
  const showLobbyPanels = room.storedPhase === "lobby";
  const showGamePanels = room.storedPhase === "playing" || room.storedPhase === "ended";
  const showPlayersPanel = !showLobbyPanels || mobilePanel === "players";
  const showGamePanel = !showGamePanels || mobilePanel === "game";
  const showFeedPanel = !showGamePanels || mobilePanel === "feed";
  const showChatPanel = mobilePanel === "chat";

  async function sendChat(scope: "room" | "team") {
    try {
      const draft = scope === "team" ? teamChatDraft : roomChatDraft;
      await api("/api/chat/send", { code, text: draft, scope });
      if (scope === "team") {
        setTeamChatDraft("");
      } else {
        setRoomChatDraft("");
      }
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div className="min-h-screen w-full px-5 py-6 pb-28 md:pb-6">
      <AnimatePresence mode="wait">
        {room.storedPhase === "lobby" && (
          <motion.section key="lobby" {...fade} className="mt-12 md:mt-16">
            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[1.1fr_0.9fr]">
              {showPlayersPanel && (
                <div className="card text-center md:text-left">
                  <div className="text-parchment/60 text-xs uppercase tracking-widest">{t.waitingForHost}</div>
                  <div className="mt-2 text-2xl text-accent">{t.playersInRoom(room.players.length)}</div>
                  <ul className="mt-6 space-y-1 text-parchment/80">
                    {room.players.map((p) => <li key={p.id}>{p.name}</li>)}
                  </ul>
                  {room.players.length === 1 && (
                    <button
                      onClick={() => setWaitingLeaveOpen(true)}
                      className="mt-12 rounded-full border border-parchment/20 bg-parchment/10 px-6 py-3 text-sm text-parchment/85 transition hover:bg-parchment/15"
                    >
                      Leave this waiting hall
                    </button>
                  )}
                </div>
              )}
              <div className={showChatPanel ? "block" : "hidden md:block"}>
                <ChatCard
                  roomMessages={roomChatMessages}
                  teamMessages={teamChatMessages}
                  roomDraft={roomChatDraft}
                  teamDraft={teamChatDraft}
                  setRoomDraft={setRoomChatDraft}
                  setTeamDraft={setTeamChatDraft}
                  onSend={sendChat}
                  currentPlayerId={playerId}
                  activeScope={activeChatScope}
                  setActiveScope={setActiveChatScope}
                  showTeamChat={false}
                  title="Chat"
                />
              </div>
            </div>
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
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className={showChatPanel ? "hidden lg:block" : "block"}>
                {showGamePanel && (
                  <>
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
                            Match the 3D maze scene to the labeled 2D maze board.
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
                  </>
                )}

                {showFeedPanel && (
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
                )}
              </div>

              <div className={showChatPanel ? "block" : "hidden lg:block"}>
                <ChatCard
                  roomMessages={roomChatMessages}
                  teamMessages={teamChatMessages}
                  roomDraft={roomChatDraft}
                  teamDraft={teamChatDraft}
                  setRoomDraft={setRoomChatDraft}
                  setTeamDraft={setTeamChatDraft}
                  onSend={sendChat}
                  currentPlayerId={playerId}
                  title="Chat"
                  activeScope={activeChatScope}
                  setActiveScope={setActiveChatScope}
                  showTeamChat={showTeamChat}
                />
              </div>
            </div>
            {error && <div className="mt-3 text-crimson text-sm">{error}</div>}
          </motion.section>
        )}
      </AnimatePresence>

      {waitingLeaveOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 backdrop-blur">
          <div className="card max-w-sm w-[90%] text-center">
            <div className="text-accent text-xs uppercase tracking-widest">Leave waiting hall</div>
            <p className="mt-3 text-parchment/90">
              Are you sure you want to end this game and go back to /start/online?
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setWaitingLeaveOpen(false)} className="btn-pill">
                {t.stay}
              </button>
              <button
                onClick={async () => {
                  try {
                    await api("/api/room/leave", { code });
                  } catch {}
                  router.push("/start/online");
                }}
                className="btn-primary !py-2 !px-4"
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-parchment/10 bg-ink/92 px-3 py-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          {showLobbyPanels ? (
            <>
              <MobileNavButton active={mobilePanel === "players"} onClick={() => setMobilePanel("players")} label="Players" />
              <MobileNavButton active={mobilePanel === "chat"} onClick={() => setMobilePanel("chat")} label="Chat" />
            </>
          ) : (
            <>
              <MobileNavButton active={mobilePanel === "game"} onClick={() => setMobilePanel("game")} label="Game" />
              <MobileNavButton active={mobilePanel === "feed"} onClick={() => setMobilePanel("feed")} label="Feed" />
              <MobileNavButton active={mobilePanel === "chat"} onClick={() => setMobilePanel("chat")} label="Chat" />
            </>
          )}
        </div>
      </div>

      {room.storedPhase === "ended" && room.scenario && (
        <CoronationModal room={room} solution={room.scenario.solutionAnswer} viewerPlayerId={playerId} />
      )}

      {tutorialGenre && (
        <GenreTutorialModal
          genre={tutorialGenre}
          title={t.tutorialAutoTitle}
          description={t.tutorialAutoDesc}
          ctaLabel={t.tutorialContinue}
          onContinue={() => {
            markGenreTutorialSeen(tutorialGenre);
            setTutorialGenre(null);
          }}
        />
      )}
    </div>
  );
}

function ChatCard({
  roomMessages,
  teamMessages,
  roomDraft,
  teamDraft,
  setRoomDraft,
  setTeamDraft,
  onSend,
  currentPlayerId,
  title,
  activeScope,
  setActiveScope,
  showTeamChat,
}: {
  roomMessages: ChatMessage[];
  teamMessages: ChatMessage[];
  roomDraft: string;
  teamDraft: string;
  setRoomDraft: (value: string) => void;
  setTeamDraft: (value: string) => void;
  onSend: (scope: "room" | "team") => void;
  currentPlayerId: string;
  title: string;
  activeScope: "room" | "team";
  setActiveScope: (value: "room" | "team") => void;
  showTeamChat: boolean;
}) {
  const messages = activeScope === "team" && showTeamChat ? teamMessages : roomMessages;
  const draft = activeScope === "team" && showTeamChat ? teamDraft : roomDraft;
  const setDraft = activeScope === "team" && showTeamChat ? setTeamDraft : setRoomDraft;

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between gap-3">
        <div className="text-accent text-[10px] uppercase tracking-widest">{title}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveScope("room")}
            className={
              "rounded-full px-3 py-1 text-xs transition " +
              (activeScope === "room" ? "bg-accent text-ink" : "bg-parchment/8 text-parchment/70")
            }
          >
            Room
          </button>
          {showTeamChat && (
            <button
              onClick={() => setActiveScope("team")}
              className={
                "rounded-full px-3 py-1 text-xs transition " +
                (activeScope === "team" ? "bg-accent text-ink" : "bg-parchment/8 text-parchment/70")
              }
            >
              Team
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 max-h-[50vh] min-h-[240px] space-y-2 overflow-auto rounded-2xl border border-parchment/10 bg-parchment/5 p-3">
        {messages.length === 0 ? (
          <div className="text-sm text-parchment/50">
            {activeScope === "team" && showTeamChat ? "No team messages yet." : "No room messages yet."}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={
                "rounded-2xl px-3 py-2 text-sm " +
                (message.playerId === currentPlayerId
                  ? "ml-6 bg-accent/15 text-parchment border border-accent/20"
                  : "mr-6 bg-parchment/8 text-parchment/85 border border-parchment/10")
              }
            >
              <div className="text-[11px] uppercase tracking-widest text-accent/80">{message.playerName}</div>
              <div className="mt-1 whitespace-pre-wrap break-words">{message.text}</div>
            </div>
          ))
        )}
      </div>
      <div className="mt-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 280))}
          rows={3}
          className="w-full rounded-xl border border-parchment/15 bg-parchment/10 px-3 py-2 text-sm text-parchment outline-none"
          placeholder={activeScope === "team" && showTeamChat ? "Write a message to your team" : "Write a message to the room"}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-xs text-parchment/50">{draft.length}/280</div>
          <button
            onClick={() => onSend(activeScope === "team" && showTeamChat ? "team" : "room")}
            disabled={!draft.trim()}
            className="btn-primary !py-2 !px-4 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileNavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex-1 rounded-full px-3 py-2 text-sm transition " +
        (active ? "bg-accent text-ink" : "bg-parchment/8 text-parchment/70")
      }
    >
      {label}
    </button>
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
