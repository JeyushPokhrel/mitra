import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip, Smile, Mic, Send, Sparkles, FileText, Zap, AtSign,
  Image as ImageIcon, Video, Hash, Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { cannedResponses, slashCommands, agents } from "@/lib/inbox-mock";
import { useMessageStore, useConversationStore, useAiAssistantStore } from "@/store/inboxStore";

const EMOJIS = ["😀", "😂", "😊", "🙏", "👍", "🎉", "🔥", "💯", "❤️", "✨", "🚀", "👏", "🙌", "💡", "✅", "❌", "⚠️", "📎"];
const GIFS = ["thumbs-up", "applause", "high-five", "lol", "shrug", "ok-hand"];

export function MessageComposer() {
  const selectedId = useConversationStore((s) => s.selectedId)!;
  const send = useMessageStore((s) => s.sendMessage);
  const aiRun = useAiAssistantStore((s) => s.run);
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<"reply" | "note">("reply");
  const [showSlash, setShowSlash] = useState(false);
  const [showMention, setShowMention] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [dragging, setDragging] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!recording) { setRecordTime(0); return; }
    const t = setInterval(() => setRecordTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  function handleChange(v: string) {
    setValue(v);
    setShowSlash(v.startsWith("/"));
    setShowMention(/(^|\s)@\w*$/.test(v));
  }

  function handleSend() {
    if (!value.trim()) return;
    send(selectedId, value, mode === "note" ? "note" : "text");
    setValue("");
    setShowSlash(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSend(); }
  }

  async function runAi(action: string) {
    const out = await aiRun(action);
    setValue((v) => v + (v ? "\n\n" : "") + out);
    taRef.current?.focus();
  }

  function insertCanned(body: string) {
    setValue((v) => (v ? v + "\n" : "") + body);
    taRef.current?.focus();
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); }}
      className={cn(
        "border-t bg-card relative",
        dragging && "ring-2 ring-primary ring-inset"
      )}
    >
      {dragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
          <p className="text-sm font-semibold text-primary">Drop files to attach</p>
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex items-center gap-1 px-3 pt-2">
        {(["reply", "note"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "text-xs px-3 py-1 rounded-md font-medium transition-colors",
              mode === m
                ? m === "note"
                  ? "bg-warning/15 text-warning-foreground"
                  : "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            {m === "reply" ? "Reply" : "Internal note"}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-muted-foreground">
          Ctrl + Enter to send · {value.length} chars
        </span>
      </div>

      {/* Slash commands */}
      <AnimatePresence>
        {showSlash && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-3 mt-2 rounded-xl border bg-popover shadow-lg p-1.5 max-h-48 overflow-y-auto"
          >
            {slashCommands.filter((c) => c.cmd.startsWith(value.trim())).map((c) => (
              <button key={c.cmd} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent">
                <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded">{c.cmd}</code>
                <span className="text-xs text-muted-foreground">{c.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mentions */}
      <AnimatePresence>
        {showMention && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-3 mt-2 rounded-xl border bg-popover shadow-lg p-1.5 max-h-48 overflow-y-auto"
          >
            {agents.slice(0, 5).map((a) => (
              <button
                key={a.id}
                onClick={() => { setValue((v) => v.replace(/@\w*$/, `@${a.name.split(" ")[0]} `)); setShowMention(false); }}
                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent"
              >
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] grid place-items-center font-semibold">{a.avatar}</span>
                <span className="text-xs font-medium">{a.name}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{a.team}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className={cn(
        "m-3 rounded-2xl border bg-background transition-colors",
        mode === "note" && "bg-warning/5 border-warning/30"
      )}>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={mode === "note" ? "Write a private note for your team…" : "Reply… use / for commands, @ to mention"}
          rows={3}
          className="w-full resize-none bg-transparent outline-none text-sm px-3.5 py-2.5 placeholder:text-muted-foreground"
        />

        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 pb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Emoji"><Smile className="h-4 w-4" /></Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
              <div className="grid grid-cols-9 gap-1">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setValue((v) => v + e)} className="text-lg hover:bg-accent rounded p-0.5">{e}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="GIF"><ImageIcon className="h-4 w-4" /></Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-2">
              <Input placeholder="Search GIFs…" className="h-8 text-xs mb-2" />
              <div className="grid grid-cols-3 gap-1.5">
                {GIFS.map((g) => (
                  <button key={g} className="aspect-video rounded-lg bg-muted hover:ring-2 hover:ring-primary text-[10px] capitalize text-muted-foreground">{g}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="h-7 w-7" title="Attach file"><Paperclip className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Video"><Video className="h-4 w-4" /></Button>

          <Button
            variant="ghost" size="icon"
            className={cn("h-7 w-7", recording && "bg-destructive/15 text-destructive")}
            onClick={() => setRecording((r) => !r)}
            title="Voice note"
          >
            {recording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
          </Button>
          {recording && (
            <span className="text-[10px] font-mono text-destructive flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              {Math.floor(recordTime / 60)}:{String(recordTime % 60).padStart(2, "0")}
            </span>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Canned responses"><Zap className="h-4 w-4" /></Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-0">
              <Tabs defaultValue="all">
                <div className="p-2 border-b">
                  <Input placeholder="Search templates…" className="h-7 text-xs" />
                </div>
                <TabsList className="w-full justify-start rounded-none border-b h-9 px-1">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="fav" className="text-xs">Favorites</TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="p-1 max-h-64 overflow-y-auto m-0">
                  {cannedResponses.map((r) => (
                    <button key={r.id} onClick={() => insertCanned(r.body)} className="w-full text-left p-2 rounded-md hover:bg-accent">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{r.title}</span>
                        <span className="text-[10px] text-muted-foreground">{r.category}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{r.body}</p>
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="fav" className="p-1 m-0">
                  {cannedResponses.filter((r) => r.favorite).map((r) => (
                    <button key={r.id} onClick={() => insertCanned(r.body)} className="w-full text-left p-2 rounded-md hover:bg-accent">
                      <span className="text-xs font-semibold">{r.title}</span>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{r.body}</p>
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="recent" className="p-3 text-xs text-muted-foreground m-0">No recent templates yet.</TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="h-7 w-7" title="Mention" onClick={() => { setValue((v) => v + "@"); setShowMention(true); }}>
            <AtSign className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Slash command" onClick={() => { setValue("/"); setShowSlash(true); taRef.current?.focus(); }}>
            <Hash className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="AI assistant"><Sparkles className="h-4 w-4 text-primary" /></Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-1.5">
              {["generate", "rephrase", "friendly", "formal", "grammar", "translate"].map((a) => (
                <button key={a} onClick={() => runAi(a)} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent text-xs capitalize">
                  <Sparkles className="h-3 w-3 text-primary" />{a}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-1">
            <Button onClick={handleSend} size="sm" className="h-8 rounded-xl gap-1.5">
              <Send className="h-3.5 w-3.5" /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
