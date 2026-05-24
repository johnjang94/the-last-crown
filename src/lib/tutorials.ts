import type { GenreName } from "@/lib/genres";

const SEEN_GENRES_KEY = "tlc:seen-genres:v1";

function readSeenGenres(): GenreName[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEEN_GENRES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GenreName[]) : [];
  } catch {
    return [];
  }
}

export function hasSeenGenreTutorial(genre: GenreName): boolean {
  return readSeenGenres().includes(genre);
}

export function markGenreTutorialSeen(genre: GenreName) {
  if (typeof window === "undefined") return;
  const next = Array.from(new Set([...readSeenGenres(), genre]));
  localStorage.setItem(SEEN_GENRES_KEY, JSON.stringify(next));
}
