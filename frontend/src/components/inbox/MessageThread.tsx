import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { useMessageStore, useConversationStore, useCustomerStore, useAgentStore } from "@/store/inboxStore";

export function MessageThread() {
  const { conversations, selectedId } = useConversationStore();
  const conv = conversations.find((c) => c.id === selectedId)!;
  const { threads, ensureThread, editMessage, deleteMessage } = useMessageStore();
  const customer = useCustomerStore((s) => s.getById(conv.customerId));
  const agents = useAgentStore((s) => s.agents);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { ensureThread(conv); }, [conv, ensureThread]);

  const messages = threads[conv.id] ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Group with date separators
  const groups: { label: string; items: typeof messages }[] = [
    { label: "Today", items: messages },
  ];

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-b from-background to-muted/20">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="flex items-center gap-3 my-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{g.label}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <AnimatePresence initial={false}>
            {g.items.map((m) => {
              const author = m.sender === "customer" ? customer : agents.find((a) => a.id === m.authorId);
              return (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  authorName={author?.name}
                  authorAvatar={author?.avatar}
                  onEdit={() => editMessage(conv.id, m.id, prompt("Edit message", m.body) ?? m.body)}
                  onDelete={() => deleteMessage(conv.id, m.id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      ))}
      <TypingIndicator name={customer?.name.split(" ")[0]} />
    </div>
  );
}
