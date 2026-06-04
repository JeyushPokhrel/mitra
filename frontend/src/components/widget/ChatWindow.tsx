import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWidgetStore } from "@/store/widgetStore";
import { useChatStore } from "@/store/chatStore";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { MessageInput } from "./MessageInput";
import { PreChatForm } from "./PreChatForm";
import { OfflineForm } from "./OfflineForm";
import { Sparkles, MessageSquarePlus, BookOpen, ArrowRight, UserPlus } from "lucide-react";

const SIZE_CLASS = {
  compact: "w-[340px] h-[480px]",
  regular: "w-[380px] h-[560px]",
  large: "w-[420px] h-[640px]",
};

export function ChatWindow() {
  const { open, position, minimized, view, setView, mode, size, hasIdentity, greeting } =
    useWidgetStore();

  const messages = useChatStore((s) => s.messages);

  // Page tracking → push to visitor store (optional)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Could call useVisitorStore.getState().pushActivity(...) here in a real integration.
  }, [view]);

  const shouldRender = open && !minimized;

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed z-[55] bottom-24",
            position === "right" ? "right-5" : "left-5",
            "max-w-[calc(100vw-2.5rem)]",
            "sm:" + SIZE_CLASS[size],
            // mobile fullscreen
            "w-[calc(100vw-2.5rem)] h-[calc(100vh-8rem)] sm:h-auto",
          )}
        >
          <div className={cn("flex flex-col h-full rounded-2xl bg-card shadow-[var(--shadow-elevated)] border border-border/60 overflow-hidden", SIZE_CLASS[size].split(" ").join(" sm:"))}>
            <ChatHeader />

            <div className="flex-1 flex flex-col min-h-0 bg-background">
              {view === "home" && (
                <HomeView greeting={greeting} onStart={() => setView(hasIdentity ? "chat" : "prechat")} />
              )}
              {view === "prechat" && <PreChatForm />}
              {view === "chat" && mode === "offline" && <OfflineForm createTicket />}
              {view === "chat" && mode !== "offline" && (
                <>
                  <ChatMessageList />
                  <MessageInput />
                </>
              )}
            </div>

            {view === "home" && (
              <div className="border-t bg-card px-3 py-2 flex items-center justify-around text-[11px] text-muted-foreground">
                <span>{messages.length} messages this session</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HomeView({ greeting, onStart }: { greeting: string; onStart: () => void }) {
  const setView = useWidgetStore((s) => s.setView);
  const setMode = useWidgetStore((s) => s.setMode);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{greeting}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ask anything — our AI replies in seconds and a human is one click away.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full text-left rounded-2xl border border-border/60 bg-card hover:bg-accent/40 p-3 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <MessageSquarePlus className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Start a new conversation</p>
              <p className="text-[11px] text-muted-foreground">Avg. reply &lt; 30s</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>

      <button
        onClick={() => {
          setMode("ai");
          setView("chat");
        }}
        className="w-full text-left rounded-2xl border border-border/60 bg-card hover:bg-accent/40 p-3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Ask the AI assistant</p>
            <p className="text-[11px] text-muted-foreground">Instant answers from our knowledge base</p>
          </div>
        </div>
      </button>

      <div className="rounded-2xl border border-border/60 bg-card p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
          <BookOpen className="h-3 w-3" />
          Popular help
        </p>
        <ul className="space-y-1.5">
          {["How do I integrate MITRA with Slack?", "Pricing and plan comparison", "Reset my password"].map((q) => (
            <li key={q}>
              <button
                onClick={() => {
                  setMode("ai");
                  setView("chat");
                  setTimeout(() => useChatStore.getState().send(q), 100);
                }}
                className="text-xs text-left w-full hover:text-primary"
              >
                → {q}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setView("prechat")}
        className="w-full flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
      >
        <UserPlus className="h-3 w-3" />
        Identify yourself for faster help
      </button>
    </div>
  );
}
