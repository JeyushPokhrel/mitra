// Deterministic seeded PRNG for SSR safety
let _seed = 17;
const rand = () => {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
};
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

export type LifecycleStage =
  | "Visitor" | "Lead" | "MQL" | "SQL" | "Opportunity" | "Customer" | "Evangelist";

export type DealStage =
  | "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  timezone: string;
  company: string;
  companyId: string;
  designation: string;
  source: string;
  tags: string[];
  notes: string;
  owner: string;
  lifecycle: LifecycleStage;
  leadScore: number;
  customerValue: number;
  sentiment: "positive" | "neutral" | "negative";
  churnRisk: number;
  lastActive: string;
  createdAt: string;
  archived?: boolean;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  employees: number;
  country: string;
  revenue: number;
  team: string;
  contacts: number;
  openDeals: number;
  logo: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number;
  probability: number;
  stage: DealStage;
  owner: string;
  expectedClose: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  contactId: string;
  type: "conversation" | "visit" | "deal" | "ticket" | "note" | "assignment" | "ai" | "call" | "meeting";
  title: string;
  description?: string;
  time: string;
  actor?: string;
}

const FIRST = ["Aarav","Mia","Liam","Sofia","Noah","Emma","Arjun","Priya","Diego","Yuki","Hana","Marcus","Zara","Ravi","Ines","Leo","Maya","Kenji","Anika","Owen"];
const LAST = ["Sharma","Chen","O'Brien","Rossi","Patel","Müller","Kapoor","Subramaniam","Martinez","Tanaka","Park","Becker","Khan","Iyer","Costa","Dubois","Singh","Sato","Reddy","Walsh"];
const COMPANIES_RAW = [
  ["Acme Corp","SaaS"],["Globex","Manufacturing"],["Initech","Finance"],["Umbrella","Healthcare"],
  ["Stark Industries","Aerospace"],["Wayne Enterprises","Conglomerate"],["Hooli","Tech"],
  ["Pied Piper","SaaS"],["Soylent","CPG"],["Massive Dynamic","R&D"],["Cyberdyne","Robotics"],
  ["Vandelay","Imports"],["Aperture","Research"],["Tyrell","AI"],["Wonka Inc","CPG"],
];
const COUNTRIES = ["India","USA","UK","Germany","Brazil","Japan","France","Australia","Canada","Singapore"];
const TZ = ["Asia/Kolkata","America/New_York","Europe/London","Europe/Berlin","America/Sao_Paulo","Asia/Tokyo"];
const SOURCES = ["Website","Live Chat","Referral","LinkedIn","Google Ads","Webinar","Cold Outreach","Partner"];
const TAGS = ["VIP","Trial","Enterprise","SMB","Hot","Renewal","Champion","Decision Maker"];
const DESIGNATIONS = ["Head of Support","CTO","Product Manager","CEO","VP Sales","Ops Lead","Founder","CMO"];
const OWNERS = ["Rohan Kapoor","Ava Lindqvist","Diego Martinez","Priya Subramaniam","Noah Becker"];
const TEAMS = ["Enterprise","Mid-Market","SMB","Strategic"];
const LIFECYCLES: LifecycleStage[] = ["Visitor","Lead","MQL","SQL","Opportunity","Customer","Evangelist"];
const DEAL_STAGES: DealStage[] = ["New","Contacted","Qualified","Proposal","Negotiation","Won","Lost"];

