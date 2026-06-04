import {
  MessageCircle, Mail, MessageSquare, Instagram, Send,
  Slack, Phone, Hash, Globe,
} from "lucide-react";
import type { Channel } from "@/lib/inbox-mock";
import { cn } from "@/lib/utils";

const map: Record<Channel, { icon: typeof Mail; color: string; label: string }> = {
  chat: { icon: MessageCircle, color: "text-info bg-info/10", label: "Web Chat" },
  email: { icon: Mail, color: "text-primary bg-primary/15", label: "Email" },
  whatsapp: { icon: MessageSquare, color: "text-success bg-success/10", label: "WhatsApp" },
  messenger: { icon: MessageCircle, color: "text-info bg-info/10", label: "Messenger" },
  instagram: { icon: Instagram, color: "text-destructive bg-destructive/10", label: "Instagram" },
  telegram: { icon: Send, color: "text-info bg-info/10", label: "Telegram" },
  slack: { icon: Slack, color: "text-warning bg-warning/10", label: "Slack" },
  discord: { icon: Hash, color: "text-info bg-info/10", label: "Discord" },
  sms: { icon: Phone, color: "text-success bg-success/10", label: "SMS" },
};

export function ChannelIcon({ channel, size = "sm", showLabel = false }: { channel: Channel; size?: "sm" | "md"; showLabel?: boolean }) {
  const cfg = map[channel] ?? { icon: Globe, color: "text-muted-foreground bg-muted", label: channel };
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full",
      cfg.color,
      size === "sm" ? "p-1" : "px-2 py-1",
      showLabel && "px-2"
    )}>
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {showLabel && <span className="text-[10px] font-semibold">{cfg.label}</span>}
    </span>
  );
}

export function channelLabel(c: Channel) { return map[c]?.label ?? c; }
