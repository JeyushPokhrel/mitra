import { useTicketsStore } from "@/store/ticketsStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sparkles, Send, FileText, ShieldAlert, Paperclip, Mail, Phone,
  Building2, GitMerge,
} from "lucide-react";
import { priorityColors, statusColors, TICKET_STATUSES, TICKET_PRIORITIES } from "@/lib/tickets-mock";
import { SLABadge } from "./SLABadge";
import { agents } from "@/lib/workforce-mock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TicketDetail() {
  const { tickets, selectedId, setStatus, assign, update } = useTicketsStore();
  const t = tickets.find((x) => x.id === selectedId);

  if (!t) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Select a ticket
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-card">
      <div className="p-4 border-b sticky top-0 bg-card z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
              <Badge className={cn("rounded-full text-[10px] border-0", statusColors[t.status])}>{t.status}</Badge>
              <Badge className={cn("rounded-full text-[10px] border-0", priorityColors[t.priority])}>{t.priority}</Badge>
            </div>
            <h2 className="text-base font-semibold mt-1 leading-snug">{t.subject}</h2>
            <p className="text-[11px] text-muted-foreground mt-1">{t.category} · {t.channel} · {t.organization}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs gap-1"
              onClick={() => toast.success("Escalated")}>
              <ShieldAlert className="h-3 w-3" /> Escalate
            </Button>
            <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs gap-1"
              onClick={() => toast("Merge wizard opened")}>
              <GitMerge className="h-3 w-3" /> Merge
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Select value={t.status} onValueChange={(v) => { setStatus(t.id, v as any); toast.success(`Status → ${v}`); }}>
            <SelectTrigger className="h-7 text-xs rounded-lg"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TICKET_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={t.priority} onValueChange={(v) => update(t.id, { priority: v as any })}>
            <SelectTrigger className="h-7 text-xs rounded-lg"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TICKET_PRIORITIES.map((p) => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={t.assignee ?? "unassigned"} onValueChange={(v) => assign(t.id, v === "unassigned" ? null : v)}>
            <SelectTrigger className="h-7 text-xs rounded-lg"><SelectValue placeholder="Assignee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned" className="text-xs">Unassigned</SelectItem>
              {agents.slice(0, 8).map((a) => <SelectItem key={a.id} value={a.name} className="text-xs">{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <SLABadge minutes={t.sla.responseDue} type="response" />
            <SLABadge minutes={t.sla.resolutionDue} type="resolution" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="conversation">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-9 px-2 gap-0">
          {["overview","conversation","activities","sla","attachments","audit"].map((k) => (
            <TabsTrigger key={k} value={k}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs capitalize h-9 px-3">
              {k}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="p-4 space-y-3 m-0">
          <Card className="p-3 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> {t.customerEmail}</div>
            <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> +1 (555) 010-2210</div>
            <div className="flex items-center gap-2"><Building2 className="h-3 w-3 text-muted-foreground" /> {t.organization}</div>
            <Separator className="my-2" />
            <p className="text-muted-foreground">{t.description}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {t.tags.map((tg) => <Badge key={tg} variant="outline" className="rounded-full text-[10px]">#{tg}</Badge>)}
            </div>
          </Card>

          <Card className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-card border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold">Mira AI suggestions</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Likely root cause: payment gateway timeout in EU region</li>
              <li>Suggested macro: <span className="text-foreground">Payment_Retry_v2</span></li>
              <li>Auto-route to: Billing team (Ava L.)</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="conversation" className="p-3 space-y-3 m-0">
          {t.messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2", m.internal && "opacity-90")}>
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                  {m.author.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Card className={cn(
                "p-3 rounded-xl flex-1",
                m.internal && "bg-warning/10 border-warning/30",
              )}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">{m.author}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {m.internal && "Internal · "}{m.time}
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed">{m.body}</p>
              </Card>
            </div>
          ))}

          <Card className="p-2 rounded-xl">
            <Textarea placeholder="Reply to customer or @mention an agent…" rows={2}
              className="resize-none border-0 focus-visible:ring-0 text-sm" />
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7"><Paperclip className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7"><FileText className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7"><Sparkles className="h-3.5 w-3.5" /></Button>
              </div>
              <Button size="sm" className="h-7 rounded-lg text-xs gap-1" onClick={() => toast.success("Reply sent")}>
                <Send className="h-3 w-3" /> Send
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="p-4 m-0 space-y-2">
          {t.audit.map((a) => (
            <div key={a.id} className="text-xs flex items-center justify-between border-l-2 border-primary/40 pl-3 py-1">
              <span>{a.action}</span>
              <span className="text-muted-foreground">{a.actor} · {a.time}</span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="sla" className="p-4 space-y-3 m-0">
          <Card className="p-3 rounded-xl">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">First response</p>
            <SLABadge minutes={t.sla.responseDue} type="response" />
            <p className="text-[11px] text-muted-foreground mt-2">
              Target: 4h · {t.sla.responded ? "Responded" : "Pending response"}
            </p>
          </Card>
          <Card className="p-3 rounded-xl">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Resolution</p>
            <SLABadge minutes={t.sla.resolutionDue} type="resolution" />
            <p className="text-[11px] text-muted-foreground mt-2">Target: 24h · escalation rule active</p>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="p-4 m-0 space-y-2">
          {t.attachments.length === 0
            ? <p className="text-xs text-muted-foreground text-center py-6">No attachments.</p>
            : t.attachments.map((a, i) => (
              <Card key={i} className="p-3 rounded-xl flex items-center gap-2">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs flex-1">{a.name}</p>
                <span className="text-[10px] text-muted-foreground">{a.size}</span>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="audit" className="p-4 m-0 space-y-1.5">
          {t.audit.map((a) => (
            <div key={a.id} className="text-[11px] flex items-center justify-between border-b pb-1.5">
              <span>{a.action}</span>
              <span className="text-muted-foreground">{a.actor} · {a.time}</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
