import { NextRequest, NextResponse } from "next/server";
import { createRoom } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { playerId, hostName, mode } = await req.json();
    if (!playerId) return NextResponse.json({ error: "playerId required" }, { status: 400 });
    const m = mode === "solo" ? "solo" : "team";
    const room = await createRoom(playerId, hostName || "Host", m);
    await pushState(room.code, room);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
