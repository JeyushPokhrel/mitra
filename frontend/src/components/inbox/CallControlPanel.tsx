import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Video, Mic, MicOff, PhoneOff, PauseCircle, ArrowRightLeft, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props { mode: "voice" | "video"; customerName: string; customerAvatar: string; onEnd: () => void; }

export function CallControlPanel({ mode, customerName, customerAvatar, onEnd }: Props) {
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  useEffect(() => { const t = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, []);

  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="border-b bg-gradient-to-r from-primary/10 to-info/10"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{customerAvatar}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold flex items-center gap-2">
            {mode === "video" ? <Video className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
            {mode === "video" ? "Video call" : "Voice call"} with {customerName}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">{time} · {held ? "On hold" : "Connected"}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant={muted ? "default" : "outline"} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setMuted((m) => !m)}>
            {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button variant={held ? "default" : "outline"} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setHeld((h) => !h)} title="Hold">
            <PauseCircle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" title="Transfer">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8 rounded-lg" onClick={onEnd} title="End">
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
          <FileText className="h-3 w-3" /> Call notes
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Capture notes during the call…"
          rows={2}
          className={cn("w-full text-xs rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40")}
        />
      </div>
    </motion.div>
  );
}
