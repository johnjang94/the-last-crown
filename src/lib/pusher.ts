// Server-side Pusher client. Used by API routes to broadcast room state.
import Pusher from "pusher";

let _pusher: Pusher | null = null;

export function getPusher(): Pusher | null {
  if (_pusher) return _pusher;
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2";
  if (!appId || !key || !secret) return null;
  _pusher = new Pusher({ appId, key, secret, cluster, useTLS: true });
  return _pusher;
}

export async function pushState(code: string, state: unknown) {
  const p = getPusher();
  if (!p) return;
  await p.trigger(`room-${code}`, "state", state);
}

export async function pushTeamEvent(
  code: string,
  team: 0 | 1 | string,
  event: string,
  payload: unknown
) {
  const p = getPusher();
  if (!p) return;
  await p.trigger(`room-${code}-team-${team}`, event, payload);
}

export async function pushPlayerEvent(
  code: string,
  playerId: string,
  event: string,
  payload: unknown
) {
  const p = getPusher();
  if (!p) return;
  await p.trigger(`room-${code}-player-${playerId}`, event, payload);
}
