import { NextRequest, NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { getRoom, removePlayer } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";
import type { Difficulty } from "@/types/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const queueKey = (genre: string, difficulty: Difficulty) => `match:${genre}:${difficulty}`;

export async function POST(req: NextRequest) {
  try {
    const { code, playerId } = await req.json();
    if (!code || !playerId) {
      return NextResponse.json({ error: "code and playerId required" }, { status: 400 });
    }

    const upper = String(code).toUpperCase();
    const existing = await getRoom(upper);
    if (!existing) return NextResponse.json({ ok: true });

    const room = await removePlayer(upper, playerId);
    if (existing.genre && existing.difficulty && existing.players.length === 1) {
      await kv.del(queueKey(existing.genre, existing.difficulty));
    }

    if (room) await pushState(upper, room);
    return NextResponse.json({ room });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
