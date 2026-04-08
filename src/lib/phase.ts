import type { Phase, RoomState } from "@/types/game";

export const TIMINGS = {
  THINKING_MS: 5 * 60 * 1000,
  BONUS1_AT_MS: 8 * 60 * 1000,
  BONUS2_AT_MS: 11 * 60 * 1000,
  HIDDEN_BTN_AT_MS: 12 * 60 * 1000,
};

export type DerivedPhase = {
  phase: Phase;
  revealedBonus: 0 | 1 | 2;
  hiddenButtonShown: boolean;
  thinkingRemainingMs: number;
};

export function derivePhase(state: RoomState, now: number = Date.now()): DerivedPhase {
  if (state.storedPhase !== "playing") {
    return {
      phase: state.storedPhase,
      revealedBonus: 0,
      hiddenButtonShown: false,
      thinkingRemainingMs: TIMINGS.THINKING_MS,
    };
  }
  const startedAt = state.startedAt || now;
  const elapsed = now - startedAt;
  let phase: Phase;
  let revealedBonus: 0 | 1 | 2;
  if (elapsed < TIMINGS.THINKING_MS) {
    phase = "thinking";
    revealedBonus = 0;
  } else if (elapsed < TIMINGS.BONUS1_AT_MS) {
    phase = "active";
    revealedBonus = 0;
  } else if (elapsed < TIMINGS.BONUS2_AT_MS) {
    phase = "bonus1";
    revealedBonus = 1;
  } else {
    phase = "bonus2";
    revealedBonus = 2;
  }
  return {
    phase,
    revealedBonus,
    hiddenButtonShown: elapsed >= TIMINGS.HIDDEN_BTN_AT_MS,
    thinkingRemainingMs: Math.max(0, TIMINGS.THINKING_MS - elapsed),
  };
}

export function buttonsActive(state: RoomState, now: number = Date.now()): boolean {
  const d = derivePhase(state, now);
  return state.storedPhase === "playing" && d.phase !== "thinking";
}
