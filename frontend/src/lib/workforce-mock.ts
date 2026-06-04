let _seed = 91;
const rand = () => {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
};
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

export type AgentStatus = "online" | "away" | "busy" | "offline";
export type RoleName = "Super Admin" | "Admin" | "Team Leader" | "Supervisor" | "Support Agent" | "Sales Agent" | "Billing Agent";
export type Permission = "View" | "Create" | "Edit" | "Delete" | "Export" | "Manage";

export const ROLES: RoleName[] = [
  "Super Admin","Admin","Team Leader","Supervisor","Support Agent","Sales Agent","Billing Agent",
];
export const PERMISSIONS: Permission[] = ["View","Create","Edit","Delete","Export","Manage"];
export const RESOURCES = ["Inbox","Tickets","CRM","Visitors","Reports","Billing","Workforce","Settings"];

// role x resource x permission
export const permissionMatrix: Record<RoleName, Record<string, Permission[]>> =
  ROLES.reduce((acc, role) => {
    acc[role] = {};
    RESOURCES.forEach((r) => {
      if (role === "Super Admin") acc[role][r] = [...PERMISSIONS];
      else if (role === "Admin") acc[role][r] = ["View","Create","Edit","Delete","Export"];
      else if (role === "Team Leader") acc[role][r] = ["View","Create","Edit","Export"];
      else if (role === "Supervisor") acc[role][r] = ["View","Edit","Export"];
      else acc[role][r] = ["View","Create","Edit"];
    });
    return acc;
  }, {} as Record<RoleName, Record<string, Permission[]>>);

export interface Team {
  id: string;
  name: string;
  description: string;
  lead: string;
  members: number;
  color: string;
}

export const teams: Team[] = [
  { id: "t1", name: "Support",          description: "Tier 1 & Tier 2 customer support",     lead: "Priya Subramaniam", members: 14, color: "primary" },
  { id: "t2", name: "Sales",            description: "Enterprise & mid-market sales",         lead: "Rohan Kapoor",       members: 9,  color: "info" },
  { id: "t3", name: "Billing",          description: "Invoicing, refunds, dispute handling",  lead: "Ava Lindqvist",      members: 5,  color: "warning" },
  { id: "t4", name: "Technical Support",description: "Engineering escalations & DevOps",      lead: "Diego Martinez",     members: 8,  color: "success" },
];

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: RoleName;
  team: string;
  department: string;
  timezone: string;
  status: AgentStatus;
  csat: number;
  resolved: number;
  conversations: number;
  responseTime: string;
}

const NAMES = [
  "Rohan Kapoor","Ava Lindqvist","Diego Martinez","Priya Subramaniam","Noah Becker",
  "Mia Chen","Aarav Sharma","Sofia Rossi","Liam O'Brien","Emma Müller",
  "Arjun Iyer","Yuki Tanaka","Hana Park","Leo Costa","Marcus Walsh",
];
const TZS = ["Asia/Kolkata","America/New_York","Europe/London","Europe/Berlin","Asia/Tokyo"];
const STATUSES: AgentStatus[] = ["online","away","busy","offline"];

export const agents: Agent[] = NAMES.map((name, i) => ({
  id: `ag_${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@mitra.app`,
  phone: `+1 ${Math.floor(rand() * 900 + 100)} ${Math.floor(rand() * 9000 + 1000)}`,
  avatar: name.split(" ").map((p) => p[0]).join("").slice(0, 2),
  role: pick(ROLES),
  team: pick(teams).name,
  department: pick(["Customer Success","Sales","Engineering","Finance","Operations"]),
  timezone: pick(TZS),
  status: pick(STATUSES),
  csat: 80 + Math.floor(rand() * 20),
  resolved: 40 + Math.floor(rand() * 200),
  conversations: 60 + Math.floor(rand() * 300),
  responseTime: `${Math.floor(rand() * 4) + 1}m ${Math.floor(rand() * 60)}s`,
}));

export interface Shift {
  id: string;
  agent: string;
  day: number; // 0-6 (Mon-Sun)
  start: number; // hour 0-23
  end: number;
  type: "shift" | "break";
}

export const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export const shifts: Shift[] = agents.flatMap((a, i) => {
  const arr: Shift[] = [];
  for (let d = 0; d < 5; d++) {
    const start = 8 + (i % 4) * 2;
    arr.push({
      id: `s_${a.id}_${d}`, agent: a.name, day: d,
      start, end: start + 8, type: "shift",
    });
    arr.push({
      id: `b_${a.id}_${d}`, agent: a.name, day: d,
      start: start + 4, end: start + 5, type: "break",
    });
  }
  return arr;
});

export const organization = {
  name: "Mitra Labs",
  domain: "mitra.app",
  website: "https://mitra.app",
  industry: "SaaS – Customer Communication",
  employees: 142,
  timezone: "Asia/Kolkata",
  region: "APAC",
  logo: "M",
  aiEnabled: true,
  brandColor: "#B6AE9F",
  description: "Enterprise AI-powered omnichannel customer support, helpdesk and CRM.",
  owner: "Priya Subramaniam",
  plan: "Enterprise",
  seats: 200,
  seatsUsed: 142,
};
