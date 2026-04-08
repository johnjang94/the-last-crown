import { NextRequest, NextResponse } from "next/server";
import { autoTeams, getRoom, setMode } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, playerId, mode } = await req.json();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    const upper = String(code).toUpperCase();
    const r0 = await getRoom(upper);
    if (!r0) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    if (r0.hostId !== playerId)
      return NextResponse.json({ error: "Only host can form teams" }, { status: 403 });
    if (mode === "team" || mode === "solo") await setMode(upper, mode);
    const room = await autoTeams(upper);
    if (room) await pushState(room.code, room);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
