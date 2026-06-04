import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_app/billing")({
  component: Billing,
});

const plans = [
  { name: "Starter", price: 29, features: ["3 seats", "1k conversations", "Email + chat"] },
  { name: "Growth", price: 79, features: ["10 seats", "10k conversations", "All channels", "AI assist"], popular: true },
  { name: "Enterprise", price: 199, features: ["Unlimited seats", "Unlimited convos", "Voice AI", "SSO + audit logs"] },
];

const invoices = [
  { id: "INV-2041", date: "May 1, 2026", amount: "$79.00", status: "Paid" },
  { id: "INV-2040", date: "Apr 1, 2026", amount: "$79.00", status: "Paid" },
  { id: "INV-2039", date: "Mar 1, 2026", amount: "$79.00", status: "Paid" },
];

function Billing() {
  return (
    <div>
      <PageHeader title="Billing" description="Manage your plan, invoices and AI token usage." />

      <Card className="p-5 rounded-2xl shadow-[var(--shadow-soft)] mb-6">
        <p className="text-sm font-semibold mb-2">AI Token Consumption</p>
        <Progress value={62} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">1.24M / 2M tokens used this month</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((p) => (
          <Card key={p.name} className={`p-6 rounded-2xl relative shadow-[var(--shadow-soft)] ${p.popular ? "border-primary border-2" : ""}`}>
            {p.popular && <Badge className="absolute -top-2 right-4 rounded-full">Current plan</Badge>}
            <p className="font-semibold">{p.name}</p>
            <p className="text-3xl font-bold mt-2">${p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[color:var(--success)]" /> {f}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-5 rounded-xl" variant={p.popular ? "default" : "outline"}>
              {p.popular ? "Manage" : "Upgrade"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-0 rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="p-4 border-b font-semibold">Invoices</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Invoice</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Amount</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="p-3 font-mono text-xs">{i.id}</td>
                <td className="p-3">{i.date}</td>
                <td className="p-3 font-medium">{i.amount}</td>
                <td className="p-3"><Badge className="rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">{i.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
