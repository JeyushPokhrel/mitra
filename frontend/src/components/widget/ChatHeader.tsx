import { Minus, X, Sparkles, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWidgetStore } from "@/store/widgetStore";
import { useChatStore } from "@/store/chatStore";

export function ChatHeader() {
  const { orgName, setOpen, setMinimized, mode, view, setView } = useWidgetStore();
  const session = useChatStore((s) => s.session);

  const subtitle =
    mode === "offline"
      ? "Offline · We'll reply by email"
      : mode === "agent"
      ? `${session.agentName ?? "Agent"} · Online`
      : "AI assistant · Online";

  return (
    <div
      className="px-4 py-3 flex items-center gap-3 text-primary-foreground rounded-t-2xl"
      style={{
        background:
          "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 75%, black) 100%)",
      }}
    >
      {view !== "home" && (
        <button
          onClick={() => setView("home")}
          className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <Avatar className="h-9 w-9 ring-2 ring-white/30">
        <AvatarFallback className="bg-white/15 text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{orgName}</p>
        <p className="text-[11px] opacity-90 flex items-center gap-1.5">
          <span
            className={
              mode === "offline"
                ? "h-1.5 w-1.5 rounded-full bg-white/60"
                : "h-1.5 w-1.5 rounded-full bg-[color:var(--success)]"
            }
          />
          {subtitle}
        </p>
      </div>
      <button
        onClick={() => setMinimized(true)}
        className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center"
        aria-label="Minimize"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        onClick={() => setOpen(false)}
        className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
