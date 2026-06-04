import { useEffect } from "react";
import { useConversationStore } from "@/store/inboxStore";

/**
 * Keyboard shortcuts for the MITRA Inbox.
 * R  = reply / focus composer       A  = assign
 * E  = archive / resolve            /  = focus search
 * N  = internal note                P  = open customer profile
 * J/K or ↓/↑ = next / previous conversation
 */
export function useInboxShortcuts(handlers: {
  focusComposer?: () => void;
  focusSearch?: () => void;
  openProfile?: () => void;
  toggleResolve?: () => void;
  openAssign?: () => void;
  openNote?: () => void;
}) {
  const { conversations, selectedId, setSelected } = useConversationStore();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && /INPUT|TEXTAREA/.test(target.tagName)) return;
      const idx = conversations.findIndex((c) => c.id === selectedId);

      switch (e.key) {
        case "r": handlers.focusComposer?.(); break;
        case "/": e.preventDefault(); handlers.focusSearch?.(); break;
        case "p": handlers.openProfile?.(); break;
        case "e": handlers.toggleResolve?.(); break;
        case "a": handlers.openAssign?.(); break;
        case "n": handlers.openNote?.(); break;
        case "j":
        case "ArrowDown":
          if (idx < conversations.length - 1) setSelected(conversations[idx + 1].id);
          break;
        case "k":
        case "ArrowUp":
          if (idx > 0) setSelected(conversations[idx - 1].id);
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [conversations, selectedId, setSelected, handlers]);
}
