import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({ meta: [{ title: "Meeting Notes — Workplace AI" }] }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const fn = useServerFn(summarizeMeeting);
  const mut = useMutation({
    mutationFn: () => fn({ data: { notes } }),
    onError: (e: Error) => toast.error(e.message || "Failed to summarize"),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-10">
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" description="Turn raw notes into a clean recap." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label>Paste your meeting notes or transcript</Label>
            <Textarea
              placeholder="Paste raw notes, bullet points, or a transcript..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[360px] font-mono text-sm"
            />
          </div>
          <Button onClick={() => mut.mutate()} disabled={notes.trim().length < 10 || mut.isPending} className="w-full">
            <Wand2 className="h-4 w-4" /> {mut.isPending ? "Summarizing..." : "Summarize"}
          </Button>
        </div>
        <div className="space-y-4">
          <AiOutput text={mut.data?.text ?? ""} isLoading={mut.isPending} />
          {!mut.data && !mut.isPending && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
              Your structured summary will appear here.
            </div>
          )}
        </div>
      </div>
      <AiDisclaimer />
    </div>
  );
}
