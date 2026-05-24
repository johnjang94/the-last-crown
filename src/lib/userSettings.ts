"use client";

import type { RoomState } from "@/types/game";

export type NotificationChannel = "email" | "sms" | "none";

export type NotificationSettings = {
  channel: NotificationChannel;
  email: string;
  phone: string;
  points: boolean;
  messages: boolean;
  badges: boolean;
  ranking: boolean;
};

export type NotificationEntry = {
  id: string;
  createdAt: number;
  kind: "message" | "points" | "badge" | "ranking";
  title: string;
  body: string;
  roomCode?: string;
  read: boolean;
};

export type GameHistoryEntry = {
  id: string;
  playedAt: number;
  roomCode: string;
  mode: RoomState["mode"];
  genre: string;
  difficulty: string;
  score: number;
  outcome: "won" | "lost";
  participants: string[];
};

export type UserSettings = {
  displayName: string;
  notifications: NotificationSettings;
  inbox: NotificationEntry[];
  history: GameHistoryEntry[];
};

const STORAGE_KEY = "tlc:user-settings";

export const defaultUserSettings: UserSettings = {
  displayName: "Player",
  notifications: {
    channel: "none",
    email: "",
    phone: "",
    points: true,
    messages: true,
    badges: true,
    ranking: true,
  },
  inbox: [],
  history: [],
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function sanitizeDisplayName(value: string) {
  return value.trim() || "Player";
}

export function readUserSettings(): UserSettings {
  if (!canUseStorage()) return defaultUserSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserSettings;
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      displayName: sanitizeDisplayName(parsed.displayName || defaultUserSettings.displayName),
      notifications: {
        ...defaultUserSettings.notifications,
        ...(parsed.notifications || {}),
      },
      inbox: Array.isArray(parsed.inbox) ? parsed.inbox.slice(0, 100) : [],
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 50) : [],
    };
  } catch {
    return defaultUserSettings;
  }
}

export function writeUserSettings(settings: UserSettings) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function buildHistoryEntry(room: RoomState, playerId: string): GameHistoryEntry | null {
  const me = room.players.find((player) => player.id === playerId);
  if (!me || me.isHost) return null;

  const won =
    room.mode === "solo"
      ? room.winner === playerId
      : me.team != null && room.winner === me.team;

  return {
    id: `${room.code}:${room.startedAt || 0}:${playerId}`,
    playedAt: room.startedAt || Date.now(),
    roomCode: room.code,
    mode: room.mode,
    genre: room.genre || "Unknown",
    difficulty: room.difficulty || "Unknown",
    score: room.mode === "solo" ? me.score : me.team != null ? room.scores[me.team] : 0,
    outcome: won ? "won" : "lost",
    participants: room.players.filter((player) => !player.isHost).map((player) => player.name),
  };
}
