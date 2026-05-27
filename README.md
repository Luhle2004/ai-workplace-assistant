# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application that helps professionals automate everyday workplace tasks with AI — drafting emails, summarizing meetings, planning work, researching topics, and chatting with an AI assistant.

![Powered by Lovable AI](https://img.shields.io/badge/Powered%20by-Lovable%20AI-6366f1)
![TanStack Start](https://img.shields.io/badge/TanStack-Start-ff4154)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 📊 **Dashboard** | Clean landing view with quick access to every tool |
| ✉️ **Smart Email Generator** | Draft emails by recipient, purpose, tone (professional, friendly, formal, concise, persuasive) and key points |
| 📝 **Meeting Notes Summarizer** | Turns raw notes into TL;DR, Key Decisions, Action Items, and Open Questions |
| ✅ **AI Task Planner** | Converts a goal + timeframe into a prioritized, scheduled task plan |
| 🔎 **AI Research Assistant** | Brief / Standard / Deep structured research briefings |
| 💬 **AI Chatbot** | Streaming, thread-based chat with local history persistence |

Every AI output supports:
- ✏️ **Inline editing** (Textarea edit mode)
- 📋 **One-click copy**
- 🧾 **Markdown rendering** (via `react-markdown` + `@tailwindcss/typography`)
- ⚠️ **Responsible AI disclaimer** — outputs may be inaccurate, always review before use

---

## 🧱 Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) v1 (React 19, SSR-capable)
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style) + OKLCH design tokens
- **AI SDK:** `ai` + `@ai-sdk/react` + `@ai-sdk/openai-compatible`
- **Model:** `google/gemini-3-flash-preview` via the Lovable AI Gateway
- **State / data:** TanStack Query, TanStack Router
- **Icons:** Lucide
- **Notifications:** Sonner

---

## 📁 Project Structure

```
src/
├── routes/                       # File-based routing
│   ├── __root.tsx                # App shell: sidebar + header + outlet
│   ├── index.tsx                 # Dashboard
│   ├── email.tsx                 # Smart Email Generator
│   ├── meeting-notes.tsx         # Meeting Notes Summarizer
│   ├── tasks.tsx                 # AI Task Planner
│   ├── research.tsx              # AI Research Assistant
│   ├── chat.tsx                  # AI Chatbot (streaming)
│   └── api/chat.ts               # Streaming chat server route
├── components/
│   ├── AppSidebar.tsx            # Collapsible sidebar navigation
│   ├── PageHeader.tsx            # Reusable page header
│   ├── AiOutput.tsx              # Markdown viewer + edit + copy
│   ├── AiDisclaimer.tsx          # Responsible AI notice
│   ├── ai-elements/              # Chat primitives (conversation, message, input…)
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── ai-gateway.server.ts      # Lovable AI Gateway provider
│   ├── ai.functions.ts           # Server functions: email, meeting, tasks, research
│   └── utils.ts
└── styles.css                    # Tailwind v4 tokens (OKLCH theme)
```

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node 20+
- A `LOVABLE_API_KEY` (auto-provided in Lovable; for local dev set it in your environment)

### Install & run

```bash
bun install
bun run dev
```

The app starts on `http://localhost:5173` (or the port Vite picks).

### Build

```bash
bun run build
```

---

## 🔐 Environment Variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `LOVABLE_API_KEY` | server only (`process.env`) | Auth for the Lovable AI Gateway |

> Never expose `LOVABLE_API_KEY` to the client. It is read inside server function handlers only.

---

## 🧠 How the AI Layer Works

All AI calls go through **server functions** (`src/lib/ai.functions.ts`) built with `createServerFn`. Each function:

1. Validates input with **Zod**
2. Builds a **structured prompt** (system message + parameterized user prompt)
3. Calls `generateText` (or `streamText` for chat) via the Lovable AI Gateway
4. Returns markdown the UI renders and lets the user edit

The chat endpoint (`src/routes/api/chat.ts`) uses `streamText` + `toUIMessageStreamResponse` for token-by-token streaming via the `useChat` hook.

---

## 🎨 Design System

- **Theme:** Cloud White SaaS aesthetic — crisp neutrals with indigo primary
- **Tokens:** Defined in `src/styles.css` using `oklch()` (`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, …)
- **Components:** All semantic — no hard-coded colors in components
- **Responsive:** Sidebar collapses to icons; layouts adapt down to mobile
- **Dark mode:** Token-ready (extendable via `.dark` overrides in `styles.css`)

---

## ⚖️ Responsible AI

The app surfaces a disclaimer (`AiDisclaimer.tsx`) on every AI-powered page and in the sidebar footer:

> *AI outputs may be inaccurate. Always review before use.*

Guidelines baked into the experience:
- Outputs are **editable** before being copied or sent
- Research outputs **flag uncertainty** explicitly
- No autonomous actions are taken on the user's behalf

---

## 🗺️ Routes

| Path | Page |
| --- | --- |
| `/` | Dashboard |
| `/email` | Smart Email Generator |
| `/meeting-notes` | Meeting Notes Summarizer |
| `/tasks` | AI Task Planner |
| `/research` | AI Research Assistant |
| `/chat` | AI Chatbot |
| `/api/chat` | Streaming chat endpoint (POST) |

---

## 📦 Deployment

This project is built for edge runtimes (e.g. Cloudflare Workers) via TanStack Start. Deploy directly from Lovable with **Publish**, or build and host the output yourself.

**Live:**
- Preview: https://id-preview--31e947e2-02b2-46e7-be5d-0b8c3a499659.lovable.app
- Published: https://luhle-ai-productivityassistant.lovable.app

---

## 📄 License

MIT — use freely for personal or commercial projects.
