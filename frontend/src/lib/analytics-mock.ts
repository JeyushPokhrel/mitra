let _seed = 137;
const rand = () => {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const executiveKPIs = {
  conversations: 18420,
  customers: 4280,
  tickets: 1842,
  resolutionRate: 92,
  revenuePipeline: 1248000,
  csat: 94,
  deltas: { conversations: 12, customers: 8, tickets: -3, resolutionRate: 2, revenuePipeline: 18, csat: 1 },
};

export const conversationVolume = MONTHS.slice(0, 7).map((m, i) => ({
  month: m,
  inbound: 800 + i * 120 + Math.floor(rand() * 150),
  resolved: 750 + i * 110 + Math.floor(rand() * 120),
}));

export const responseTimeTrend = MONTHS.slice(0, 7).map((m, i) => ({
  month: m,
  firstResponse: 4.8 - i * 0.2 + rand() * 0.8,
  resolution: 18 - i * 0.6 + rand() * 2,
}));

export const channelDistribution = [
  { name: "Live Chat", value: 42, fill: "var(--chart-1)" },
  { name: "Email", value: 28, fill: "var(--chart-2)" },
  { name: "WhatsApp", value: 14, fill: "var(--chart-3)" },
  { name: "Instagram", value: 9, fill: "var(--chart-4)" },
  { name: "Phone", value: 7, fill: "var(--chart-5)" },
];

export const visitorTrend = MONTHS.slice(0, 7).map((m, i) => ({
  month: m,
  total: 12000 + i * 1800 + Math.floor(rand() * 2000),
  returning: 4000 + i * 800 + Math.floor(rand() * 600),
}));

export const deviceBreakdown = [
  { name: "Desktop", value: 58, fill: "var(--chart-1)" },
  { name: "Mobile", value: 34, fill: "var(--chart-2)" },
  { name: "Tablet", value: 8, fill: "var(--chart-3)" },
];

export const trafficSources = [
  { source: "Direct", visits: 8200 },
  { source: "Google", visits: 12400 },
  { source: "LinkedIn", visits: 3100 },
  { source: "Referral", visits: 2150 },
  { source: "Email", visits: 1850 },
];

export const topCountries = [
  { country: "USA", value: 38 },
  { country: "India", value: 22 },
  { country: "UK", value: 12 },
  { country: "Germany", value: 9 },
  { country: "Brazil", value: 7 },
  { country: "Japan", value: 5 },
];

export const crmAnalytics = {
  leadsCreated: 1280,
  conversionRate: 18,
  pipelineValue: 1248000,
  won: 42,
  lost: 14,
  sources: [
    { source: "Website",  leads: 320, converted: 64 },
    { source: "LinkedIn", leads: 240, converted: 38 },
    { source: "Referral", leads: 180, converted: 52 },
    { source: "Webinar",  leads: 120, converted: 22 },
    { source: "Ads",      leads: 260, converted: 28 },
  ],
};

export const ticketTrend = MONTHS.slice(0, 7).map((m, i) => ({
  month: m,
  created: 180 + i * 30 + Math.floor(rand() * 40),
  resolved: 170 + i * 28 + Math.floor(rand() * 35),
  sla: 88 + Math.floor(rand() * 10),
}));

export const ticketCategoryDist = [
  { name: "Billing", value: 24, fill: "var(--chart-1)" },
  { name: "Technical", value: 32, fill: "var(--chart-2)" },
  { name: "Account", value: 14, fill: "var(--chart-3)" },
  { name: "Bug", value: 18, fill: "var(--chart-4)" },
  { name: "Feature", value: 12, fill: "var(--chart-5)" },
];

export const agentLeaderboard = [
  { name: "Priya Subramaniam", resolved: 248, csat: 98, productivity: 96 },
  { name: "Rohan Kapoor",      resolved: 224, csat: 96, productivity: 94 },
  { name: "Ava Lindqvist",     resolved: 198, csat: 95, productivity: 91 },
  { name: "Diego Martinez",    resolved: 184, csat: 92, productivity: 88 },
  { name: "Noah Becker",       resolved: 162, csat: 90, productivity: 84 },
].map((a, i) => ({ ...a, rank: i + 1 }));

export const aiInsights = {
  sentimentTrend: MONTHS.slice(0, 7).map((m, i) => ({
    month: m,
    positive: 60 + Math.floor(rand() * 20),
    neutral: 20 + Math.floor(rand() * 15),
    negative: 8 + Math.floor(rand() * 10),
  })),
  alerts: [
    { type: "risk",   title: "Churn risk spiking in Enterprise tier",     detail: "12 accounts inactive 30+ days · $182k ARR" },
    { type: "opp",    title: "Upsell signal in 8 mid-market accounts",    detail: "AI detected expansion intent in last 7 days" },
    { type: "perf",   title: "Response time degraded for WhatsApp",       detail: "Avg 6m 12s — up 38% week-over-week" },
    { type: "action", title: "Auto-route Billing tickets to Ava L.",      detail: "Predicted 22% faster resolution" },
  ] as { type: "risk" | "opp" | "perf" | "action"; title: string; detail: string }[],
};

export const savedReports = [
  { id: "r1", name: "Weekly Executive Summary", schedule: "Mon 9:00 AM", owner: "Priya S.", format: "PDF" },
  { id: "r2", name: "Agent Performance – Q3",   schedule: "Quarterly",    owner: "Rohan K.", format: "XLSX" },
  { id: "r3", name: "SLA Breach Daily",         schedule: "Daily 6:00 AM",owner: "Diego M.", format: "CSV" },
  { id: "r4", name: "Pipeline Forecast",        schedule: "On demand",    owner: "Ava L.",   format: "PDF" },
];
