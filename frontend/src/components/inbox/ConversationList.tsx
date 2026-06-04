import { useMemo, useState, useEffect, useRef } from "react";
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConversationCard } from "./ConversationCard";
import {
  useConversationStore, useCustomerStore, useAgentStore,
  type ViewKey, type SortKey,
} from "@/store/inboxStore";
import { cn } from "@/lib/utils";

const views: { key: ViewKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "assigned", label: "Assigned" },
  { key: "unassigned", label: "Unassigned" },
  { key: "resolved", label: "Resolved" },
  { key: "vip", label: "VIP" },
  { key: "spam", label: "Spam" },
];

const sorts: { key: SortKey; label: string }[] = [
  { key: "latest", label: "Latest message" },
  { key: "waiting", label: "Waiting longest" },
  { key: "priority", label: "Priority" },
  { key: "agent", label: "Assigned agent" },
];

const priOrder = { urgent: 0, high: 1, normal: 2, low: 3 } as const;

export function ConversationList() {
  const { conversations, selectedId, setSelected, filters, setFilter } = useConversationStore();
  const customers = useCustomerStore((s) => s.customers);
  const agents = useAgentStore((s) => s.agents);
  const [visible, setVisible] = useState(20);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = conversations.slice();
    const f = filters;
    if (f.view === "open") list = list.filter((c) => c.status === "open" || c.status === "pending");
    if (f.view === "assigned") list = list.filter((c) => !!c.assignedTo);
    if (f.view === "unassigned") list = list.filter((c) => !c.assignedTo);
    if (f.view === "resolved") list = list.filter((c) => c.status === "resolved");
    if (f.view === "vip") list = list.filter((c) => c.vip);
    if (f.view === "spam") list = list.filter((c) => c.status === "spam");
    if (f.channel) list = list.filter((c) => c.channel === f.channel);
    if (f.agent) list = list.filter((c) => c.assignedTo === f.agent);
    if (f.tag) list = list.filter((c) => c.tags.includes(f.tag!));
    if (f.sentiment) list = list.filter((c) => c.sentiment === f.sentiment);
    if (f.query) {
      const q = f.query.toLowerCase();
      list = list.filter((c) => {
        const cust = customers.find((x) => x.id === c.customerId);
        return c.subject.toLowerCase().includes(q)
          || c.lastMessage.toLowerCase().includes(q)
          || cust?.name.toLowerCase().includes(q);
      });
    }
    if (f.sort === "waiting") list.sort((a, b) => b.waitingMinutes - a.waitingMinutes);
    if (f.sort === "priority") list.sort((a, b) => priOrder[a.priority] - priOrder[b.priority]);
    if (f.sort === "agent") list.sort((a, b) => (a.assignedTo ?? "").localeCompare(b.assignedTo ?? ""));
    return list;
  }, [conversations, filters, customers]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200 && visible < filtered.length) {
      setVisible((v) => Math.min(v + 15, filtered.length));
    }
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="p-3 border-b space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Inbox</h2>
          <span className="text-[10px] text-muted-foreground">{filtered.length} conversations</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => setFilter("query", e.target.value)}
            placeholder="Search conversations…"
            className="pl-9 h-9 rounded-xl text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 rounded-lg text-xs">
                <Filter className="h-3 w-3" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Channel</DropdownMenuLabel>
              {["chat", "email", "whatsapp", "instagram", "slack", "sms"].map((c) => (
                <DropdownMenuItem key={c} onClick={() => setFilter("channel", filters.channel === c ? null : c)}>
                  <span className={cn("capitalize", filters.channel === c && "font-semibold text-primary")}>{c}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Agent</DropdownMenuLabel>
              {agents.slice(0, 6).map((a) => (
                <DropdownMenuItem key={a.id} onClick={() => setFilter("agent", filters.agent === a.id ? null : a.id)}>
                  <span className={cn(filters.agent === a.id && "font-semibold text-primary")}>{a.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sentiment</DropdownMenuLabel>
              {["positive", "neutral", "negative"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setFilter("sentiment", filters.sentiment === s ? null : s)}>
                  <span className={cn("capitalize", filters.sentiment === s && "font-semibold text-primary")}>{s}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 rounded-lg text-xs ml-auto">
                <SlidersHorizontal className="h-3 w-3" />
                {sorts.find((s) => s.key === filters.sort)?.label}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sorts.map((s) => (
                <DropdownMenuItem key={s.key} onClick={() => setFilter("sort", s.key)}>
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-0.5">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setFilter("view", v.key)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors",
                filters.view === v.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-3 border-b flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          : filtered.slice(0, visible).map((conv) => (
              <ConversationCard
                key={conv.id}
                conv={conv}
                customer={customers.find((c) => c.id === conv.customerId)}
                agent={agents.find((a) => a.id === conv.assignedTo)}
                active={conv.id === selectedId}
                onClick={() => setSelected(conv.id)}
              />
            ))}
        {!loading && visible < filtered.length && (
          <div className="p-4 text-center text-xs text-muted-foreground">Loading more…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No conversations match these filters.</div>
        )}
      </div>
    </div>
  );
}
