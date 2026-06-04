import { motion } from "framer-motion";

export function TypingIndicator({ name }: { name?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
      <div className="flex gap-1 bg-muted px-2.5 py-1.5 rounded-full">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span>{name ?? "Customer"} is typing…</span>
    </motion.div>
  );
}
