import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useWidgetStore } from "@/store/widgetStore";
import { cn } from "@/lib/utils";

export function ChatLauncher() {
  const { open, toggle, position, unread, greeting } = useWidgetStore();
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(!open), 1500);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div
      className={cn(
        "fixed bottom-5 z-[60] flex items-end gap-2",
        position === "right" ? "right-5 flex-row-reverse" : "left-5 flex-row",
      )}
    >
      <button
        onClick={toggle}
        aria-label="Open chat"
        className="relative h-14 w-14 rounded-full text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 70%, black) 100%)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
            {unread}
          </span>
        )}
        {!open && unread > 0 && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        )}
      </button>

      <AnimatePresence>
        {showTip && !open && (
          <motion.div
            initial={{ opacity: 0, x: position === "right" ? 8 : -8, y: 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-[220px] mb-1 rounded-2xl bg-card border border-border/60 shadow-[var(--shadow-elevated)] px-3 py-2 text-xs"
          >
            {greeting}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
