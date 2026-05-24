"use client";

import { apiGet, getPlayerId } from "@/lib/client";
import type { RoomState } from "@/types/game";

const ACTIVE_SESSION_KEY = "tlc:active-session:v1";

export type ActiveSession = {
  code: string;
  path: string;
  role: "solo" | "host" | "player";
};

export function readActiveSession(): ActiveSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.code || !parsed?.path || !parsed?.role) return null;
    return parsed as ActiveSession;
  } catch {
    return null;
  }
}

export function writeActiveSession(session: ActiveSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
}

export function clearActiveSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export async function getResumableSession(): Promise<ActiveSession | null> {
  const session = readActiveSession();
  if (!session) return null;
  try {
    const { room } = await apiGet<{ room: RoomState }>(`/api/room/${session.code}`);
    if (!room || room.storedPhase === "ended") {
      clearActiveSession();
      return null;
    }

    const playerId = getPlayerId();
    if (session.role === "host" && room.hostId !== playerId) {
      clearActiveSession();
      return null;
    }
    if (session.role !== "host" && !room.players.some((player) => player.id === playerId)) {
      clearActiveSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
