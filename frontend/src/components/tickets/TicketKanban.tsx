import { useState } from "react";
import { motion } from "framer-motion";
import { useTicketsStore } from "@/store/ticketsStore";
import { KANBAN_COLUMNS, priorityColors, statusColors, type TicketStatus } from "@/lib/tickets-mock";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TicketKanban() {
  const { tickets, setStatus, select } = useTicketsStore();
  const [dragId, setDragId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-auto p-3">
      <div className="grid grid-flow-col auto-cols-[16rem] gap-3 min-w-max">
        {KANBAN_COLUMNS.map((col) => {
          const colTickets = tickets.filter((t) => t.status === col);
          return (
            <div
              key={col}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) {
                  setStatus(dragId, col);
                  toast.success(`Moved to ${col}`);
                  setDragId(null);
                }
              }}
              className={cn("rounded-2xl border bg-card/50 flex flex-col min-h-[60vh]")}
            >
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("inline-block h-2 w-2 rounded-full", statusColors[col].split(" ")[0])} />
                  <p className="text-sm font-semibold">{col}</p>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">{colTickets.length}</Badge>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {colTickets.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => select(t.id)}
                  >
                    <Card className="p-3 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-[var(--shadow-elevated)] transition-shadow bg-card">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                        <Badge className={cn("rounded-full text-[10px] border-0", priorityColors[t.priority])}>
                          {t.priority}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium mt-1 line-clamp-2">{t.subject}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{t.assignee?.split(" ")[0] ?? "Unassigned"}</span>
                        <span>{t.createdAt}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
