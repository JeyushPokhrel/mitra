import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import {
  TicketCheck, Clock, AlertOctagon, CheckCircle2, UserPlus, Users,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { useTicketsStore } from "@/store/ticketsStore";
import { ticketVolumeTrend, categoryDistribution } from "@/lib/tickets-mock";

const PIE_COLORS = ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--info)"];

export function TicketDashboard() {
  const { tickets } = useTicketsStore();
  const open = tickets.filter((t) => t.status === "Open").length;
  const pending = tickets.filter((t) => t.status === "Pending").length;
  const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const breached = tickets.filter((t) => t.sla.breached).length;
  const assigned = tickets.filter((t) => t.assignee).length;
  const unassigned = tickets.filter((t) => !t.assignee).length;

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Open" value={open.toString()} icon={TicketCheck} delta={4} />
        <StatCard label="Pending" value={pending.toString()} icon={Clock} accent="warning" delta={-2} />
        <StatCard label="Resolved" value={resolved.toString()} icon={CheckCircle2} accent="success" delta={9} />
        <StatCard label="SLA breached" value={breached.toString()} icon={AlertOctagon} accent="destructive" delta={3} />
        <StatCard label="Assigned" value={assigned.toString()} icon={Users} accent="info" />
        <StatCard label="Unassigned" value={unassigned.toString()} icon={UserPlus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 rounded-2xl lg:col-span-2">
          <p className="text-xs font-semibold mb-3">Ticket volume (last 7 days)</p>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={ticketVolumeTrend}>
                <defs>
                  <linearGradient id="tk1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tk2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="created" stroke="var(--chart-1)" fill="url(#tk1)" />
                <Area type="monotone" dataKey="resolved" stroke="var(--chart-3)" fill="url(#tk2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="text-xs font-semibold mb-3">Category distribution</p>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="category" innerRadius={42} outerRadius={72}>
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl lg:col-span-3">
          <p className="text-xs font-semibold mb-3">Recent activity</p>
          <div className="divide-y">
            {tickets.slice(0, 6).map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                  <p className="truncate">{t.subject}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {t.status} · {t.assignee ?? "Unassigned"} · {t.createdAt}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
