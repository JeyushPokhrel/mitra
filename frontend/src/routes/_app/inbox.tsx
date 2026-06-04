import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, User } from "lucide-react";
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ConversationHeader } from "@/components/inbox/ConversationHeader";
import { MessageThread } from "@/components/inbox/MessageThread";
import { MessageComposer } from "@/components/inbox/MessageComposer";
import { CustomerProfile } from "@/components/inbox/CustomerProfile";
import { AIAssistantPanel } from "@/components/inbox/AIAssistantPanel";
import { NotificationCenter } from "@/components/inbox/NotificationCenter";
import { useConversationStore, usePanelStore } from "@/store/inboxStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/inbox")({
  component: InboxPage,
});

function InboxPage() {
  const isMobile = useIsMobile();
  const { leftWidth, rightWidth } = usePanelStore();
  const [aiOpen, setAiOpen] = useState(true);

  if (isMobile) return <MobileInbox />;

  return (
    <div className="h-[calc(100vh-7rem)] -mx-4 -my-4 lg:-mx-6 lg:-my-6">
      <ResizablePanelGroup
        className="rounded-2xl border bg-background overflow-hidden shadow-[var(--shadow-soft)]"
      >
        <ResizablePanel defaultSize={leftWidth} minSize={18} maxSize={36} className="!overflow-visible">
          <ConversationList />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={100 - leftWidth - rightWidth} minSize={35}>
          <div className="flex h-full flex-col bg-background">
            <div className="flex items-center justify-between pr-3 bg-card border-b">
              <div className="flex-1 min-w-0">
                <ConversationHeader />
              </div>
            </div>
            <MessageThread />
            <MessageComposer />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={rightWidth} minSize={20} maxSize={36}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b bg-card">
              <p className="text-xs font-semibold">Customer & Copilot</p>
              <div className="flex items-center gap-1">
                <Button
                  size="sm" variant={aiOpen ? "default" : "outline"}
                  className="h-7 rounded-lg gap-1 text-[10px]"
                  onClick={() => setAiOpen((v) => !v)}
                >
                  <Sparkles className="h-3 w-3" /> AI
                </Button>
                <NotificationCenter />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence initial={false}>
                {aiOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <AIAssistantPanel />
                  </motion.div>
                )}
              </AnimatePresence>
              <CustomerProfile />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

/** Stacked mobile experience with bottom actions + floating reply */
function MobileInbox() {
  const { conversations, selectedId } = useConversationStore();
  const conv = conversations.find((c) => c.id === selectedId);
  const [view, setView] = useState<"list" | "thread">("list");

  return (
    <div className="h-[calc(100vh-7rem)] -mx-4 -my-4 flex flex-col bg-background rounded-2xl border overflow-hidden">
      {view === "list" ? (
        <ConversationList />
      ) : (
        <>
          <div className="flex items-center gap-2 px-2 py-1 border-b bg-card">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView("list")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <ConversationHeader />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><User className="h-4 w-4" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[90%] sm:max-w-sm">
                <CustomerProfile />
              </SheetContent>
            </Sheet>
          </div>
          <MessageThread />
          <MessageComposer />
        </>
      )}

      {view === "list" && (
        <div className="border-t bg-card grid grid-cols-4 gap-1 p-2">
          {[
            { label: "Open" }, { label: "VIP" }, { label: "Mine" }, { label: "All" },
          ].map((b) => (
            <button key={b.label} className="text-[11px] py-1.5 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors">
              {b.label}
            </button>
          ))}
        </div>
      )}

      {selectedId && view === "list" && conv && (
        <button
          onClick={() => setView("thread")}
          className={cn(
            "absolute bottom-20 right-4 h-12 px-4 rounded-full bg-primary text-primary-foreground",
            "shadow-[var(--shadow-glow)] flex items-center gap-2 text-sm font-semibold"
          )}
        >
          <Sparkles className="h-4 w-4" />
          Open conversation
        </button>
      )}
    </div>
  );
}
