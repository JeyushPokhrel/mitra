import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./ChatBubble";
import { WidgetTypingIndicator } from "./TypingIndicator";
import { useChatStore } from "@/store/chatStore";

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay ? "Today" : d.toLocaleDateString();
}

export function ChatMessageList() {
  const messages = useChatStore((s) => s.messages);
  const typing = useChatStore((s) => s.typing.who);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  // Group by day
  const groups: { day: string; items: typeof messages }[] = [];
  messages.forEach((m) => {
    const day = dayLabel(m.at);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(m);
    else groups.push({ day, items: [m] });
  });

  return (
    <ScrollArea ref={ref} className="flex-1">
      <div className="py-3 space-y-2">
        {groups.map((g) => (
          <div key={g.day} className="space-y-2">
            <div className="flex justify-center">
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {g.day}
              </span>
            </div>
            <AnimatePresence initial={false}>
              {g.items.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatBubble msg={m} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
        {typing && <WidgetTypingIndicator name={typing === "agent" ? "Agent" : "Mira AI"} />}
      </div>
    </ScrollArea>
  );
}
