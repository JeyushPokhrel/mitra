import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Plus, Trash2, ArrowRight } from "lucide-react";

interface Rule {
  id: string;
  condition: string;
  value: string;
  action: string;
  enabled: boolean;
}

const CONDITIONS = [
  "Time on page >",
  "Visited page",
  "Exit intent",
  "Scroll depth >",
  "Returning visitor",
];
const ACTIONS = ["Open chat widget", "Send AI message", "Notify agent", "Create lead"];

export function ProactiveTriggerBuilder() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "r1", condition: "Time on page >", value: "30s", action: "Open chat widget", enabled: true },
    { id: "r2", condition: "Visited page", value: "/pricing", action: "Send AI message", enabled: true },
    { id: "r3", condition: "Exit intent", value: "—", action: "Notify agent", enabled: false },
  ]);

  const addRule = () =>
    setRules((r) => [
      ...r,
      { id: `r${Date.now()}`, condition: "Time on page >", value: "10s", action: "Open chat widget", enabled: true },
    ]);

  const removeRule = (id: string) => setRules((r) => r.filter((x) => x.id !== id));

  return (
    <Card className="p-4 rounded-2xl shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Proactive triggers</h3>
            <p className="text-xs text-muted-foreground">Auto-engage visitors based on behavior</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-lg h-8" onClick={addRule}>
          <Plus className="h-3 w-3" />
          Rule
        </Button>
      </div>

      <div className="space-y-2">
        {rules.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60"
          >
            <Badge
              variant={r.enabled ? "default" : "secondary"}
              className="rounded-full text-[10px] shrink-0"
            >
              IF
            </Badge>
            <Select value={r.condition}>
              <SelectTrigger className="h-8 rounded-lg text-xs w-[150px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={r.value}
              onChange={(e) => setRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, value: e.target.value } : x)))}
              className="h-8 rounded-lg text-xs flex-1 bg-background"
            />
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <Select value={r.action}>
              <SelectTrigger className="h-8 rounded-lg text-xs w-[160px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map((a) => (
                  <SelectItem key={a} value={a} className="text-xs">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
              onClick={() => removeRule(r.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
