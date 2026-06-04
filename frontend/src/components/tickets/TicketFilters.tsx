import { useTicketsStore } from "@/store/ticketsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES,
} from "@/lib/tickets-mock";
import { agents } from "@/lib/workforce-mock";
import {
  Search, Filter, Inbox as InboxIcon, Tag, AlertOctagon, Users, UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TicketFilters() {
  const s = useTicketsStore();

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            value={s.search}
            onChange={(e) => s.setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="pl-8 h-8 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
        <Section icon={InboxIcon} title="Status">
          <Row label="All" active={s.statusFilter === "all"} onClick={() => s.setStatusFilter("all")} />
          {TICKET_STATUSES.map((st) => (
            <Row key={st} label={st} active={s.statusFilter === st} onClick={() => s.setStatusFilter(st)} />
          ))}
        </Section>

        <Section icon={AlertOctagon} title="Priority">
          <Row label="All" active={s.priorityFilter === "all"} onClick={() => s.setPriorityFilter("all")} />
          {TICKET_PRIORITIES.map((p) => (
            <Row key={p} label={p} active={s.priorityFilter === p} onClick={() => s.setPriorityFilter(p)} />
          ))}
        </Section>

        <Section icon={Tag} title="Category">
          <Row label="All" active={s.categoryFilter === "all"} onClick={() => s.setCategoryFilter("all")} />
          {TICKET_CATEGORIES.map((c) => (
            <Row key={c} label={c} active={s.categoryFilter === c} onClick={() => s.setCategoryFilter(c)} />
          ))}
        </Section>

        <Section icon={Users} title="Assignee">
          <Row label="All" active={s.assigneeFilter === "all"} onClick={() => s.setAssigneeFilter("all")} />
          <Row
            label="Unassigned"
            icon={UserMinus}
            active={s.assigneeFilter === "unassigned"}
            onClick={() => s.setAssigneeFilter("unassigned")}
          />
          {agents.slice(0, 6).map((a) => (
            <Row key={a.id} label={a.name} active={s.assigneeFilter === a.name}
              onClick={() => s.setAssigneeFilter(a.name)} />
          ))}
        </Section>
      </div>

      <Separator />
      <div className="p-3">
        <Button size="sm" variant="outline" className="w-full h-8 rounded-lg text-xs gap-2">
          <Filter className="h-3 w-3" /> Save view
        </Button>
      </div>
    </div>
  );
}

function Section({
  icon: Icon, title, children,
}: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <p className="text-[10px] font-semibold uppercase tracking-wide">{title}</p>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({
  label, active, icon: Icon, onClick,
}: { label: string; active?: boolean; icon?: React.ComponentType<{ className?: string }>; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-1.5 text-left px-2 py-1.5 rounded-md transition-colors",
        active ? "bg-primary/15 text-foreground font-medium" : "hover:bg-muted",
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span className="truncate">{label}</span>
    </button>
  );
}
