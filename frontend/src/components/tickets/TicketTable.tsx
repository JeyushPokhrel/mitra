import { useMemo } from "react";
import { useTicketsStore } from "@/store/ticketsStore";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, GitMerge, RefreshCw } from "lucide-react";
import { priorityColors, statusColors } from "@/lib/tickets-mock";
import { SLABadge } from "./SLABadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TicketTable() {
  const s = useTicketsStore();

  const filtered = useMemo(() => s.tickets.filter((t) => {
    if (s.search && !`${t.id} ${t.subject} ${t.customer}`.toLowerCase().includes(s.search.toLowerCase())) return false;
    if (s.statusFilter !== "all" && t.status !== s.statusFilter) return false;
    if (s.priorityFilter !== "all" && t.priority !== s.priorityFilter) return false;
    if (s.categoryFilter !== "all" && t.category !== s.categoryFilter) return false;
    if (s.assigneeFilter === "unassigned" && t.assignee) return false;
    if (s.assigneeFilter !== "all" && s.assigneeFilter !== "unassigned" && t.assignee !== s.assigneeFilter) return false;
    return true;
  }), [s.tickets, s.search, s.statusFilter, s.priorityFilter, s.categoryFilter, s.assigneeFilter]);

  const allSelected = filtered.length > 0 && filtered.every((t) => s.selectedIds.includes(t.id));

  return (
    <div className="flex h-full flex-col">
      {s.selectedIds.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-primary/10">
          <span className="text-xs font-semibold">{s.selectedIds.length} selected</span>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs gap-1"
              onClick={() => { s.merge(s.selectedIds); toast.success("Tickets merged"); }}>
              <GitMerge className="h-3 w-3" /> Merge
            </Button>
            <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs gap-1 text-destructive"
              onClick={() => { s.selectedIds.forEach(s.remove); s.clearSelection(); toast.success("Deleted"); }}>
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={s.clearSelection}>Clear</Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-8 pl-4">
                <Checkbox checked={allSelected}
                  onCheckedChange={() => {
                    if (allSelected) s.clearSelection();
                    else filtered.forEach((t) => !s.selectedIds.includes(t.id) && s.toggleSelect(t.id));
                  }} />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} onClick={() => s.select(t.id)}
                className={cn("cursor-pointer", s.selectedId === t.id && "bg-primary/10 hover:bg-primary/15")}>
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={s.selectedIds.includes(t.id)} onCheckedChange={() => s.toggleSelect(t.id)} />
                </TableCell>
                <TableCell className="font-mono text-[11px]">{t.id}</TableCell>
                <TableCell className="max-w-[280px]">
                  <p className="text-sm font-medium truncate">{t.subject}</p>
                  <p className="text-[10px] text-muted-foreground">{t.category} · {t.channel}</p>
                </TableCell>
                <TableCell className="text-xs">{t.customer}</TableCell>
                <TableCell>
                  <Badge className={cn("rounded-full text-[10px] border-0", statusColors[t.status])}>{t.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("rounded-full text-[10px] border-0", priorityColors[t.priority])}>{t.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <SLABadge minutes={t.sla.responseDue} type="response" />
                    <SLABadge minutes={t.sla.resolutionDue} type="resolution" />
                  </div>
                </TableCell>
                <TableCell>
                  {t.assignee ? (
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px] bg-primary/20 text-primary">
                          {t.assignee.split(" ").map((p) => p[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{t.assignee.split(" ")[0]}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.createdAt}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { s.reopen(t.id); toast.success("Reopened"); }}>
                        <RefreshCw className="h-3 w-3 mr-2" /> Reopen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Transferring…")}>Transfer</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Duplicated")}>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"
                        onClick={() => { s.remove(t.id); toast.success("Deleted"); }}>
                        <Trash2 className="h-3 w-3 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No tickets match the current filters.</div>
        )}
      </div>
    </div>
  );
}
