import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label, value, delta, icon: Icon, accent = "primary",
}: {
  label: string; value: string; delta?: number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info" | "destructive";
}) {
  const accentBg = {
    primary: "bg-primary/15 text-primary",
    success: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    info: "bg-[color:var(--info)]/15 text-[color:var(--info)]",
    destructive: "bg-destructive/15 text-destructive",
  }[accent];

  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="p-5 rounded-2xl border-border/60 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accentBg)}>
          <Icon className="h-5 w-5" />
        </div>
        {delta != null && (
          <span className={cn(
            "flex items-center gap-1 text-xs font-semibold",
            positive ? "text-[color:var(--success)]" : "text-destructive"
          )}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </Card>
  );
}

export function PageHeader({
  title, description, children,
}: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
