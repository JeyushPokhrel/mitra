export function WidgetTypingIndicator({ name = "Mira AI" }: { name?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
      <span className="text-[11px] text-muted-foreground">{name} is typing…</span>
    </div>
  );
}
