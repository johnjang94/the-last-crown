import OpenAI from "openai";
import { getKey } from "./keys";
import type { Difficulty, Scenario } from "@/types/game";

async function client() {
  const apiKey = await getKey("OPENAI_API_KEY");
  if (!apiKey) throw new Error("A required service key is not set. Configure it in Settings.");
  return new OpenAI({ apiKey });
}

const TEXT_MODEL = async () => (await getKey("OPENAI_TEXT_MODEL")) || "gpt-4.1-mini";
const IMAGE_MODEL = async () => (await getKey("OPENAI_IMAGE_MODEL")) || "gpt-image-1";

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text.trim();
}

async function jsonCompletion(system: string, prompt: string, temperature = 0.8) {
  const c = await client();
  const res = await c.chat.completions.create({
    model: await TEXT_MODEL(),
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });
  return res.choices[0]?.message?.content || "{}";
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

export async function generateScenario(genre: string, difficulty: Difficulty): Promise<Scenario> {
  const system = `You are the game master of "The Last Crown".
Create tight mobile-friendly game passages and clue sets.
Return strict JSON only.
- Always create exactly 4 photos and exactly 2 bonus keywords.
- Make every photo prompt visually rich and usable for the round visuals.
- Keep the hidden answer fair for the selected difficulty.
- "Codebreaker" and "Final Pick" must include 4 multiple-choice answers.
- Other game types should set "choices" to null.`;

  const prompt = `Generate a game with:
- type: ${genre}
- difficulty: ${difficulty}

Return JSON in this exact shape:
{
  "briefing": "string",
  "question": "string",
  "photos": [
    { "keyword": "string", "prompt": "detailed art prompt" },
    { "keyword": "string", "prompt": "detailed art prompt" },
    { "keyword": "string", "prompt": "detailed art prompt" },
    { "keyword": "string", "prompt": "detailed art prompt" }
  ],
  "bonusKeywords": ["string", "string"],
  "solutionAnswer": "string",
  "choices": ["string", "string", "string", "string"] or null
}

Game type guidance:
- Riddles: the player needs to guess the answer from a layered clue.
- Final Pick: present a short story or situation, then offer 4 options where only one still feels right after every clue.
- Visual Match: frame the puzzle around matching a 3D maze-like view with a labeled 2D maze.
- Codebreaker: use a story-led decoding puzzle with multiple-choice answers.

Difficulty guidance:
- novice: extra clear and forgiving
- easy: straightforward
- medium: balanced
- hard: deceptive but fair
- challenger: most demanding

The briefing should clearly tell the players what they are dealing with.`;

  const parsed = JSON.parse(extractJson(await jsonCompletion(system, prompt)));
  const photos = Array.isArray(parsed.photos) ? parsed.photos.slice(0, 4) : [];
  const bonusKeywords = Array.isArray(parsed.bonusKeywords) ? parsed.bonusKeywords.slice(0, 2) : [];
  return {
    briefing: String(parsed.briefing || ""),
    question: String(parsed.question || ""),
    photos: photos.map((photo: any) => ({
      keyword: String(photo.keyword || ""),
      prompt: String(photo.prompt || photo.keyword || ""),
      imageUrl: null,
    })),
    bonusKeywords: bonusKeywords.map((keyword: string) => String(keyword)),
    solutionKeywords: [
      ...photos.map((photo: any) => String(photo.keyword || "")),
      ...bonusKeywords.map((keyword: string) => String(keyword)),
    ],
    solutionAnswer: String(parsed.solutionAnswer || ""),
    choices: Array.isArray(parsed.choices)
      ? parsed.choices.slice(0, 4).map((choice: string) => String(choice))
      : null,
  };
}

export type Judgement = {
  verdict: "correct" | "not_true" | "unknown";
  message: string;
};

function hintInstructionByDifficulty(difficulty: Difficulty) {
  switch (difficulty) {
    case "novice":
      return `This is NOVICE difficulty.
- Give a very direct hint that is almost the answer.
- You may strongly narrow the answer to a single obvious idea.
- Do not literally repeat the exact hidden answer text unless the player's question already says it.`;
    case "easy":
      return `This is EASY difficulty.
- Give a highly revealing hint that makes the answer obvious to most players.
- You may point directly at the core concept, object, or interpretation.
- Stay one tiny step short of quoting the hidden answer verbatim.`;
    case "medium":
      return `This is MEDIUM difficulty.
- Give a useful, fair hint that genuinely helps.
- Clarify direction, remove one false path, or spotlight the key relationship.
- Do not make the answer obvious in one sentence.`;
    case "hard":
      return `This is HARD difficulty.
- Give a restrained but meaningful hint.
- Nudge the player toward the right reasoning pattern without collapsing the puzzle.
- Avoid naming the core answer directly or reducing it to one obvious option.`;
    case "challenger":
      return `This is CHALLENGER difficulty.
- Give a deliberately sparse and slippery hint.
- The hint should feel technically helpful but still leave the puzzle very difficult.
- Favor abstract guidance, tension, contrast, or what to re-examine over concrete answer content.`;
  }
}

export async function judgeAnswer(
  scenario: Scenario,
  answer: string,
  revealedBonus: number
): Promise<Judgement> {
  const visibleKeywords = [
    ...scenario.photos.map((photo) => photo.keyword),
    ...scenario.bonusKeywords.slice(0, revealedBonus),
  ];
  const raw = await jsonCompletion(
    `You judge answers for The Last Crown. Return JSON only.
Valid verdicts are correct, not_true, and unknown.
- correct: semantically matches the hidden answer
- not_true: clearly wrong
- unknown: too incomplete or unsupported`,
    `Briefing: ${scenario.briefing}
Question: ${scenario.question}
Visible keywords: ${visibleKeywords.join(", ")}
Multiple-choice options: ${scenario.choices?.join(" | ") || "none"}
Hidden answer: ${scenario.solutionAnswer}

Player answer: ${answer}

Return:
{"verdict":"correct|not_true|unknown","message":"Correct!|That is not true.|That is still unknown."}`,
    0.2
  );

  try {
    const parsed = JSON.parse(extractJson(raw));
    return {
      verdict: parsed.verdict,
      message: parsed.message,
    };
  } catch {
    return { verdict: "unknown", message: "That is still unknown." };
  }
}

export async function answerQuestion(
  scenario: Scenario,
  question: string,
  difficulty: Difficulty
): Promise<string> {
  const c = await client();
  const res = await c.chat.completions.create({
    model: await TEXT_MODEL(),
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `You are the game master of The Last Crown.
Give a short hint in plain text.
Reply with "That is not relevant." if the question is off-topic.
Never break character.

${hintInstructionByDifficulty(difficulty)}`,
      },
      {
        role: "user",
        content: `Briefing: ${scenario.briefing}
Question: ${scenario.question}
Visible answer options: ${scenario.choices?.join(" | ") || "none"}
Hidden answer: ${scenario.solutionAnswer}
Keywords: ${scenario.solutionKeywords.join(", ")}
Difficulty: ${difficulty}

Player question: ${question}`,
      },
    ],
  });
  return (res.choices[0]?.message?.content || "That is still unknown.").trim();
}

export async function generateGameImage(prompt: string): Promise<string> {
  const c = await client();
  const result = await c.images.generate({
    model: await IMAGE_MODEL(),
    prompt,
    size: "1024x1024",
  } as any);
  const image = result.data?.[0] as any;
  if (image?.url) return image.url;
  if (image?.b64_json) return `data:image/png;base64,${image.b64_json}`;
  throw new Error("Visual creation returned no image.");
}
