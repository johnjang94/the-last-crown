"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import QRCode from "qrcode";
import { GENRES } from "@/lib/genres";
import { derivePhase } from "@/lib/phase";
import type { Mode, RoomState } from "@/types/game";
import { api, getPlayerId, speakOpenAI, subscribeRoom } from "@/lib/client";
import ParticipantsModal from "@/components/ParticipantsModal";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

export default function HostPage() {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [qr, setQr] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [genreLoading, setGenreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("team");
  const announcedRef = useRef<Set<string>>(new Set());

  // Create the room on mount.
  useEffect(() => {
    (async () => {
      try {
        const playerId = getPlayerId();
        const { room } = await api<{ room: RoomState }>("/api/room/create", {
          hostName: "Host",
          mode: "team",
        });
        setRoom(room);
        const subs = subscribeRoom(room.code, null, playerId, { onState: setRoom });
        return () => subs.unsubscribe();
      } catch (e: any) {
        setError(String(e?.message || e));
      }
    })();
  }, []);

  // QR
  useEffect(() => {
    if (!room) return;
    const url = `${location.origin}/play/${room.code}`;
    QRCode.toDataURL(url, { margin: 1, color: { dark: "#f5efe1", light: "#0b0b1000" } }).then(setQr);
  }, [room?.code]);

  // Voice announcements based on derived phase
  useEffect(() => {
    if (!room) return;
    const tick = () => {
      const d = derivePhase(room);
      const key = d.phase + ":" + d.revealedBonus + ":" + room.storedPhase + ":" + room.winner;
      if (announcedRef.current.has(key)) return;
      announcedRef.current.add(key);
      if (room.storedPhase === "playing" && d.phase === "thinking")
        speakOpenAI("The five minute countdown begins now.");
      if (d.phase === "active") speakOpenAI("You may now ask questions and attempt answers.");
      if (d.phase === "bonus1") speakOpenAI("A new bonus keyword is now revealed.");
      if (d.phase === "bonus2") speakOpenAI("The final bonus keyword is now revealed.");
      if (d.phase === "ended" && room.winner != null)
        speakOpenAI("The case has been solved.");
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [room]);

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center text-parchment/70">
        {error || "Connecting…"}
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Link href="/" className="absolute top-6 left-6 text-parchment/60 hover:text-parchment text-sm z-10">
        ← Home
      </Link>

      <AnimatePresence mode="wait">
        {room.storedPhase === "lobby" && (
          <LobbyScreen
            key="lobby"
            room={room}
            qr={qr}
            mode={mode}
            onModeChange={setMode}
            onTeams={() => api("/api/room/teams", { code: room.code, mode })}
          />
        )}

        {room.storedPhase === "teams" && (
          <TeamsScreen
            key="teams"
            room={room}
            onContinue={() => api("/api/room/phase", { code: room.code, phase: "genre" })}
            onEdit={() => setEditOpen(true)}
          />
        )}

        {room.storedPhase === "genre" && (
          <GenreScreen
            key="genre"
            room={room}
            selected={selectedGenre}
            onSelect={(g) => setSelectedGenre(g)}
            onEdit={() => setEditOpen(true)}
            loading={genreLoading}
            error={error}
            onContinue={async () => {
              if (!selectedGenre) return;
              setGenreLoading(true);
              setError(null);
              try {
                await api("/api/scenario", { code: room.code, genre: selectedGenre });
              } catch (e: any) {
                setError(String(e.message || e));
              } finally {
                setGenreLoading(false);
              }
            }}
          />
        )}

        {(room.storedPhase === "playing" || room.storedPhase === "ended") && (
          <GameScreen key="game" room={room} />
        )}
      </AnimatePresence>

      <ParticipantsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        room={room}
        onRename={(id, name) =>
          api("/api/room/rename", { code: room.code, targetId: id, name })
        }
      />
    </div>
  );
}

/* ───────────── Screens ───────────── */

function LobbyScreen({
  room,
  qr,
  mode,
  onModeChange,
  onTeams,
}: {
  room: RoomState;
  qr: string;
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onTeams: () => void;
}) {
  const joinUrl = typeof window !== "undefined" ? `${location.origin}/play/${room.code}` : "";
  const playableCount = room.players.filter((p) => !p.isHost).length;
  return (
    <motion.section {...fade} className="relative min-h-screen flex flex-col items-center px-6 pt-20">
      <h2 className="text-3xl text-accent font-display">Form a Team</h2>
      <p className="mt-3 text-parchment/70 text-center max-w-xl">
        Players join from their phones. Pick a mode, then form teams.
      </p>

      <div className="mt-6 flex gap-2 bg-parchment/10 rounded-full p-1 border border-parchment/15">
        {(["team", "solo"] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={
              "px-5 py-2 rounded-full text-sm transition " +
              (mode === m ? "bg-accent text-ink" : "text-parchment/70 hover:bg-parchment/10")
            }
          >
            {m === "team" ? "Team mode" : "Solo / PvP"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="card flex flex-col items-center">
          {qr ? <img src={qr} alt="QR" className="w-56 h-56" /> : <div className="w-56 h-56" />}
          <div className="mt-3 text-parchment/60 text-xs break-all max-w-xs text-center">{joinUrl}</div>
          <div className="mt-2 text-accent text-3xl tracking-[0.4em]">{room.code}</div>
        </div>
        <div className="card min-w-[260px]">
          <div className="text-parchment/60 text-xs uppercase tracking-widest">Players</div>
          <ul className="mt-3 space-y-1 text-parchment/90 max-h-72 overflow-auto">
            {room.players.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {p.name} {p.isHost && <span className="text-accent/60 text-xs">(host)</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onTeams}
        disabled={playableCount < 1}
        className="mt-10 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {mode === "team" ? "Form Teams" : "Start Solo"}
      </button>
    </motion.section>
  );
}

function TeamsScreen({
  room,
  onContinue,
  onEdit,
}: {
  room: RoomState;
  onContinue: () => void;
  onEdit: () => void;
}) {
  const teamA = room.players.filter((p) => p.team === 0);
  const teamB = room.players.filter((p) => p.team === 1);
  return (
    <motion.section {...fade} className="relative min-h-screen flex flex-col items-center px-6 pt-20">
      <h2 className="text-3xl text-accent font-display">
        {room.mode === "solo" ? "Solo Lineup" : "Teams Formed"}
      </h2>
      <button onClick={onEdit} className="absolute top-20 right-6 btn-pill">
        Edit Participants
      </button>
      {room.mode === "solo" ? (
        <ul className="mt-10 card w-full max-w-md space-y-1">
          {room.players.filter((p) => !p.isHost).map((p) => <li key={p.id}>{p.name}</li>)}
        </ul>
      ) : (
        <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-3xl w-full">
          <div className="card">
            <div className="text-crimson text-xs uppercase tracking-widest">Team 1</div>
            <ul className="mt-3 space-y-1">{teamA.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
          </div>
          <div className="card">
            <div className="text-accent text-xs uppercase tracking-widest">Team 2</div>
            <ul className="mt-3 space-y-1">{teamB.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
          </div>
        </div>
      )}
      <button onClick={onContinue} className="absolute bottom-6 right-6 btn-primary !py-3 !px-6">
        Next
      </button>
    </motion.section>
  );
}

function GenreScreen({
  room,
  selected,
  onSelect,
  onEdit,
  onContinue,
  loading,
  error,
}: {
  room: RoomState;
  selected: string | null;
  onSelect: (g: string) => void;
  onEdit: () => void;
  onContinue: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <motion.section {...fade} className="relative min-h-screen flex flex-col items-center px-6 pt-20">
      <h2 className="text-3xl text-accent font-display">Choose a Genre</h2>
      <button onClick={onEdit} className="absolute top-20 right-6 btn-pill">
        Edit Participants
      </button>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        {GENRES.map((g) => (
          <button
            key={g.name}
            onClick={() => onSelect(g.name)}
            className={
              "card flex flex-col items-center transition " +
              (selected === g.name ? "ring-2 ring-accent shadow-glow" : "hover:bg-parchment/10")
            }
          >
            <div className="text-3xl">{g.emoji}</div>
            <div className="mt-2 text-parchment/90 text-sm">{g.name}</div>
          </button>
        ))}
      </div>

      {error && <div className="mt-4 text-crimson text-sm">{error}</div>}
      {loading && <div className="mt-4 text-parchment/60 text-sm">Generating mystery (this may take ~10 seconds)…</div>}

      <button
        onClick={onContinue}
        disabled={!selected || loading}
        className="absolute bottom-6 right-6 btn-primary !py-3 !px-6 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </motion.section>
  );
}

function GameScreen({ room }: { room: RoomState }) {
  const s = room.scenario!;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);
  const d = derivePhase(room, now);
  const remainingMs = d.thinkingRemainingMs;
  const mm = Math.floor(remainingMs / 60000).toString().padStart(2, "0");
  const ss = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, "0");

  const visibleBonus = s.bonusKeywords.slice(0, d.revealedBonus);

  return (
    <motion.section {...fade} className="relative min-h-screen px-6 py-20">
      <header className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex gap-6 flex-wrap">
          {room.mode === "team" ? (
            <>
              <ScoreBox label="Team 1" score={room.scores[0]} accent="text-crimson" winner={room.winner === 0} />
              <ScoreBox label="Team 2" score={room.scores[1]} accent="text-accent" winner={room.winner === 1} />
            </>
          ) : (
            room.players.filter((p) => !p.isHost).slice(0, 6).map((p) => (
              <ScoreBox
                key={p.id}
                label={p.name}
                score={p.score}
                accent="text-accent"
                winner={room.winner === p.id}
              />
            ))
          )}
        </div>
        <div className="text-center">
          <div className="text-parchment/60 text-xs uppercase tracking-widest">Time</div>
          <div className="text-4xl text-accent font-display">{mm}:{ss}</div>
          <div className="text-parchment/40 text-[10px] uppercase tracking-widest">{d.phase}</div>
        </div>
      </header>

      <section className="mt-10 max-w-3xl mx-auto card">
        <div className="text-accent text-xs uppercase tracking-widest">Case Briefing</div>
        <p className="mt-2 text-parchment/90 italic">{s.briefing}</p>
        <p className="mt-3 text-parchment/80">
          <span className="text-parchment/50 text-xs uppercase tracking-widest mr-2">Question</span>
          {s.question}
        </p>
      </section>

      <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {s.photos.map((p, i) => (
          <div key={i} className="card flex flex-col items-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-parchment/15 to-parchment/5 border border-parchment/15">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.keyword} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-parchment/40 text-xs italic p-2 text-center">
                  {p.prompt.slice(0, 60)}…
                </div>
              )}
            </div>
            <div className="mt-2 text-accent text-sm">{p.keyword}</div>
          </div>
        ))}
      </section>

      {visibleBonus.length > 0 && (
        <section className="mt-6 max-w-5xl mx-auto card">
          <div className="text-accent text-xs uppercase tracking-widest">Bonus Keywords</div>
          <div className="mt-2 flex gap-3 flex-wrap">
            {visibleBonus.map((k) => (
              <span key={k} className="px-3 py-1 rounded-full bg-accent/20 border border-accent text-accent text-sm">
                {k}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 max-w-5xl mx-auto card max-h-48 overflow-auto">
        <div className="text-accent text-xs uppercase tracking-widest">Activity</div>
        <ul className="mt-2 space-y-1 text-parchment/70 text-sm">
          {room.activity.map((a) => (
            <li key={a.id}>• {a.text}</li>
          ))}
        </ul>
      </section>

      {room.storedPhase === "ended" && (
        <EndModal room={room} solution={s.solutionAnswer} />
      )}

      {d.hiddenButtonShown && room.storedPhase !== "ended" && (
        <button
          onClick={() => api("/api/game/giveup", { code: room.code })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-parchment/30 text-xs underline"
          title="The hidden button"
        >
          I have no idea, cuckoo
        </button>
      )}
    </motion.section>
  );
}

function ScoreBox({
  label,
  score,
  accent,
  winner,
}: {
  label: string;
  score: number;
  accent: string;
  winner: boolean;
}) {
  return (
    <div className={"card min-w-[120px] text-center " + (winner ? "ring-2 ring-accent" : "")}>
      <div className={"text-xs uppercase tracking-widest " + accent}>{label}</div>
      <div className="text-3xl font-display">{score}</div>
    </div>
  );
}

function EndModal({ room, solution }: { room: RoomState; solution: string }) {
  let title = "No winner";
  if (room.winner != null) {
    if (typeof room.winner === "number") title = `Team ${room.winner + 1} wins!`;
    else {
      const p = room.players.find((p) => p.id === room.winner);
      title = p ? `${p.name} wins!` : "Winner";
    }
  }
  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur flex items-center justify-center z-50">
      <div className="card max-w-md text-center">
        <div className="text-accent text-xs uppercase tracking-widest">{title}</div>
        <p className="mt-3 text-parchment/90">{solution}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/" className="btn-primary !py-2 !px-4">
            New Game
          </Link>
        </div>
      </div>
    </div>
  );
}
