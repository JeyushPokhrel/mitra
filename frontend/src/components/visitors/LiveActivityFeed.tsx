import { AnimatePresence, motion } from "framer-motion";
import { useVisitorStore } from "@/store/visitorStore";
import {
  MousePointerClick,
  Eye,
  FileText,
  FileX,
  MessageSquare,
  MessageSquarePlus,
  ChevronsDown,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONS = {
  page_view: Eye,
  click: MousePointerClick,
  form_start: FileText,
  form_abandon: FileX,
  chat_opened: MessageSquare,
  chat_started: MessageSquarePlus,
  scroll: ChevronsDown,
  exit_intent: LogOut,
  added_to_cart: ShoppingCart,
};

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - +new Date(iso)) / 1000));
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export function LiveActivityFeed({ visitorId }: { visitorId?: string }) {
  const feed = useVisitorStore((s) => s.feed);
  const items = visitorId ? feed.filter((f) => f.visitorId === visitorId) : feed;

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-accent/40"
              >
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-tight">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {!visitorId && <span className="font-medium">{item.visitorName}</span>}
                    {!visitorId && " · "}
                    {timeAgo(item.at)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No activity yet</p>
        )}
      </div>
    </ScrollArea>
  );
}
