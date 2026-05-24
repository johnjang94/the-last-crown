# Mystery Champion

A cooperative deduction party game built as a Next.js 14 PWA, designed to deploy on **Vercel**.

## Architecture

- **Next.js 14** App Router (no custom server)
- **Vercel KV** (Upstash Redis) — room + settings storage
- **Pusher Channels** — realtime room state, team-private hints, per-player answer results
- **Content service** — round creation, hint replies, answer judging
- **Visual + voice service** — images and narration
- **PWA** — installable, offline shell

## Setup

### 1. Required services

| Service | Purpose | Free tier |
|---|---|---|
| Vercel KV | game state + settings | Yes |
| Pusher Channels | realtime websockets | Yes (sandbox) |
| Content service | round logic | Pay-as-you-go |
| Visual + voice service | images + voice | Pay-as-you-go |

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in.

```bash
CONTENT_API_KEY=...
CONTENT_MODEL=...
VISUAL_API_KEY=...
VISUAL_IMAGE_MODEL=...
VOICE_MODEL=...
VOICE_VOICE=...

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
# add the content, visual, and Pusher keys in the Vercel dashboard
vercel --prod
```

## How to play

1. Host opens `/` and starts a room.
2. Players scan the QR (or visit `/play/CODE`), enter a name, and join.
3. The group chooses a mode, a game type, and a difficulty.
4. The app prepares the round, including the passage, visuals, and answer set.
5. Players ask for hints or submit answers as they work toward the crown.

### Answer rules

- Missing a required keyword → *"That is still unknown."*
- Not phrased as a question, or wrong → *"That is not true."*
- All keywords used + correct + question form → *"Correct!"*

## Settings

The `/settings` page lets you store service keys in KV at runtime, so you can rotate keys without redeploying. Keys stored in KV override the environment variables.
