"use client";

import Link from "next/link";
import type { RoomState } from "@/types/game";
import { useT } from "@/contexts/LanguageContext";

type Standing = {
  key: string;
  label: string;
  score: number;
  winner: boolean;
};

function buildStandings(room: RoomState, t: ReturnType<typeof useT>["t"]): Standing[] {
  if (room.mode === "team") {
    return [
      { key: "team-0", label: `${t.group} 1`, score: room.scores[0], winner: room.winner === 0 },
      { key: "team-1", label: `${t.group} 2`, score: room.scores[1], winner: room.winner === 1 },
    ].sort((a, b) => b.score - a.score);
  }

  return room.players
    .filter((player) => !player.isHost)
    .map((player) => ({
      key: player.id,
      label: player.name,
      score: player.score,
      winner: room.winner === player.id,
    }))
    .sort((a, b) => b.score - a.score);
}

function getWinnerLabel(room: RoomState, t: ReturnType<typeof useT>["t"]) {
  if (room.winner == null) return t.noWinner;
  if (typeof room.winner === "number") return `${t.group} ${room.winner + 1}`;
  const player = room.players.find((entry) => entry.id === room.winner);
  return player?.name || t.winner;
}

export default function CoronationModal({
  room,
  solution,
  viewerPlayerId,
}: {
  room: RoomState;
  solution: string;
  viewerPlayerId?: string | null;
}) {
  const { t } = useT();
  const standings = buildStandings(room, t);
  const topScore = standings[0]?.score ?? 0;
  const runnerUpScore = standings[1]?.score ?? topScore;
  const scoreGap = Math.max(0, topScore - runnerUpScore);
  const winnerLabel = getWinnerLabel(room, t);
  const viewer =
    viewerPlayerId && room.mode === "solo"
      ? room.players.find((player) => player.id === viewerPlayerId)
      : null;
  const viewerWon = viewer ? room.winner === viewer.id : false;

  return (
    <div className="fixed inset-0 bg-ink/85 backdrop-blur flex items-center justify-center z-50 px-4 py-8">
      <div className="card max-w-2xl w-full text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/12 shadow-glow">
          <div className="text-3xl text-accent">♛</div>
        </div>
        <div className="mt-4 text-accent text-[11px] uppercase tracking-[0.35em]">{t.crownedThisRound}</div>
        <div className="mt-3 text-3xl sm:text-4xl font-display text-parchment">{winnerLabel}</div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-accent/20 bg-parchment/5 px-4 py-4">
            <div className="text-accent/80 text-[10px] uppercase tracking-widest">{t.winningScore}</div>
            <div className="mt-2 text-3xl font-display text-parchment">{topScore}</div>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-parchment/5 px-4 py-4">
            <div className="text-accent/80 text-[10px] uppercase tracking-widest">{t.scoreGap}</div>
            <div className="mt-2 text-3xl font-display text-parchment">{scoreGap}</div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4 text-left">
          <div className="text-accent text-[10px] uppercase tracking-widest">{t.finalStandings}</div>
          <div className="mt-3 space-y-2">
            {standings.map((entry, index) => (
              <div
                key={entry.key}
                className={
                  "flex items-center justify-between rounded-xl px-3 py-2 " +
                  (entry.winner ? "bg-accent/12 border border-accent/35" : "bg-parchment/5 border border-parchment/10")
                }
              >
                <div className="flex items-center gap-3">
                  <span className={"text-xs font-semibold " + (entry.winner ? "text-accent" : "text-parchment/55")}>
                    #{index + 1}
                  </span>
                  <span className="text-parchment/90">{entry.label}</span>
                </div>
                <span className="font-display text-xl text-parchment">{entry.score}</span>
              </div>
            ))}
          </div>
        </div>

        {viewer && (
          <div className="mt-5 rounded-2xl border border-crimson/20 bg-crimson/8 px-4 py-4 text-left">
            <div className="text-crimson text-[10px] uppercase tracking-widest">{t.yourRound}</div>
            <div className="mt-2 text-parchment/90">
              {viewerWon ? t.personalSummaryWon : t.personalSummaryLost}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-parchment/60">{t.yourScore}</span>
              <span className="font-display text-2xl text-parchment">{viewer.score}</span>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-parchment/10 bg-parchment/5 px-4 py-4 text-left">
          <div className="text-accent text-[10px] uppercase tracking-widest">{t.solutionLabel}</div>
          <p className="mt-2 text-parchment/90">{solution}</p>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/" className="btn-primary !py-2 !px-5">
            {t.newGame}
          </Link>
        </div>
      </div>
    </div>
  );
}
