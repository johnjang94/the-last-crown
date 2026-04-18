import { NextRequest, NextResponse } from "next/server";
import { getRoom, setGenre, setDifficulty } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";
import type { Difficulty } from "@/types/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, genre, difficulty, playerId } = await req.json();
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    const upper = String(code).toUpperCase();
    const r0 = await getRoom(upper);
    if (!r0) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    if (r0.hostId !== playerId)
      return NextResponse.json({ error: "Only host can update selection" }, { status: 403 });

    let room = r0;
    if (genre != null) room = (await setGenre(upper, genre)) ?? room;
    if (difficulty != null) room = (await setDifficulty(upper, difficulty as Difficulty)) ?? room;

    await pushState(room.code, room);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
