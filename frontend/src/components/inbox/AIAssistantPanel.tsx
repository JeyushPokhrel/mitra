import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Wand2, Smile, Briefcase, SpellCheck, Languages, FileText, ArrowRightCircle,
  Activity, Shield, Target, Tag as TagIcon, UserCheck, CheckCircle2, AlertTriangle, ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiAssistantStore, useConversationStore } from "@/store/inboxStore";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = {
  Sparkles, Wand2, Smile, Briefcase, SpellCheck, Languages, FileText, ArrowRightCircle,
};

const actions = [
  { id: "generate", label: "Generate reply", desc: "Draft contextual answer", icon: "Sparkles" },
  { id: "rephrase", label: "Rephrase", desc: "Improve current draft", icon: "Wand2" },
  { id: "friendly", label: "Make friendly", desc: "Warm, casual tone", icon: "Smile" },
  { id: "formal", label: "Make formal", desc: "Polished, professional", icon: "Briefcase" },
  { id: "grammar", label: "Fix grammar", desc: "Correct spelling & grammar", icon: "SpellCheck" },
  { id: "translate", label: "Translate", desc: "Auto-detect & translate", icon: "Languages" },
  { id: "summarize", label: "Summarize", desc: "TL;DR of the thread", icon: "FileText" },
  { id: "next", label: "Next action", desc: "Recommend a step", icon: "ArrowRightCircle" },
];

export function AIAssistantPanel() {
  const { conversations, selectedId } = useConversationStore();
  const conv = conversations.find((c) => c.id === selectedId)!;
  const { loading, run } = useAiAssistantStore();
  const [output, setOutput] = useState<string | null>(null);

  async function trigger(id: string) {
    const text = await run(id);
    setOutput(text);
  }

  return (
    <div className="border-b">
      <div className="p-3 bg-gradient-to-br from-primary/10 via-card to-info/5">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold">MITRA Copilot</p>
            <p className="text-[10px] text-muted-foreground">AI-powered suggestions for this conversation</p>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <InsightCard icon={Activity} label="Sentiment" value={conv.sentiment} tone={
            conv.sentiment === "positive" ? "success" : conv.sentiment === "negative" ? "destructive" : "info"
          } />
          <InsightCard icon={Target} label="Priority" value={conv.priority} tone={
            conv.priority === "urgent" || conv.priority === "high" ? "destructive" : "info"
          } />
          <InsightCard icon={Shield} label="Risk" value={conv.sentiment === "negative" ? "Churn risk" : "Low"} tone={
            conv.sentiment === "negative" ? "warning" : "success"
          } />
          <InsightCard icon={ThumbsUp} label="Lead" value="Qualified" tone="success" />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {actions.map((a) => {
            const Icon = ICONS[a.icon] ?? Sparkles;
            return (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => trigger(a.id)}
                disabled={loading === a.id}
                className={cn(
                  "text-left rounded-xl border bg-card p-2 hover:border-primary hover:shadow-[var(--shadow-soft)] transition-all",
                  loading === a.id && "opacity-60"
                )}
              >
                <Icon className="h-3.5 w-3.5 text-primary mb-1" />
                <p className="text-[11px] font-semibold leading-tight">{a.label}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{a.desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Suggestions */}
        <div className="mt-3 space-y-2">
          <SuggestionRow icon={TagIcon} label="Suggested tags" pills={["billing", "refund", "urgent"]} />
          <SuggestionRow icon={UserCheck} label="Suggested assignee" pills={["Priya S. · Billing"]} />
          <SuggestionRow icon={CheckCircle2} label="Suggested resolution" pills={["Issue refund & confirm"]} />
        </div>

        {/* Output */}
        {(output || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border bg-card p-2.5"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AI output</p>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Generating…
              </div>
            ) : (
              <>
                <p className="text-[11px] whitespace-pre-wrap">{output}</p>
                <div className="flex gap-1 mt-2">
                  <Button size="sm" className="h-6 text-[10px] rounded-md">Insert</Button>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-md" onClick={() => setOutput(null)}>Discard</Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, tone }: any) {
  const toneClasses: Record<string, string> = {
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    info: "bg-info/10 text-info border-info/30",
  };
  return (
    <div className={cn("rounded-lg border px-2 py-1.5 flex items-center gap-1.5", toneClasses[tone])}>
      <Icon className="h-3 w-3 shrink-0" />
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider opacity-70 leading-tight">{label}</p>
        <p className="text-[11px] font-semibold capitalize leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}

function SuggestionRow({ icon: Icon, label, pills }: any) {
  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <div className="flex gap-1 flex-wrap">
        {pills.map((p: string) => (
          <Badge key={p} variant="outline" className="rounded-full text-[9px] h-4 px-1.5 font-normal">{p}</Badge>
        ))}
      </div>
    </div>
  );
}
