import { useMemo } from "react";
import { useCRMStore } from "@/store/crmStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, UserCheck, Archive, Mail } from "lucide-react";
import { OWNERS } from "@/lib/crm-mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const lifecycleColors: Record<string, string> = {
  Visitor: "bg-muted text-foreground",
  Lead: "bg-info/15 text-[color:var(--info)]",
  MQL: "bg-warning/15 text-[color:var(--warning)]",
  SQL: "bg-primary/20 text-primary",
  Opportunity: "bg-chart-2/15 text-[color:var(--chart-2)]",
  Customer: "bg-success/15 text-[color:var(--success)]",
  Evangelist: "bg-destructive/15 text-destructive",
};

export function ContactsTable({ leadsOnly = false }: { leadsOnly?: boolean }) {
  const s = useCRMStore();

  const filtered = useMemo(() => {
    return s.contacts.filter((c) => {
      if (c.archived) return false;
      if (leadsOnly && !["Lead", "MQL", "SQL", "Opportunity"].includes(c.lifecycle)) return false;
      if (s.search && !`${c.name} ${c.email} ${c.company}`.toLowerCase().includes(s.search.toLowerCase())) return false;
      if (s.ownerFilter !== "all" && c.owner !== s.ownerFilter) return false;
      if (s.sourceFilter !== "all" && c.source !== s.sourceFilter) return false;
      if (s.tagFilter !== "all" && !c.tags.includes(s.tagFilter)) return false;
      if (s.lifecycleFilter !== "all" && c.lifecycle !== s.lifecycleFilter) return false;
      if (s.view === "vip" && !c.tags.includes("VIP")) return false;
      if (s.view === "hot" && c.leadScore < 70) return false;
      if (s.view === "churn" && c.churnRisk < 60) return false;
      return true;
    });
  }, [s.contacts, s.search, s.ownerFilter, s.sourceFilter, s.tagFilter, s.lifecycleFilter, s.view, leadsOnly]);

  const allSelected = filtered.length > 0 && filtered.every((c) => s.selectedIds.includes(c.id));

  return (
    <div className="flex h-full flex-col">
      {s.selectedIds.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-primary/10">
          <span className="text-xs font-semibold">{s.selectedIds.length} selected</span>
          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs gap-1">
                  <UserCheck className="h-3 w-3" /> Assign
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {OWNERS.map((o) => (
                  <DropdownMenuItem
                    key={o}
                    onClick={() => {
                      s.bulkAssign(o);
                      toast.success(`Assigned to ${o}`);
                    }}
                  >
                    {o}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs gap-1">
              <Mail className="h-3 w-3" /> Email
            </Button>
            <Button
              size="sm" variant="outline"
              className="h-7 rounded-lg text-xs gap-1 text-destructive"
              onClick={() => {
                s.bulkDelete();
                toast.success("Contacts deleted");
              }}
            >
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={s.clearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-8 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => {
                    if (allSelected) s.clearSelection();
                    else filtered.forEach((c) => !s.selectedIds.includes(c.id) && s.toggleSelect(c.id));
                  }}
                />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Lifecycle</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow
                key={c.id}
                onClick={() => s.select(c.id)}
                className={cn(
                  "cursor-pointer",
                  s.selectedContactId === c.id && "bg-primary/10 hover:bg-primary/15",
                )}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={s.selectedIds.includes(c.id)}
                    onCheckedChange={() => s.toggleSelect(c.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                        {c.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{c.company}</p>
                  <p className="text-[11px] text-muted-foreground">{c.designation}</p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full text-[10px] h-5 border-0", lifecycleColors[c.lifecycle])}
                  >
                    {c.lifecycle}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-24">
                    <Progress value={c.leadScore} className="h-1.5" />
                    <span className="text-[11px] tabular-nums w-6">{c.leadScore}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{c.owner.split(" ")[0]}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.source}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.lastActive}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast("Opening editor")}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Merge wizard opened")}>Merge duplicate</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { s.archiveContact(c.id); toast.success("Archived"); }}>
                        <Archive className="h-3 w-3 mr-2" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => { s.deleteContact(c.id); toast.success("Deleted"); }}
                      >
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
          <div className="py-12 text-center text-sm text-muted-foreground">No contacts match the current filters.</div>
        )}
      </div>
    </div>
  );
}
