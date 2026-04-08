import OpenAI from "openai";
import { getKey } from "./keys";

async function client() {
  const apiKey = await getKey("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set. Configure it in Settings.");
  return new OpenAI({ apiKey });
}

export async function generateImage(prompt: string): Promise<string> {
  const c = await client();
  const model = (await getKey("OPENAI_IMAGE_MODEL")) || "gpt-image-1";
  const res = await c.images.generate({
    model,
    prompt: `Stylized 2D illustration, painterly, moody, cinematic lighting. Subject: ${prompt}`,
    size: "1024x1024",
  });
  const item = res.data?.[0] as any;
  if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (item?.url) return item.url;
  throw new Error("No image returned from OpenAI");
}

export async function generateImageWithTimeout(prompt: string, ms: number): Promise<string | null> {
  return await Promise.race<string | null>([
    generateImage(prompt).catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export async function generateSpeech(text: string): Promise<Buffer> {
  const c = await client();
  const model = (await getKey("OPENAI_TTS_MODEL")) || "gpt-4o-mini-tts";
  const voice = (await getKey("OPENAI_TTS_VOICE")) || "alloy";
  const res = await c.audio.speech.create({
    model,
    voice: voice as any,
    input: text,
    format: "mp3",
  } as any);
  const arrayBuffer = await (res as any).arrayBuffer();
  return Buffer.from(arrayBuffer);
}
