import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Building2, Users, DollarSign, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/super-admin")({
  component: SuperAdmin,
});

const orgs = [
  { name: "Acme Inc.", plan: "Growth", seats: 12, mrr: "$948", status: "Active" },
  { name: "Globex Co.", plan: "Enterprise", seats: 84, mrr: "$4,200", status: "Active" },
  { name: "Initech", plan: "Starter", seats: 3, mrr: "$87", status: "Trial" },
  { name: "Umbrella Corp.", plan: "Enterprise", seats: 120, mrr: "$6,800", status: "Active" },
];

function SuperAdmin() {
  return (
    <div>
      <PageHeader title="Super Admin" description="Platform-wide controls and monitoring." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Organizations" value="1,284" delta={9} icon={Building2} />
        <StatCard label="Users" value="14.2k" delta={12} icon={Users} accent="info" />
        <StatCard label="MRR" value="$184k" delta={18} icon={DollarSign} accent="success" />
        <StatCard label="System health" value="99.98%" icon={Activity} accent="primary" />
      </div>
      <Card className="rounded-2xl p-0 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="p-4 border-b font-semibold">Organizations</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Organization</th>
              <th className="text-left p-3 font-medium">Plan</th>
              <th className="text-left p-3 font-medium">Seats</th>
              <th className="text-left p-3 font-medium">MRR</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.name} className="border-t hover:bg-accent/40">
                <td className="p-3 font-medium">{o.name}</td>
                <td className="p-3">{o.plan}</td>
                <td className="p-3">{o.seats}</td>
                <td className="p-3">{o.mrr}</td>
                <td className="p-3">
                  <Badge className={`rounded-full ${o.status === "Active" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"}`}>
                    {o.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
