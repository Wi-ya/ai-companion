import {
  LearnHeader,
  ModelMatchupPlayground,
  TheoryPlaygroundTabs,
} from "@/components/lab";

export default function ModelsLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Model Size Lab"
        subtitle="Run the same prompt on stronger and weaker models side-by-side."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">David vs. Goliath models</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                Larger models usually sustain better formatting, coherence, and
                nuance because they capture richer patterns.
              </p>
              <p>
                Smaller models can still be useful but often sound more literal and
                less robust on multi-step prompts.
              </p>
              <p>
                This lab includes an external weaker model through a separate API so
                the difference is visible in one interface.
              </p>
            </div>
          </div>
        }
        playground={<ModelMatchupPlayground />}
      />
    </main>
  );
}
