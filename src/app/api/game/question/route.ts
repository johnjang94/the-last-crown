import { NextRequest, NextResponse } from "next/server";
import { findPlayer, getRoom, markHintUsed, pushActivity } from "@/lib/rooms";
import { pushPlayerEvent, pushState, pushTeamEvent } from "@/lib/pusher";
import { answerQuestion } from "@/lib/openai";
import { buttonsActive } from "@/lib/phase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { code, playerId, question } = await req.json();
    if (!code || !playerId || !question)
      return NextResponse.json({ error: "code/playerId/question required" }, { status: 400 });
    const upper = String(code).toUpperCase();
    const r = await getRoom(upper);
    if (!r || !r.scenario)
      return NextResponse.json({ error: "Game not active" }, { status: 400 });
    if (!buttonsActive(r))
      return NextResponse.json({ error: "Buttons are not active yet" }, { status: 400 });

    const me = findPlayer(r, playerId);
    if (!me) return NextResponse.json({ error: "Not in room" }, { status: 403 });

    if (r.mode !== "solo" && me.team == null)
      return NextResponse.json({ error: "Not on a team" }, { status: 400 });

    await markHintUsed(upper, playerId);
    const r2 = await pushActivity(upper, `${me.name} asked for a hint.`);
    if (r2) await pushState(upper, r2);

    const hint = await answerQuestion(r.scenario, question, r.difficulty || "medium");

    if (r.mode === "solo") {
      await pushPlayerEvent(upper, playerId, "hint", { askerName: me.name, question, hint });
    } else {
      await pushTeamEvent(upper, me.team!, "hint", { askerName: me.name, question, hint });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
