import { ABPlayground, LearnHeader, TheoryPlaygroundTabs } from "@/components/lab";

const promptOptions = [
  {
    id: "tavern",
    label: "Fantasy Tavern",
    prompt:
      "Write a vivid description of a fantasy tavern at midnight in 120 words.",
  },
  {
    id: "elevator",
    label: "Startup Pitch",
    prompt:
      "Write an elevator pitch for an app that helps students avoid procrastination.",
  },
];

export default function TemperatureLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Temperature Lab"
        subtitle="See how randomness changes output style and confidence."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Creativity vs. predictability</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                Temperature controls randomness in token selection. Lower values
                force safer and more likely next words.
              </p>
              <p>
                High values increase variety, which can feel creative but also
                unstable. This is one of the strongest drivers of perceived
                personality.
              </p>
              <p>
                Keep the prompt fixed and vary only temperature to isolate the
                effect in side-by-side results.
              </p>
            </div>
          </div>
        }
        playground={
          <ABPlayground
            title="A/B Temperature Playground"
            description="Two simultaneous generations, same prompt, different temperature."
            promptOptions={promptOptions}
            controls={[
              {
                key: "temperature",
                label: "Temperature",
                min: 0,
                max: 2,
                step: 0.1,
                leftDefault: 0.1,
                rightDefault: 1.5,
              },
            ]}
          />
        }
      />
    </main>
  );
}
