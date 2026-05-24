import type { RoomState, Mode, Scenario, ActivityEntry, Player, Difficulty, ChatMessage } from "@/types/game";
import { kv } from "./kv";

const roomKey = (code: string) => `room:${code}`;

function rid() {
  return Math.random().toString(36).slice(2, 10);
}

export async function getRoom(code: string): Promise<RoomState | null> {
  if (!code) return null;
  const room = (await kv.get<RoomState>(roomKey(code.toUpperCase()))) || null;
  if (!room) return null;
  if (!room.roomChat) room.roomChat = ((room as any).chat || []).map((message: ChatMessage) => ({
    ...message,
    scope: "room",
    team: null,
  }));
  if (!room.teamChat) room.teamChat = [];
  return room;
}

export async function saveRoom(state: RoomState): Promise<void> {
  await kv.set(roomKey(state.code), state);
}

async function generateCode(): Promise<string> {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  for (let i = 0; i < 8; i++) {
    let code = "";
    for (let j = 0; j < 4; j++) code += letters[Math.floor(Math.random() * letters.length)];
    const exists = await kv.get(roomKey(code));
    if (!exists) return code;
  }
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function createRoom(hostId: string, hostName: string, mode: Mode): Promise<RoomState> {
  const code = await generateCode();
  const room: RoomState = {
    code,
    hostId,
    mode,
    players: [{ id: hostId, name: hostName || "Player", team: null, isHost: true, score: 0 }],
    storedPhase: "lobby",
    genre: null,
    difficulty: null,
    scenario: null,
    scores: [0, 0],
    activity: [],
    roomChat: [],
    teamChat: [],
    roundHintUsers: [],
    startedAt: null,
    winner: null,
  };
  await saveRoom(room);
  return room;
}

export async function update(
  code: string,
  fn: (r: RoomState) => void
): Promise<RoomState | null> {
  const r = await getRoom(code);
  if (!r) return null;
  fn(r);
  await saveRoom(r);
  return r;
}

export async function addPlayer(code: string, id: string, name: string): Promise<RoomState | null> {
  return update(code, (r) => {
    if (!r.players.find((p) => p.id === id)) {
      r.players.push({ id, name: name || "Player", team: null, score: 100 });
    } else {
      const p = r.players.find((q) => q.id === id)!;
      if (name) p.name = name;
    }
  });
}

export async function renamePlayer(code: string, id: string, name: string) {
  return update(code, (r) => {
    const p = r.players.find((p) => p.id === id);
    if (p) p.name = name;
  });
}

export async function removePlayer(code: string, id: string) {
  return update(code, (r) => {
    r.players = r.players.filter((p) => p.id !== id);
  });
}

export async function setHostPlayable(code: string) {
  return update(code, (r) => {
    const host = r.players.find((player) => player.id === r.hostId);
    if (host) host.isHost = false;
  });
}

export async function setMode(code: string, mode: Mode) {
  return update(code, (r) => {
    r.mode = mode;
  });
}

export async function autoTeams(code: string) {
  return update(code, (r) => {
    if (r.mode === "solo") {
      r.players.forEach((p) => (p.team = null));
    } else {
      const playable = r.players.filter((p) => !p.isHost);
      const shuffled = [...playable].sort(() => Math.random() - 0.5);
      shuffled.forEach((p, i) => {
        const idx = r.players.findIndex((q) => q.id === p.id);
        if (idx >= 0) r.players[idx].team = (i % 2) as 0 | 1;
      });
      r.players.filter((p) => p.isHost).forEach((p) => (p.team = null));
    }
    r.storedPhase = "genre";
  });
}

export async function setPhase(code: string, phase: RoomState["storedPhase"]) {
  return update(code, (r) => {
    r.storedPhase = phase;
  });
}

export async function setGenre(code: string, genre: string) {
  return update(code, (r) => {
    r.genre = genre;
  });
}

export async function setDifficulty(code: string, difficulty: Difficulty) {
  return update(code, (r) => {
    r.difficulty = difficulty;
  });
}

export async function setScenario(code: string, scenario: Scenario) {
  return update(code, (r) => {
    r.scenario = scenario;
    r.storedPhase = "playing";
    r.startedAt = Date.now();
    r.activity = [];
    r.roundHintUsers = [];
    r.winner = null;
  });
}

export async function updatePhotoImage(
  code: string,
  photoIndex: number,
  imageUrl: string
) {
  return update(code, (r) => {
    if (r.scenario && r.scenario.photos[photoIndex]) {
      r.scenario.photos[photoIndex].imageUrl = imageUrl;
    }
  });
}

export async function pushActivity(code: string, text: string) {
  return update(code, (r) => {
    const e: ActivityEntry = { id: rid(), ts: Date.now(), text };
    r.activity.unshift(e);
    if (r.activity.length > 50) r.activity.length = 50;
  });
}

export async function pushRoomChatMessage(code: string, playerId: string, playerName: string, text: string) {
  return update(code, (r) => {
    if (!r.roomChat) r.roomChat = [];
    const entry: ChatMessage = { id: rid(), ts: Date.now(), playerId, playerName, text, scope: "room", team: null };
    r.roomChat.push(entry);
    if (r.roomChat.length > 100) r.roomChat = r.roomChat.slice(-100);
  });
}

export async function pushTeamChatMessage(
  code: string,
  team: 0 | 1,
  playerId: string,
  playerName: string,
  text: string
) {
  return update(code, (r) => {
    if (!r.teamChat) r.teamChat = [];
    const entry: ChatMessage = { id: rid(), ts: Date.now(), playerId, playerName, text, scope: "team", team };
    r.teamChat.push(entry);
    if (r.teamChat.length > 100) r.teamChat = r.teamChat.slice(-100);
  });
}

export async function markHintUsed(code: string, playerId: string) {
  return update(code, (r) => {
    if (!r.roundHintUsers.includes(playerId)) {
      r.roundHintUsers.push(playerId);
    }
  });
}

export async function adjustTeamScore(code: string, team: 0 | 1, delta: number) {
  return update(code, (r) => {
    r.scores[team] = Math.max(0, r.scores[team] + delta);
  });
}

export async function adjustPlayerScore(code: string, playerId: string, delta: number) {
  return update(code, (r) => {
    const p = r.players.find((p) => p.id === playerId);
    if (p) p.score = Math.max(0, p.score + delta);
  });
}

export async function endGame(code: string, winner: 0 | 1 | string | null) {
  return update(code, (r) => {
    r.storedPhase = "ended";
    r.winner = winner;
  });
}

export function findPlayer(r: RoomState, id: string): Player | undefined {
  return r.players.find((p) => p.id === id);
}
