import type { Difficulty } from "@/types/game";
import type { GenreName } from "@/lib/genres";

const STORAGE_KEY = "tlc:genre-progression:v1";

export type VisibleDifficulty = Exclude<Difficulty, "novice" | "challenger">;

export type GenreProgress = {
  currentDifficulty: Difficulty;
  streak: number;
  consecutiveFailures: number;
  easyFailures: number;
};

type GenreProgressMap = Partial<Record<GenreName, GenreProgress>>;

const DEFAULT_PROGRESS: GenreProgress = {
  currentDifficulty: "easy",
  streak: 0,
  consecutiveFailures: 0,
  easyFailures: 0,
};

const TIERS: Difficulty[] = ["novice", "easy", "medium", "hard", "challenger"];

function readAll(): GenreProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as GenreProgressMap) : {};
  } catch {
    return {};
  }
}

function writeAll(data: GenreProgressMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getGenreProgress(genre: GenreName): GenreProgress {
  const all = readAll();
  return all[genre] || DEFAULT_PROGRESS;
}

export function setInitialDifficulty(genre: GenreName, difficulty: VisibleDifficulty) {
  const all = readAll();
  if (!all[genre]) {
    all[genre] = {
      currentDifficulty: difficulty,
      streak: 0,
      consecutiveFailures: 0,
      easyFailures: difficulty === "easy" ? 0 : 0,
    };
    writeAll(all);
  }
}

function nextDifficulty(current: Difficulty): Difficulty {
  const index = TIERS.indexOf(current);
  return TIERS[Math.min(index + 1, TIERS.length - 1)] || current;
}

function previousDifficulty(current: Difficulty): Difficulty {
  const index = TIERS.indexOf(current);
  return TIERS[Math.max(index - 1, 0)] || current;
}

export function recordGenreWin(genre: GenreName): GenreProgress {
  const all = readAll();
  const current = all[genre] || DEFAULT_PROGRESS;
  const next: GenreProgress = {
    currentDifficulty: current.currentDifficulty,
    streak: current.streak + 1,
    consecutiveFailures: 0,
    easyFailures: 0,
  };

  const neededStreak = current.currentDifficulty === "novice" ? 1 : current.currentDifficulty === "challenger" ? Infinity : 2;
  if (next.streak >= neededStreak && current.currentDifficulty !== "challenger") {
    next.currentDifficulty = nextDifficulty(current.currentDifficulty);
    next.streak = 0;
  }

  all[genre] = next;
  writeAll(all);
  return next;
}

export function recordGenreFailure(genre: GenreName): GenreProgress {
  const all = readAll();
  const current = all[genre] || DEFAULT_PROGRESS;
  let difficulty = current.currentDifficulty;
  let consecutiveFailures = current.consecutiveFailures + 1;
  let easyFailures = difficulty === "easy" ? current.easyFailures + 1 : 0;

  if (difficulty === "easy" && easyFailures >= 3) {
    difficulty = "novice";
    consecutiveFailures = 0;
    easyFailures = 0;
  } else if (difficulty !== "easy" && difficulty !== "novice" && consecutiveFailures >= 2) {
    difficulty = previousDifficulty(difficulty);
    consecutiveFailures = 0;
    easyFailures = difficulty === "easy" ? 0 : easyFailures;
  }

  const next: GenreProgress = {
    currentDifficulty: difficulty,
    streak: 0,
    consecutiveFailures,
    easyFailures,
  };

  all[genre] = next;
  writeAll(all);
  return next;
}

export function getDifficultyLabel(difficulty: Difficulty) {
  switch (difficulty) {
    case "novice":
      return "Novice";
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
    case "challenger":
      return "Challenger";
  }
}
