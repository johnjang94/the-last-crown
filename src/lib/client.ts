"use client";
import Pusher, { Channel } from "pusher-js";
import type { RoomState } from "@/types/game";

const PLAYER_ID_KEY = "mc:playerId";

export function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id =
      "p_" +
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

let _pusher: Pusher | null = null;
function getPusherClient(): Pusher | null {
  if (typeof window === "undefined") return null;
  if (_pusher) return _pusher;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2";
  if (!key) return null;
  _pusher = new Pusher(key, { cluster });
  return _pusher;
}

export type RoomChannels = {
  room: Channel | null;
  team: Channel | null;
  player: Channel | null;
  unsubscribe: () => void;
};

export function subscribeRoom(
  code: string,
  team: 0 | 1 | string | null,
  playerId: string,
  handlers: {
    onState?: (s: RoomState) => void;
    onHint?: (h: { askerName: string; question: string; hint: string }) => void;
    onAnswerResult?: (r: {
      askerName: string;
      answer: string;
      verdict: "correct" | "not_true" | "unknown";
      message: string;
    }) => void;
  }
): RoomChannels {
  const p = getPusherClient();
  if (!p) return { room: null, team: null, player: null, unsubscribe: () => {} };

  const room = p.subscribe(`room-${code}`);
  if (handlers.onState) room.bind("state", handlers.onState);

  let teamCh: Channel | null = null;
  if (team !== null) {
    teamCh = p.subscribe(`room-${code}-team-${team}`);
    if (handlers.onHint) teamCh.bind("hint", handlers.onHint);
    if (handlers.onAnswerResult) teamCh.bind("answer-result", handlers.onAnswerResult);
  }

  const playerCh = p.subscribe(`room-${code}-player-${playerId}`);
  if (handlers.onHint) playerCh.bind("hint", handlers.onHint);
  if (handlers.onAnswerResult) playerCh.bind("answer-result", handlers.onAnswerResult);

  return {
    room,
    team: teamCh,
    player: playerCh,
    unsubscribe: () => {
      p.unsubscribe(`room-${code}`);
      if (team !== null) p.unsubscribe(`room-${code}-team-${team}`);
      p.unsubscribe(`room-${code}-player-${playerId}`);
    },
  };
}

export async function api<T = any>(
  path: string,
  body: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, playerId: getPlayerId() }),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {}
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json as T;
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function speakBrowser(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export async function speakOpenAI(text: string) {
  try {
    const r = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!r.ok) throw new Error("tts failed");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
  } catch {
    speakBrowser(text);
  }
}
