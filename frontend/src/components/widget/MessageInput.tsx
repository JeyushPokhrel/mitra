import { useRef, useState } from "react";
import { Paperclip, Smile, Send, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useChatStore, aiReplyFor, shouldEscalate } from "@/store/chatStore";
import { useWidgetStore } from "@/store/widgetStore";

const EMOJIS = ["😀", "😅", "🙏", "🎉", "❤️", "👍", "👀", "🔥", "💡", "✨", "🤝", "🚀"];

export function MessageInput() {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const send = useChatStore((s) => s.send);
  const receive = useChatStore((s) => s.receive);
  const setTyping = useChatStore((s) => s.setTyping);
  const attachAgent = useChatStore((s) => s.attachAgent);
  const linkConv = useChatStore((s) => s.linkConversation);
  const mode = useWidgetStore((s) => s.mode);
  const setMode = useWidgetStore((s) => s.setMode);

  const handleSend = (body: string, kind: "text" | "file" | "image" | "voice" = "text", name?: string) => {
    if (!body.trim() && kind === "text") return;
    send(body, kind, { attachmentName: name });
    setText("");

    // Mark sent + create conversation link
    setTimeout(() => {
      useChatStore.setState((s) => ({
        messages: s.messages.map((m) =>
          m.status === "sending" ? { ...m, status: "sent" as const } : m,
        ),
        session: { ...s.session, conversationId: s.session.conversationId ?? `conv-${Date.now()}` },
      }));
    }, 400);

    if (kind !== "text") return;

    if (mode === "offline") {
      setTimeout(() => {
        receive({
          sender: "system",
          kind: "system",
          body: "We're offline — your message has been emailed to our team.",
        });
      }, 600);
      return;
    }

    // AI / agent reply simulation
    if (shouldEscalate(body)) {
      setTyping("ai");
      setTimeout(() => {
        receive({ sender: "ai", kind: "text", body: "Connecting you to an agent now…", authorName: "Mira AI" });
        setTyping(null);
        setTimeout(() => {
          attachAgent("a1", "Rohan K.");
          setMode("agent");
          linkConv(`conv-${Date.now()}`);
          setTyping("agent");
          setTimeout(() => {
            receive({ sender: "agent", kind: "text", body: "Hey! I just picked up your chat — what can I help with?", authorName: "Rohan K." });
            setTyping(null);
          }, 1200);
        }, 800);
      }, 700);
      return;
    }

    if (mode === "ai") {
      setTyping("ai");
      setTimeout(() => {
        receive({ sender: "ai", kind: "text", body: aiReplyFor(body), authorName: "Mira AI" });
        setTyping(null);
      }, 900);
    } else {
      setTyping("agent");
      setTimeout(() => {
        receive({ sender: "agent", kind: "text", body: "Thanks — let me check on that.", authorName: "Rohan K." });
        setTyping(null);
      }, 1100);
    }
  };

  const onFile = (f: File) => {
    const kind = f.type.startsWith("image/") ? "image" : "file";
    handleSend(f.name, kind, f.name);
    toast.success("File uploaded", { description: f.name });
  };

  return (
    <div className="border-t bg-card">
      <div
        ref={dragRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
        className="px-3 pt-2"
      >
        {showEmoji && (
          <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-xl bg-muted">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => {
                  setText((t) => t + e);
                  setShowEmoji(false);
                }}
                className="text-lg hover:scale-125 transition-transform"
              >
                {e}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-1">
          <textarea
            rows={1}
            placeholder="Type your message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(text);
              }
            }}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none py-2 max-h-24"
          />
          {text.trim() ? (
            <Button size="icon" onClick={() => handleSend(text)} className="h-8 w-8 rounded-full shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setRecording((r) => !r);
                if (recording) {
                  handleSend("Voice note", "voice", "voice-0:14.webm");
                }
              }}
              className="h-8 w-8 rounded-full shrink-0"
            >
              {recording ? <Square className="h-3.5 w-3.5 text-destructive" /> : <Mic className="h-3.5 w-3.5" />}
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 text-muted-foreground">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEmoji((s) => !s)}
            className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center"
            aria-label="Emoji"
          >
            <Smile className="h-4 w-4" />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </div>
        <span className="text-[10px]">
          Powered by <span className="font-semibold">MITRA</span>
        </span>
      </div>
    </div>
  );
}
