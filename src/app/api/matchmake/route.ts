import { NextRequest, NextResponse } from "next/server";
import { generateScenario } from "@/lib/openai";
import { kv } from "@/lib/kv";
import { addPlayer, autoTeams, createRoom, getRoom, setDifficulty, setGenre, setHostPlayable, setScenario } from "@/lib/rooms";
import { pushState } from "@/lib/pusher";
import type { Difficulty } from "@/types/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const queueKey = (genre: string, difficulty: Difficulty) => `match:${genre}:${difficulty}`;

export async function POST(req: NextRequest) {
  try {
    const { playerId, name, genre, difficulty } = await req.json();
    if (!playerId || !genre || !difficulty) {
      return NextResponse.json({ error: "playerId, genre, and difficulty are required" }, { status: 400 });
    }

    const key = queueKey(String(genre), difficulty as Difficulty);
    const waitingCode = await kv.get<string>(key);

    if (!waitingCode) {
      const room = await createRoom(playerId, name || "Player", "team");
      await setHostPlayable(room.code);
      await setGenre(room.code, String(genre));
      await setDifficulty(room.code, difficulty as Difficulty);
      const created = (await getRoom(room.code)) || room;
      await kv.set(key, room.code);
      await pushState(room.code, created);
      return NextResponse.json({ room: created, waiting: true });
    }

    let room = await getRoom(waitingCode);
    if (!room || room.storedPhase !== "lobby") {
      await kv.del(key);
      const fresh = await createRoom(playerId, name || "Player", "team");
      await setHostPlayable(fresh.code);
      await setGenre(fresh.code, String(genre));
      await setDifficulty(fresh.code, difficulty as Difficulty);
      const created = (await getRoom(fresh.code)) || fresh;
      await kv.set(key, fresh.code);
      await pushState(fresh.code, created);
      return NextResponse.json({ room: created, waiting: true });
    }

    room = await addPlayer(waitingCode, playerId, name || "Player");
    if (!room) return NextResponse.json({ error: "Could not join waiting room" }, { status: 500 });

    const playable = room.players.filter((player) => !player.isHost);
    if (playable.length >= 2) {
      await kv.del(key);
      await autoTeams(waitingCode);
      await setGenre(waitingCode, String(genre));
      await setDifficulty(waitingCode, difficulty as Difficulty);
      const scenario = await generateScenario(String(genre), difficulty as Difficulty);
      const ready = await setScenario(waitingCode, scenario);
      if (ready) {
        await pushState(waitingCode, ready);
        return NextResponse.json({ room: ready, waiting: false });
      }
    }

    const joined = await getRoom(waitingCode);
    if (joined) await pushState(waitingCode, joined);
    return NextResponse.json({ room: joined, waiting: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
