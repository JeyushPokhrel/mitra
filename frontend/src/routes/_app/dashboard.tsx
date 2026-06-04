import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MessageSquare, Ticket, Eye, UserPlus, DollarSign, Bot,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  conversationVolume, csatTrend, channelBreakdown, conversations, agents,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

const PALETTE = ["#B6AE9F", "#0A84FF", "#34C759", "#FF9500"];

function Dashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PageHeader title="Welcome back, Rohan 👋" description="Here's how your support is doing today.">
        <Button variant="outline" className="rounded-xl">Export</Button>
        <Button className="rounded-xl">New conversation</Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Conversations" value="12,840" delta={12} icon={MessageSquare} />
        <StatCard label="Open Tickets" value="248" delta={-4} icon={Ticket} accent="warning" />
        <StatCard label="Visitors Online" value="1,204" delta={8} icon={Eye} accent="info" />
        <StatCard label="Leads Generated" value="328" delta={18} icon={UserPlus} accent="success" />
        <StatCard label="Revenue Impact" value="$84.2k" delta={22} icon={DollarSign} accent="success" />
        <StatCard label="AI Resolution Rate" value="64%" delta={6} icon={Bot} accent="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2 p-5 rounded-2xl shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Conversation Volume</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="secondary" className="rounded-full">+12% vs last week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={conversationVolume}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B6AE9F" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#B6AE9F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" stroke="#5C5C5C" fontSize={12} />
              <YAxis stroke="#5C5C5C" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DEDED1" }} />
              <Area type="monotone" dataKey="conversations" stroke="#B6AE9F" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="resolved" stroke="#0A84FF" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 rounded-2xl shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-1">Channel Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Where conversations come from</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={channelBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {channelBreakdown.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Legend iconType="circle" />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 rounded-2xl shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-1">Customer Satisfaction</h3>
          <p className="text-xs text-muted-foreground mb-4">CSAT score trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={csatTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="week" stroke="#5C5C5C" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="#5C5C5C" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#34C759" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 rounded-2xl shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Recent Conversations</h3>
          <div className="space-y-3">
            {conversations.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">{c.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 rounded-2xl shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Top Agents</h3>
          <div className="space-y-3">
            {agents.slice(0, 5).map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-secondary text-xs">{a.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.resolved} resolved · CSAT {a.csat}</p>
                </div>
                <span className={`h-2 w-2 rounded-full ${a.status === "online" ? "bg-[color:var(--success)]" : a.status === "away" ? "bg-[color:var(--warning)]" : "bg-muted-foreground/40"}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
