import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or return to the dashboard.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Workplace AI — Productivity Assistant" },
      {
        name: "description",
        content:
          "AI-powered workplace productivity suite: smart emails, meeting summaries, task planning, research, and chat.",
      },
      { property: "og:title", content: "Workplace AI — Productivity Assistant" },
      { name: "twitter:title", content: "Workplace AI — Productivity Assistant" },
      { name: "description", content: "AI Workplace Productivity Assistant automates professional tasks with AI-powered tools." },
      { property: "og:description", content: "AI Workplace Productivity Assistant automates professional tasks with AI-powered tools." },
      { name: "twitter:description", content: "AI Workplace Productivity Assistant automates professional tasks with AI-powered tools." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dd7f2a2a-e76a-4c43-a343-85cc27b8be15/id-preview-157e9f6d--31e947e2-02b2-46e7-be5d-0b8c3a499659.lovable.app-1779869899723.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dd7f2a2a-e76a-4c43-a343-85cc27b8be15/id-preview-157e9f6d--31e947e2-02b2-46e7-be5d-0b8c3a499659.lovable.app-1779869899723.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
              <SidebarTrigger />
              <div className="ml-auto text-xs text-muted-foreground">
                Powered by Lovable AI
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
