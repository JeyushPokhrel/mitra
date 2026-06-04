import { create } from "zustand";
import { seedVisitors, newRandomVisitor, type Visitor, type VisitorActivity } from "@/lib/visitors-mock";

export type VisitorViewKey =
  | "all"
  | "active"
  | "high_intent"
  | "returning"
  | "new"
  | "vip";

export type VisitorSortKey =
  | "most_active"
  | "highest_intent"
  | "longest_session"
  | "newest";

interface Filters {
  view: VisitorViewKey;
  sort: VisitorSortKey;
  query: string;
  country: string | null;
  device: string | null;
  source: string | null;
  page: string | null;
}

interface FeedItem extends VisitorActivity {
  visitorId: string;
  visitorName: string;
}

interface VisitorState {
  visitors: Visitor[];
  selectedId: string | null;
  filters: Filters;
  feed: FeedItem[];
  setSelected: (id: string) => void;
  setFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  resetFilters: () => void;
  addTag: (id: string, tag: string) => void;
  toggleVip: (id: string) => void;
  blockVisitor: (id: string) => void;
  assignAgent: (id: string, agent: string) => void;
  pushActivity: (visitorId: string, act: VisitorActivity) => void;
  simulateTick: () => void;
}

const defaultFilters: Filters = {
  view: "all",
  sort: "most_active",
  query: "",
  country: null,
  device: null,
  source: null,
  page: null,
};

export const useVisitorStore = create<VisitorState>((set, get) => ({
  visitors: seedVisitors,
  selectedId: seedVisitors[0].id,
  filters: defaultFilters,
  feed: seedVisitors
    .slice(0, 8)
    .map((v) => ({
      ...v.activities[v.activities.length - 1],
      visitorId: v.id,
      visitorName: v.name ?? v.id,
    })),
  setSelected: (id) => set({ selectedId: id }),
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  resetFilters: () => set({ filters: defaultFilters }),
  addTag: (id, tag) =>
    set((s) => ({
      visitors: s.visitors.map((v) =>
        v.id === id && !v.tags.includes(tag) ? { ...v, tags: [...v.tags, tag] } : v,
      ),
    })),
  toggleVip: (id) =>
    set((s) => ({
      visitors: s.visitors.map((v) => (v.id === id ? { ...v, vip: !v.vip } : v)),
    })),
  blockVisitor: (id) =>
    set((s) => ({
      visitors: s.visitors.filter((v) => v.id !== id),
      selectedId: s.selectedId === id ? s.visitors[0]?.id ?? null : s.selectedId,
    })),
  assignAgent: (id, agent) =>
    set((s) => ({
      visitors: s.visitors.map((v) =>
        v.id === id ? { ...v, tags: Array.from(new Set([...v.tags, `@${agent}`])) } : v,
      ),
    })),
  pushActivity: (visitorId, act) =>
    set((s) => {
      const v = s.visitors.find((x) => x.id === visitorId);
      if (!v) return s;
      const feedItem: FeedItem = { ...act, visitorId, visitorName: v.name ?? v.id };
      return {
        visitors: s.visitors.map((x) =>
          x.id === visitorId
            ? {
                ...x,
                activities: [...x.activities.slice(-19), act],
                lastActivityAt: act.at,
                currentPage: act.page ?? x.currentPage,
                pagesVisited: act.type === "page_view" ? x.pagesVisited + 1 : x.pagesVisited,
              }
            : x,
        ),
        feed: [feedItem, ...s.feed].slice(0, 40),
      };
    }),
  simulateTick: () => {
    const state = get();
    // Random scenario
    const roll = Math.random();
    if (roll < 0.2 && state.visitors.length < 60) {
      // new visitor
      const v = newRandomVisitor();
      set((s) => ({
        visitors: [v, ...s.visitors],
        feed: [
          {
            ...v.activities[v.activities.length - 1],
            visitorId: v.id,
            visitorName: v.name ?? v.id,
          },
          ...s.feed,
        ].slice(0, 40),
      }));
      return;
    }
    if (roll < 0.4) {
      // status flip
      set((s) => {
        const idx = Math.floor(Math.random() * s.visitors.length);
        const next = [...s.visitors];
        const cur = next[idx];
        if (!cur) return s;
        const flip = cur.status === "active" ? "idle" : cur.status === "idle" ? "active" : "leaving";
        next[idx] = { ...cur, status: flip, lastActivityAt: new Date().toISOString() };
        return { visitors: next };
      });
      return;
    }
    // push activity to random visitor
    const visitor = state.visitors[Math.floor(Math.random() * state.visitors.length)];
    if (!visitor) return;
    const types: VisitorActivity["type"][] = ["page_view", "click", "scroll", "form_start", "chat_opened", "exit_intent"];
    const t = types[Math.floor(Math.random() * types.length)];
    const pages = ["/", "/pricing", "/features/ai", "/contact", "/integrations"];
    const page = pages[Math.floor(Math.random() * pages.length)];
    const act: VisitorActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: t,
      label:
        t === "page_view" ? `Viewed ${page}`
        : t === "click" ? `Clicked CTA on ${page}`
        : t === "scroll" ? `Scrolled 75% on ${page}`
        : t === "form_start" ? `Started form on ${page}`
        : t === "chat_opened" ? `Opened chat widget`
        : `Exit intent detected on ${page}`,
      page,
      at: new Date().toISOString(),
    };
    get().pushActivity(visitor.id, act);
  },
}));

export function selectFilteredVisitors(s: VisitorState): Visitor[] {
  const { visitors, filters } = s;
  let list = [...visitors];
  if (filters.view === "active") list = list.filter((v) => v.status === "active");
  if (filters.view === "high_intent") list = list.filter((v) => v.intent === "high");
  if (filters.view === "returning") list = list.filter((v) => v.returning);
  if (filters.view === "new") list = list.filter((v) => !v.returning);
  if (filters.view === "vip") list = list.filter((v) => v.vip);
  if (filters.country) list = list.filter((v) => v.country === filters.country);
  if (filters.device) list = list.filter((v) => v.device === filters.device);
  if (filters.source) list = list.filter((v) => v.source === filters.source);
  if (filters.page) list = list.filter((v) => v.currentPage === filters.page);
  if (filters.query.trim()) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (v) =>
        (v.name?.toLowerCase().includes(q) ?? false) ||
        (v.email?.toLowerCase().includes(q) ?? false) ||
        v.id.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.currentPage.toLowerCase().includes(q),
    );
  }
  switch (filters.sort) {
    case "most_active":
      list.sort((a, b) => +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt));
      break;
    case "highest_intent":
      list.sort((a, b) => b.leadScore - a.leadScore);
      break;
    case "longest_session":
      list.sort((a, b) => b.sessionSeconds - a.sessionSeconds);
      break;
    case "newest":
      list.sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
      break;
  }
  return list;
}
