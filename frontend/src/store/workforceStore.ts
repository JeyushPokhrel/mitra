import { create } from "zustand";
import {
  teams as seedTeams, agents as seedAgents, shifts as seedShifts,
  organization as seedOrg, permissionMatrix as seedMatrix,
  type Team, type Agent, type Shift, type RoleName, type Permission, type AgentStatus,
} from "@/lib/workforce-mock";

interface WorkforceState {
  organization: typeof seedOrg;
  updateOrganization: (patch: Partial<typeof seedOrg>) => void;

  teams: Team[];
  addTeam: (t: Partial<Team>) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  removeTeam: (id: string) => void;

  agents: Agent[];
  inviteAgent: (a: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  suspendAgent: (id: string) => void;
  setAgentStatus: (id: string, status: AgentStatus) => void;

  permissions: Record<RoleName, Record<string, Permission[]>>;
  togglePermission: (role: RoleName, resource: string, perm: Permission) => void;

  shifts: Shift[];
  addShift: (s: Partial<Shift>) => void;
  removeShift: (id: string) => void;
}

export const useWorkforceStore = create<WorkforceState>((set) => ({
  organization: seedOrg,
  updateOrganization: (patch) => set((s) => ({ organization: { ...s.organization, ...patch } })),

  teams: seedTeams,
  addTeam: (t) => set((s) => ({
    teams: [
      ...s.teams,
      {
        id: `t_${Date.now()}`,
        name: t.name ?? "New Team",
        description: t.description ?? "",
        lead: t.lead ?? "—",
        members: 0,
        color: t.color ?? "primary",
      },
    ],
  })),
  updateTeam: (id, patch) => set((s) => ({
    teams: s.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  })),
  removeTeam: (id) => set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),

  agents: seedAgents,
  inviteAgent: (a) => set((s) => ({
    agents: [
      {
        id: `ag_${Date.now()}`,
        name: a.name ?? "New Agent",
        email: a.email ?? "",
        phone: a.phone ?? "",
        avatar: (a.name ?? "NA").split(" ").map((p) => p[0]).join("").slice(0, 2),
        role: a.role ?? "Support Agent",
        team: a.team ?? "Support",
        department: a.department ?? "Customer Success",
        timezone: a.timezone ?? "Asia/Kolkata",
        status: "offline",
        csat: 0,
        resolved: 0,
        conversations: 0,
        responseTime: "—",
      },
      ...s.agents,
    ],
  })),
  removeAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
  suspendAgent: (id) => set((s) => ({
    agents: s.agents.map((a) => (a.id === id ? { ...a, status: "offline" as AgentStatus } : a)),
  })),
  setAgentStatus: (id, status) => set((s) => ({
    agents: s.agents.map((a) => (a.id === id ? { ...a, status } : a)),
  })),

  permissions: seedMatrix,
  togglePermission: (role, resource, perm) => set((s) => {
    const cur = s.permissions[role][resource] ?? [];
    const next = cur.includes(perm) ? cur.filter((p) => p !== perm) : [...cur, perm];
    return {
      permissions: {
        ...s.permissions,
        [role]: { ...s.permissions[role], [resource]: next },
      },
    };
  }),

  shifts: seedShifts,
  addShift: (sh) => set((s) => ({
    shifts: [
      ...s.shifts,
      {
        id: `s_${Date.now()}`,
        agent: sh.agent ?? "—",
        day: sh.day ?? 0,
        start: sh.start ?? 9,
        end: sh.end ?? 17,
        type: sh.type ?? "shift",
      },
    ],
  })),
  removeShift: (id) => set((s) => ({ shifts: s.shifts.filter((x) => x.id !== id) })),
}));
