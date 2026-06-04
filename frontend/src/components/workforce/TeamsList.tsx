import { useWorkforceStore } from "@/store/workforceStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const colorMap: Record<string, string> = {
  primary: "from-primary/30 to-primary/10",
  info:    "from-info/30 to-info/10",
  warning: "from-warning/30 to-warning/10",
  success: "from-success/30 to-success/10",
};

export function TeamsList() {
  const { teams, agents, addTeam, removeTeam } = useWorkforceStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Teams</p>
        <Button size="sm" className="h-8 rounded-lg text-xs gap-1.5"
          onClick={() => { addTeam({ name: "New Team" }); toast.success("Team created"); }}>
          <Plus className="h-3.5 w-3.5" /> New team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {teams.map((t) => {
          const members = agents.filter((a) => a.team === t.name).slice(0, 4);
          return (
            <Card key={t.id} className="p-4 rounded-2xl overflow-hidden">
              <div className={`h-1.5 -mx-4 -mt-4 mb-3 bg-gradient-to-r ${colorMap[t.color] ?? colorMap.primary}`} />
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{t.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-6 w-6"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast("Editing team")}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast("Assigning agents")}>Assign agents</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"
                      onClick={() => { removeTeam(t.id); toast.success("Team removed"); }}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-muted-foreground">
                <Users className="h-3 w-3" /> {t.members} members
                <span>·</span>
                <span>Lead: {t.lead.split(" ")[0]}</span>
              </div>
              <div className="flex items-center mt-3">
                {members.map((m, i) => (
                  <Avatar key={m.id} className={`h-6 w-6 border-2 border-card ${i > 0 ? "-ml-2" : ""}`}>
                    <AvatarFallback className="text-[9px] bg-primary/20 text-primary">{m.avatar}</AvatarFallback>
                  </Avatar>
                ))}
                {t.members > members.length && (
                  <Badge variant="secondary" className="ml-2 rounded-full text-[9px] h-5">+{t.members - members.length}</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
