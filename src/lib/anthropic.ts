import Anthropic from "@anthropic-ai/sdk";
import { getKey } from "./keys";
import type { Scenario } from "@/types/game";

async function client() {
  const apiKey = await getKey("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set. Configure it in Settings.");
  return new Anthropic({ apiKey });
}

const MODEL = async () => (await getKey("ANTHROPIC_MODEL")) || "claude-haiku-4-5-20251001";

const SYSTEM = `You are the game master of "Mystery Champion", a deduction party game.
You craft short, evocative mystery cases in a chosen genre. The case has:
- a 3-5 sentence briefing
- ONE central question the players must answer (as a question)
- exactly 4 photos (each: vivid 2D-illustration prompt + a one-word keyword that IS related to the case)
- exactly 2 bonus keywords that get revealed later
- a canonical solution that uses ALL 6 keywords (4 photo keywords + 2 bonus) and is itself phrased as a question
The photos do not all need to literally appear in the case — but every keyword must be meaningfully tied to the truth.
Respond ONLY with strict JSON matching the schema. No prose.`;

const SCHEMA_HINT = `{
  "briefing": "string",
  "question": "string (the question players must answer, phrased as a question)",
  "photos": [
    {"keyword":"string","prompt":"detailed 2D illustration prompt"},
    {"keyword":"string","prompt":"..."},
    {"keyword":"string","prompt":"..."},
    {"keyword":"string","prompt":"..."}
  ],
  "bonusKeywords": ["string","string"],
  "solutionAnswer": "string phrased as a question that uses all 6 keywords"
}`;

export async function generateScenario(genre: string): Promise<Scenario> {
  const c = await client();
  const msg = await c.messages.create({
    model: await MODEL(),
    max_tokens: 800,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Generate a ${genre} mystery case. Return JSON only matching this schema:\n${SCHEMA_HINT}`,
      },
    ],
  });
  const text = msg.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("");
  const json = extractJson(text);
  const parsed = JSON.parse(json);
  const photoKeywords = parsed.photos.map((p: any) => String(p.keyword));
  const bonus = parsed.bonusKeywords.map((k: string) => String(k));
  const scenario: Scenario = {
    briefing: String(parsed.briefing),
    question: String(parsed.question),
    photos: parsed.photos.map((p: any) => ({
      keyword: String(p.keyword),
      prompt: String(p.prompt),
      imageUrl: null,
    })),
    bonusKeywords: bonus,
    solutionKeywords: [...photoKeywords, ...bonus],
    solutionAnswer: String(parsed.solutionAnswer),
  };
  return scenario;
}

export type Judgement = {
  verdict: "correct" | "not_true" | "unknown";
  message: string;
};

export async function judgeAnswer(
  scenario: Scenario,
  answer: string,
  revealedBonus: number
): Promise<Judgement> {
  const requiredBase = scenario.photos.map((p) => p.keyword);
  const requiredBonus = scenario.bonusKeywords.slice(0, revealedBonus);
  const allKeywords = [...requiredBase, ...requiredBonus];

  // ── Cheap local pre-checks ────────────────────────────────────────────
  // Rules 1 + 2 from the original prompt are mechanical — handle them in
  // code so we never burn LLM tokens on obviously-incomplete attempts.
  const lower = answer.toLowerCase();
  const missing = allKeywords.filter((k) => !lower.includes(k.toLowerCase()));
  if (missing.length > 0) {
    return { verdict: "unknown", message: "That is still unknown." };
  }
  if (!answer.includes("?")) {
    return { verdict: "not_true", message: "That is not true." };
  }

  // ── Only the semantic match (rule 3) actually needs the LLM ───────────
  const c = await client();
  const prompt = `You are judging a player's answer in Mystery Champion.
Case briefing: ${scenario.briefing}
Question: ${scenario.question}
Canonical solution (keep secret): ${scenario.solutionAnswer}
Required keywords (already verified present): ${allKeywords.join(", ")}

Player's answer: """${answer}"""

The answer already uses every required keyword and is phrased as a question.
Decide ONLY whether it semantically matches the canonical solution.
Reply with JSON only: {"verdict":"correct"|"not_true","message":"short reply"}.
- If yes → {"verdict":"correct","message":"Correct!"}
- If no  → {"verdict":"not_true","message":"That is not true."}`;

  const msg = await c.messages.create({
    model: await MODEL(),
    max_tokens: 80,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("");
  try {
    const json = JSON.parse(extractJson(text));
    return { verdict: json.verdict, message: json.message };
  } catch {
    return { verdict: "unknown", message: "That is still unknown." };
  }
}

export async function answerQuestion(
  scenario: Scenario,
  question: string
): Promise<string> {
  const c = await client();
  const prompt = `You are the game master of Mystery Champion. The player asks a hint question.
Case briefing (secret to player): ${scenario.briefing}
Canonical solution (secret): ${scenario.solutionAnswer}
Keywords (relevant to truth): ${scenario.solutionKeywords.join(", ")}

Player's question: """${question}"""

Reply with a SHORT (max 2 sentences) hint that:
- never reveals the canonical solution outright
- nudges them toward the meaning of relevant keywords
- if the question is unrelated to the case, gently say "That is not relevant."
Reply with plain text only.`;
  const msg = await c.messages.create({
    model: await MODEL(),
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });
  return msg.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();
}

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text.trim();
}
