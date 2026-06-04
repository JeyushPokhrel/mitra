import { useState } from "react";
import { useWorkforceStore } from "@/store/workforceStore";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Plus, MoreHorizontal, UserMinus, Pause, Mail, Phone,
} from "lucide-react";
import { ROLES } from "@/lib/workforce-mock";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusDot: Record<string, string> = {
  online: "bg-[color:var(--success)]",
  away: "bg-[color:var(--warning)]",
  busy: "bg-destructive",
  offline: "bg-muted-foreground",
};

export function AgentsTable() {
  const { agents, teams, inviteAgent, removeAgent, suspendAgent, setAgentStatus } = useWorkforceStore();
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");

  const filtered = agents.filter((a) => {
    if (q && !`${a.name} ${a.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (roleFilter !== "all" && a.role !== roleFilter) return false;
    if (teamFilter !== "all" && a.team !== teamFilter) return false;
    return true;
  });

  return (
    <Card className="rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b">
        <div className="relative flex-1 min-w-[160px] max-w-sm">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents…"
            className="pl-8 h-8 rounded-lg text-xs" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-8 text-xs rounded-lg w-36"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All roles</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="h-8 text-xs rounded-lg w-36"><SelectValue placeholder="Team" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All teams</SelectItem>
            {teams.map((t) => <SelectItem key={t.id} value={t.name} className="text-xs">{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 rounded-lg text-xs gap-1.5 ml-auto"
          onClick={() => { inviteAgent({ name: "New Agent", email: "new@mitra.app" }); toast.success("Invite sent"); }}>
          <Plus className="h-3.5 w-3.5" /> Invite agent
        </Button>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CSAT</TableHead>
              <TableHead>Resolved</TableHead>
              <TableHead>Avg response</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-primary/20 text-primary">{a.avatar}</AvatarFallback>
                      </Avatar>
                      <span className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card", statusDot[a.status])} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="h-2.5 w-2.5" /> {a.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="rounded-full text-[10px]">{a.role}</Badge></TableCell>
                <TableCell className="text-xs">{a.team}</TableCell>
                <TableCell>
                  <Select value={a.status} onValueChange={(v) => setAgentStatus(a.id, v as any)}>
                    <SelectTrigger className="h-6 text-[10px] rounded-md w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["online","away","busy","offline"].map((s) =>
                        <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs tabular-nums">{a.csat}%</TableCell>
                <TableCell className="text-xs tabular-nums">{a.resolved}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.responseTime}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.timezone}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast("Opening profile")}>View profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { suspendAgent(a.id); toast.success("Suspended"); }}>
                        <Pause className="h-3 w-3 mr-2" /> Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"
                        onClick={() => { removeAgent(a.id); toast.success("Removed"); }}>
                        <UserMinus className="h-3 w-3 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
