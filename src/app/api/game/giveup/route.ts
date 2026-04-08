import { NextRequest, NextResponse } from "next/server";
import { endGame, getRoom, pushActivity } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, playerId } = await req.json();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    const upper = String(code).toUpperCase();
    const r = await getRoom(upper);
    if (!r) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    if (r.hostId !== playerId)
      return NextResponse.json({ error: "Only host can give up" }, { status: 403 });
    await pushActivity(upper, "The game ended without a winner.");
    const final = await endGame(upper, null);
    if (final) await pushState(upper, final);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
