import { ABPlayground, LearnHeader, TheoryPlaygroundTabs } from "@/components/lab";

const promptOptions = [
  {
    id: "love",
    label: "Write About Love",
    prompt:
      "Write a short paragraph about what love means to you.",
  },
  {
    id: "city",
    label: "Describe a City",
    prompt:
      "Describe what it feels like to walk through a busy city at night.",
  },
  {
    id: "success",
    label: "Define Success",
    prompt:
      "Write a motivational paragraph about what it means to be successful.",
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
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold">Point deductions for tokens</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                After picking a word, the model secretly adjusts future word
                probabilities based on what it has already said. Penalties are how
                you make it penalise itself for being repetitive.
              </p>
              <p>
                <span className="font-medium text-foreground">Frequency penalty</span> — every
                time a word appears in the output, its future probability gets nudged
                down. So the more you use a word, the less likely you are to use it
                again. With no penalty, ask the model about love and you might get:
                <span className="italic"> "Love is love. Love connects us. Love is what love does."</span>
                — same word, endlessly.
              </p>
              <p>
                <span className="font-medium text-foreground">Presence penalty</span> — any
                word that has appeared at all gets a one-time penalty, discouraging
                the model from returning to topics it already touched on — even with
                different words. High presence penalty can cause sudden topic jumps mid-paragraph.
              </p>
              <p>
                Crank both penalties to maximum and you'll see the model start
                synonym-hopping desperately: <span className="italic">"Affection is a bond. Tenderness connects souls. Devotion binds individuals."</span> — it is avoiding "love" entirely because it already appeared. The math is driving the language, not meaning.
              </p>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">Try this</p>
                <p>Use "Write About Love". Set left penalties to <span className="font-mono">0</span> and right to frequency <span className="font-mono">1.5</span> + presence <span className="font-mono">1.5</span>. Watch the right side avoid the word "love" like it owes it money.</p>
              </div>
            </div>
          </div>
        }
        playground={
          <ABPlayground
            title="A/B Penalty Playground"
            description="Compare low-penalty coherence against high-penalty drift. Try a repetitive topic for the clearest effect."
            promptOptions={promptOptions}
            controls={[
              {
                key: "frequencyPenalty",
                label: "Frequency Penalty",
                min: 0,
                max: 2,
                step: 0.1,
                leftDefault: 0,
                rightDefault: 1.5,
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
