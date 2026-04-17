import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

interface ModelRequestBody {
  prompt: string;
  systemPrompt?: string;
  modelId: string;
  temperature?: number;
}

const DEFAULT_SYSTEM =
  "You are an assistant for an AI behavior lab. Keep responses concise.";

function getNumeric(value: unknown, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return num;
}

async function generateWithOpenRouter(body: ModelRequestBody) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY is missing. Add it to .env.local to use the weaker external model."
    );
  }

  const modelName = body.modelId.replace("openrouter:", "");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "AI Laboratory",
    },
    body: JSON.stringify({
      model: modelName,
      temperature: getNumeric(body.temperature, 0.9),
      messages: [
        { role: "system", content: body.systemPrompt ?? DEFAULT_SYSTEM },
        { role: "user", content: body.prompt },
      ],
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenRouter request failed.");
  }

  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return {
    text,
    meta: {
      model: modelName,
      provider: "openrouter",
    },
  };
}

async function generateWithGoogle(body: ModelRequestBody) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing.");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const modelName = body.modelId.replace("google:", "");
  const result = await generateText({
    model: google(modelName),
    system: body.systemPrompt ?? DEFAULT_SYSTEM,
    prompt: body.prompt,
    temperature: getNumeric(body.temperature, 0.7),
  });

  return {
    text: result.text,
    meta: {
      model: modelName,
      provider: "google",
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ModelRequestBody;
    if (!body.prompt || !body.modelId) {
      return Response.json(
        { error: "Missing prompt or modelId for model matchup." },
        { status: 400 }
      );
    }

    if (body.modelId.startsWith("openrouter:")) {
      const output = await generateWithOpenRouter(body);
      return Response.json(output);
    }

    if (body.modelId.startsWith("google:")) {
      const output = await generateWithGoogle(body);
      return Response.json(output);
    }

    return Response.json({ error: "Unsupported model provider." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: `Model matchup generation failed: ${message}` },
      { status: 500 }
    );
  }
}
