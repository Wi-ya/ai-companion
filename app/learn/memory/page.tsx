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
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold">Memory is request-scoped</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">The model has no memory.</span> None.
                Every time you send a message, the app packages up the entire
                conversation history and ships it to the model fresh. The model reads
                it all from scratch and replies. It is not "remembering" — it is
                re-reading.
              </p>
              <p>
                The <span className="font-medium text-foreground">context window</span> is
                the maximum amount of text the model can read in one go. If your
                conversation gets longer than that limit, older messages get dropped.
                The model simply never sees them — and acts as if they never happened.
              </p>
              <p>
                Imagine telling someone your name at the start of a conversation,
                then asking them your name again after they have forgotten the first
                few minutes. That is exactly what happens here. The transcript below
                has a user introducing themselves as Alex and mentioning a project.
                If the model only sees the last 1 message, it has no idea who Alex is
                or what the project was about.
              </p>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">Try this</p>
                <p>Set the left slider to <span className="font-mono">1</span> message and right to <span className="font-mono">6</span>. The right will answer correctly; the left will confess it has no idea who you are.</p>
              </div>
            </div>
          </div>
        }
        playground={<MemoryPlayground />}
      />
    </main>
  );
}
