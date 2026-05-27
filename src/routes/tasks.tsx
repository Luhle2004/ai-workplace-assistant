import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — Workplace AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("this week");
  const [context, setContext] = useState("");
  const fn = useServerFn(planTasks);
  const mut = useMutation({
    mutationFn: () => fn({ data: { goal, timeframe, context } }),
    onError: (e: Error) => toast.error(e.message || "Failed to plan"),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-10">
      <PageHeader icon={ListChecks} title="AI Task Planner" description="Break goals into prioritized, scheduled tasks." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label>Goal *</Label>
            <Textarea placeholder="e.g. Launch Q3 marketing campaign" value={goal} onChange={(e) => setGoal(e.target.value)} className="min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Context (optional)</Label>
            <Textarea placeholder="Team size, constraints, dependencies..." value={context} onChange={(e) => setContext(e.target.value)} className="min-h-[80px]" />
          </div>
          <Button onClick={() => mut.mutate()} disabled={goal.trim().length < 3 || mut.isPending} className="w-full">
            <Wand2 className="h-4 w-4" /> {mut.isPending ? "Planning..." : "Generate Plan"}
          </Button>
        </div>
        <div className="space-y-4">
          <AiOutput text={mut.data?.text ?? ""} isLoading={mut.isPending} />
          {!mut.data && !mut.isPending && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
              Your task plan will appear here.
            </div>
          )}
        </div>
      </div>
      <AiDisclaimer />
    </div>
  );
}
