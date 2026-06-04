import { Sparkles, ShieldAlert, Send, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Visitor } from "@/lib/visitors-mock";

function suggestedMessage(v: Visitor) {
  if (v.currentPage.includes("pricing")) return "Hey! Need help comparing our plans? I can find the right fit in 30 seconds.";
  if (v.currentPage.includes("contact")) return "Hi there 👋 Want to skip the form and chat directly with our team?";
  return `Welcome back${v.name ? `, ${v.name.split(" ")[0]}` : ""}! Anything I can help you with today?`;
}

export function AIInsightCard({ visitor, onSendProactive }: { visitor: Visitor; onSendProactive: (msg: string) => void }) {
  const insights: string[] = [];
  if (visitor.intent === "high") insights.push("High intent visitor detected");
  if (visitor.pagesVisited > 5) insights.push(`Deep browsing: ${visitor.pagesVisited} pages`);
  if (visitor.returning) insights.push("Returning visitor — likely warm lead");
  if (visitor.currentPage.includes("pricing")) insights.push("Currently on pricing — ready to convert");
  const botRisk = visitor.sessionSeconds < 30 && visitor.pagesVisited > 8;
  const msg = suggestedMessage(visitor);

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI Copilot</p>
          <p className="text-[11px] text-muted-foreground">Real-time intent intelligence</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {insights.map((i) => (
          <li key={i} className="text-xs flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            {i}
          </li>
        ))}
        {botRisk && (
          <li className="text-xs flex items-start gap-1.5 text-destructive">
            <ShieldAlert className="h-3 w-3 mt-0.5 shrink-0" />
            Bot-like behavior detected — review before engaging
          </li>
        )}
      </ul>

      <div className="rounded-xl bg-background/60 border border-border/60 p-3">
        <p className="text-[11px] text-muted-foreground mb-1.5">Suggested message</p>
        <p className="text-xs leading-relaxed">{msg}</p>
        <div className="flex gap-2 mt-2.5">
          <Button size="sm" className="h-7 rounded-lg flex-1 text-xs" onClick={() => onSendProactive(msg)}>
            <Send className="h-3 w-3" />
            Send
          </Button>
          <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs">
            Rephrase
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1">
        <span className="text-muted-foreground flex items-center gap-1">
          <UserCheck className="h-3 w-3" /> Assign to
        </span>
        <span className="font-medium">Rohan K. · 96 CSAT</span>
      </div>
    </div>
  );
}
