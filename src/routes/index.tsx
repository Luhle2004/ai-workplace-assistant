import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails in seconds with the right tone." },
  { to: "/meeting-notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into TL;DRs, decisions, and action items." },
  { to: "/tasks", icon: ListChecks, title: "AI Task Planner", desc: "Break down goals into prioritized, scheduled tasks." },
  { to: "/research", icon: Search, title: "AI Research Assistant", desc: "Get structured briefings on any topic." },
  { to: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Open-ended conversation for anything else." },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          AI Workplace Productivity Suite
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Get more done, with a little help from AI.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Automate the busywork — emails, meeting recaps, planning, research, and quick answers — so
          you can focus on the work that matters.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <AiDisclaimer />
    </div>
  );
}
