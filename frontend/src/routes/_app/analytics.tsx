import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare, Users, TicketCheck, CheckCircle2, DollarSign, Smile,
  Download, Calendar, Plus, Sparkles, TrendingUp, AlertTriangle, Zap, Target,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import {
  executiveKPIs, conversationVolume, responseTimeTrend, channelDistribution,
  visitorTrend, deviceBreakdown, trafficSources, topCountries,
  crmAnalytics, ticketTrend, ticketCategoryDist,
  agentLeaderboard, aiInsights, savedReports,
} from "@/lib/analytics-mock";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

const tooltipStyle = {
  background: "var(--popover)", border: "1px solid var(--border)",
  borderRadius: 12, fontSize: 12,
};

function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics & Reporting" description="Executive insights across conversations, CRM, tickets, and agents.">
        <Select defaultValue="7d">
          <SelectTrigger className="h-9 text-xs rounded-lg w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["24h","7d","30d","90d","12m"].map((r) => <SelectItem key={r} value={r} className="text-xs">Last {r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" className="rounded-lg gap-2" onClick={() => toast("Export started")}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </PageHeader>

      <Tabs defaultValue="executive">
        <TabsList className="h-9 mb-4 flex flex-wrap">
          <TabsTrigger value="executive" className="text-xs h-7 px-3">Executive</TabsTrigger>
          <TabsTrigger value="conversations" className="text-xs h-7 px-3">Conversations</TabsTrigger>
          <TabsTrigger value="visitors" className="text-xs h-7 px-3">Visitors</TabsTrigger>
          <TabsTrigger value="crm" className="text-xs h-7 px-3">CRM</TabsTrigger>
          <TabsTrigger value="tickets" className="text-xs h-7 px-3">Tickets</TabsTrigger>
          <TabsTrigger value="agents" className="text-xs h-7 px-3">Agents</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs h-7 px-3">AI Insights</TabsTrigger>
          <TabsTrigger value="builder" className="text-xs h-7 px-3">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="executive"><Executive /></TabsContent>
        <TabsContent value="conversations"><Conversations /></TabsContent>
        <TabsContent value="visitors"><Visitors /></TabsContent>
        <TabsContent value="crm"><CRM /></TabsContent>
        <TabsContent value="tickets"><Tickets /></TabsContent>
        <TabsContent value="agents"><Agents /></TabsContent>
        <TabsContent value="ai"><AI /></TabsContent>
        <TabsContent value="builder"><ReportBuilder /></TabsContent>
      </Tabs>
    </div>
  );
}

