"use client";

import { useMemo, useState } from "react";
import type { PromptOption } from "@/lib/learn";

interface ControlDefinition {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  leftDefault: number;
  rightDefault: number;
}

interface ABPlaygroundProps {
  title: string;
  description: string;
  promptOptions: PromptOption[];
  controls: ControlDefinition[];
  systemPrompt?: string;
}

interface LabResult {
  text: string;
  meta: {
    model: string;
    provider: string;
  };
}

type ValueMap = Record<string, number>;

const DEFAULT_SYSTEM_PROMPT =
  "You are an AI writing assistant. Be clear and concise.";

function buildDefaults(
  controls: ControlDefinition[],
  side: "left" | "right"
): ValueMap {
  return controls.reduce<ValueMap>((acc, control) => {
    acc[control.key] = side === "left" ? control.leftDefault : control.rightDefault;
    return acc;
  }, {});
}

export function ABPlayground({
  title,
  description,
  promptOptions,
  controls,
  systemPrompt = DEFAULT_SYSTEM_PROMPT,
}: ABPlaygroundProps) {
  const [promptId, setPromptId] = useState(promptOptions[0]?.id ?? "");
  const [leftValues, setLeftValues] = useState(() => buildDefaults(controls, "left"));
  const [rightValues, setRightValues] = useState(() => buildDefaults(controls, "right"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftResult, setLeftResult] = useState<LabResult | null>(null);
  const [rightResult, setRightResult] = useState<LabResult | null>(null);

  const selectedPrompt = useMemo(
    () => promptOptions.find((prompt) => prompt.id === promptId) ?? promptOptions[0],
    [promptId, promptOptions]
  );

  const runComparison = async () => {
    if (!selectedPrompt) return;
    setLoading(true);
    setError(null);
    setLeftResult(null);
    setRightResult(null);

    const payload = (values: ValueMap) => ({
      prompt: selectedPrompt.prompt,
      systemPrompt,
      settings: values,
    });

    try {
      const [leftRes, rightRes] = await Promise.all([
        fetch("/api/lab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(leftValues)),
        }),
        fetch("/api/lab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(rightValues)),
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

  const updateValue = (
    side: "left" | "right",
    key: string,
    rawValue: string,
    min: number,
    max: number
  ) => {
    const parsed = Number(rawValue);
    const next = Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : min;
    if (side === "left") {
      setLeftValues((prev) => ({ ...prev, [key]: next }));
      return;
    }
    setRightValues((prev) => ({ ...prev, [key]: next }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {promptOptions.map((option) => {
            const isActive = option.id === promptId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPromptId(option.id)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {selectedPrompt && (
          <p className="mt-3 rounded-md bg-muted p-3 text-sm text-foreground">
            <span className="font-medium">Prompt:</span> {selectedPrompt.prompt}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(["left", "right"] as const).map((side) => {
          const values = side === "left" ? leftValues : rightValues;
          const result = side === "left" ? leftResult : rightResult;
          return (
            <div key={side} className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {side === "left" ? "Left Variant" : "Right Variant"}
              </h3>
              <div className="mt-3 space-y-3">
                {controls.map((control) => (
                  <label key={control.key} className="block text-sm">
                    <div className="mb-1 flex items-center justify-between">
                      <span>{control.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {(values[control.key] ?? 0).toFixed(control.step < 1 ? 2 : 0)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={values[control.key] ?? control.min}
                      onChange={(event) =>
                        updateValue(
                          side,
                          control.key,
                          event.target.value,
                          control.min,
                          control.max
                        )
                      }
                      className="w-full"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
                {result ? (
                  <>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {result.meta.model} via {result.meta.provider}
                    </p>
                    <p className="whitespace-pre-wrap">{result.text}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Output appears here after running the side-by-side comparison.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={runComparison}
          disabled={loading || !selectedPrompt}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating both sides..." : "Generate side-by-side"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
