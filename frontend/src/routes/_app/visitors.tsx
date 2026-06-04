import { useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Eye, Globe, Flame, Activity, Zap } from "lucide-react";
import { useVisitorStore, selectFilteredVisitors } from "@/store/visitorStore";
import { VisitorCard } from "@/components/visitors/VisitorCard";
import { VisitorFilters } from "@/components/visitors/VisitorFilters";
import { VisitorDetailPanel } from "@/components/visitors/VisitorDetailPanel";
import { LiveActivityFeed } from "@/components/visitors/LiveActivityFeed";
import { ProactiveTriggerBuilder } from "@/components/visitors/ProactiveTriggerBuilder";

export const Route = createFileRoute("/_app/visitors")({
  component: Visitors,
});

function Visitors() {
  const visitors = useVisitorStore((s) => s.visitors);
  const selectedId = useVisitorStore((s) => s.selectedId);
  const setSelected = useVisitorStore((s) => s.setSelected);
  const tick = useVisitorStore((s) => s.simulateTick);

  const filtered = useVisitorStore(selectFilteredVisitors);
  const selected = useMemo(
    () => visitors.find((v) => v.id === selectedId) ?? filtered[0] ?? visitors[0],
    [visitors, selectedId, filtered],
  );

  // Live simulation
  useEffect(() => {
    const id = setInterval(() => tick(), 3500);
    return () => clearInterval(id);
  }, [tick]);

  const stats = useMemo(() => {
    const active = visitors.filter((v) => v.status === "active").length;
    const high = visitors.filter((v) => v.intent === "high").length;
    const countries = new Set(visitors.map((v) => v.country)).size;
    return { active, high, countries };
  }, [visitors]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <PageHeader title="Live Visitors" description="Real-time visitor intelligence and proactive engagement.">
        <Badge variant="secondary" className="rounded-full gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[color:var(--success)] animate-pulse" />
          Live
        </Badge>
        <Button variant="outline" className="rounded-xl">
          <Zap className="h-4 w-4" />
          Triggers
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Active now" value={String(stats.active)} delta={8} icon={Eye} accent="info" />
        <StatCard label="High intent" value={String(stats.high)} delta={12} icon={Flame} accent="destructive" />
        <StatCard label="Countries" value={String(stats.countries)} icon={Globe} accent="primary" />
        <StatCard label="Avg. session" value="3m 42s" delta={5} icon={Activity} accent="success" />
      </div>

      <Card className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] p-0">
        <ResizablePanelGroup className="h-full">
          {/* LEFT */}
          <ResizablePanel defaultSize={36} minSize={28}>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    Visitors <span className="text-muted-foreground font-normal">· {filtered.length}</span>
                  </h3>
                </div>
                <VisitorFilters />
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1.5">
                  {filtered.map((v) => (
                    <VisitorCard
                      key={v.id}
                      visitor={v}
                      selected={selected?.id === v.id}
                      onClick={() => setSelected(v.id)}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-xs text-center text-muted-foreground py-8">
                      No visitors match your filters
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* CENTER */}
          <ResizablePanel defaultSize={40} minSize={30}>
            {selected ? (
              <VisitorDetailPanel visitor={selected} />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Select a visitor
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT */}
          <ResizablePanel defaultSize={24} minSize={18}>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Live feed
                  </h3>
                  <Badge variant="secondary" className="rounded-full gap-1.5 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)] animate-pulse" />
                    Streaming
                  </Badge>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <LiveActivityFeed />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>

      <div className="mt-4">
        <ProactiveTriggerBuilder />
      </div>
    </div>
  );
}
