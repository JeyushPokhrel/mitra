import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, GitBranch, Clock, Send, Sparkles, ArrowRight, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/automation")({
  component: Automation,
});

const nodes = [
  { icon: Zap, label: "Trigger", desc: "New conversation", tint: "bg-[color:var(--info)]/15 text-[color:var(--info)]" },
  { icon: GitBranch, label: "Condition", desc: "If contains 'refund'", tint: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" },
  { icon: Sparkles, label: "AI Decision", desc: "Classify intent", tint: "bg-primary/15 text-primary" },
  { icon: Clock, label: "Delay", desc: "Wait 5 minutes", tint: "bg-muted text-muted-foreground" },
  { icon: Send, label: "Action", desc: "Send Slack alert", tint: "bg-[color:var(--success)]/15 text-[color:var(--success)]" },
];

function Automation() {
  return (
    <div>
      <PageHeader title="Automation Builder" description="Design no-code workflows with triggers, conditions and AI.">
        <Button variant="outline" className="rounded-xl">Templates</Button>
        <Button className="rounded-xl">Save workflow</Button>
      </PageHeader>

      <Card className="p-8 rounded-2xl shadow-[var(--shadow-soft)] overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max">
          {nodes.map((n, i) => (
            <div key={n.label} className="flex items-center gap-4">
              <div className="w-56 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-colors shadow-[var(--shadow-soft)]">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${n.tint}`}>
                  <n.icon className="h-4 w-4" />
                </div>
                <p className="font-semibold text-sm">{n.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              </div>
              {i < nodes.length - 1 && <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />}
            </div>
          ))}
          <Button variant="outline" className="w-56 h-[110px] rounded-2xl border-dashed gap-2">
            <Plus className="h-4 w-4" /> Add step
          </Button>
        </div>
      </Card>
    </div>
  );
}
