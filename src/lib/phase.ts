import type { Phase, RoomState } from "@/types/game";

// ─── Timeline ──────────────────────────────────────────────────────────
//  0:00 →  5:00   thinking    — countdown 5:00 → 0:00
//  5:00 →  8:00   active      — "Next keyword in 3:00 → 0:00"
//  8:00 →  8:30   bonus1      — "Additional keyword: [kw1]"  (grace 30s)
//  8:30 → 11:30   active2     — "Next keyword in 3:00 → 0:00"
// 11:30 → 12:00   bonus2      — "Final keyword: [kw2]"       (grace 30s)
// 12:00+          open        — hiddenButton shows at 13:00
// ───────────────────────────────────────────────────────────────────────
export const TIMINGS = {
  THINKING_MS:       5 * 60 * 1000,        //  5:00
  BONUS1_AT_MS:      8 * 60 * 1000,        //  8:00
  BONUS1_GRACE_MS:   8 * 60 * 1000 + 30_000, //  8:30
  BONUS2_AT_MS:     11 * 60 * 1000 + 30_000, // 11:30
  BONUS2_GRACE_MS:  12 * 60 * 1000,           // 12:00
  HIDDEN_BTN_AT_MS: 13 * 60 * 1000,           // 13:00
};

// What the timer widget should currently display.
export type TimerDisplay =
  | { kind: "thinking";      remainingMs: number }
  | { kind: "next_keyword";  nth: 1 | 2; remainingMs: number }
  | { kind: "bonus_reveal";  nth: 1 | 2; keyword: string }
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
      timer: { kind: "thinking", remainingMs: TIMINGS.THINKING_MS },
    };
  }

  const startedAt = state.startedAt || now;
  const elapsed = now - startedAt;
  const b1 = state.scenario?.bonusKeywords[0] ?? "?";
  const b2 = state.scenario?.bonusKeywords[1] ?? "?";

  let phase: Phase;
  let revealedBonus: 0 | 1 | 2;
  let timer: TimerDisplay;

  if (elapsed < TIMINGS.THINKING_MS) {
    phase = "thinking";
    revealedBonus = 0;
    timer = { kind: "thinking", remainingMs: TIMINGS.THINKING_MS - elapsed };
  } else if (elapsed < TIMINGS.BONUS1_AT_MS) {
    phase = "active";
    revealedBonus = 0;
    timer = { kind: "next_keyword", nth: 1, remainingMs: TIMINGS.BONUS1_AT_MS - elapsed };
  } else if (elapsed < TIMINGS.BONUS1_GRACE_MS) {
    phase = "bonus1";
    revealedBonus = 1;
    timer = { kind: "bonus_reveal", nth: 1, keyword: b1 };
  } else if (elapsed < TIMINGS.BONUS2_AT_MS) {
    phase = "active";
    revealedBonus = 1;
    timer = { kind: "next_keyword", nth: 2, remainingMs: TIMINGS.BONUS2_AT_MS - elapsed };
  } else if (elapsed < TIMINGS.BONUS2_GRACE_MS) {
    phase = "bonus2";
    revealedBonus = 2;
    timer = { kind: "bonus_reveal", nth: 2, keyword: b2 };
  } else {
    phase = "bonus2";
    revealedBonus = 2;
    timer = { kind: "open" };
  }

  return {
    phase,
    revealedBonus,
    hiddenButtonShown: elapsed >= TIMINGS.HIDDEN_BTN_AT_MS,
    buttonsUnlocked: elapsed >= TIMINGS.THINKING_MS,
    timer,
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
