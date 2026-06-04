// Realistic mock data for the MITRA Inbox V2 module.
// All data is generated deterministically (no Math.random in module scope)
// so SSR and CSR stay in sync.

export type Channel =
  | "chat"
  | "email"
  | "whatsapp"
  | "messenger"
  | "instagram"
  | "telegram"
  | "slack"
  | "discord"
  | "sms";

export type ConvStatus = "open" | "pending" | "resolved" | "snoozed" | "spam";
export type Priority = "low" | "normal" | "high" | "urgent";
export type Sentiment = "positive" | "neutral" | "negative";

export type MessageKind =
  | "text"
  | "image"
  | "file"
  | "video"
  | "voice"
  | "system"
  | "note"
  | "ai";

export type Sender = "customer" | "agent" | "bot" | "system";
export type DeliveryStatus = "sending" | "sent" | "delivered" | "seen" | "failed";

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: string;
  online: "online" | "away" | "offline";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  countryCode: string;
  timezone: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  language: string;
  leadScore: number;
  value: number;
  vip: boolean;
  since: string;
  totalConversations: number;
  totalTickets: number;
  recentActivity: { label: string; at: string }[];
  purchases: { id: string; item: string; amount: number; at: string }[];
  tags: string[];
  attributes: Record<string, string>;
}

export interface Message {
  id: string;
  conversationId: string;
  kind: MessageKind;
  sender: Sender;
  authorId: string; // agent id, customer id, "bot", "system"
  body: string;
  attachment?: { name: string; size?: string; url?: string; duration?: string };
  createdAt: string;
  status: DeliveryStatus;
  replyTo?: string;
  edited?: boolean;
  reactions?: string[];
}

export interface Conversation {
  id: string;
  subject: string;
  customerId: string;
  channel: Channel;
  status: ConvStatus;
  priority: Priority;
  assignedTo: string | null;
  team: string | null;
  tags: string[];
  unread: number;
  lastMessage: string;
  lastAt: string;
  waitingMinutes: number;
  vip: boolean;
  sentiment: Sentiment;
  locked: boolean;
  archived: boolean;
  participants: string[];
  sla: { dueIn: string; breached: boolean };
}

const teams = [
  "Tier 1 Support",
  "Tier 2 Support",
  "Billing",
  "Onboarding",
  "Sales",
  "Success",
  "Engineering",
  "Trust & Safety",
  "Partnerships",
  "VIP Desk",
];

