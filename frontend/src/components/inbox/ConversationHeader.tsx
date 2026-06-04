import { useState } from "react";
import {
  Phone, Video, MoreHorizontal, Tag, Lock, Archive, ArrowUpRight,
  AlarmClock, Download, FileDown, Sparkles, ChevronDown, UserPlus, Star, Ban, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChannelIcon, channelLabel } from "./ChannelIcon";
import { CallControlPanel } from "./CallControlPanel";
import { useConversationStore, useCustomerStore, useAgentStore } from "@/store/inboxStore";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  open: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  resolved: "bg-muted text-muted-foreground border-border",
  snoozed: "bg-info/15 text-info border-info/30",
  spam: "bg-destructive/15 text-destructive border-destructive/30",
};

export function ConversationHeader() {
  const { conversations, selectedId, updateConversation } = useConversationStore();
  const conv = conversations.find((c) => c.id === selectedId)!;
  const customer = useCustomerStore((s) => s.getById(conv.customerId));
  const agents = useAgentStore((s) => s.agents);
  const assigned = agents.find((a) => a.id === conv.assignedTo);
  const [call, setCall] = useState<null | "voice" | "video">(null);

  return (
    <>
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-3.5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{customer?.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate">{customer?.name}</p>
                {conv.vip && <Star className="h-3.5 w-3.5 fill-warning text-warning shrink-0" />}
                <Badge variant="outline" className={cn("h-5 text-[10px] rounded-full", statusColor[conv.status])}>
                  {conv.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <ChannelIcon channel={conv.channel} />
                <span>{channelLabel(conv.channel)}</span>
                <span>·</span>
                <span className="truncate">{conv.subject}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-xs">{assigned ? assigned.name.split(" ")[0] : "Assign"}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Assign to</DropdownMenuLabel>
                {agents.slice(0, 8).map((a) => (
                  <DropdownMenuItem key={a.id} onClick={() => updateConversation(conv.id, { assignedTo: a.id })}>
                    <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] grid place-items-center font-semibold mr-2">{a.avatar}</span>
                    {a.name}
                    <span className="ml-auto text-[10px] text-muted-foreground">{a.team}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCall("voice")} title="Voice call"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCall("video")} title="Video call"><Video className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Add tag"><Tag className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Snooze / reminder"><AlarmClock className="h-4 w-4" /></Button>
            <Button
              variant="ghost" size="icon"
              className={cn("h-8 w-8 rounded-lg", conv.locked && "text-warning")}
              onClick={() => updateConversation(conv.id, { locked: !conv.locked })}
              title="Lock"
            ><Lock className="h-4 w-4" /></Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem><ArrowUpRight className="h-3.5 w-3.5" />Escalate to Tier 2</DropdownMenuItem>
                <DropdownMenuItem><Archive className="h-3.5 w-3.5" />Archive conversation</DropdownMenuItem>
                <DropdownMenuItem><Download className="h-3.5 w-3.5" />Export conversation</DropdownMenuItem>
                <DropdownMenuItem><FileDown className="h-3.5 w-3.5" />Download transcript</DropdownMenuItem>
                <DropdownMenuItem><Sparkles className="h-3.5 w-3.5 text-primary" />AI summarize</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Ban className="h-3.5 w-3.5" />Mark as spam</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className="h-8 rounded-lg ml-1"
              onClick={() => updateConversation(conv.id, { status: conv.status === "resolved" ? "open" : "resolved" })}
            >
              {conv.status === "resolved" ? "Reopen" : "Resolve"}
            </Button>
          </div>
        </div>

        {/* SLA bar */}
        {conv.sla && (
          <div className={cn(
            "flex items-center gap-2 text-[11px] px-3.5 py-1 border-t",
            conv.sla.breached ? "bg-destructive/10 text-destructive" : "bg-muted/40 text-muted-foreground"
          )}>
            <AlarmClock className="h-3 w-3" />
            {conv.sla.breached ? "SLA breached" : `SLA due in ${conv.sla.dueIn}`}
            <span className="ml-auto">Priority: <span className="font-semibold capitalize">{conv.priority}</span></span>
          </div>
        )}
      </div>

      {call && (
        <CallControlPanel
          mode={call}
          customerName={customer?.name ?? ""}
          customerAvatar={customer?.avatar ?? "?"}
          onEnd={() => setCall(null)}
        />
      )}
    </>
  );
}
