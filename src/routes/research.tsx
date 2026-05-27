import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { researchTopic } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research — Workplace AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"brief" | "standard" | "deep">("standard");
  const fn = useServerFn(researchTopic);
  const mut = useMutation({
    mutationFn: () => fn({ data: { topic, depth } }),
    onError: (e: Error) => toast.error(e.message || "Failed to research"),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-10">
      <PageHeader icon={Search} title="AI Research Assistant" description="Get a structured briefing on any topic." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label>Topic *</Label>
            <Input placeholder="e.g. Best practices for async standups" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief overview</SelectItem>
                <SelectItem value="standard">Standard briefing</SelectItem>
                <SelectItem value="deep">Deep dive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => mut.mutate()} disabled={topic.trim().length < 3 || mut.isPending} className="w-full">
            <Wand2 className="h-4 w-4" /> {mut.isPending ? "Researching..." : "Research Topic"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Note: AI may produce inaccurate or outdated information. Verify important facts independently.
          </p>
        </div>
        <div className="space-y-4">
          <AiOutput text={mut.data?.text ?? ""} isLoading={mut.isPending} />
          {!mut.data && !mut.isPending && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
              Your research briefing will appear here.
            </div>
          )}
        </div>
      </div>
      <AiDisclaimer />
    </div>
  );
}
