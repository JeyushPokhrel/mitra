import { create } from "zustand";
import {
  tickets as seedTickets,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
} from "@/lib/tickets-mock";

type View = "dashboard" | "list" | "kanban";

interface TicketsState {
  tickets: Ticket[];
  view: View;
  setView: (v: View) => void;

  selectedId: string | null;
  select: (id: string | null) => void;

  // filters
  search: string;
  setSearch: (s: string) => void;
  statusFilter: TicketStatus | "all";
  setStatusFilter: (s: TicketStatus | "all") => void;
  priorityFilter: TicketPriority | "all";
  setPriorityFilter: (p: TicketPriority | "all") => void;
  categoryFilter: TicketCategory | "all";
  setCategoryFilter: (c: TicketCategory | "all") => void;
  assigneeFilter: string | "all" | "unassigned";
  setAssigneeFilter: (a: string | "all" | "unassigned") => void;

  // bulk
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  clearSelection: () => void;

  // mutations
  add: (t: Partial<Ticket>) => string;
  update: (id: string, patch: Partial<Ticket>) => void;
  setStatus: (id: string, s: TicketStatus) => void;
  assign: (id: string, assignee: string | null) => void;
  remove: (id: string) => void;
  reopen: (id: string) => void;
  merge: (ids: string[]) => void;

  // integration
  fromConversation: (payload: { subject: string; customer: string; customerEmail: string }) => string;
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
  tickets: seedTickets,
  view: "dashboard",
  setView: (view) => set({ view }),

  selectedId: seedTickets[0]?.id ?? null,
  select: (selectedId) => set({ selectedId }),

  search: "",
  setSearch: (search) => set({ search }),
  statusFilter: "all",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  priorityFilter: "all",
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  categoryFilter: "all",
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  assigneeFilter: "all",
  setAssigneeFilter: (assigneeFilter) => set({ assigneeFilter }),

  selectedIds: [],
  toggleSelect: (id) => set((s) => ({
    selectedIds: s.selectedIds.includes(id)
      ? s.selectedIds.filter((x) => x !== id)
      : [...s.selectedIds, id],
  })),
  clearSelection: () => set({ selectedIds: [] }),

  add: (t) => {
    const id = `T-${Math.floor(Date.now() / 1000)}`;
    const newTicket: Ticket = {
      id,
      subject: t.subject ?? "Untitled ticket",
      description: t.description ?? "",
      status: t.status ?? "New",
      priority: t.priority ?? "Medium",
      category: t.category ?? "General",
      assignee: t.assignee ?? null,
      collaborators: t.collaborators ?? [],
      organization: t.organization ?? "—",
      customer: t.customer ?? "—",
      customerEmail: t.customerEmail ?? "",
      channel: t.channel ?? "Web",
      sla: t.sla ?? { responseDue: 240, resolutionDue: 1440, responded: false, breached: false },
      createdAt: "just now",
      dueAt: "in 4h",
      tags: t.tags ?? [],
      messages: [],
      audit: [{ id: "a1", time: "now", actor: "System", action: "Ticket created" }],
      attachments: [],
    };
    set((s) => ({ tickets: [newTicket, ...s.tickets], selectedId: id }));
    return id;
  },
  update: (id, patch) => set((s) => ({
    tickets: s.tickets.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  })),
  setStatus: (id, status) => set((s) => ({
    tickets: s.tickets.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            audit: [
              { id: `a${Date.now()}`, time: "now", actor: "You", action: `Status → ${status}` },
              ...t.audit,
            ],
          }
        : t,
    ),
  })),
  assign: (id, assignee) => set((s) => ({
    tickets: s.tickets.map((t) =>
      t.id === id
        ? {
            ...t,
            assignee,
            audit: [
              { id: `a${Date.now()}`, time: "now", actor: "You", action: `Assigned to ${assignee ?? "unassigned"}` },
              ...t.audit,
            ],
          }
        : t,
    ),
  })),
  remove: (id) => set((s) => ({
    tickets: s.tickets.filter((t) => t.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),
  reopen: (id) => get().setStatus(id, "Open"),
  merge: (ids) => {
    if (ids.length < 2) return;
    const [keep, ...rest] = ids;
    set((s) => ({
      tickets: s.tickets
        .filter((t) => !rest.includes(t.id))
        .map((t) =>
          t.id === keep
            ? {
                ...t,
                audit: [
                  { id: `a${Date.now()}`, time: "now", actor: "You", action: `Merged ${rest.length} ticket(s)` },
                  ...t.audit,
                ],
              }
            : t,
        ),
      selectedIds: [],
    }));
  },

  fromConversation: ({ subject, customer, customerEmail }) =>
    get().add({ subject, customer, customerEmail, channel: "Chat", status: "Open" }),
}));
