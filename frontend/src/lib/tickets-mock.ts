// Deterministic seeded PRNG for SSR safety
let _seed = 53;
const rand = () => {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
};
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

export type TicketStatus =
  | "New" | "Open" | "Pending" | "Waiting Customer" | "Escalated" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent" | "Critical";
export type TicketCategory = "Billing" | "Technical" | "Account" | "Bug" | "Feature Request" | "General";

export const TICKET_STATUSES: TicketStatus[] = [
  "New","Open","Pending","Waiting Customer","Escalated","Resolved","Closed",
];
export const KANBAN_COLUMNS: TicketStatus[] = [
  "New","Open","Pending","Escalated","Resolved","Closed",
];
export const TICKET_PRIORITIES: TicketPriority[] = ["Low","Medium","High","Urgent","Critical"];
export const TICKET_CATEGORIES: TicketCategory[] = [
  "Billing","Technical","Account","Bug","Feature Request","General",
];

export const statusColors: Record<TicketStatus, string> = {
  "New": "bg-info/15 text-[color:var(--info)]",
  "Open": "bg-primary/20 text-primary",
  "Pending": "bg-warning/15 text-[color:var(--warning)]",
  "Waiting Customer": "bg-chart-4/15 text-[color:var(--chart-4)]",
  "Escalated": "bg-destructive/15 text-destructive",
  "Resolved": "bg-success/15 text-[color:var(--success)]",
  "Closed": "bg-muted text-muted-foreground",
};

export const priorityColors: Record<TicketPriority, string> = {
  "Low": "bg-muted text-muted-foreground",
  "Medium": "bg-info/15 text-[color:var(--info)]",
  "High": "bg-warning/15 text-[color:var(--warning)]",
  "Urgent": "bg-destructive/15 text-destructive",
  "Critical": "bg-destructive text-destructive-foreground",
};

export interface SLA {
  responseDue: number;   // minutes (negative = breached)
  resolutionDue: number; // minutes
  responded: boolean;
  breached: boolean;
}

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
}

export interface TicketMessage {
  id: string;
  author: string;
  body: string;
  time: string;
  internal: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignee: string | null;
  collaborators: string[];
  organization: string;
  customer: string;
  customerEmail: string;
  channel: "Email" | "Chat" | "WhatsApp" | "Phone" | "Web";
  sla: SLA;
  createdAt: string;
  dueAt: string;
  tags: string[];
  messages: TicketMessage[];
  audit: AuditEntry[];
  attachments: { name: string; size: string }[];
}

const SUBJECTS = [
  "Payment failed during checkout",
  "Cannot reset password",
  "Widget not loading on Safari",
  "Integration with HubSpot fails",
  "Feature request: dark mode",
  "Subscription auto-renewed incorrectly",
  "API rate limit too aggressive",
  "Export CSV missing columns",
  "SSO with Okta returns 500",
  "Mobile app crashes on iOS 17",
  "Webhook deliveries delayed",
  "Custom domain SSL not provisioning",
  "Invoice missing VAT details",
  "Two-factor backup codes not working",
  "Slack notifications duplicated",
  "Onboarding emails not sent",
  "Dashboard charts show stale data",
  "Voice call disconnects after 30s",
  "AI Copilot suggestions incorrect",
  "Team member cannot be removed",
];
const CUSTOMERS = [
  ["Aarav Sharma","aarav@acme.com"],["Mia Chen","mia@globex.com"],
  ["Liam O'Brien","liam@initech.com"],["Sofia Rossi","sofia@stark.com"],
  ["Noah Patel","noah@hooli.com"],["Emma Müller","emma@piedpiper.com"],
  ["Arjun Iyer","arjun@umbrella.com"],["Yuki Tanaka","yuki@cyberdyne.com"],
];
const ORGS = ["Acme Corp","Globex","Initech","Umbrella","Stark Industries","Hooli","Pied Piper","Cyberdyne"];
const AGENTS = ["Rohan Kapoor","Ava Lindqvist","Diego Martinez","Priya Subramaniam","Noah Becker"];
const CHANNELS = ["Email","Chat","WhatsApp","Phone","Web"] as const;
const TAGS = ["billing","p1","escalation","beta","enterprise","mobile","api","ux"];

export const tickets: Ticket[] = SUBJECTS.map((subj, i) => {
  const [name, email] = pick(CUSTOMERS);
  const status = pick(TICKET_STATUSES);
  const priority = pick(TICKET_PRIORITIES);
  const responseDue = Math.floor(rand() * 480 - 60);
  const resolutionDue = Math.floor(rand() * 2880 - 200);
  return {
    id: `T-${2050 - i}`,
    subject: subj,
    description: `Customer reports: "${subj.toLowerCase()}". Reproduced on production. Awaiting engineering review.`,
    status,
    priority,
    category: pick(TICKET_CATEGORIES),
    assignee: rand() > 0.15 ? pick(AGENTS) : null,
    collaborators: [pick(AGENTS), pick(AGENTS)].filter((v, idx, arr) => arr.indexOf(v) === idx),
    organization: pick(ORGS),
    customer: name,
    customerEmail: email,
    channel: pick([...CHANNELS]),
    sla: {
      responseDue,
      resolutionDue,
      responded: rand() > 0.3,
      breached: responseDue < 0 || resolutionDue < 0,
    },
    createdAt: `${Math.floor(rand() * 48) + 1}h ago`,
    dueAt: `in ${Math.max(1, Math.floor(rand() * 24))}h`,
    tags: Array.from(new Set([pick(TAGS), pick(TAGS)])),
    messages: [
      {
        id: "m1", author: name, internal: false,
        time: `${Math.floor(rand() * 24) + 1}h ago`,
        body: `Hi team, ${subj.toLowerCase()}. Can you please look into this urgently?`,
      },
      {
        id: "m2", author: pick(AGENTS), internal: false,
        time: `${Math.floor(rand() * 12) + 1}h ago`,
        body: "Thanks for reaching out — we're investigating and will update shortly.",
      },
      {
        id: "m3", author: pick(AGENTS), internal: true,
        time: `${Math.floor(rand() * 6) + 1}h ago`,
        body: "FYI — looping in engineering. This looks like a regression from the v2.4 release.",
      },
    ],
    audit: [
      { id: "a1", time: "2h ago", actor: pick(AGENTS), action: `Status changed to ${status}` },
      { id: "a2", time: "3h ago", actor: pick(AGENTS), action: `Priority set to ${priority}` },
      { id: "a3", time: "5h ago", actor: "System", action: "Ticket created from " + pick([...CHANNELS]) },
    ],
    attachments: rand() > 0.5 ? [{ name: "screenshot.png", size: "248 KB" }] : [],
  };
});

export const ticketVolumeTrend = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => ({
  day,
  created: 20 + Math.floor(rand() * 30),
  resolved: 18 + Math.floor(rand() * 28),
}));

export const categoryDistribution = TICKET_CATEGORIES.map((c) => ({
  category: c,
  value: tickets.filter((t) => t.category === c).length,
}));
