import type { Phase, RoomState } from "@/types/game";
export type TimerDisplay =
  | { kind: "thinking"; remainingMs: number }
  | { kind: "next_keyword"; nth: 1 | 2; remainingMs: number }
  | { kind: "bonus_reveal"; nth: 1 | 2; keyword: string }
  | { kind: "open" };

export type DerivedPhase = {
  phase: Phase;
  revealedBonus: 0 | 1 | 2;
  hiddenButtonShown: boolean;
  buttonsUnlocked: boolean;
  timer: TimerDisplay;
};

export function derivePhase(state: RoomState, now: number = Date.now()): DerivedPhase {
  if (state.storedPhase !== "playing") {
    return {
      phase: state.storedPhase as Phase,
      revealedBonus: 0,
      hiddenButtonShown: false,
      buttonsUnlocked: false,
      timer: { kind: "open" },
    };
  }

  return {
    phase: "active",
    revealedBonus: 2,
    hiddenButtonShown: false,
    buttonsUnlocked: true,
    timer: { kind: "open" },
  };
}

export function buttonsActive(state: RoomState, now: number = Date.now()): boolean {
  return state.storedPhase === "playing" && derivePhase(state, now).buttonsUnlocked;
}

export function fmt(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
