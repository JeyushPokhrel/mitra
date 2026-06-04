import { motion } from "framer-motion";
import type { Activity } from "@/lib/crm-mock";
import {
  MessageSquare, Eye, DollarSign, Ticket, FileText, UserCheck,
  Sparkles, Phone, Calendar,
} from "lucide-react";

const iconMap: Record<Activity["type"], React.ComponentType<{ className?: string }>> = {
  conversation: MessageSquare,
  visit: Eye,
  deal: DollarSign,
  ticket: Ticket,
  note: FileText,
  assignment: UserCheck,
  ai: Sparkles,
  call: Phone,
  meeting: Calendar,
};

const colorMap: Record<Activity["type"], string> = {
  conversation: "bg-info/15 text-[color:var(--info)]",
  visit: "bg-muted text-muted-foreground",
  deal: "bg-success/15 text-[color:var(--success)]",
  ticket: "bg-destructive/15 text-destructive",
  note: "bg-warning/15 text-[color:var(--warning)]",
  assignment: "bg-primary/15 text-primary",
  ai: "bg-chart-2/15 text-[color:var(--chart-2)]",
  call: "bg-secondary text-foreground",
  meeting: "bg-accent text-foreground",
};

export function ActivityTimeline({ items }: { items: Activity[] }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-8">No activity yet.</p>;
  }
  return (
    <div className="relative px-4 py-3">
      <div className="absolute left-[1.65rem] top-3 bottom-3 w-px bg-border" />
      <div className="space-y-3">
        {items.map((a, idx) => {
          const Icon = iconMap[a.type];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="relative flex gap-3"
            >
              <div className={`relative z-10 h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${colorMap[a.type]}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <p className="text-xs font-medium">{a.title}</p>
                {a.description && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.description}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {a.actor && <span>{a.actor} · </span>}
                  {a.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
