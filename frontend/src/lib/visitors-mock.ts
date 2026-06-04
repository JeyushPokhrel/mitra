export type VisitorStatus = "active" | "idle" | "leaving";
export type IntentLevel = "low" | "medium" | "high";
export type DeviceType = "Desktop" | "Mobile" | "Tablet";

export interface VisitorActivity {
  id: string;
  type:
    | "page_view"
    | "click"
    | "form_start"
    | "form_abandon"
    | "chat_opened"
    | "chat_started"
    | "scroll"
    | "exit_intent"
    | "added_to_cart";
  label: string;
  page?: string;
  at: string; // ISO
}

export interface Visitor {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar: string;
  country: string;
  countryCode: string; // for flag emoji
  city: string;
  ip: string;
  device: DeviceType;
  os: string;
  browser: string;
  screen: string;
  source: "Google" | "Direct" | "Ads" | "LinkedIn" | "Twitter" | "Referral";
  currentPage: string;
  pagesVisited: number;
  sessionSeconds: number;
  status: VisitorStatus;
  leadScore: number; // 0-100
  intent: IntentLevel;
  conversionProbability: number; // 0-1
  tags: string[];
  vip: boolean;
  returning: boolean;
  startedAt: string;
  lastActivityAt: string;
  activities: VisitorActivity[];
}

const FIRST = ["Aarav", "Mia", "Liam", "Sofia", "Noah", "Emma", "Yuki", "Carlos", "Priya", "Lucas", "Zara", "Oscar", "Ines", "Hugo", "Aya"];
const LAST = ["Sharma", "Chen", "O'Brien", "Rossi", "Patel", "Müller", "Tanaka", "Mendes", "Singh", "Silva", "Khan", "Becker", "Costa", "Dubois", "Sato"];
const COUNTRIES: { c: string; code: string; cities: string[] }[] = [
  { c: "India", code: "IN", cities: ["Bengaluru", "Mumbai", "Delhi"] },
  { c: "USA", code: "US", cities: ["New York", "Austin", "San Francisco"] },
  { c: "Germany", code: "DE", cities: ["Berlin", "Munich"] },
  { c: "UK", code: "GB", cities: ["London", "Manchester"] },
  { c: "Brazil", code: "BR", cities: ["São Paulo", "Rio"] },
  { c: "Japan", code: "JP", cities: ["Tokyo", "Osaka"] },
  { c: "France", code: "FR", cities: ["Paris", "Lyon"] },
  { c: "Spain", code: "ES", cities: ["Madrid", "Barcelona"] },
  { c: "Canada", code: "CA", cities: ["Toronto", "Vancouver"] },
];
const DEVICES: DeviceType[] = ["Desktop", "Mobile", "Tablet"];
const BROWSERS = ["Chrome", "Safari", "Firefox", "Edge"];
const OSES = ["macOS 14", "Windows 11", "iOS 17", "Android 14", "Linux"];
const SOURCES: Visitor["source"][] = ["Google", "Direct", "Ads", "LinkedIn", "Twitter", "Referral"];
const PAGES = ["/", "/pricing", "/features/ai", "/blog/ai-support", "/contact", "/integrations", "/docs", "/login", "/demo"];

export function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

// Seeded PRNG so SSR and client produce identical mock data.
let _seed = 1337;
function srand() {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
}
const rand = <T,>(arr: T[]) => arr[Math.floor(srand() * arr.length)];
const ri = (min: number, max: number) => Math.floor(srand() * (max - min + 1)) + min;
export function _resetMockSeed(seed = 1337) { _seed = seed; }

function buildActivities(currentPage: string, baseTime: number): VisitorActivity[] {
  const out: VisitorActivity[] = [];
  const n = ri(3, 8);
  for (let i = 0; i < n; i++) {
    const at = new Date(baseTime - (n - i) * ri(30, 180) * 1000).toISOString();
    const page = rand(PAGES);
    const types: VisitorActivity["type"][] = ["page_view", "click", "scroll", "form_start", "chat_opened"];
    const t = i === 0 ? "page_view" : rand(types);
    out.push({
      id: `act-${baseTime}-${i}`,
      type: t,
      label: labelFor(t, page),
      page,
      at,
    });
  }
  out.push({
    id: `act-${baseTime}-now`,
    type: "page_view",
    label: `Viewing ${currentPage}`,
    page: currentPage,
    at: new Date(baseTime).toISOString(),
  });
  return out;
}

function labelFor(t: VisitorActivity["type"], page: string) {
  switch (t) {
    case "page_view": return `Viewed ${page}`;
    case "click": return `Clicked CTA on ${page}`;
    case "scroll": return `Scrolled 80% on ${page}`;
    case "form_start": return `Started form on ${page}`;
    case "form_abandon": return `Abandoned form on ${page}`;
    case "chat_opened": return `Opened chat widget`;
    case "chat_started": return `Started a conversation`;
    case "exit_intent": return `Exit intent detected on ${page}`;
    case "added_to_cart": return `Added item to cart`;
  }
}

// Deterministic base time so SSR/CSR produce same ISO strings.
const BASE_TIME = 1735689600000; // 2025-01-01T00:00:00Z

function makeVisitor(i: number, baseTime = BASE_TIME): Visitor {
  const known = srand() > 0.45;
  const fn = rand(FIRST);
  const ln = rand(LAST);
  const country = rand(COUNTRIES);
  const city = rand(country.cities);
  const score = ri(5, 99);
  const intent: IntentLevel = score > 75 ? "high" : score > 45 ? "medium" : "low";
  const status: VisitorStatus = srand() > 0.7 ? "idle" : srand() > 0.92 ? "leaving" : "active";
  const page = rand(PAGES);
  return {
    id: `v-${1000 + i}`,
    name: known ? `${fn} ${ln}` : null,
    email: known ? `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@example.com` : null,
    phone: known && srand() > 0.5 ? `+1 555 0${ri(100, 999)}` : null,
    avatar: `${fn[0]}${ln[0]}`,
    country: country.c,
    countryCode: country.code,
    city,
    ip: `${ri(20, 220)}.${ri(0, 255)}.${ri(0, 255)}.${ri(0, 255)}`,
    device: rand(DEVICES),
    os: rand(OSES),
    browser: rand(BROWSERS),
    screen: rand(["1920×1080", "1440×900", "390×844", "1366×768", "768×1024"]),
    source: rand(SOURCES),
    currentPage: page,
    pagesVisited: ri(1, 14),
    sessionSeconds: ri(20, 1800),
    status,
    leadScore: score,
    intent,
    conversionProbability: Math.min(0.99, score / 100 + (srand() * 0.1 - 0.05)),
    tags: srand() > 0.6 ? rand([["pricing"], ["enterprise"], ["returning", "newsletter"], ["trial"]]) : [],
    vip: srand() > 0.9,
    returning: srand() > 0.6,
    startedAt: new Date(baseTime - ri(60, 1800) * 1000).toISOString(),
    lastActivityAt: new Date(baseTime - ri(0, 60) * 1000).toISOString(),
    activities: buildActivities(page, baseTime),
  };
}

export const seedVisitors: Visitor[] = Array.from({ length: 24 }, (_, i) => makeVisitor(i));

export function newRandomVisitor(): Visitor {
  return makeVisitor(Math.floor(Math.random() * 100000), Date.now());
}

export const PAGES_LIST = PAGES;
