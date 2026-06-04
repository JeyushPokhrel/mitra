import { cn } from "@/lib/utils";
import { Flame, TrendingUp, Minus } from "lucide-react";
import type { IntentLevel } from "@/lib/visitors-mock";

export function IntentScoreBadge({ score, intent, size = "sm" }: { score: number; intent: IntentLevel; size?: "sm" | "md" }) {
  const cfg = {
    high: { cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: Flame, label: "High" },
    medium: { cls: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30", Icon: TrendingUp, label: "Medium" },
    low: { cls: "bg-muted text-muted-foreground border-border", Icon: Minus, label: "Low" },
  }[intent];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        cfg.cls,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      )}
    >
      <cfg.Icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {cfg.label} · {score}
    </span>
  );
}

export function StatusDot({ status }: { status: "active" | "idle" | "leaving" }) {
  const color = {
    active: "bg-[color:var(--success)]",
    idle: "bg-[color:var(--warning)]",
    leaving: "bg-destructive",
  }[status];
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", color)} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}
