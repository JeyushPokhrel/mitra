import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { integrations } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/integrations")({
  component: Integrations,
});

function Integrations() {
  const cats = ["All", "Communication", "CRM", "E-Commerce", "Automation", "Analytics"];
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? integrations : integrations.filter(i => i.category === cat);

  return (
    <div>
      <PageHeader title="Integrations" description="Connect MITRA to the tools your team already uses." />
      <div className="flex flex-wrap gap-2 mb-5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              cat === c ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent border"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((i) => (
          <Card key={i.name} className="p-5 rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition">
            <div className="flex items-start justify-between mb-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/30 to-secondary flex items-center justify-center font-bold text-primary">
                {i.name[0]}
              </div>
              {i.connected && <Badge className="rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">Connected</Badge>}
            </div>
            <p className="font-semibold">{i.name}</p>
            <p className="text-xs text-muted-foreground mt-1 min-h-[2.5rem]">{i.desc}</p>
            <div className="flex items-center justify-between mt-4">
              <Badge variant="outline" className="rounded-full text-[10px]">{i.category}</Badge>
              <Button size="sm" variant={i.connected ? "outline" : "default"} className="rounded-xl">
                {i.connected ? "Configure" : "Connect"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
