"use client";

import { useMemo, useState } from "react";
import type { PromptOption } from "@/lib/learn";

interface LabResult {
  text: string;
  meta: {
    model: string;
    provider: string;
  };
}

interface ModelOption {
  id: string;
  label: string;
  note: string;
}

const models: ModelOption[] = [
  {
    id: "google:gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    note: "Primary stronger model (Google AI Studio)",
  },
  {
    id: "google:gemini-2.0-flash-lite",
    label: "Gemini 2.0 Flash-Lite",
    note: "Smaller baseline in same provider",
  },
  {
    id: "openrouter:meta-llama/llama-3.2-3b-instruct:free",
    label: "Llama 3.2 3B (OpenRouter)",
    note: "External weaker model via a different API",
  },
  {
    id: "openrouter:microsoft/phi-3-mini-128k-instruct:free",
    label: "Phi-3 Mini (OpenRouter)",
    note: "Microsoft's small model via OpenRouter",
  },
  {
    id: "openrouter:google/gemma-3-1b-it:free",
    label: "Gemma 3 1B (OpenRouter)",
    note: "Google's smallest model via OpenRouter",
  },
];

const prompts: PromptOption[] = [
  {
    id: "argument",
    label: "Structured Argument",
    prompt:
      "Write a 4-step argument for why students should learn media literacy in the AI era.",
  },
  {
    id: "code-review",
    label: "Code Review Reasoning",
    prompt:
      "Given a function that is slow on large arrays, explain two likely causes and one fix for each cause.",
  },
];

export function ModelMatchupPlayground() {
  const [promptId, setPromptId] = useState(prompts[0].id);
  const [leftModelId, setLeftModelId] = useState(models[0].id);
  const [rightModelId, setRightModelId] = useState(models[2].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftResult, setLeftResult] = useState<LabResult | null>(null);
  const [rightResult, setRightResult] = useState<LabResult | null>(null);

  const selectedPrompt = useMemo(
    () => prompts.find((prompt) => prompt.id === promptId) ?? prompts[0],
    [promptId]
  );

  const runComparison = async () => {
    setLoading(true);
    setError(null);
    setLeftResult(null);
    setRightResult(null);

    const payload = (modelId: string) => ({
      modelId,
      prompt: selectedPrompt.prompt,
      systemPrompt:
        "You are part of a model comparison lab. Be concise and format with short paragraphs.",
      temperature: 0.7,
    });

    try {
      const [leftRes, rightRes] = await Promise.all([
        fetch("/api/model-matchup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(leftModelId)),
        }),
        fetch("/api/model-matchup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(rightModelId)),
        }),
      ]);

      const [leftJson, rightJson] = await Promise.all([
        leftRes.json() as Promise<LabResult & { error?: string }>,
        rightRes.json() as Promise<LabResult & { error?: string }>,
      ]);

      if (!leftRes.ok || !rightRes.ok) {
        throw new Error(leftJson.error ?? rightJson.error ?? "Request failed");
      }

      setLeftResult(leftJson);
      setRightResult(rightJson);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Model size showdown</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Same prompt, two models, simultaneous generation. This includes a weaker
          model from a different API provider.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => {
            const isActive = prompt.id === promptId;
            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => setPromptId(prompt.id)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {prompt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {([
          {
            side: "left",
            modelId: leftModelId,
            setModelId: setLeftModelId,
            result: leftResult,
          },
          {
            side: "right",
            modelId: rightModelId,
            setModelId: setRightModelId,
            result: rightResult,
          },
        ] as const).map((column) => (
          <div key={column.side} className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {column.side === "left" ? "Left Model" : "Right Model"}
            </h3>
            <select
              value={column.modelId}
              onChange={(event) => column.setModelId(event.target.value)}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              {models.find((model) => model.id === column.modelId)?.note}
            </p>

            <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
              {column.result ? (
                <>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {column.result.meta.model} via {column.result.meta.provider}
                  </p>
                  <p className="whitespace-pre-wrap">{column.result.text}</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Output appears here after running the comparison.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
        If the OpenRouter model is selected, set `OPENROUTER_API_KEY` in
        `.env.local`. Google models use `GOOGLE_GENERATIVE_AI_API_KEY`.
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={runComparison}
          disabled={loading}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating both sides..." : "Run model showdown"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
