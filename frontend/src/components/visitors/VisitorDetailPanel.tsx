import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquarePlus,
  UserPlus,
  Tag,
  TicketPlus,
  Send,
  Ban,
  Crown,
  Monitor,
  MapPin,
  Globe,
  Mail,
  Phone,
  Clock,
  Eye,
  Activity,
} from "lucide-react";
import type { Visitor } from "@/lib/visitors-mock";
import { flagEmoji } from "@/lib/visitors-mock";
import { useVisitorStore } from "@/store/visitorStore";
import { IntentScoreBadge, StatusDot } from "./IntentScoreBadge";
import { SessionTimeline } from "./SessionTimeline";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { AIInsightCard } from "./AIInsightCard";

function formatDur(s: number) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

export function VisitorDetailPanel({ visitor }: { visitor: Visitor }) {
  const navigate = useNavigate();
  const toggleVip = useVisitorStore((s) => s.toggleVip);
  const addTag = useVisitorStore((s) => s.addTag);
  const block = useVisitorStore((s) => s.blockVisitor);

  const startChat = () => {
    toast.success("Conversation created in Inbox", {
      description: `Chat opened with ${visitor.name ?? "Visitor " + visitor.id}`,
    });
    navigate({ to: "/inbox" });
  };

  const convertLead = () => {
    toast.success("Visitor converted to lead", {
      description: "Added to CRM › New stage",
    });
    navigate({ to: "/crm" });
  };

  const createTicket = () => {
    toast.success("Ticket created", { description: `Linked to visitor ${visitor.id}` });
    navigate({ to: "/tickets" });
  };

  const sendProactive = (msg: string) => {
    toast.success("Proactive message sent", { description: msg.slice(0, 60) + "…" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                {visitor.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5">
              <StatusDot status={visitor.status} />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold truncate">
                {visitor.name ?? `Visitor ${visitor.id.toUpperCase()}`}
              </h2>
              {visitor.vip && <Crown className="h-4 w-4 text-[color:var(--warning)]" />}
              <span className="text-lg">{flagEmoji(visitor.countryCode)}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {visitor.city}, {visitor.country}
              <span>·</span>
              <span className="font-mono">{visitor.ip}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <IntentScoreBadge score={visitor.leadScore} intent={visitor.intent} size="md" />
              <Badge variant="outline" className="rounded-full text-[10px]">
                {Math.round(visitor.conversionProbability * 100)}% conv. probability
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-1.5 mt-4">
          <Button size="sm" onClick={startChat} className="rounded-xl h-9 text-xs flex-col gap-0.5 py-1">
            <MessageSquarePlus className="h-3.5 w-3.5" />
            <span className="text-[10px]">Start chat</span>
          </Button>
          <Button size="sm" variant="outline" onClick={convertLead} className="rounded-xl h-9 text-xs flex-col gap-0.5 py-1">
            <UserPlus className="h-3.5 w-3.5" />
            <span className="text-[10px]">To lead</span>
          </Button>
          <Button size="sm" variant="outline" onClick={createTicket} className="rounded-xl h-9 text-xs flex-col gap-0.5 py-1">
            <TicketPlus className="h-3.5 w-3.5" />
            <span className="text-[10px]">Ticket</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addTag(visitor.id, "tagged")}
            className="rounded-xl h-9 text-xs flex-col gap-0.5 py-1"
          >
            <Tag className="h-3.5 w-3.5" />
            <span className="text-[10px]">Tag</span>
          </Button>
        </div>

        <div className="flex gap-1.5 mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleVip(visitor.id)}
            className="rounded-xl h-8 text-xs flex-1"
          >
            <Crown className="h-3.5 w-3.5" />
            {visitor.vip ? "Unmark VIP" : "Mark VIP"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => sendProactive("Hey 👋 anything I can help with?")}
            className="rounded-xl h-8 text-xs flex-1"
          >
            <Send className="h-3.5 w-3.5" />
            Proactive
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              block(visitor.id);
              toast.error("Visitor blocked");
            }}
            className="rounded-xl h-8 text-xs flex-1 hover:text-destructive"
          >
            <Ban className="h-3.5 w-3.5" />
            Block
          </Button>
        </div>
      </div>

      {/* Body */}
      <Tabs defaultValue="profile" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-3 rounded-xl bg-muted">
          <TabsTrigger value="profile" className="rounded-lg text-xs">Profile</TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg text-xs">Timeline</TabsTrigger>
          <TabsTrigger value="live" className="rounded-lg text-xs">Live feed</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <AIInsightCard visitor={visitor} onSendProactive={sendProactive} />

              <Section title="Identity">
                <Row icon={Mail} label="Email" value={visitor.email ?? "—"} />
                <Row icon={Phone} label="Phone" value={visitor.phone ?? "—"} />
                <Row icon={Globe} label="Source" value={visitor.source} />
              </Section>

              <Section title="Technical">
                <Row icon={Monitor} label="Device" value={`${visitor.device} · ${visitor.os}`} />
                <Row icon={Globe} label="Browser" value={visitor.browser} />
                <Row icon={Monitor} label="Screen" value={visitor.screen} />
                <Row icon={MapPin} label="IP" value={visitor.ip} />
              </Section>

              <Section title="Behavior">
                <Row icon={Clock} label="Session" value={formatDur(visitor.sessionSeconds)} />
                <Row icon={Eye} label="Pages viewed" value={String(visitor.pagesVisited)} />
                <Row icon={Activity} label="Current page" value={visitor.currentPage} />
              </Section>

              <Card className="p-3 rounded-xl">
                <p className="text-xs font-medium mb-2">Heatmap summary</p>
                <div className="grid grid-cols-10 gap-0.5">
                  {Array.from({ length: 50 }).map((_, i) => {
                    // Deterministic pattern keyed off visitor id + index — no Math.random in render.
                    const seed = (visitor.id.charCodeAt(visitor.id.length - 1) + i * 7) % 100;
                    const intensity = ((seed * 37) % 100) / 100;
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: `color-mix(in oklab, var(--primary) ${Math.round(intensity * 100)}%, transparent)`,
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Most engagement: hero CTA, pricing tiers, FAQ
                </p>
              </Card>

              {visitor.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {visitor.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <SessionTimeline visitor={visitor} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="live" className="flex-1 min-h-0 m-0">
          <LiveActivityFeed visitorId={visitor.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="font-medium truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}
