import { useState } from "react";
import { useWorkforceStore } from "@/store/workforceStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DAYS } from "@/lib/workforce-mock";
import { cn } from "@/lib/utils";
import { Plus, Coffee, Clock } from "lucide-react";
import { toast } from "sonner";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM – 11 PM

export function Scheduling() {
  const { shifts, agents } = useWorkforceStore();
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("weekly");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="daily" className="text-xs h-7 px-3">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs h-7 px-3">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs h-7 px-3">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-3 ml-auto text-[10px]">
          <Legend color="bg-primary/60" label="Shift" />
          <Legend color="bg-warning/60" label="Break" />
        </div>
        <Button size="sm" className="h-8 rounded-lg text-xs gap-1.5"
          onClick={() => toast.success("Shift created")}>
          <Plus className="h-3.5 w-3.5" /> Add shift
        </Button>
      </div>

      <Tabs value={view}>
        <TabsContent value="weekly" className="m-0">
          <Card className="rounded-2xl overflow-hidden">
            <div className="overflow-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[160px_repeat(7,_1fr)] border-b bg-muted/30 text-[10px] font-medium text-muted-foreground">
                  <div className="p-2 border-r">Agent</div>
                  {DAYS.map((d) => <div key={d} className="p-2 border-r last:border-r-0 text-center">{d}</div>)}
                </div>
                {agents.slice(0, 10).map((a) => (
                  <div key={a.id} className="grid grid-cols-[160px_repeat(7,_1fr)] border-b last:border-b-0 hover:bg-muted/20">
                    <div className="p-2 border-r text-xs font-medium truncate flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
                      {a.name}
                    </div>
                    {DAYS.map((_, dIdx) => {
                      const dayShifts = shifts.filter((s) => s.agent === a.name && s.day === dIdx);
                      return (
                        <div key={dIdx} className="relative h-10 border-r last:border-r-0">
                          {dayShifts.map((s) => {
                            const left = ((s.start - 6) / 18) * 100;
                            const width = ((s.end - s.start) / 18) * 100;
                            return (
                              <div
                                key={s.id}
                                className={cn(
                                  "absolute top-1 bottom-1 rounded-md text-[9px] px-1.5 flex items-center text-foreground",
                                  s.type === "shift"
                                    ? "bg-primary/30 border border-primary/40"
                                    : "bg-warning/30 border border-warning/40",
                                )}
                                style={{ left: `${left}%`, width: `${width}%` }}
                                title={`${s.start}:00 - ${s.end}:00`}
                              >
                                {s.type === "break" ? <Coffee className="h-2.5 w-2.5" /> : `${s.start}–${s.end}`}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="m-0">
          <Card className="rounded-2xl overflow-hidden">
            <div className="overflow-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[160px_1fr] border-b bg-muted/30 text-[10px] font-medium text-muted-foreground">
                  <div className="p-2 border-r">Agent</div>
                  <div className="p-2 grid grid-cols-18" style={{ gridTemplateColumns: `repeat(${HOURS.length},1fr)` }}>
                    {HOURS.map((h) => <div key={h} className="text-center">{h}</div>)}
                  </div>
                </div>
                {agents.slice(0, 8).map((a) => (
                  <div key={a.id} className="grid grid-cols-[160px_1fr] border-b last:border-b-0">
                    <div className="p-2 border-r text-xs font-medium truncate">{a.name}</div>
                    <div className="relative h-10">
                      {shifts.filter((s) => s.agent === a.name && s.day === 0).map((s) => {
                        const left = ((s.start - 6) / 18) * 100;
                        const width = ((s.end - s.start) / 18) * 100;
                        return (
                          <div key={s.id}
                            className={cn(
                              "absolute top-1 bottom-1 rounded-md text-[9px] px-2 flex items-center gap-1",
                              s.type === "shift" ? "bg-primary/30" : "bg-warning/30",
                            )}
                            style={{ left: `${left}%`, width: `${width}%` }}>
                            <Clock className="h-2.5 w-2.5" /> {s.start}:00–{s.end}:00
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="m-0">
          <Card className="p-4 rounded-2xl">
            <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground mb-2">
              {DAYS.map((d) => <div key={d} className="text-center font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 2;
                const inMonth = day > 0 && day <= 31;
                const shiftCount = shifts.filter((s) => s.day === i % 7 && s.type === "shift").length;
                return (
                  <div key={i} className={cn(
                    "aspect-square rounded-lg border p-1.5 text-[10px]",
                    inMonth ? "bg-card" : "bg-muted/30 text-muted-foreground",
                  )}>
                    <p className="font-semibold">{inMonth ? day : ""}</p>
                    {inMonth && shiftCount > 0 && (
                      <div className="mt-1 h-1 rounded-full bg-primary/40" style={{ width: `${Math.min(100, shiftCount * 4)}%` }} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-3 rounded-sm ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
