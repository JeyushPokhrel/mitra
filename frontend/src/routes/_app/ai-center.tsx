import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, BookOpen, GraduationCap, BarChart3, Lightbulb, Mic, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_app/ai-center")({
  component: AICenter,
});

const sections = [
  { icon: BookOpen, title: "Knowledge Base", desc: "Train AI on your help articles", count: "284 articles" },
  { icon: Bot, title: "AI Agents", desc: "Deploy autonomous support agents", count: "3 active" },
  { icon: GraduationCap, title: "AI Training", desc: "Fine-tune answers on past conversations", count: "12k samples" },
  { icon: BarChart3, title: "AI Analytics", desc: "Resolution rate & deflection", count: "64% deflection" },
  { icon: Lightbulb, title: "Copilot", desc: "Real-time agent assist", count: "Enabled" },
  { icon: Sparkles, title: "AI Suggestions", desc: "Smart reply recommendations", count: "1.8k/day" },
  { icon: Mic, title: "Voice AI", desc: "Speech-to-text & voicebots", count: "Beta" },
  { icon: ImageIcon, title: "Visual AI", desc: "Image understanding & OCR", count: "Beta" },
];

function AICenter() {
  return (
    <div>
      <PageHeader title="AI Center" description="Your AI-powered customer support workspace.">
        <Button className="rounded-xl gap-2"><Sparkles className="h-4 w-4" /> Train AI</Button>
      </PageHeader>

      <Card className="p-6 rounded-2xl mb-6 bg-gradient-to-br from-primary/20 via-secondary/30 to-background shadow-[var(--shadow-soft)] border-primary/20">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">MITRA AI is resolving 64% of conversations</h2>
            <p className="text-sm text-muted-foreground mt-1">That's 8,214 tickets deflected this month — saving ~342 agent hours.</p>
          </div>
          <Button variant="outline" className="rounded-xl">View report</Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="AI Conversations" value="8,214" delta={28} icon={Bot} />
        <StatCard label="Avg. Response Time" value="0.8s" delta={-12} icon={Sparkles} accent="success" />
        <StatCard label="Tokens Used" value="2.4M" icon={BarChart3} accent="info" />
        <StatCard label="Confidence Score" value="92%" delta={3} icon={GraduationCap} accent="primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {sections.map((s) => (
          <Card key={s.title} className="p-5 rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="font-semibold">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            <Badge variant="secondary" className="rounded-full mt-3 text-[10px]">{s.count}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
