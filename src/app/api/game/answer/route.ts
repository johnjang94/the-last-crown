import { NextRequest, NextResponse } from "next/server";
import { adjustPlayerScore, adjustTeamScore, endGame, findPlayer, getRoom, pushActivity } from "@/lib/rooms";
import { pushPlayerEvent, pushState, pushTeamEvent } from "@/lib/pusher";
import { judgeAnswer } from "@/lib/openai";
import { buttonsActive, derivePhase } from "@/lib/phase";
import type { Difficulty } from "@/types/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BASE_POINTS: Record<Difficulty, number> = {
  novice: 6,
  easy: 10,
  medium: 14,
  hard: 18,
  challenger: 24,
};

export async function POST(req: NextRequest) {
  try {
    const { code, playerId, answer } = await req.json();
    if (!code || !playerId || !answer)
      return NextResponse.json({ error: "code/playerId/answer required" }, { status: 400 });
    const upper = String(code).toUpperCase();
    const r = await getRoom(upper);
    if (!r || !r.scenario)
      return NextResponse.json({ error: "Game not active" }, { status: 400 });
    if (!buttonsActive(r))
      return NextResponse.json({ error: "Buttons are not active yet" }, { status: 400 });

    const me = findPlayer(r, playerId);
    if (!me) return NextResponse.json({ error: "Not in room" }, { status: 403 });

    const { revealedBonus } = derivePhase(r);
    const j = await judgeAnswer(r.scenario, answer, revealedBonus);

    const payload = { askerName: me.name, answer, verdict: j.verdict, message: j.message };
    const hintUsed = r.roundHintUsers.includes(playerId);
    const difficulty = r.difficulty || "medium";
    if (r.mode === "solo") {
      await pushPlayerEvent(upper, playerId, "answer-result", payload);
    } else if (me.team != null) {
      await pushTeamEvent(upper, me.team, "answer-result", payload);
    }

    if (j.verdict === "correct") {
      const basePoints = BASE_POINTS[difficulty];
      const awardedPoints = hintUsed ? Math.max(1, Math.ceil(basePoints * 0.5)) : basePoints;
      if (r.mode === "solo") {
        await adjustPlayerScore(upper, playerId, awardedPoints);
      } else if (me.team != null) {
        await adjustTeamScore(upper, me.team, awardedPoints);
      }
      await pushActivity(
        upper,
        hintUsed
          ? `${me.name} solved the case and earned ${awardedPoints} points after using a hint.`
          : `${me.name} solved the case and earned ${awardedPoints} points.`
      );
      const winner = r.mode === "solo" ? playerId : (me.team as 0 | 1);
      const final = await endGame(upper, winner);
      if (final) await pushState(upper, final);
    } else {
      await pushActivity(upper, `${me.name} missed the answer. The round ended.`);
      const final = await endGame(upper, null);
      if (final) await pushState(upper, final);
    }
    return NextResponse.json({ verdict: j.verdict });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
