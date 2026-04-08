# Mystery Champion

A cooperative deduction party game built as a Next.js 14 PWA, designed to deploy on **Vercel**.

## Architecture

- **Next.js 14** App Router (no custom server)
- **Vercel KV** (Upstash Redis) — room + settings storage
- **Pusher Channels** — realtime room state, team-private hints, per-player answer results
- **Anthropic Claude** — scenario generation, hint replies, answer judging
- **OpenAI** — `gpt-image-1` photos and TTS narration
- **PWA** — installable, offline shell

The game timer (`thinking → active → bonus1 → bonus2 → hidden-button`) is **derived from `startedAt`** on every read, so no background workers are needed — perfect for Vercel's serverless model.

## Setup

### 1. Required services

| Service | Purpose | Free tier |
|---|---|---|
| Vercel KV | game state + settings | Yes |
| Pusher Channels | realtime websockets | Yes (sandbox) |
| Anthropic API | scenario + judging | Pay-as-you-go |
| OpenAI API | images + voice | Pay-as-you-go |

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in.

```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-opus-4-6
OPENAI_API_KEY=sk-...
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=alloy

KV_REST_API_URL=...
KV_REST_API_TOKEN=...

PUSHER_APP_ID=...
PUSHER_SECRET=...
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

### 3. Local dev

```bash
npm install
npm run dev
# http://localhost:3000
```

If `KV_REST_API_*` are not set, the app falls back to an **in-memory** store that resets on each cold start — fine for local UI work, but multiplayer won't survive serverless invocations.

### 4. Deploy to Vercel

```bash
vercel link
vercel kv create mystery-kv      # creates a KV store and links env vars
vercel env pull .env.local       # pulls the KV vars locally
# add ANTHROPIC_API_KEY, OPENAI_API_KEY, PUSHER_*, NEXT_PUBLIC_PUSHER_* in the Vercel dashboard
vercel --prod
```

## How to play

1. Host opens `/` and clicks **Start Game** → a room code + QR appears.
2. Players scan the QR (or visit `/play/CODE`), enter a name, and join.
3. Host picks **Team mode** or **Solo / PvP**, then **Form Teams**.
4. Host picks a genre. Claude generates the case + 4 photos (with a 5-second per-image budget — slow images become styled placeholders so the game never stalls).
5. 5-minute thinking timer starts. After it ends, players can ask questions (-1 pt) or attempt an answer (must be phrased as a question, must use all currently revealed keywords).
6. Bonus keywords reveal at +3 min and +6 min from the start of the active phase. After 7 minutes of no answer, a hidden "I have no idea, cuckoo" button appears for the host to abandon the case.

### Answer rules

- Missing a required keyword → *"That is still unknown."*
- Not phrased as a question, or wrong → *"That is not true."*
- All keywords used + correct + question form → *"Correct!"*

The AI never reveals the answer in hints; the canonical solution is only shown on the host screen after the game ends.

## Settings

The `/settings` page lets you store API keys in KV at runtime, so you can rotate keys without redeploying. Keys stored in KV override the environment variables.
