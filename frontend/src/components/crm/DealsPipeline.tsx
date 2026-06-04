import { useState } from "react";
import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crmStore";
import { DEAL_STAGES, type DealStage } from "@/lib/crm-mock";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const stageColors: Record<DealStage, string> = {
  New: "bg-muted",
  Contacted: "bg-info/15",
  Qualified: "bg-primary/15",
  Proposal: "bg-warning/15",
  Negotiation: "bg-chart-2/15",
  Won: "bg-success/15",
  Lost: "bg-destructive/15",
};

export function DealsPipeline() {
  const { deals, moveDeal } = useCRMStore();
  const [dragId, setDragId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-auto p-3">
      <div className="grid grid-flow-col auto-cols-[16rem] gap-3 min-w-max">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const total = stageDeals.reduce((a, d) => a + d.value, 0);
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) {
                  moveDeal(dragId, stage);
                  toast.success(`Moved to ${stage}`);
                  setDragId(null);
                }
              }}
              className={cn("rounded-2xl border bg-card/50 flex flex-col min-h-[60vh]", stageColors[stage])}
            >
              <div className="p-3 border-b flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{stage}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {stageDeals.length} · ${(total / 1000).toFixed(0)}k
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {stageDeals.length}
                </Badge>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {stageDeals.map((d) => (
                  <motion.div
                    key={d.id}
                    layout
                    draggable
                    onDragStart={() => setDragId(d.id)}
                    onDragEnd={() => setDragId(null)}
                  >
                    <Card className="p-3 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-[var(--shadow-elevated)] transition-shadow bg-card">
                      <p className="text-xs font-semibold line-clamp-2">{d.title}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-medium tabular-nums">${(d.value / 1000).toFixed(1)}k</span>
                        <span className="text-muted-foreground">{d.probability}%</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="truncate">{d.contactName}</span>
                        <span>{d.expectedClose}</span>
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
