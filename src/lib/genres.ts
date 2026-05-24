export const GENRES = [
  {
    name: "Riddles",
    emoji: "🧩",
    description: "Read the clue, discuss the twist, and guess the hidden answer.",
  },
  {
    name: "Final Pick",
    emoji: "🎯",
    description: "Listen to the story, test the options, and make the final pick that still fits every clue.",
  },
  {
    name: "Visual Match",
    emoji: "🌀",
    description: "Compare a 3D maze view against a labeled 2D maze map.",
  },
  {
    name: "Codebreaker",
    emoji: "🔐",
    description: "Break the code hidden inside the prompt and find the answer that survives the pattern.",
  },
] as const;

export type GenreName = (typeof GENRES)[number]["name"];
