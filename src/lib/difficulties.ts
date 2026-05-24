import type { Difficulty } from "@/types/game";

export const DIFFICULTIES: Array<{
  value: Difficulty;
  label: string;
  tagline: string;
}> = [
  { value: "novice", label: "Novice", tagline: "Gentle clues and extra breathing room." },
  { value: "easy", label: "Easy", tagline: "Clear clues and a friendly warm-up." },
  { value: "medium", label: "Medium", tagline: "Balanced twists for steady teams." },
  { value: "hard", label: "Hard", tagline: "Sharper traps and trickier deductions." },
  { value: "challenger", label: "The Challenger", tagline: "The boldest version of the crown." },
];
