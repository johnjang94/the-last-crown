import { NextRequest, NextResponse } from "next/server";
import { renamePlayer } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, targetId, name, playerId } = await req.json();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    const room = await renamePlayer(String(code).toUpperCase(), targetId || playerId, name);
    if (room) await pushState(room.code, room);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
