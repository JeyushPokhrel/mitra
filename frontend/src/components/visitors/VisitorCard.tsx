import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Globe, Laptop, Smartphone, Tablet, Clock, Eye } from "lucide-react";
import type { Visitor } from "@/lib/visitors-mock";
import { flagEmoji } from "@/lib/visitors-mock";
import { IntentScoreBadge, StatusDot } from "./IntentScoreBadge";

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

const DeviceIcon = ({ d }: { d: Visitor["device"] }) =>
  d === "Mobile" ? <Smartphone className="h-3 w-3" /> : d === "Tablet" ? <Tablet className="h-3 w-3" /> : <Laptop className="h-3 w-3" />;

export function VisitorCard({
  visitor,
  selected,
  onClick,
}: {
  visitor: Visitor;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-xl border transition-all",
        selected
          ? "bg-primary/10 border-primary/40 shadow-[var(--shadow-soft)]"
          : "bg-card border-border/60 hover:bg-accent/40",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
              {visitor.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5">
            <StatusDot status={visitor.status} />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="font-medium text-sm truncate">
                {visitor.name ?? `Visitor ${visitor.id.toUpperCase()}`}
              </p>
              {visitor.vip && <Crown className="h-3 w-3 text-[color:var(--warning)] shrink-0" />}
            </div>
            <span className="text-base shrink-0" title={visitor.country}>
              {flagEmoji(visitor.countryCode)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">
            {visitor.currentPage}
          </p>

          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(visitor.sessionSeconds)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {visitor.pagesVisited}
            </span>
            <span className="flex items-center gap-1">
              <DeviceIcon d={visitor.device} />
              {visitor.browser}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <IntentScoreBadge score={visitor.leadScore} intent={visitor.intent} />
            <Badge variant="outline" className="rounded-full text-[10px] gap-1 font-normal">
              <Globe className="h-2.5 w-2.5" />
              {visitor.source}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}
