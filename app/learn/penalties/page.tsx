import { ABPlayground, LearnHeader, TheoryPlaygroundTabs } from "@/components/lab";

const promptOptions = [
  {
    id: "story",
    label: "Travel Story",
    prompt:
      "Write a short travel story about getting lost in a city and finding your way.",
  },
  {
    id: "brainstorm",
    label: "Brainstorm Session",
    prompt:
      "Brainstorm ideas for a school event theme and explain each in one sentence.",
  },
];

export default function PenaltiesLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Frequency & Presence Penalties Lab"
        subtitle="Push the model away from repetition and topics to expose token-level nudges."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Point deductions for tokens</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                Frequency penalty discourages repeating the same words by reducing
                their future probability each time they appear.
              </p>
              <p>
                Presence penalty discourages returning to already-used topics even if
                the exact words differ.
              </p>
              <p>
                High penalties can produce odd synonym hopping or sudden topic
                shifts, showing behavior is math-constrained rather than understood.
              </p>
            </div>
          </div>
        }
        playground={
          <ABPlayground
            title="A/B Penalty Playground"
            description="Compare low-penalty coherence against high-penalty drift."
            promptOptions={promptOptions}
            controls={[
              {
                key: "frequencyPenalty",
                label: "Frequency Penalty",
                min: 0,
                max: 2,
                step: 0.1,
                leftDefault: 0,
                rightDefault: 1.3,
              },
              {
                key: "presencePenalty",
                label: "Presence Penalty",
                min: 0,
                max: 2,
                step: 0.1,
                leftDefault: 0,
                rightDefault: 1.5,
              },
            ]}
          />
        }
      />
    </main>
  );
}
