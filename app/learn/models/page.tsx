import { LearnHeader } from "@/components/lab";

export default function ModelsLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Model Internals Lab"
        subtitle="Coming soon — a look at what actually happens inside a model."
      />

      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* big construction sign */}
        <div className="text-8xl mb-6 animate-bounce">🚧</div>

        <div className="mx-auto max-w-md space-y-4">
          <h2 className="text-2xl font-bold">
            Oops. Nothing to see here. Yet.
          </h2>
          <p className="text-muted-foreground text-sm">
            This lab is still under construction. The hard hat crew is working
            on it. They are mostly cats. Progress is slow.
          </p>

          {/* fake error terminal */}
          <div className="rounded-xl border border-border bg-card p-4 text-left font-mono text-xs text-muted-foreground space-y-1">
            <p><span className="text-green-400">$</span> load_model_lab.py</p>
            <p className="text-yellow-400">WARNING: lab not found</p>
            <p className="text-yellow-400">WARNING: still thinking about it</p>
            <p className="text-red-400">ERROR: too many cats on keyboard</p>
            <p><span className="text-green-400">$</span> <span className="animate-pulse">_</span></p>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            Check back later. Or don't. The cats will decide.
          </p>
        </div>
      </div>
    </main>
  );
}
