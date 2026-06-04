import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WidgetMode = "ai" | "agent" | "offline";
export type WidgetPosition = "right" | "left";
export type WidgetView = "home" | "chat" | "prechat";

interface WidgetState {
  open: boolean;
  minimized: boolean;
  mode: WidgetMode;
  view: WidgetView;
  position: WidgetPosition;
  themeColor: string;
  greeting: string;
  orgName: string;
  size: "compact" | "regular" | "large";
  soundOn: boolean;
  unread: number;
  hasIdentity: boolean;
  identity: { name: string; email: string; phone?: string; subject?: string } | null;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  setMinimized: (v: boolean) => void;
  setMode: (m: WidgetMode) => void;
  setView: (v: WidgetView) => void;
  setPosition: (p: WidgetPosition) => void;
  setTheme: (c: string) => void;
  setGreeting: (g: string) => void;
  setOrgName: (n: string) => void;
  setSize: (s: WidgetState["size"]) => void;
  setSound: (v: boolean) => void;
  setUnread: (n: number) => void;
  incrementUnread: () => void;
  setIdentity: (i: WidgetState["identity"]) => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      open: false,
      minimized: false,
      mode: "ai",
      view: "home",
      position: "right",
      themeColor: "#B6AE9F",
      greeting: "Hi there 👋 How can we help?",
      orgName: "MITRA Support",
      size: "regular",
      soundOn: true,
      unread: 1,
      hasIdentity: false,
      identity: null,
      setOpen: (v) => set({ open: v, unread: v ? 0 : undefined as unknown as number }),
      toggle: () => set((s) => ({ open: !s.open, unread: !s.open ? 0 : s.unread })),
      setMinimized: (v) => set({ minimized: v }),
      setMode: (m) => set({ mode: m }),
      setView: (v) => set({ view: v }),
      setPosition: (p) => set({ position: p }),
      setTheme: (c) => set({ themeColor: c }),
      setGreeting: (g) => set({ greeting: g }),
      setOrgName: (n) => set({ orgName: n }),
      setSize: (s) => set({ size: s }),
      setSound: (v) => set({ soundOn: v }),
      setUnread: (n) => set({ unread: n }),
      incrementUnread: () => set((s) => ({ unread: s.unread + 1 })),
      setIdentity: (i) => set({ identity: i, hasIdentity: !!i }),
    }),
    { name: "mitra-widget" },
  ),
);
