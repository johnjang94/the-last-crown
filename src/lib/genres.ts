export const GENRES = [
  { name: "Horror", emoji: "🕯️" },
  { name: "Romance", emoji: "🌹" },
  { name: "Comedy", emoji: "🎭" },
  { name: "Sci-Fi", emoji: "🛸" },
  { name: "Fantasy", emoji: "🐉" },
  { name: "Historical", emoji: "🏛️" },
  { name: "Slice of Life", emoji: "☕" },
  { name: "Adventure", emoji: "🗺️" },
] as const;

export type GenreName = (typeof GENRES)[number]["name"];
