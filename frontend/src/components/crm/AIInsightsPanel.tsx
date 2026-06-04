import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, Target, ArrowRight } from "lucide-react";
import type { Contact } from "@/lib/crm-mock";
import { toast } from "sonner";

export function AIInsightsPanel({ contact }: { contact: Contact }) {
  const winProb = Math.min(95, Math.round((contact.leadScore + (100 - contact.churnRisk)) / 2));
  const oppScore = Math.min(99, contact.leadScore + 10);
  const intent =
    contact.leadScore > 70 ? "High purchase intent" :
    contact.leadScore > 40 ? "Researching options" : "Low engagement";

  return (
    <div className="space-y-3">
      <Card className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-card to-card border-primary/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-semibold">Mira AI Summary</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {contact.name} is a {contact.lifecycle.toLowerCase()} from {contact.company} showing{" "}
          <span className="font-medium text-foreground">{intent.toLowerCase()}</span>. Sentiment is{" "}
          <span className="font-medium text-foreground">{contact.sentiment}</span> across recent conversations.
          Best next step is a personalized follow-up within 24 hours.
        </p>
      </Card>

      <ScoreCard
        icon={Target}
        label="Lead qualification"
        value={contact.leadScore}
        suffix="/100"
      />
      <ScoreCard
        icon={TrendingUp}
        label="Win probability"
        value={winProb}
        suffix="%"
        tone="success"
      />
      <ScoreCard
        icon={Sparkles}
        label="Opportunity score"
        value={oppScore}
        suffix="/100"
      />
      <ScoreCard
        icon={AlertTriangle}
        label="Churn risk"
        value={contact.churnRisk}
        suffix="%"
        tone={contact.churnRisk > 60 ? "destructive" : "muted"}
      />

      <Card className="p-3 rounded-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Recommended actions
        </p>
        <div className="space-y-2">
          {[
            "Send personalized pricing breakdown",
            "Schedule 15-min discovery call",
            "Loop in account executive Priya S.",
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => toast.success("Action queued")}
              className="w-full flex items-center justify-between text-xs px-2.5 py-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <span className="truncate">{a}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
        <Button size="sm" className="w-full mt-3 rounded-lg gap-2 text-xs">
          <Sparkles className="h-3 w-3" /> Generate playbook
        </Button>
      </Card>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <Badge variant="outline" className="rounded-full text-[10px] h-4">Intent: {intent}</Badge>
        <Badge variant="outline" className="rounded-full text-[10px] h-4 capitalize">
          Sentiment: {contact.sentiment}
        </Badge>
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon, label, value, suffix, tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: number; suffix: string;
  tone?: "primary" | "success" | "destructive" | "muted";
}) {
  const toneCls = {
    primary: "text-primary",
    success: "text-[color:var(--success)]",
    destructive: "text-destructive",
    muted: "text-muted-foreground",
  }[tone];
  return (
    <Card className="p-3 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${toneCls}`} />
          <p className="text-xs font-medium">{label}</p>
        </div>
        <span className={`text-sm font-semibold tabular-nums ${toneCls}`}>
          {value}{suffix}
        </span>
      </div>
      <Progress value={value} className="h-1 mt-2" />
    </Card>
  );
}
