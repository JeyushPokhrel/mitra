import { motion } from "framer-motion";
import { Star, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChannelIcon } from "./ChannelIcon";
import { cn } from "@/lib/utils";
import type { Conversation, Customer, Agent } from "@/lib/inbox-mock";

interface Props {
  conv: Conversation;
  customer?: Customer;
  agent?: Agent;
  active?: boolean;
  onClick: () => void;
}

const priorityColor: Record<string, string> = {
  urgent: "bg-destructive",
  high: "bg-warning",
  normal: "bg-info",
  low: "bg-muted-foreground/50",
};

export function ConversationCard({ conv, customer, agent, active, onClick }: Props) {
  return (
    <motion.button
      layout
      onClick={onClick}
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "group relative w-full text-left flex gap-3 p-3 border-b border-border/50 transition-colors",
        active ? "bg-accent" : "hover:bg-accent/50"
      )}
    >
      <span className={cn("absolute left-0 top-0 h-full w-0.5", priorityColor[conv.priority])} />
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
            {customer?.avatar ?? "??"}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5">
          <ChannelIcon channel={conv.channel} />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold truncate">{customer?.name}</p>
          {conv.vip && <Star className="h-3 w-3 fill-warning text-warning shrink-0" />}
          {conv.locked && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
          <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{conv.lastAt}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          {conv.tags.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline" className="text-[9px] rounded-full px-1.5 py-0 h-4 font-normal">{t}</Badge>
          ))}
          {customer && (
            <span className="text-[9px] text-muted-foreground ml-auto">
              {customer.countryCode}
            </span>
          )}
          {agent && (
            <span className="text-[9px] text-muted-foreground">
              · {agent.avatar}
            </span>
          )}
          {conv.unread > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 min-w-[18px] text-center font-semibold">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
