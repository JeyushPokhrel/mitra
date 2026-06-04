import { useEffect, useState } from "react";
import { ChatLauncher } from "./ChatLauncher";
import { ChatWindow } from "./ChatWindow";
import { useWidgetStore } from "@/store/widgetStore";
import { useChatStore } from "@/store/chatStore";

/**
 * Root entry point of the embeddable Chat Widget.
 * Renders client-only so persisted Zustand state and animations don't
 * cause SSR hydration mismatches.
 */
export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const setOpen = useWidgetStore((s) => s.setOpen);
  const setView = useWidgetStore((s) => s.setView);
  const incrementUnread = useWidgetStore((s) => s.incrementUnread);
  const open = useWidgetStore((s) => s.open);

  useEffect(() => setMounted(true), []);

  // Simulate a proactive incoming message after 12s if widget is closed.
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      if (!useWidgetStore.getState().open) {
        useChatStore.getState().receive({
          sender: "ai",
          kind: "text",
          body: "Saw you browsing our pricing — want me to compare plans for you? ✨",
          authorName: "Mira AI",
        });
        incrementUnread();
      }
    }, 12000);
    return () => clearTimeout(t);
  }, [mounted, incrementUnread]);

  // Expose simple imperative API for previews
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { MITRA?: object }).MITRA = {
      open: () => setOpen(true),
      close: () => setOpen(false),
      goto: (v: "home" | "chat" | "prechat") => setView(v),
    };
  }, [setOpen, setView]);

  if (!mounted) return null;

  return (
    <>
      <ChatLauncher />
      <ChatWindow />
      {/* Screen-reader live region for new messages */}
      <div className="sr-only" aria-live="polite">
        {open ? "Chat window opened" : ""}
      </div>
    </>
  );
}
