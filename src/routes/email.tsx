import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email — Workplace AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "formal" | "concise" | "persuasive">(
    "professional",
  );
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");

  const fn = useServerFn(generateEmail);
  const mut = useMutation({
    mutationFn: () => fn({ data: { recipient, tone, purpose, keyPoints } }),
    onError: (e: Error) => toast.error(e.message || "Failed to generate"),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-10">
      <PageHeader icon={Mail} title="Smart Email Generator" description="Draft a polished email in seconds." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Input placeholder="e.g. Sarah, my manager" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Purpose *</Label>
            <Textarea placeholder="What's this email about?" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label>Key points (optional)</Label>
            <Textarea placeholder="Specific facts, dates, links to include" value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} className="min-h-[80px]" />
          </div>
          <Button onClick={() => mut.mutate()} disabled={!purpose.trim() || mut.isPending} className="w-full">
            <Wand2 className="h-4 w-4" /> {mut.isPending ? "Generating..." : "Generate Email"}
          </Button>
        </div>

        <div className="space-y-4">
          <AiOutput text={mut.data?.text ?? ""} isLoading={mut.isPending} />
          {!mut.data && !mut.isPending && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
              Your AI-generated email will appear here.
            </div>
          )}
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
