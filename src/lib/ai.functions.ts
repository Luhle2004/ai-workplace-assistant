import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { getModel } from "./ai-gateway.server";

async function run(system: string, prompt: string) {
  const { text } = await generateText({
    model: getModel(),
    system,
    prompt,
  });
  return { text };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      recipient: z.string().max(200),
      purpose: z.string().min(1).max(2000),
      tone: z.enum(["professional", "friendly", "formal", "concise", "persuasive"]),
      keyPoints: z.string().max(2000).optional().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const prompt = `Write an email with the following parameters:
- Recipient: ${data.recipient || "the recipient"}
- Tone: ${data.tone}
- Purpose: ${data.purpose}
${data.keyPoints ? `- Key points to include: ${data.keyPoints}` : ""}

Output the email with a Subject line and body. Use markdown.`;
    return run(
      "You are an expert email writer for professional workplace communication.",
      prompt,
    );
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      notes: z.string().min(10).max(20000),
    }),
  )
  .handler(async ({ data }) => {
    const prompt = `Summarize the following meeting notes into:
## TL;DR
(2-3 sentences)

## Key Decisions
- bullet list

## Action Items
- [ ] item — owner — due date

## Open Questions
- bullet list

Meeting notes:
${data.notes}`;
    return run(
      "You are an expert at distilling meetings into actionable summaries.",
      prompt,
    );
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      goal: z.string().min(3).max(2000),
      timeframe: z.string().max(200).optional().default("this week"),
      context: z.string().max(2000).optional().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const prompt = `Create a structured task plan to achieve this goal: "${data.goal}"
Timeframe: ${data.timeframe}
${data.context ? `Context: ${data.context}` : ""}

Output as markdown with:
## Plan Overview
## Prioritized Tasks
A numbered list. Each task: **Title** — priority (High/Med/Low), estimated time, dependencies.
## Suggested Schedule
A day-by-day breakdown.`;
    return run("You are an expert productivity coach and project planner.", prompt);
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(3).max(500),
      depth: z.enum(["brief", "standard", "deep"]).default("standard"),
    }),
  )
  .handler(async ({ data }) => {
    const prompt = `Research this topic: "${data.topic}"
Depth: ${data.depth}

Provide a structured briefing with:
## Executive Summary
## Key Concepts
## Important Considerations
## Recommended Next Steps
## Further Reading (suggested search queries)

Use markdown. Be factual; flag uncertainty explicitly.`;
    return run(
      "You are a thorough research analyst. Cite when possible; otherwise flag claims that need verification.",
      prompt,
    );
  });
