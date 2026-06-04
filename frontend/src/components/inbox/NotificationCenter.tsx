import { Bell, AtSign, Star, AlertTriangle, MessageCircle, UserCheck, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/inboxStore";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  mention: AtSign, vip: Star, sla: AlertTriangle, message: MessageCircle, assign: UserCheck,
};
const toneMap: Record<string, string> = {
  mention: "text-info bg-info/10",
  vip: "text-warning bg-warning/10",
  sla: "text-destructive bg-destructive/10",
  message: "text-primary bg-primary/15",
  assign: "text-success bg-success/10",
};

export function NotificationCenter() {
  const { items, unread, markRead, markAllRead } = useNotificationStore();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-semibold grid place-items-center px-1">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <p className="text-sm font-semibold">Notifications</p>
          <button onClick={markAllRead} className="text-[11px] text-primary hover:underline flex items-center gap-1">
            <CheckCheck className="h-3 w-3" /> Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.map((n) => {
            const Icon = iconMap[n.kind] ?? Bell;
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full text-left flex gap-3 p-3 border-b border-border/50 hover:bg-accent transition-colors",
                  !n.read && "bg-accent/30"
                )}
              >
                <span className={cn("h-7 w-7 rounded-full grid place-items-center shrink-0", toneMap[n.kind])}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.at} ago</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
