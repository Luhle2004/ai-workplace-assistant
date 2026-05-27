import { Info } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground ${className}`}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> Outputs are
        AI-generated and may contain errors or biases. Review, edit, and verify before sharing or
        acting on them. Do not include confidential or personal data you don't have permission to
        share.
      </p>
    </div>
  );
}
