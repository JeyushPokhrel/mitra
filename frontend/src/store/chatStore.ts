import { create } from "zustand";

export type ChatSender = "visitor" | "agent" | "ai" | "bot" | "system";
export type ChatMessageKind = "text" | "image" | "file" | "voice" | "video" | "system" | "card";
export type DeliveryStatus = "sending" | "sent" | "delivered" | "read";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  kind: ChatMessageKind;
  body: string;
  attachmentName?: string;
  attachmentUrl?: string;
  at: string; // ISO
  status?: DeliveryStatus;
  authorName?: string;
}

export interface ChatSession {
  id: string;
  startedAt: string;
  agentId?: string;
  agentName?: string;
  agentOnline: boolean;
  conversationId?: string; // linked Inbox conversation
}

interface ChatState {
  session: ChatSession;
  messages: ChatMessage[];
  typing: { who: "agent" | "ai" | null };
  send: (body: string, kind?: ChatMessageKind, extras?: Partial<ChatMessage>) => void;
  receive: (msg: Omit<ChatMessage, "id" | "at"> & { id?: string }) => void;
  setTyping: (who: "agent" | "ai" | null) => void;
  reset: () => void;
  attachAgent: (id: string, name: string) => void;
  linkConversation: (convId: string) => void;
}

function uid() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const seedMessages: ChatMessage[] = [
  {
    id: "m0",
    sender: "system",
    kind: "system",
    body: "Conversation started",
    at: new Date().toISOString(),
  },
  {
    id: "m1",
    sender: "ai",
    kind: "text",
    body: "Hi 👋 I'm Mira, your AI assistant. I can help with pricing, features, and account questions. What's on your mind?",
    at: new Date().toISOString(),
    authorName: "Mira AI",
  },
];

export const useChatStore = create<ChatState>((set) => ({
  session: {
    id: `s-${Date.now()}`,
    startedAt: new Date().toISOString(),
    agentOnline: true,
  },
  messages: seedMessages,
  typing: { who: null },
  send: (body, kind = "text", extras = {}) =>
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id: uid(),
          sender: "visitor",
          kind,
          body,
          at: new Date().toISOString(),
          status: "sending",
          ...extras,
        },
      ],
    })),
  receive: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages.map((m) => (m.status === "sending" ? { ...m, status: "delivered" as const } : m)),
        { id: msg.id ?? uid(), at: new Date().toISOString(), ...msg } as ChatMessage,
      ],
    })),
  setTyping: (who) => set({ typing: { who } }),
  reset: () =>
    set({
      session: { id: `s-${Date.now()}`, startedAt: new Date().toISOString(), agentOnline: true },
      messages: seedMessages,
      typing: { who: null },
    }),
  attachAgent: (id, name) =>
    set((s) => ({
      session: { ...s.session, agentId: id, agentName: name, agentOnline: true },
      messages: [
        ...s.messages,
        {
          id: uid(),
          sender: "system",
          kind: "system",
          body: `${name} joined the conversation`,
          at: new Date().toISOString(),
        },
      ],
    })),
  linkConversation: (convId) =>
    set((s) => ({ session: { ...s.session, conversationId: convId } })),
}));

// Simple mock AI knowledge base
const AI_KB: { q: RegExp; a: string }[] = [
  { q: /pric|cost|plan/i, a: "We offer three plans: Starter ($29/mo), Growth ($79/mo), and Enterprise (custom). Want me to compare them?" },
  { q: /refund|cancel/i, a: "You can cancel anytime from Billing › Subscription. Refunds are processed within 5–7 business days." },
  { q: /integrat|connect/i, a: "MITRA integrates with 50+ tools including Slack, Gmail, Shopify, HubSpot, and Zapier. Looking for a specific one?" },
  { q: /agent|human|person/i, a: "Sure — let me connect you with a human agent. One moment…" },
  { q: /hour|support|when/i, a: "Our team is available 24/5 (Mon–Fri). AI assistant is available 24/7." },
];

export function aiReplyFor(text: string): string {
  for (const k of AI_KB) if (k.q.test(text)) return k.a;
  return "Got it — let me look into that. In the meantime, can you share a bit more about what you're trying to do?";
}

export function shouldEscalate(text: string): boolean {
  return /human|agent|person|talk to someone|representative/i.test(text);
}
