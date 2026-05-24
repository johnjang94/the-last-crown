import { NextRequest, NextResponse } from "next/server";
import { findPlayer, getRoom, pushRoomChatMessage, pushTeamChatMessage } from "@/lib/rooms";
import { pushRoomEvent, pushState, pushTeamEvent } from "@/lib/pusher";
import type { ChatMessage } from "@/types/game";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, playerId, text, scope } = await req.json();
    if (!code || !playerId || !text || !scope) {
      return NextResponse.json({ error: "code, playerId, text, and scope are required" }, { status: 400 });
    }

    const upper = String(code).toUpperCase();
    const room = await getRoom(upper);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const me = findPlayer(room, String(playerId));
    if (!me) return NextResponse.json({ error: "Player not found in room" }, { status: 403 });

    const messageText = String(text).trim().slice(0, 280);
    if (!messageText) return NextResponse.json({ error: "Message is empty" }, { status: 400 });

    let updated = null;
    if (scope === "team") {
      if (me.team == null || room.mode !== "team") {
        return NextResponse.json({ error: "Team chat is not available here" }, { status: 400 });
      }
      updated = await pushTeamChatMessage(upper, me.team, me.id, me.name, messageText);
    } else {
      updated = await pushRoomChatMessage(upper, me.id, me.name, messageText);
    }
    if (!updated) return NextResponse.json({ error: "Could not save message" }, { status: 500 });

    const source = scope === "team" ? updated.teamChat : updated.roomChat;
    const message = source[source.length - 1] as ChatMessage;
    if (scope === "team" && message.team != null) {
      await pushTeamEvent(upper, message.team, "team-chat", message);
    } else {
      await pushRoomEvent(upper, "room-chat", message);
    }
    await pushState(upper, updated);

    return NextResponse.json({ ok: true, message });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
