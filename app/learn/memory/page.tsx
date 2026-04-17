import {
  LearnHeader,
  MemoryPlayground,
  TheoryPlaygroundTabs,
} from "@/components/lab";

export default function MemoryLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Context Window Lab"
        subtitle="Demonstrate that AI memory depends on what text is passed in each request."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Memory is request-scoped</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                The model has no persistent memory by itself. It only reads the
                messages included in the current API call.
              </p>
              <p>
                Reducing the context window removes prior facts, so recall and
                persona consistency degrade immediately.
              </p>
              <p>
                This lab replays a fixed transcript and changes only how many past
                messages each side can see.
              </p>
            </div>
          </div>
        }
        playground={<MemoryPlayground />}
      />
    </main>
  );
}