export const companies: Company[] = COMPANIES_RAW.map(([name, industry], i) => ({
  id: `co_${i + 1}`,
  name,
  industry,
  website: `${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
  employees: Math.floor(rand() * 4800 + 50),
  country: pick(COUNTRIES),
  revenue: Math.floor(rand() * 480 + 20),
  team: pick(TEAMS),
  contacts: Math.floor(rand() * 18 + 1),
  openDeals: Math.floor(rand() * 6),
  logo: name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
}));

export const contacts: Contact[] = Array.from({ length: 48 }).map((_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const name = `${first} ${last}`;
  const co = pick(companies);
  return {
    id: `ct_${i + 1}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}@${co.website}`,
    phone: `+1 ${Math.floor(rand() * 900 + 100)} ${Math.floor(rand() * 9000 + 1000)}`,
    avatar: `${first[0]}${last[0]}`,
    country: co.country,
    timezone: pick(TZ),
    company: co.name,
    companyId: co.id,
    designation: pick(DESIGNATIONS),
    source: pick(SOURCES),
    tags: Array.from(new Set([pick(TAGS), pick(TAGS)])),
    notes: "",
    owner: pick(OWNERS),
    lifecycle: pick(LIFECYCLES),
    leadScore: Math.floor(rand() * 100),
    customerValue: Math.floor(rand() * 80 + 2) * 1000,
    sentiment: pick(["positive", "neutral", "negative"] as const),
    churnRisk: Math.floor(rand() * 100),
    lastActive: `${Math.floor(rand() * 48) + 1}h ago`,
    createdAt: `${Math.floor(rand() * 90) + 1}d ago`,
  };
});

export const deals: Deal[] = Array.from({ length: 26 }).map((_, i) => {
  const ct = pick(contacts);
  const stage = pick(DEAL_STAGES);
  return {
    id: `d_${i + 1}`,
    title: `${ct.company} – ${pick(["Annual Plan","Expansion","Pilot","Renewal","Enterprise Upgrade"])}`,
    contactId: ct.id,
    contactName: ct.name,
    company: ct.company,
    value: Math.floor(rand() * 180 + 5) * 1000,
    probability:
      stage === "Won" ? 100 : stage === "Lost" ? 0 : Math.floor(rand() * 80 + 10),
    stage,
    owner: pick(OWNERS),
    expectedClose: `${Math.floor(rand() * 60) + 5}d`,
    createdAt: `${Math.floor(rand() * 45) + 1}d ago`,
  };
});

export const activities: Activity[] = Array.from({ length: 60 }).map((_, i) => {
  const ct = pick(contacts);
  const type = pick(["conversation","visit","deal","ticket","note","assignment","ai","call","meeting"] as const);
  const titles: Record<Activity["type"], string> = {
    conversation: "Replied in live chat",
    visit: "Visited /pricing",
    deal: "Moved to Negotiation",
    ticket: "Opened ticket T-2041",
    note: "Added private note",
    assignment: "Assigned to Rohan K.",
    ai: "AI summarized conversation",
    call: "Outbound call 4m 32s",
    meeting: "Demo scheduled",
  };
  return {
    id: `a_${i + 1}`,
    contactId: ct.id,
    type,
    title: titles[type],
    description: type === "ai" ? "Sentiment positive · intent to upgrade" : undefined,
    time: `${Math.floor(rand() * 72) + 1}h ago`,
    actor: pick(OWNERS),
  };
});

// Analytics-ready
export const pipelineByStage = DEAL_STAGES.map((s) => ({
  stage: s,
  value: deals.filter((d) => d.stage === s).reduce((a, d) => a + d.value, 0) / 1000,
  count: deals.filter((d) => d.stage === s).length,
}));

export const sourcePerformance = SOURCES.slice(0, 6).map((s) => ({
  source: s,
  leads: Math.floor(rand() * 80) + 10,
  converted: Math.floor(rand() * 30) + 2,
}));

export const forecastTrend = ["Jan","Feb","Mar","Apr","May","Jun"].map((m, i) => ({
  month: m,
  forecast: 120 + i * 18 + Math.floor(rand() * 30),
  closed: 100 + i * 14 + Math.floor(rand() * 25),
}));

export const SAVED_VIEWS = [
  { id: "all", name: "All contacts" },
  { id: "mine", name: "My contacts" },
  { id: "vip", name: "VIP customers" },
  { id: "hot", name: "Hot leads" },
  { id: "churn", name: "Churn risk" },
  { id: "new", name: "New this week" },
];

export const SEGMENTS = [
  { id: "ent", name: "Enterprise", count: 18 },
  { id: "trial", name: "On trial", count: 42 },
  { id: "renew", name: "Up for renewal", count: 11 },
  { id: "inactive", name: "Inactive 30d+", count: 24 },
];

export { LIFECYCLES, DEAL_STAGES, OWNERS, SOURCES, TAGS };
