import { motion } from "framer-motion";
import { Check, CheckCheck, Clock, Sparkles, Pencil, Trash2, Reply, Bot, FileText, Image as ImageIcon, Mic, Play } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/inbox-mock";

interface Props {
  msg: Message;
  authorName?: string;
  authorAvatar?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
}

function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "sending") return <Clock className="h-3 w-3 opacity-60" />;
  if (status === "sent") return <Check className="h-3 w-3 opacity-60" />;
  if (status === "delivered") return <CheckCheck className="h-3 w-3 opacity-60" />;
  if (status === "seen") return <CheckCheck className="h-3 w-3 text-info" />;
  return <span className="text-destructive text-[10px]">!</span>;
}

export function MessageBubble({ msg, authorName, authorAvatar, onEdit, onDelete, onReply }: Props) {
  // System message
  if (msg.kind === "system") {
    return (
      <div className="flex justify-center my-3">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
          {msg.body}
        </span>
      </div>
    );
  }

  // Internal note
  if (msg.kind === "note") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 px-2 my-2">
        <div className="flex-1 rounded-xl bg-warning/10 border border-warning/30 px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-warning-foreground/80 mb-1">
            <FileText className="h-3 w-3" /> Internal note · {authorName ?? "Agent"}
          </div>
          <p className="text-xs">{msg.body}</p>
        </div>
      </motion.div>
    );
  }

  // AI suggestion
  if (msg.kind === "ai") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 px-2 my-2">
        <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/15 to-info/10 border border-primary/30 px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-primary mb-1">
            <Bot className="h-3 w-3" /> AI assistant
          </div>
          <p className="text-xs italic">{msg.body}</p>
          <div className="flex gap-1 mt-2">
            <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-md">Use reply</Button>
            <Button size="sm" variant="ghost" className="h-6 text-[10px] rounded-md">Dismiss</Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const isAgent = msg.sender === "agent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("group flex gap-2 my-2", isAgent ? "justify-end" : "justify-start")}
    >
      {!isAgent && (
        <Avatar className="h-7 w-7 mt-auto">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">{authorAvatar ?? "?"}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[78%]", isAgent ? "items-end" : "items-start")}>
        {msg.replyTo && (
          <div className="text-[10px] text-muted-foreground border-l-2 border-primary pl-2 mb-1 italic max-w-full truncate">
            ↪ Replying to message
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 shadow-[var(--shadow-soft)] relative",
            isAgent
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card border rounded-bl-md"
          )}
        >
          {/* Attachments */}
          {msg.kind === "image" && (
            <div className="mb-1.5 -mx-1 -mt-1 rounded-xl bg-muted/40 aspect-video w-56 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 opacity-50" />
            </div>
          )}
          {msg.kind === "file" && msg.attachment && (
            <div className="flex items-center gap-2 mb-1 px-2 py-1.5 rounded-lg bg-background/15 text-current">
              <FileText className="h-4 w-4" />
              <div className="text-xs">
                <p className="font-semibold leading-tight">{msg.attachment.name}</p>
                <p className="opacity-70 text-[10px]">{msg.attachment.size}</p>
              </div>
            </div>
          )}
          {msg.kind === "voice" && msg.attachment && (
            <div className="flex items-center gap-2 min-w-[180px]">
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-background/20 hover:bg-background/30">
                <Play className="h-3.5 w-3.5" />
              </Button>
              <div className="flex-1 h-1 rounded-full bg-current/20 overflow-hidden">
                <div className="h-full w-1/3 bg-current/60" />
              </div>
              <span className="text-[10px] opacity-80 flex items-center gap-1"><Mic className="h-3 w-3" />{msg.attachment.duration}</span>
            </div>
          )}
          {msg.body && <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>}

          <div className={cn("flex items-center gap-1 mt-1 text-[10px] opacity-70", isAgent ? "justify-end" : "justify-start")}>
            <span>{msg.createdAt}</span>
            {msg.edited && <span className="italic">· edited</span>}
            {isAgent && <StatusIcon status={msg.status} />}
          </div>
        </div>

        {/* Hover actions */}
        <div className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 mt-0.5",
          isAgent ? "flex-row-reverse" : "flex-row"
        )}>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onReply}><Reply className="h-3 w-3" /></Button>
          {isAgent && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onEdit}><Pencil className="h-3 w-3" /></Button>}
          {isAgent && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>}
          <Button size="icon" variant="ghost" className="h-6 w-6"><Sparkles className="h-3 w-3 text-primary" /></Button>
        </div>
      </div>
    </motion.div>
  );
}
