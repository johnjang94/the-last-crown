import { NextRequest, NextResponse } from "next/server";
import { addPlayer, getRoom } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, name, playerId } = await req.json();
    if (!code || !playerId)
      return NextResponse.json({ error: "code and playerId required" }, { status: 400 });
    const upper = String(code).toUpperCase();
    const exists = await getRoom(upper);
    if (!exists) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    const room = await addPlayer(upper, playerId, name);
    if (room) await pushState(room.code, room);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
