import { useState } from "react";
import {
  Mail, Phone, Globe, MapPin, Smartphone, Languages, TrendingUp,
  DollarSign, Star, Calendar, Tag as TagIcon, Plus, UserPlus, ArrowRightLeft,
  Ban, Ticket, UserRound, Bell, Download, ShoppingBag, Clock, Activity,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useConversationStore, useCustomerStore } from "@/store/inboxStore";
import { ChannelIcon } from "./ChannelIcon";

export function CustomerProfile() {
  const { conversations, selectedId } = useConversationStore();
  const conv = conversations.find((c) => c.id === selectedId)!;
  const customer = useCustomerStore((s) => s.getById(conv.customerId));
  const [tab, setTab] = useState("profile");

  if (!customer) return null;

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="p-4 border-b text-center">
        <div className="relative inline-block">
          <Avatar className="h-16 w-16 mx-auto">
            <AvatarFallback className="bg-gradient-to-br from-primary to-info text-primary-foreground font-semibold">
              {customer.avatar}
            </AvatarFallback>
          </Avatar>
          {customer.vip && (
            <span className="absolute -top-1 -right-1 bg-warning text-warning-foreground rounded-full p-1">
              <Star className="h-3 w-3 fill-current" />
            </span>
          )}
        </div>
        <p className="font-semibold mt-2 text-sm">{customer.name}</p>
        <p className="text-[11px] text-muted-foreground">{customer.email}</p>
        <div className="flex justify-center gap-1 mt-2 flex-wrap">
          <Badge variant="secondary" className="rounded-full text-[10px]">{customer.attributes.Plan}</Badge>
          {customer.vip && <Badge className="rounded-full text-[10px] bg-warning text-warning-foreground">VIP</Badge>}
          <Badge variant="outline" className="rounded-full text-[10px]">{customer.country}</Badge>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-1 mt-3">
          {[
            { icon: UserPlus, label: "Assign" },
            { icon: ArrowRightLeft, label: "Transfer" },
            { icon: Ticket, label: "Ticket" },
            { icon: UserRound, label: "Lead" },
            { icon: TagIcon, label: "Tag" },
            { icon: Bell, label: "Remind" },
            { icon: Download, label: "Export" },
            { icon: Ban, label: "Ban" },
          ].map((a) => (
            <button key={a.label} className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-accent text-[10px] text-muted-foreground transition-colors">
              <a.icon className="h-3.5 w-3.5" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 m-2 h-8">
          <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <TabsContent value="profile" className="space-y-4 m-0 mt-2">
            <Section title="Contact">
              <Row icon={Mail} k="Email" v={customer.email} />
              <Row icon={Phone} k="Phone" v={customer.phone} />
              <Row icon={MapPin} k="Location" v={`${customer.city}, ${customer.country}`} />
              <Row icon={Clock} k="Timezone" v={customer.timezone} />
              <Row icon={Languages} k="Language" v={customer.language} />
            </Section>

            <Section title="Device">
              <Row icon={Globe} k="Browser" v={customer.browser} />
              <Row icon={Smartphone} k="OS / Device" v={`${customer.os} · ${customer.device}`} />
            </Section>

            <Section title="Value">
              <Row icon={TrendingUp} k="Lead score" v={`${customer.leadScore}/100`} />
              <Row icon={DollarSign} k="LTV" v={`$${customer.value.toLocaleString()}`} />
              <Row icon={Calendar} k="Customer since" v={customer.since} />
              <Row icon={Activity} k="Conversations" v={String(customer.totalConversations)} />
              <Row icon={Ticket} k="Tickets" v={String(customer.totalTickets)} />
            </Section>

            <Section title="Tags" action={<Button size="icon" variant="ghost" className="h-5 w-5"><Plus className="h-3 w-3" /></Button>}>
              <div className="flex flex-wrap gap-1">
                {customer.tags.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full text-[10px]">{t}</Badge>
                ))}
              </div>
            </Section>

            <Section title="Custom attributes">
              {Object.entries(customer.attributes).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </Section>

            <Section title="Participants">
              <div className="flex -space-x-2">
                {conv.participants.slice(0, 5).map((p, i) => (
                  <Avatar key={i} className="h-6 w-6 ring-2 ring-card">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">{p.slice(-2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                <button className="h-6 w-6 rounded-full bg-muted hover:bg-accent text-muted-foreground grid place-items-center ring-2 ring-card">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="activity" className="m-0 mt-2">
            <Section title="Recent activity">
              <ol className="relative border-l border-border ml-2 space-y-3">
                {customer.recentActivity.map((a, i) => (
                  <li key={i} className="pl-3 relative">
                    <span className="absolute -left-1.5 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card" />
                    <p className="text-xs">{a.label}</p>
                    <p className="text-[10px] text-muted-foreground">{a.at}</p>
                  </li>
                ))}
                <li className="pl-3 relative">
                  <span className="absolute -left-1.5 top-1 h-2.5 w-2.5 rounded-full bg-info ring-2 ring-card" />
                  <p className="text-xs">Conversation assigned to agent</p>
                  <p className="text-[10px] text-muted-foreground">3d ago</p>
                </li>
              </ol>
            </Section>
          </TabsContent>

          <TabsContent value="orders" className="m-0 mt-2 space-y-2">
            {customer.purchases.map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg border bg-background">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{p.item}</p>
                  <p className="text-[10px] text-muted-foreground">{p.at}</p>
                </div>
                <span className="text-xs font-semibold">${p.amount}</span>
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        {action}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, k, v }: { icon: any; k: string; v: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium ml-auto truncate text-right">{v}</span>
    </div>
  );
}
