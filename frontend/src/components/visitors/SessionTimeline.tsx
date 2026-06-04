import { motion } from "framer-motion";
import type { Visitor } from "@/lib/visitors-mock";
import { Eye, MousePointerClick, FileText, ChevronsDown, MessageSquare, LogOut } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  page_view: Eye,
  click: MousePointerClick,
  form_start: FileText,
  scroll: ChevronsDown,
  chat_opened: MessageSquare,
  exit_intent: LogOut,
};

export function SessionTimeline({ visitor }: { visitor: Visitor }) {
  const acts = [...visitor.activities].reverse();
  return (
    <div className="relative pl-5">
      <div className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
      {acts.map((a, i) => {
        const Icon = ICONS[a.type] ?? Eye;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="relative pb-3 last:pb-0"
          >
            <span className="absolute -left-[18px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-muted-foreground" />
              {a.label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {new Date(a.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
