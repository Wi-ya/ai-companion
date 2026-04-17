import {
  convertToModelMessages,
  generateText,
  type ModelMessage,
  type UIMessage,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const DEFAULT_SYSTEM_PROMPT =
  "You are an AI writing assistant. Keep responses concise and plain.";

type NumericSettings = Partial<{
  temperature: number;
  topP: number;
  topK: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxOutputTokens: number;
}>;

function toFiniteNumber(value: unknown): number | undefined {
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  return num;
}

function parseSettings(raw: unknown): NumericSettings {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const settings: NumericSettings = {};
  for (const key of [
    "temperature",
    "topP",
    "topK",
    "frequencyPenalty",
    "presencePenalty",
    "maxOutputTokens",
  ] as const) {
    const value = toFiniteNumber(input[key]);
    if (value !== undefined) {
      settings[key] = value;
    }
  }
  return settings;
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to .env.local for the learning labs.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const systemPrompt =
      typeof body.systemPrompt === "string" ? body.systemPrompt : DEFAULT_SYSTEM_PROMPT;
    const settings = parseSettings(body.settings);
    const modelName =
      typeof body.model === "string" && body.model.trim().length > 0
        ? body.model
        : "gemini-2.5-flash";

    let messages: ModelMessage[] = [];
    if (Array.isArray(body.messages) && body.messages.length > 0) {
      messages = await convertToModelMessages(body.messages as UIMessage[]);
    } else if (prompt) {
      messages = [{ role: "user", content: [{ type: "text", text: prompt }] }];
    } else {
      return Response.json(
        { error: "Missing prompt or messages for lab request." },
        { status: 400 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const result = await generateText({
      model: google(modelName),
      system: systemPrompt,
      messages,
      ...settings,
    });

    return Response.json({
      text: result.text,
      meta: {
        model: modelName,
        provider: "google",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Lab generation failed: ${message}` }, { status: 500 });
  }
}
