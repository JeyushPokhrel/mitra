import { Clock, AlertOctagon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SLABadge({ minutes, type }: { minutes: number; type: "response" | "resolution" }) {
  const breached = minutes < 0;
  const warning = !breached && minutes < 60;
  const Icon = breached ? AlertOctagon : warning ? Clock : CheckCircle2;
  const label = breached
    ? `Breached ${Math.abs(minutes)}m`
    : minutes > 60
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
      : `${minutes}m`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium",
        breached && "bg-destructive/15 text-destructive",
        warning && "bg-warning/15 text-[color:var(--warning)]",
        !breached && !warning && "bg-success/15 text-[color:var(--success)]",
      )}
    >
      <Icon className="h-3 w-3" />
      {type === "response" ? "R" : "F"} · {label}
    </span>
  );
}
