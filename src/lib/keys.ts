// Reads game keys/settings from KV first, falling back to env vars.
// Lets the in-app /settings page override Vercel env vars at runtime.
import { kv } from "./kv";

const SETTINGS_KEY = "settings:keys";

export async function getKey(name: string): Promise<string | undefined> {
  try {
    const obj = (await kv.hgetall<Record<string, string>>(SETTINGS_KEY)) || {};
    if (obj[name]) return String(obj[name]).trim();
  } catch {}
  return process.env[name] || undefined;
}

export async function getAllKeysMasked() {
  const obj = (await kv.hgetall<Record<string, string>>(SETTINGS_KEY)) || {};
  return obj;
}

export async function setKeys(fields: Record<string, string>) {
  const filtered: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === "string" && v.length) filtered[k] = v;
  }
  if (Object.keys(filtered).length) await kv.hset(SETTINGS_KEY, filtered);
}
