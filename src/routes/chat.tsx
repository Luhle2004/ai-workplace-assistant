import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — Workplace AI" }] }),
  component: ChatPage,
});

type Thread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };

const STORAGE_KEY = "workplace-ai-threads";

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Thread[];
  } catch {
    return [];
  }
}
function saveThreads(threads: Thread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}
function newThread(): Thread {
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>(() => {
    const existing = loadThreads();
    if (existing.length > 0) return existing;
    const initial = [newThread()];
    saveThreads(initial);
    return initial;
  });
  const [activeId, setActiveId] = useState<string>(() => {
    const existing = loadThreads();
    return existing[0]?.id ?? threads[0].id;
  });

  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  const handleCreate = () => {
    const t = newThread();
    setThreads((prev) => [t, ...prev]);
    setActiveId(t.id);
  };

  const handleDelete = (id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const t = newThread();
        setActiveId(t.id);
        return [t];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const updateActiveMessages = (msgs: UIMessage[]) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: msgs,
              updatedAt: Date.now(),
              title:
                t.title === "New conversation" && msgs.length > 0
                  ? deriveTitle(msgs[0])
                  : t.title,
            }
          : t,
      ),
    );
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Threads sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar/50 md:flex">
        <div className="p-3">
          <Button onClick={handleCreate} className="w-full" size="sm">
            <Plus className="h-4 w-4" /> New chat
          </Button>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2">
          {threads.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group mb-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent",
                t.id === activeId && "bg-sidebar-accent",
              )}
            >
              <button
                onClick={() => setActiveId(t.id)}
                className="flex flex-1 items-center gap-2 truncate text-left"
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{t.title}</span>
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="rounded p-1 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat window */}
      <div className="flex flex-1 flex-col min-w-0">
        <ChatWindow
          key={active.id}
          threadId={active.id}
          initialMessages={active.messages}
          onMessagesChange={updateActiveMessages}
        />
      </div>
    </div>
  );
}

function deriveTitle(msg: UIMessage): string {
  const text = msg.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  return text.slice(0, 40) || "New conversation";
}

function ChatWindow({
  threadId,
  initialMessages,
  onMessagesChange,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  onMessagesChange: (m: UIMessage[]) => void;
}) {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => console.error(e),
  });

  // Persist when stream completes or messages settle
  useEffect(() => {
    if (status === "ready" || status === "error") {
      onMessagesChange(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status, threadId]);

  const handleSubmit = async (msg: PromptInputMessage) => {
    const text = msg.text.trim();
    if (!text) return;
    await sendMessage({ text });
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="h-8 w-8 text-primary" />}
              title="How can I help today?"
              description="Ask anything — drafting, brainstorming, summarizing, or quick answers."
            />
          ) : (
            messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (m.role === "user") {
                return (
                  <Message key={m.id} from="user">
                    <MessageContent>{text}</MessageContent>
                  </Message>
                );
              }
              return (
                <Message key={m.id} from="assistant">
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                </Message>
              );
            })
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <Shimmer>Thinking...</Shimmer>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto max-w-3xl space-y-2">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea placeholder="Message Workplace AI..." autoFocus />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
          <AiDisclaimer />
        </div>
      </div>
    </>
  );
}
