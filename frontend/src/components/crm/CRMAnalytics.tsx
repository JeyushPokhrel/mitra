import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Users, UserPlus, DollarSign, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, LineChart, Line, Legend,
} from "recharts";
import { useCRMStore } from "@/store/crmStore";
import { pipelineByStage, sourcePerformance, forecastTrend } from "@/lib/crm-mock";

export function CRMAnalytics() {
  const { contacts, deals } = useCRMStore();
  const totalLeads = contacts.filter((c) =>
    ["Lead", "MQL", "SQL", "Opportunity"].includes(c.lifecycle),
  ).length;
  const pipelineValue = deals
    .filter((d) => !["Won", "Lost"].includes(d.stage))
    .reduce((a, d) => a + d.value, 0);
  const customers = contacts.filter((c) => c.lifecycle === "Customer").length;
  const conv = totalLeads ? Math.round((customers / (totalLeads + customers)) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total contacts" value={contacts.length.toString()} delta={8} icon={Users} />
        <StatCard label="Open leads" value={totalLeads.toString()} delta={12} icon={UserPlus} accent="info" />
        <StatCard label="Pipeline value" value={`$${(pipelineValue / 1000).toFixed(0)}k`} delta={5} icon={DollarSign} accent="success" />
        <StatCard label="Conversion rate" value={`${conv}%`} delta={-2} icon={TrendingUp} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 rounded-2xl lg:col-span-2">
          <p className="text-xs font-semibold mb-3">Revenue forecast</p>
          <div className="h-48">
            <ResponsiveContainer>
              <AreaChart data={forecastTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="forecast" stroke="var(--chart-1)" fill="url(#g1)" />
                <Line type="monotone" dataKey="closed" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <p className="text-xs font-semibold mb-3">Pipeline by stage</p>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={pipelineByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl lg:col-span-3">
          <p className="text-xs font-semibold mb-3">Lead source performance</p>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={sourcePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="source" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="leads" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="converted" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
