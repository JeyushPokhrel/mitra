import { create } from "zustand";
import {
  contacts as seedContacts,
  companies as seedCompanies,
  deals as seedDeals,
  activities as seedActivities,
  type Contact,
  type Company,
  type Deal,
  type Activity,
  type DealStage,
  type LifecycleStage,
} from "@/lib/crm-mock";

export type CRMTab = "contacts" | "leads" | "companies" | "deals";

interface CRMState {
  tab: CRMTab;
  setTab: (t: CRMTab) => void;

  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  activities: Activity[];

  selectedContactId: string | null;
  selectedCompanyId: string | null;
  selectedDealId: string | null;
  select: (id: string | null) => void;
  selectCompany: (id: string | null) => void;

  // filters
  search: string;
  setSearch: (s: string) => void;
  view: string;
  setView: (v: string) => void;
  ownerFilter: string | "all";
  setOwnerFilter: (o: string | "all") => void;
  sourceFilter: string | "all";
  setSourceFilter: (s: string | "all") => void;
  tagFilter: string | "all";
  setTagFilter: (t: string | "all") => void;
  lifecycleFilter: LifecycleStage | "all";
  setLifecycleFilter: (l: LifecycleStage | "all") => void;

  // bulk
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  bulkDelete: () => void;
  bulkAssign: (owner: string) => void;

  // mutations
  addContact: (c: Partial<Contact>) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  archiveContact: (id: string) => void;
  restoreContact: (id: string) => void;
  deleteContact: (id: string) => void;

  moveDeal: (id: string, stage: DealStage) => void;
  addDeal: (d: Partial<Deal>) => void;

  // integrations
  convertVisitorToLead: (payload: { name: string; email?: string; source?: string }) => string;
}

export const useCRMStore = create<CRMState>((set, get) => ({
  tab: "contacts",
  setTab: (tab) => set({ tab, selectedIds: [] }),

  contacts: seedContacts,
  companies: seedCompanies,
  deals: seedDeals,
  activities: seedActivities,

  selectedContactId: seedContacts[0]?.id ?? null,
  selectedCompanyId: seedCompanies[0]?.id ?? null,
  selectedDealId: null,
  select: (id) => set({ selectedContactId: id }),
  selectCompany: (id) => set({ selectedCompanyId: id }),

  search: "",
  setSearch: (search) => set({ search }),
  view: "all",
  setView: (view) => set({ view }),
  ownerFilter: "all",
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  sourceFilter: "all",
  setSourceFilter: (sourceFilter) => set({ sourceFilter }),
  tagFilter: "all",
  setTagFilter: (tagFilter) => set({ tagFilter }),
  lifecycleFilter: "all",
  setLifecycleFilter: (lifecycleFilter) => set({ lifecycleFilter }),

  selectedIds: [],
  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  clearSelection: () => set({ selectedIds: [] }),
  bulkDelete: () =>
    set((s) => ({
      contacts: s.contacts.filter((c) => !s.selectedIds.includes(c.id)),
      selectedIds: [],
    })),
  bulkAssign: (owner) =>
    set((s) => ({
      contacts: s.contacts.map((c) =>
        s.selectedIds.includes(c.id) ? { ...c, owner } : c,
      ),
      selectedIds: [],
    })),

  addContact: (c) =>
    set((s) => {
      const id = `ct_${Date.now()}`;
      const co = s.companies[0];
      const newContact: Contact = {
        id,
        name: c.name ?? "Untitled",
        email: c.email ?? "",
        phone: c.phone ?? "",
        avatar: (c.name ?? "U N").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
        country: c.country ?? "India",
        timezone: c.timezone ?? "Asia/Kolkata",
        company: c.company ?? co.name,
        companyId: c.companyId ?? co.id,
        designation: c.designation ?? "—",
        source: c.source ?? "Website",
        tags: c.tags ?? [],
        notes: c.notes ?? "",
        owner: c.owner ?? "Rohan Kapoor",
        lifecycle: c.lifecycle ?? "Lead",
        leadScore: c.leadScore ?? 50,
        customerValue: c.customerValue ?? 0,
        sentiment: "neutral",
        churnRisk: 20,
        lastActive: "just now",
        createdAt: "just now",
      };
      return { contacts: [newContact, ...s.contacts], selectedContactId: id };
    }),
  updateContact: (id, patch) =>
    set((s) => ({
      contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  archiveContact: (id) =>
    set((s) => ({
      contacts: s.contacts.map((c) => (c.id === id ? { ...c, archived: true } : c)),
    })),
  restoreContact: (id) =>
    set((s) => ({
      contacts: s.contacts.map((c) => (c.id === id ? { ...c, archived: false } : c)),
    })),
  deleteContact: (id) =>
    set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),

  moveDeal: (id, stage) =>
    set((s) => ({
      deals: s.deals.map((d) =>
        d.id === id
          ? {
              ...d,
              stage,
              probability: stage === "Won" ? 100 : stage === "Lost" ? 0 : d.probability,
            }
          : d,
      ),
    })),
  addDeal: (d) =>
    set((s) => {
      const id = `d_${Date.now()}`;
      const ct = s.contacts.find((c) => c.id === d.contactId) ?? s.contacts[0];
      const newDeal: Deal = {
        id,
        title: d.title ?? `${ct.company} – New Deal`,
        contactId: ct.id,
        contactName: ct.name,
        company: ct.company,
        value: d.value ?? 10000,
        probability: 20,
        stage: d.stage ?? "New",
        owner: d.owner ?? ct.owner,
        expectedClose: d.expectedClose ?? "30d",
        createdAt: "just now",
      };
      return { deals: [newDeal, ...s.deals] };
    }),

  convertVisitorToLead: ({ name, email, source }) => {
    const id = `ct_${Date.now()}`;
    get().addContact({
      name,
      email: email ?? "",
      source: source ?? "Live Visitor",
      lifecycle: "Lead",
    });
    return id;
  },
}));
