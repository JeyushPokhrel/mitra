import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, Users, MousePointerClick } from "lucide-react";

export const Route = createFileRoute("/_app/campaigns")({
  component: Campaigns,
});

const campaigns = [
  { name: "Welcome series", channel: "Email", status: "Active", sent: 12480, opened: "62%", clicked: "18%" },
  { name: "Black Friday promo", channel: "In-app", status: "Scheduled", sent: 0, opened: "—", clicked: "—" },
  { name: "Re-engagement", channel: "WhatsApp", status: "Active", sent: 3204, opened: "48%", clicked: "22%" },
  { name: "Feature launch: AI", channel: "Email", status: "Completed", sent: 28100, opened: "71%", clicked: "29%" },
];

function Campaigns() {
  return (
    <div>
      <PageHeader title="Campaigns" description="Reach customers across channels with targeted messages.">
        <Button variant="outline" className="rounded-xl">Templates</Button>
        <Button className="rounded-xl">New campaign</Button>
      </PageHeader>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active campaigns" value="8" icon={Megaphone} />
        <StatCard label="Messages sent" value="184k" delta={18} icon={Send} accent="info" />
        <StatCard label="Audience reached" value="42k" delta={12} icon={Users} accent="success" />
        <StatCard label="Avg CTR" value="22%" delta={4} icon={MousePointerClick} accent="warning" />
      </div>
      <Card className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Campaign</th>
              <th className="text-left p-3 font-medium">Channel</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Sent</th>
              <th className="text-left p-3 font-medium">Opened</th>
              <th className="text-left p-3 font-medium">Clicked</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.name} className="border-t hover:bg-accent/40">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.channel}</td>
                <td className="p-3">
                  <Badge variant={c.status === "Active" ? "default" : "secondary"} className="rounded-full">{c.status}</Badge>
                </td>
                <td className="p-3">{c.sent.toLocaleString()}</td>
                <td className="p-3">{c.opened}</td>
                <td className="p-3">{c.clicked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
