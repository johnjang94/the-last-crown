export type Mode = "team" | "solo";
export type Difficulty = "novice" | "easy" | "medium" | "hard" | "challenger";

export type Player = {
  id: string;
  name: string;
  team: 0 | 1 | null;
  isHost?: boolean;
  score: number;
};

export type Photo = {
  keyword: string;
  prompt: string;
  imageUrl?: string | null;
};

export type Scenario = {
  briefing: string;
  question: string;
  photos: Photo[];
  bonusKeywords: string[];
  solutionKeywords: string[];
  solutionAnswer: string;
  choices?: string[] | null;
};
export type StoredPhase = "lobby" | "genre" | "difficulty" | "playing" | "ended";
export type Phase =
  | "lobby"
  | "genre"
  | "difficulty"
  | "thinking"
  | "active"
  | "bonus1"
  | "bonus2"
  | "ended";

export type ActivityEntry = { id: string; ts: number; text: string };
export type ChatScope = "room" | "team";
export type ChatMessage = {
  id: string;
  ts: number;
  playerId: string;
  playerName: string;
  text: string;
  scope: ChatScope;
  team: 0 | 1 | null;
};

export type RoomState = {
  code: string;
  hostId: string;
  mode: Mode;
  players: Player[];
  storedPhase: StoredPhase;
  genre: string | null;
  difficulty: Difficulty | null;
  scenario: Scenario | null;
  scores: [number, number];
  activity: ActivityEntry[];
  roomChat: ChatMessage[];
  teamChat: ChatMessage[];
  roundHintUsers: string[];
  startedAt: number | null;
  winner: 0 | 1 | string | null;
};