function Executive() {
  const k = executiveKPIs;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Conversations" value={k.conversations.toLocaleString()} delta={k.deltas.conversations} icon={MessageSquare} />
        <StatCard label="Customers" value={k.customers.toLocaleString()} delta={k.deltas.customers} icon={Users} accent="info" />
        <StatCard label="Tickets" value={k.tickets.toLocaleString()} delta={k.deltas.tickets} icon={TicketCheck} accent="warning" />
        <StatCard label="Resolution rate" value={`${k.resolutionRate}%`} delta={k.deltas.resolutionRate} icon={CheckCircle2} accent="success" />
        <StatCard label="Pipeline" value={`$${(k.revenuePipeline / 1000).toFixed(0)}k`} delta={k.deltas.revenuePipeline} icon={DollarSign} accent="success" />
        <StatCard label="CSAT" value={`${k.csat}%`} delta={k.deltas.csat} icon={Smile} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 rounded-2xl lg:col-span-2">
          <p className="text-xs font-semibold mb-3">Conversation volume</p>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={conversationVolume}>
                <defs>
                  <linearGradient id="ex1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="inbound" stroke="var(--chart-1)" fill="url(#ex1)" />
                <Line type="monotone" dataKey="resolved" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="text-xs font-semibold mb-3">Channel distribution</p>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={channelDistribution} dataKey="value" nameKey="name" innerRadius={42} outerRadius={72}>
                  {channelDistribution.map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Conversations() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <ChartCard title="Volume">
        <AreaChart data={conversationVolume}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="inbound" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
          <Area type="monotone" dataKey="resolved" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.25} />
        </AreaChart>
      </ChartCard>
      <ChartCard title="Response & resolution time (minutes)">
        <LineChart data={responseTimeTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="firstResponse" stroke="var(--chart-1)" strokeWidth={2} />
          <Line type="monotone" dataKey="resolution" stroke="var(--chart-2)" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Channel split" className="lg:col-span-2">
        <BarChart data={channelDistribution}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {channelDistribution.map((c, i) => <Cell key={i} fill={c.fill} />)}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}

function Visitors() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <ChartCard title="Visitor trend" className="lg:col-span-2">
        <AreaChart data={visitorTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="total" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
          <Area type="monotone" dataKey="returning" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.3} />
        </AreaChart>
      </ChartCard>
      <ChartCard title="Devices">
        <PieChart>
          <Pie data={deviceBreakdown} dataKey="value" nameKey="name" innerRadius={36} outerRadius={70}>
            {deviceBreakdown.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ChartCard>
      <ChartCard title="Traffic sources" className="lg:col-span-2">
        <BarChart data={trafficSources} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis type="category" dataKey="source" fontSize={11} stroke="var(--muted-foreground)" width={80} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="visits" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ChartCard>
      <Card className="p-4 rounded-2xl">
        <p className="text-xs font-semibold mb-3">Top countries</p>
        <div className="space-y-2">
          {topCountries.map((c) => (
            <div key={c.country} className="flex items-center gap-2">
              <span className="text-xs w-20">{c.country}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${c.value * 2.5}%` }} />
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">{c.value}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CRM() {
  const c = crmAnalytics;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Leads created" value={c.leadsCreated.toString()} icon={Users} delta={12} />
        <StatCard label="Conversion rate" value={`${c.conversionRate}%`} icon={TrendingUp} accent="success" delta={3} />
        <StatCard label="Pipeline" value={`$${(c.pipelineValue / 1000).toFixed(0)}k`} icon={DollarSign} accent="info" delta={18} />
        <StatCard label="Won" value={c.won.toString()} icon={CheckCircle2} accent="success" delta={6} />
        <StatCard label="Lost" value={c.lost.toString()} icon={Target} accent="destructive" delta={-2} />
      </div>
      <ChartCard title="Lead source performance">
        <BarChart data={c.sources}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="source" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="leads" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="converted" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  );
}

function Tickets() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <ChartCard title="Tickets created vs resolved" className="lg:col-span-2">
        <AreaChart data={ticketTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="created" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
          <Area type="monotone" dataKey="resolved" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.3} />
        </AreaChart>
      </ChartCard>
      <ChartCard title="SLA performance (%)">
        <LineChart data={ticketTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" domain={[80, 100]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="sla" stroke="var(--chart-3)" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Category distribution" className="lg:col-span-3">
        <BarChart data={ticketCategoryDist}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {ticketCategoryDist.map((c, i) => <Cell key={i} fill={c.fill} />)}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}

function Agents() {
  return (
    <Card className="rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-semibold">Agent leaderboard</p>
        <p className="text-[11px] text-muted-foreground">Last 30 days · resolved, CSAT, productivity score</p>
      </div>
      <div className="divide-y">
        {agentLeaderboard.map((a) => (
          <div key={a.name} className="flex items-center gap-3 px-4 py-3">
            <span className="w-6 text-center text-xs font-bold text-muted-foreground">{a.rank}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                {a.name.split(" ").map((p) => p[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{a.name}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{a.resolved} resolved</span>
                <span>CSAT {a.csat}%</span>
                <span>Productivity {a.productivity}</span>
              </div>
            </div>
            <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${a.productivity}%` }} />
            </div>
            {a.rank === 1 && <Badge className="rounded-full text-[10px]">Top</Badge>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function AI() {
  const iconMap = { risk: AlertTriangle, opp: TrendingUp, perf: Zap, action: Sparkles };
  const colorMap = {
    risk: "text-destructive bg-destructive/15",
    opp: "text-[color:var(--success)] bg-success/15",
    perf: "text-[color:var(--warning)] bg-warning/15",
    action: "text-primary bg-primary/15",
  };
  return (
    <div className="space-y-3">
      <ChartCard title="Sentiment trend">
        <AreaChart data={aiInsights.sentimentTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
          <YAxis fontSize={11} stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" stackId="1" dataKey="positive" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.6} />
          <Area type="monotone" stackId="1" dataKey="neutral" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.6} />
          <Area type="monotone" stackId="1" dataKey="negative" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.6} />
        </AreaChart>
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {aiInsights.alerts.map((a, i) => {
          const Icon = iconMap[a.type];
          return (
            <Card key={i} className="p-4 rounded-2xl flex gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[a.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.detail}</p>
                <Button size="sm" variant="outline" className="h-6 rounded-md text-[10px] mt-2"
                  onClick={() => toast.success("Action queued")}>Take action</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ReportBuilder() {
  const [name, setName] = useState("My custom report");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="p-4 rounded-2xl lg:col-span-2 space-y-3">
        <p className="text-sm font-semibold">Build a report</p>
        <div className="space-y-1.5">
          <Label className="text-[11px]">Report name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldSel label="Data source" options={["Conversations","Tickets","CRM","Visitors","Agents"]} />
          <FieldSel label="Date range" options={["Last 24h","Last 7d","Last 30d","Last quarter","Custom"]} />
          <FieldSel label="Group by" options={["Day","Week","Month","Channel","Agent","Team"]} />
          <FieldSel label="Metric" options={["Volume","CSAT","Response time","Revenue","SLA"]} />
        </div>
        <div>
          <Label className="text-[11px] mb-1.5 block">Filters</Label>
          <div className="flex flex-wrap gap-1.5">
            {["channel = chat","priority ≥ high","assignee = me","sentiment = negative"].map((f) => (
              <Badge key={f} variant="outline" className="rounded-full text-[10px]">{f}</Badge>
            ))}
            <Button size="sm" variant="ghost" className="h-6 rounded-md text-[10px] gap-1"><Plus className="h-3 w-3" /> Filter</Button>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" className="h-8 rounded-lg text-xs" onClick={() => toast.success("Report saved")}>Save report</Button>
          <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5" onClick={() => toast("Exporting…")}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5" onClick={() => toast("Schedule set")}>
            <Calendar className="h-3.5 w-3.5" /> Schedule
          </Button>
        </div>
      </Card>

      <Card className="p-4 rounded-2xl">
        <p className="text-sm font-semibold mb-3">Saved reports</p>
        <div className="space-y-2">
          {savedReports.map((r) => (
            <div key={r.id} className="p-2.5 rounded-xl border hover:bg-muted/40 transition-colors">
              <p className="text-xs font-semibold">{r.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {r.schedule} · {r.owner} · {r.format}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FieldSel({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px]">{label}</Label>
      <Select defaultValue={options[0]}>
        <SelectTrigger className="h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function ChartCard({
  title, children, className,
}: { title: string; children: React.ReactElement; className?: string }) {
  return (
    <Card className={`p-4 rounded-2xl ${className ?? ""}`}>
      <p className="text-xs font-semibold mb-3">{title}</p>
      <div className="h-56">
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </Card>
  );
}
