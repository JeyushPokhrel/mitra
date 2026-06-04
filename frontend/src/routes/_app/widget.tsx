import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatWidget } from "@/components/widget/ChatWidget";
import { useWidgetStore } from "@/store/widgetStore";
import { useChatStore } from "@/store/chatStore";
import { Copy, RotateCcw, Smartphone, Monitor, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/widget")({
  component: WidgetPage,
});

function WidgetPage() {
  const w = useWidgetStore();
  const resetChat = useChatStore((s) => s.reset);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="relative">
      <PageHeader
        title="Chat Widget"
        description="Configure and preview your embeddable messenger. Changes apply instantly."
      >
        <Badge variant="secondary" className="rounded-full gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[color:var(--success)] animate-pulse" />
          {w.mode === "agent" ? "Agent mode" : w.mode === "offline" ? "Offline" : "AI mode"}
        </Badge>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => {
            resetChat();
            toast.success("Chat session reset");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset session
        </Button>
        <Button className="rounded-xl" onClick={() => w.setOpen(true)}>
          <MessageSquarePlus className="h-4 w-4" />
          Open widget
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings */}
        <Card className="p-5 rounded-2xl shadow-[var(--shadow-soft)] space-y-5 lg:col-span-1">
          <Section title="Branding">
            <Field label="Organization name">
              <Input
                value={w.orgName}
                onChange={(e) => w.setOrgName(e.target.value)}
                maxLength={60}
                className="rounded-xl h-9"
              />
            </Field>
            <Field label="Greeting message">
              <Input
                value={w.greeting}
                onChange={(e) => w.setGreeting(e.target.value)}
                maxLength={120}
                className="rounded-xl h-9"
              />
            </Field>
            <Field label="Theme color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={w.themeColor}
                  onChange={(e) => w.setTheme(e.target.value)}
                  className="h-9 w-9 rounded-lg border bg-transparent cursor-pointer"
                />
                <Input
                  value={w.themeColor}
                  onChange={(e) => w.setTheme(e.target.value)}
                  className="rounded-xl h-9 font-mono text-xs"
                />
              </div>
            </Field>
          </Section>

          <Section title="Layout">
            <Field label="Position">
              <Select value={w.position} onValueChange={(v) => w.setPosition(v as "left" | "right")}>
                <SelectTrigger className="rounded-xl h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right" className="text-xs">Bottom right</SelectItem>
                  <SelectItem value="left" className="text-xs">Bottom left</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Size">
              <Select value={w.size} onValueChange={(v) => w.setSize(v as "compact" | "regular" | "large")}>
                <SelectTrigger className="rounded-xl h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact" className="text-xs">Compact</SelectItem>
                  <SelectItem value="regular" className="text-xs">Regular</SelectItem>
                  <SelectItem value="large" className="text-xs">Large</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Mode">
              <Select value={w.mode} onValueChange={(v) => w.setMode(v as "ai" | "agent" | "offline")}>
                <SelectTrigger className="rounded-xl h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai" className="text-xs">AI only</SelectItem>
                  <SelectItem value="agent" className="text-xs">Agent connected</SelectItem>
                  <SelectItem value="offline" className="text-xs">Offline</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Section>

          <Section title="Behavior">
            <Toggle
              label="Sound notifications"
              checked={w.soundOn}
              onChange={w.setSound}
            />
            <Toggle
              label="Show on mobile fullscreen"
              checked
              onChange={() => {}}
            />
          </Section>

          <Section title="Install snippet">
            <div className="rounded-xl bg-muted p-3 font-mono text-[10px] leading-relaxed">
              {`<script src="https://cdn.mitra.app/widget.js"
  data-org="acme"
  data-color="${w.themeColor}"
  data-position="${w.position}"></script>`}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg w-full"
              onClick={() => {
                navigator.clipboard.writeText("<script src=\"https://cdn.mitra.app/widget.js\"></script>");
                toast.success("Snippet copied");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy snippet
            </Button>
          </Section>
        </Card>

        {/* Preview */}
        <Card className="p-0 rounded-2xl shadow-[var(--shadow-soft)] lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-sm">Live preview</h3>
              <p className="text-xs text-muted-foreground">
                Widget renders bottom-{w.position} on every app page.
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted">
              <button
                onClick={() => setDevice("desktop")}
                className={
                  device === "desktop"
                    ? "h-7 px-2.5 rounded-lg bg-card shadow-sm text-xs font-medium flex items-center gap-1"
                    : "h-7 px-2.5 rounded-lg text-xs text-muted-foreground flex items-center gap-1"
                }
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={
                  device === "mobile"
                    ? "h-7 px-2.5 rounded-lg bg-card shadow-sm text-xs font-medium flex items-center gap-1"
                    : "h-7 px-2.5 rounded-lg text-xs text-muted-foreground flex items-center gap-1"
                }
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>
          </div>
          <div
            className="relative bg-[radial-gradient(circle_at_top,var(--muted),var(--background))] flex items-end justify-center p-6 overflow-hidden"
            style={{ minHeight: 520 }}
          >
            <div
              className={
                device === "mobile"
                  ? "w-[380px] h-[640px] rounded-[2rem] border-[10px] border-foreground/80 bg-background relative overflow-hidden shadow-[var(--shadow-elevated)]"
                  : "w-full max-w-3xl h-[520px] rounded-2xl border bg-background relative overflow-hidden shadow-[var(--shadow-elevated)]"
              }
            >
              <div className="h-8 border-b flex items-center px-3 gap-1.5 bg-muted/50">
                <span className="h-2 w-2 rounded-full bg-destructive/60" />
                <span className="h-2 w-2 rounded-full bg-[color:var(--warning)]/60" />
                <span className="h-2 w-2 rounded-full bg-[color:var(--success)]/60" />
                <span className="ml-3 text-[10px] text-muted-foreground font-mono">
                  acme.com/pricing
                </span>
              </div>
              <div className="p-6 space-y-3">
                <div className="h-6 w-1/3 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted/60" />
                <div className="h-3 w-1/2 rounded bg-muted/60" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-muted/40" />
                  ))}
                </div>
              </div>
              {/* Widget mounts globally via _app, but render an inline copy here for preview clarity */}
            </div>
          </div>
        </Card>
      </div>

      {/* Global widget mount (in case _app doesn't render it on this page yet) */}
      <ChatWidget />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
