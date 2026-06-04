import { useMemo } from "react";
import { useCRMStore } from "@/store/crmStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  Mail, Phone, MapPin, Building2, Sparkles, MessageSquare,
  Ticket, DollarSign, FileText, Plus, Clock,
} from "lucide-react";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { ActivityTimeline } from "./ActivityTimeline";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function CustomerProfile360() {
  const { contacts, selectedContactId, companies, deals, activities } = useCRMStore();
  const c = useMemo(
    () => contacts.find((x) => x.id === selectedContactId),
    [contacts, selectedContactId],
  );
  const co = useMemo(() => companies.find((x) => x.id === c?.companyId), [companies, c]);
  const myDeals = useMemo(() => deals.filter((d) => d.contactId === c?.id), [deals, c]);
  const myActivities = useMemo(
    () => activities.filter((a) => a.contactId === c?.id),
    [activities, c],
  );
  const navigate = useNavigate();

  if (!c) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Select a contact to view profile
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {c.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold truncate">{c.name}</h2>
            <p className="text-xs text-muted-foreground truncate">
              {c.designation} · {c.company}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary" className="rounded-full text-[10px] h-5">
                {c.lifecycle}
              </Badge>
              {c.tags.map((t) => (
                <Badge key={t} variant="outline" className="rounded-full text-[10px] h-5">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <QuickAction
            icon={MessageSquare}
            label="Chat"
            onClick={() => {
              toast.success("Opening Inbox…");
              navigate({ to: "/inbox" });
            }}
          />
          <QuickAction icon={Ticket} label="Ticket" onClick={() => toast("Ticket draft created")} />
          <QuickAction icon={DollarSign} label="Deal" onClick={() => toast("New deal opened")} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-9 px-2 gap-0">
          {["overview", "conversations", "tickets", "deals", "activities", "ai"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs capitalize h-9 px-3"
            >
              {t === "ai" ? "AI" : t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="p-4 space-y-4 m-0">
          <InfoBlock title="Contact information">
            <Field icon={Mail} label="Email" value={c.email} />
            <Field icon={Phone} label="Phone" value={c.phone} />
            <Field icon={MapPin} label="Location" value={`${c.country} · ${c.timezone}`} />
            <Field icon={Building2} label="Company" value={c.company} />
          </InfoBlock>

          <InfoBlock title="Ownership">
            <Field label="Assigned agent" value={c.owner} />
            <Field label="Source" value={c.source} />
            <Field label="Created" value={c.createdAt} />
          </InfoBlock>

          <InfoBlock title="Customer value">
            <div className="space-y-3">
              <Metric label="Lead score" value={c.leadScore} suffix="/100" tone="primary" />
              <Metric label="Customer value" value={c.customerValue} prefix="$" />
              <Metric label="Churn risk" value={c.churnRisk} suffix="%" tone={c.churnRisk > 60 ? "destructive" : "success"} />
            </div>
          </InfoBlock>

          {co && (
            <InfoBlock title="Company">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
                  {co.logo}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{co.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {co.industry} · {co.employees.toLocaleString()} employees · ${co.revenue}M
                  </p>
                </div>
              </div>
            </InfoBlock>
          )}
        </TabsContent>

        <TabsContent value="conversations" className="p-4 space-y-2 m-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">
                  {["Live Chat", "Email", "WhatsApp", "Instagram"][i]} conversation
                </p>
                <Badge variant="outline" className="text-[10px] rounded-full">
                  {["resolved", "open", "pending", "closed"][i]}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                Thanks for reaching out — your issue has been escalated to Tier 2 support…
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{i + 1}d ago · 12 messages</p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tickets" className="p-4 space-y-2 m-0">
          {["T-2041", "T-2034", "T-2018"].map((id, i) => (
            <Card key={id} className="p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{id}</p>
                <Badge variant="outline" className="text-[10px] rounded-full">
                  {["Open", "In Progress", "Closed"][i]}
                </Badge>
              </div>
              <p className="text-xs mt-1">Payment failed during checkout</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Priority: High · SLA: {i === 2 ? "—" : `${2 + i}h left`}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="deals" className="p-4 space-y-2 m-0">
          {myDeals.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">No deals yet.</p>
          )}
          {myDeals.map((d) => (
            <Card key={d.id} className="p-3 rounded-xl">
              <p className="text-xs font-semibold">{d.title}</p>
              <div className="flex items-center justify-between mt-2 text-[11px]">
                <span className="tabular-nums font-semibold">${(d.value / 1000).toFixed(1)}k</span>
                <Badge variant="secondary" className="rounded-full text-[10px]">{d.stage}</Badge>
              </div>
              <Progress value={d.probability} className="h-1 mt-2" />
            </Card>
          ))}
          <Button size="sm" variant="outline" className="w-full rounded-lg gap-2 text-xs">
            <Plus className="h-3 w-3" /> Add deal
          </Button>
        </TabsContent>

        <TabsContent value="activities" className="m-0">
          <ActivityTimeline items={myActivities.length ? myActivities : activities.slice(0, 8)} />
        </TabsContent>

        <TabsContent value="ai" className="p-4 m-0">
          <AIInsightsPanel contact={c} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuickAction({
  icon: Icon, label, onClick,
}: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="h-auto py-2 flex-col gap-1 rounded-xl text-[11px] font-medium"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
      <Separator className="mt-4" />
    </div>
  );
}

function Field({
  icon: Icon, label, value,
}: { icon?: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      {Icon && <Icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="truncate">{value}</p>
      </div>
    </div>
  );
}

function Metric({
  label, value, prefix = "", suffix = "", tone = "primary",
}: { label: string; value: number; prefix?: string; suffix?: string; tone?: "primary" | "success" | "destructive" }) {
  const toneCls = {
    primary: "text-primary",
    success: "text-[color:var(--success)]",
    destructive: "text-destructive",
  }[tone];
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold tabular-nums ${toneCls}`}>
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      {suffix !== "$" && <Progress value={Math.min(100, value)} className="h-1 mt-1" />}
    </div>
  );
}