const firstNames = [
  "Aarav", "Mia", "Liam", "Sofia", "Noah", "Emma", "Olivia", "Lucas", "Ava", "Ethan",
  "Yuki", "Hiro", "Leon", "Zoe", "Diego", "Priya", "Rohan", "Aisha", "Ben", "Chloe",
  "Mateo", "Isla", "Theo", "Maya", "Sara", "Omar", "Lina", "Ivan", "Ella", "Kai",
  "Nora", "Asher", "Layla", "Felix", "Hana", "Caleb", "Ruby", "Aria", "Jonas", "Iris",
  "Pablo", "Anya", "Tobias", "Selma", "Arjun", "Mira", "Idris", "Nadia", "Rafael", "Ines",
];
const lastNames = [
  "Sharma", "Chen", "O'Brien", "Rossi", "Patel", "Müller", "Becker", "Kim", "García", "Hassan",
  "Tanaka", "Suzuki", "Petrov", "Silva", "Martínez", "Subramaniam", "Kapoor", "Khan", "Carter", "Singh",
  "López", "Ali", "Nguyen", "Schmidt", "Larsen", "Costa", "Dubois", "Romano", "Park", "Andersen",
];
const cities = [
  ["India", "IN", "Asia/Kolkata", "Bengaluru"],
  ["USA", "US", "America/New_York", "New York"],
  ["Germany", "DE", "Europe/Berlin", "Berlin"],
  ["UK", "GB", "Europe/London", "London"],
  ["Brazil", "BR", "America/Sao_Paulo", "São Paulo"],
  ["Japan", "JP", "Asia/Tokyo", "Tokyo"],
  ["France", "FR", "Europe/Paris", "Paris"],
  ["Spain", "ES", "Europe/Madrid", "Barcelona"],
  ["UAE", "AE", "Asia/Dubai", "Dubai"],
  ["Singapore", "SG", "Asia/Singapore", "Singapore"],
];
const channels: Channel[] = [
  "chat", "email", "whatsapp", "messenger", "instagram", "telegram", "slack", "discord", "sms",
];
const tagPool = [
  "billing", "refund", "feature-request", "bug", "vip", "renewal", "trial",
  "enterprise", "shopify", "integration", "lead", "churn-risk", "feedback", "onboarding", "compliance",
];
const subjects = [
  "Payment failed during checkout", "Cannot reset password", "Widget not loading on Safari",
  "Integration with HubSpot", "Refund for order #1042", "Loving the new dashboard",
  "Question about pricing", "Cannot import contacts", "Sales tax invoice request",
  "Webhook signature mismatch", "Mobile app crashing on iOS 17", "How to enable SSO?",
  "Renewal quote needed", "Lost access to workspace", "API rate limit exceeded",
  "Two-factor auth not sending code", "Bulk export of conversations", "GDPR data deletion request",
  "Custom domain not verifying", "Live chat widget loading slowly", "VIP customer escalation",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const TEAMS = teams;

export const agents: Agent[] = Array.from({ length: 20 }, (_, i) => ({
  id: `a${i + 1}`,
  name: `${pick(firstNames, i * 3 + 1)} ${pick(lastNames, i * 5 + 2)}`,
  avatar: `${pick(firstNames, i * 3 + 1)[0]}${pick(lastNames, i * 5 + 2)[0]}`,
  role: i % 5 === 0 ? "Team Lead" : i % 7 === 0 ? "Senior Agent" : "Agent",
  team: pick(teams, i),
  online: (["online", "online", "online", "away", "offline"] as const)[i % 5],
}));

export const tags = tagPool;

export const customers: Customer[] = Array.from({ length: 50 }, (_, i) => {
  const fn = pick(firstNames, i * 2 + 7);
  const ln = pick(lastNames, i * 3 + 11);
  const c = pick(cities, i);
  return {
    id: `cu${i + 1}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
    phone: `+${10 + (i % 80)} ${100 + i} ${1000 + i * 7}`,
    avatar: `${fn[0]}${ln[0]}`,
    country: c[0], countryCode: c[1], timezone: c[2], city: c[3],
    browser: pick(["Chrome 124", "Safari 17", "Firefox 122", "Edge 123"], i),
    os: pick(["macOS 14", "Windows 11", "iOS 17", "Android 14", "Ubuntu 22"], i + 1),
    device: pick(["Desktop", "Mobile", "Tablet"], i),
    language: pick(["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP", "pt-BR"], i),
    leadScore: 30 + ((i * 13) % 70),
    value: 250 + ((i * 137) % 9000),
    vip: i % 8 === 0,
    since: `${2021 + (i % 4)}-0${1 + (i % 9)}-1${i % 9}`,
    totalConversations: 3 + (i % 40),
    totalTickets: i % 12,
    recentActivity: [
      { label: "Viewed Pricing page", at: "2m ago" },
      { label: "Downloaded invoice INV-204", at: "1h ago" },
      { label: "Started a trial of Pro", at: "Yesterday" },
      { label: "Replied to email", at: "2d ago" },
    ],
    purchases: [
      { id: `o${i}1`, item: "Pro plan – Monthly", amount: 49, at: "Mar 2026" },
      { id: `o${i}2`, item: "Add-on: 5 seats", amount: 120, at: "Feb 2026" },
    ],
    tags: [pick(tagPool, i), pick(tagPool, i + 3), pick(tagPool, i + 7)],
    attributes: {
      Plan: pick(["Free", "Starter", "Pro", "Enterprise"], i),
      "Account Manager": pick(agents, i + 2).name,
      Industry: pick(["SaaS", "E-commerce", "Fintech", "Education", "Healthcare"], i),
    },
  };
});

export const conversations: Conversation[] = Array.from({ length: 100 }, (_, i) => {
  const cust = customers[i % customers.length];
  const assigned = i % 6 === 0 ? null : agents[i % agents.length].id;
  const status: ConvStatus =
    i % 11 === 0 ? "spam" :
    i % 9 === 0 ? "resolved" :
    i % 7 === 0 ? "snoozed" :
    i % 3 === 0 ? "pending" : "open";
  const priority: Priority = (["low", "normal", "high", "urgent"] as const)[i % 4];
  const unread = i % 4 === 0 ? 0 : 1 + (i % 5);
  const waiting = (i * 7) % 240;
  return {
    id: `c${i + 1}`,
    subject: pick(subjects, i),
    customerId: cust.id,
    channel: pick(channels, i),
    status,
    priority,
    assignedTo: assigned,
    team: pick(teams, i),
    tags: [pick(tagPool, i), pick(tagPool, i + 2)],
    unread,
    lastMessage: pick([
      "Thanks, that solved it!",
      "Can you check my invoice?",
      "Hello, anyone there?",
      "I need to upgrade my plan",
      "Refund request for order #882",
      "Loving the new dashboard ✨",
      "When will this be fixed?",
      "Following up on my last message",
      "Please escalate this to a manager",
      "Got it, much appreciated 🙏",
    ], i),
    lastAt: `${(i * 3) % 60}m`,
    waitingMinutes: waiting,
    vip: cust.vip,
    sentiment: (["positive", "neutral", "negative"] as const)[i % 3],
    locked: i % 23 === 0,
    archived: false,
    participants: [assigned, agents[(i + 3) % agents.length].id].filter(Boolean) as string[],
    sla: { dueIn: `${(i % 8) + 1}h ${10 + (i % 50)}m`, breached: i % 13 === 0 },
  };
});

// Pre-built thread for the selected conversation. We generate a thread on
// demand for any conversation id so the messageStore is always populated.
export function buildThread(conv: Conversation): Message[] {
  const cust = customers.find((c) => c.id === conv.customerId)!;
  const agent = conv.assignedTo ?? agents[0].id;
  const base = [
    { kind: "system" as MessageKind, sender: "system" as Sender, body: `Conversation started via ${conv.channel}.` },
    { kind: "text" as MessageKind, sender: "customer" as Sender, body: `Hi! ${conv.subject}.` },
    { kind: "text" as MessageKind, sender: "agent" as Sender, body: `Hi ${cust.name.split(" ")[0]} 👋  Let me take a look right away.` },
    { kind: "text" as MessageKind, sender: "customer" as Sender, body: "Thanks, I've been waiting for a fix." },
    { kind: "image" as MessageKind, sender: "customer" as Sender, body: "Here is a screenshot of the issue.", attachment: { name: "screenshot.png", size: "284 KB" } },
    { kind: "note" as MessageKind, sender: "agent" as Sender, body: "Internal: customer is on the Pro plan, expedite this." },
    { kind: "ai" as MessageKind, sender: "bot" as Sender, body: "Suggested reply: Apologize, offer 10% credit and schedule a follow-up." },
    { kind: "text" as MessageKind, sender: "agent" as Sender, body: "I see the issue — I'll process a refund and credit your account right away." },
    { kind: "file" as MessageKind, sender: "agent" as Sender, body: "Sharing the invoice PDF.", attachment: { name: "INV-2041.pdf", size: "112 KB" } },
    { kind: "voice" as MessageKind, sender: "customer" as Sender, body: "", attachment: { name: "voice-note", duration: "0:24" } },
    { kind: "text" as MessageKind, sender: "customer" as Sender, body: "That works, thank you so much!" },
  ];
  return base.map((m, i) => ({
    id: `${conv.id}-m${i + 1}`,
    conversationId: conv.id,
    kind: m.kind,
    sender: m.sender,
    authorId: m.sender === "customer" ? cust.id : m.sender === "agent" ? agent : m.sender,
    body: m.body,
    attachment: m.attachment,
    createdAt: `${9 + i}:${10 + i * 3}`,
    status: m.sender === "agent" ? (i < 7 ? "seen" : "delivered") : "delivered",
  }));
}

export const cannedResponses = [
  { id: "r1", category: "Greetings", title: "Welcome 👋", body: "Hi there! Thanks for reaching out to MITRA. How can I help you today?", favorite: true },
  { id: "r2", category: "Greetings", title: "Working on it", body: "Thanks for your patience — I'm looking into this right now.", favorite: false },
  { id: "r3", category: "Billing", title: "Refund issued", body: "Your refund has been issued and should appear within 5–7 business days.", favorite: true },
  { id: "r4", category: "Billing", title: "Invoice attached", body: "Please find your invoice attached. Let me know if anything looks off.", favorite: false },
  { id: "r5", category: "Closing", title: "Anything else?", body: "Is there anything else I can help you with today?", favorite: true },
  { id: "r6", category: "Closing", title: "Closing", body: "I'll close this conversation for now. Reply anytime to reopen it. 🙌", favorite: false },
  { id: "r7", category: "Tech", title: "Clear cache", body: "Could you try clearing your browser cache and reloading the page?", favorite: false },
  { id: "r8", category: "Tech", title: "Escalated", body: "I've escalated this to our engineering team and you'll hear back shortly.", favorite: false },
];

export const slashCommands = [
  { cmd: "/assign", desc: "Assign conversation to an agent" },
  { cmd: "/note", desc: "Add an internal note" },
  { cmd: "/snooze", desc: "Snooze conversation" },
  { cmd: "/close", desc: "Resolve & close conversation" },
  { cmd: "/escalate", desc: "Escalate to Tier 2" },
  { cmd: "/tag", desc: "Add a tag" },
  { cmd: "/ai", desc: "Ask AI assistant" },
];

export const aiActions = [
  { id: "generate", label: "Generate reply", desc: "Draft a contextual answer", icon: "Sparkles" },
  { id: "rephrase", label: "Rephrase", desc: "Improve the current draft", icon: "Wand2" },
  { id: "friendly", label: "Make friendly", desc: "Warm, casual tone", icon: "Smile" },
  { id: "formal", label: "Make formal", desc: "Polished, professional", icon: "Briefcase" },
  { id: "grammar", label: "Fix grammar", desc: "Correct spelling & grammar", icon: "SpellCheck" },
  { id: "translate", label: "Translate", desc: "Auto-detect & translate", icon: "Languages" },
  { id: "summarize", label: "Summarize conversation", desc: "TL;DR of the thread", icon: "FileText" },
  { id: "next", label: "Generate next action", desc: "Recommend a step", icon: "ArrowRightCircle" },
];

export const notificationsSeed = [
  { id: "n1", kind: "mention", title: "Priya mentioned you", body: "in T-2041 — can you take this?", at: "2m", read: false },
  { id: "n2", kind: "vip", title: "VIP escalation", body: "Mia Chen replied to her conversation", at: "5m", read: false },
  { id: "n3", kind: "sla", title: "SLA warning", body: "T-2039 breaches in 12 minutes", at: "12m", read: false },
  { id: "n4", kind: "assign", title: "Assigned to you", body: "T-2050 — Cannot import contacts", at: "1h", read: true },
  { id: "n5", kind: "message", title: "New message", body: "Noah Patel: 'Following up on my last message'", at: "2h", read: true },
];
