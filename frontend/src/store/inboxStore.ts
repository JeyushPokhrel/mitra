import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  conversations as seedConvs,
  customers as seedCustomers,
  agents as seedAgents,
  notificationsSeed,
  buildThread,
  type Conversation,
  type Customer,
  type Message,
  type Agent,
} from "@/lib/inbox-mock";

export type ViewKey = "all" | "open" | "assigned" | "unassigned" | "resolved" | "vip" | "spam";
export type SortKey = "latest" | "waiting" | "priority" | "agent";

interface InboxFilters {
  view: ViewKey;
  sort: SortKey;
  query: string;
  channel: string | null;
  agent: string | null;
  tag: string | null;
  country: string | null;
  sentiment: string | null;
}

interface ConversationState {
  conversations: Conversation[];
  selectedId: string | null;
  filters: InboxFilters;
  setSelected: (id: string) => void;
  setFilter: <K extends keyof InboxFilters>(k: K, v: InboxFilters[K]) => void;
  resetFilters: () => void;
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
}

const defaultFilters: InboxFilters = {
  view: "all", sort: "latest", query: "",
  channel: null, agent: null, tag: null, country: null, sentiment: null,
};

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: seedConvs,
  selectedId: seedConvs[0].id,
  filters: defaultFilters,
  setSelected: (id) => set({ selectedId: id }),
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  resetFilters: () => set({ filters: defaultFilters }),
  updateConversation: (id, patch) => set((s) => ({
    conversations: s.conversations.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  })),
}));

interface MessageState {
  threads: Record<string, Message[]>;
  ensureThread: (conv: Conversation) => void;
  sendMessage: (convId: string, body: string, kind?: Message["kind"]) => void;
  editMessage: (convId: string, msgId: string, body: string) => void;
  deleteMessage: (convId: string, msgId: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  threads: {},
  ensureThread: (conv) => {
    if (!get().threads[conv.id]) {
      set((s) => ({ threads: { ...s.threads, [conv.id]: buildThread(conv) } }));
    }
  },
  sendMessage: (convId, body, kind = "text") => set((s) => {
    const existing = s.threads[convId] ?? [];
    const msg: Message = {
      id: `${convId}-m${existing.length + 1}-${Date.now()}`,
      conversationId: convId,
      kind,
      sender: kind === "note" ? "agent" : "agent",
      authorId: "a1",
      body,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    };
    return { threads: { ...s.threads, [convId]: [...existing, msg] } };
  }),
  editMessage: (convId, msgId, body) => set((s) => ({
    threads: {
      ...s.threads,
      [convId]: (s.threads[convId] ?? []).map((m) => m.id === msgId ? { ...m, body, edited: true } : m),
    },
  })),
  deleteMessage: (convId, msgId) => set((s) => ({
    threads: {
      ...s.threads,
      [convId]: (s.threads[convId] ?? []).filter((m) => m.id !== msgId),
    },
  })),
}));

interface CustomerState {
  customers: Customer[];
  getById: (id: string) => Customer | undefined;
}
export const useCustomerStore = create<CustomerState>((_set, get) => ({
  customers: seedCustomers,
  getById: (id) => get().customers.find((c) => c.id === id),
}));

interface AgentState { agents: Agent[]; getById: (id: string) => Agent | undefined; }
export const useAgentStore = create<AgentState>((_set, get) => ({
  agents: seedAgents,
  getById: (id) => get().agents.find((a) => a.id === id),
}));

interface NotificationState {
  items: typeof notificationsSeed;
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}
export const useNotificationStore = create<NotificationState>((set) => ({
  items: notificationsSeed,
  unread: notificationsSeed.filter((n) => !n.read).length,
  markRead: (id) => set((s) => {
    const items = s.items.map((n) => n.id === id ? { ...n, read: true } : n);
    return { items, unread: items.filter((n) => !n.read).length };
  }),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })), unread: 0 })),
}));

interface AiState {
  open: boolean;
  loading: string | null;
  toggle: () => void;
  setOpen: (v: boolean) => void;
  run: (action: string) => Promise<string>;
}
const aiResults: Record<string, string> = {
  generate: "Hi! Thanks for reaching out — I've reviewed your account and processed the refund. You should see it on your card within 5–7 business days. Let me know if anything else comes up. 🙌",
  rephrase: "Thanks for the patience — your refund is on its way and should land in your account within 5–7 business days.",
  friendly: "Hey! 🌟 Totally got you — refund is out the door and should show up within 5–7 business days. Yell anytime!",
  formal: "Thank you for your patience. The refund has been issued and will appear in your account within 5–7 business days.",
  grammar: "Thanks for your patience. The refund has been issued and will appear in your account within 5–7 business days.",
  translate: "Gracias por su paciencia. El reembolso ha sido emitido y aparecerá en su cuenta en un plazo de 5 a 7 días hábiles.",
  summarize: "Customer reported a failed payment, shared a screenshot, requested a refund. Agent issued a refund and shared an updated invoice. Customer confirmed and thanked the team.",
  next: "Schedule a 2-day follow-up to confirm the refund landed and offer a 1-month credit.",
};
export const useAiAssistantStore = create<AiState>((set) => ({
  open: true,
  loading: null,
  toggle: () => set((s) => ({ open: !s.open })),
  setOpen: (v) => set({ open: v }),
  run: async (action) => {
    set({ loading: action });
    await new Promise((r) => setTimeout(r, 700));
    set({ loading: null });
    return aiResults[action] ?? "Done.";
  },
}));

interface PanelState {
  leftWidth: number;
  rightWidth: number;
  setSizes: (l: number, r: number) => void;
}
export const usePanelStore = create<PanelState>()(
  persist(
    (set) => ({
      leftWidth: 24,
      rightWidth: 26,
      setSizes: (l, r) => set({ leftWidth: l, rightWidth: r }),
    }),
    { name: "mitra-inbox-panels" },
  ),
);
