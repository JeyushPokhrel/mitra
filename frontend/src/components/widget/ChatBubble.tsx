import { cn } from "@/lib/utils";
import { Check, CheckCheck, Sparkles, FileText, Mic, Image as ImageIcon, Play } from "lucide-react";
import type { ChatMessage } from "@/store/chatStore";

function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatBubble({ msg }: { msg: ChatMessage }) {
  if (msg.kind === "system") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[10px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {msg.body}
        </span>
      </div>
    );
  }

  const isVisitor = msg.sender === "visitor";
  const isAi = msg.sender === "ai";
  const isBot = msg.sender === "bot";

  return (
    <div className={cn("flex gap-2 px-3", isVisitor ? "justify-end" : "justify-start")}>
      {!isVisitor && (
        <div
          className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold",
            isAi || isBot ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground",
          )}
        >
          {isAi || isBot ? <Sparkles className="h-3.5 w-3.5" /> : msg.authorName?.[0] ?? "A"}
        </div>
      )}
      <div className={cn("max-w-[78%] flex flex-col", isVisitor ? "items-end" : "items-start")}>
        {!isVisitor && msg.authorName && (
          <span className="text-[10px] text-muted-foreground mb-0.5 px-1">{msg.authorName}</span>
        )}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-snug shadow-[var(--shadow-soft)]",
            isVisitor
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card border border-border/60 rounded-bl-md",
          )}
        >
          {msg.kind === "text" && <p className="whitespace-pre-wrap break-words">{msg.body}</p>}
          {msg.kind === "image" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-center w-48 h-32 rounded-lg bg-muted text-muted-foreground">
                <ImageIcon className="h-6 w-6" />
              </div>
              <p className="text-[11px] opacity-80">{msg.attachmentName ?? "image.png"}</p>
            </div>
          )}
          {msg.kind === "file" && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 opacity-70" />
              <span className="text-xs">{msg.attachmentName ?? msg.body}</span>
            </div>
          )}
          {msg.kind === "voice" && (
            <div className="flex items-center gap-2 min-w-[140px]">
              <button className="h-6 w-6 rounded-full bg-background/30 flex items-center justify-center">
                <Play className="h-3 w-3" />
              </button>
              <div className="flex-1 h-1 rounded-full bg-background/30 overflow-hidden">
                <div className="h-full w-1/3 bg-current opacity-60 rounded-full" />
              </div>
              <span className="text-[10px] opacity-80">0:14</span>
              <Mic className="h-3 w-3 opacity-60" />
            </div>
          )}
        </div>
        <div className={cn("flex items-center gap-1 mt-1 px-1 text-[10px] text-muted-foreground")}>
          <span>{timeStr(msg.at)}</span>
          {isVisitor && msg.status === "sending" && <span>· sending…</span>}
          {isVisitor && msg.status === "sent" && <Check className="h-3 w-3" />}
          {isVisitor && msg.status === "delivered" && <CheckCheck className="h-3 w-3" />}
          {isVisitor && msg.status === "read" && <CheckCheck className="h-3 w-3 text-primary" />}
        </div>
      </div>
    </div>
  );
}
