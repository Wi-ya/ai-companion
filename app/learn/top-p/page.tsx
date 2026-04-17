import { ABPlayground, LearnHeader, TheoryPlaygroundTabs } from "@/components/lab";

const promptOptions = [
  {
    id: "quantum",
    label: "Quantum Physics",
    prompt:
      "Explain quantum entanglement to a curious high school student with an analogy.",
  },
  {
    id: "economics",
    label: "Economics",
    prompt:
      "Explain inflation, interest rates, and unemployment in one clear paragraph.",
  },
];

export default function TopPLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Top-P / Top-K Lab"
        subtitle="Constrain vocabulary candidates and observe fluency changes."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Vocabulary restriction controls</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                Top-P (nucleus sampling) keeps only the smallest set of words whose
                probabilities sum to P.
              </p>
              <p>
                Top-K caps the candidate list to K highest-probability words. Low
                values can force repetitive, generic language.
              </p>
              <p>
                In this lab, both sides run the exact same prompt while only
                Top-P/Top-K differ.
              </p>
            </div>
          </div>
        }
        playground={
          <ABPlayground
            title="A/B Top-P and Top-K Playground"
            description="Generate both sides together to compare constrained vs. flexible wording."
            promptOptions={promptOptions}
            controls={[
              {
                key: "topP",
                label: "Top-P",
                min: 0.1,
                max: 1,
                step: 0.05,
                leftDefault: 0.2,
                rightDefault: 0.95,
              },
              {
                key: "topK",
                label: "Top-K",
                min: 1,
                max: 50,
                step: 1,
                leftDefault: 5,
                rightDefault: 40,
              },
            ]}
          />
        }
      />
    </main>
  );
}
