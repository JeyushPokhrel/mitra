import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Inbox, Ticket, Users, UserSquare2, Sparkles,
  Megaphone, Workflow, BarChart3, UsersRound, Building2, Plug,
  CreditCard, Settings, Shield, MessageCircle, MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inbox", label: "Inbox", icon: Inbox, badge: 12 },
  { to: "/tickets", label: "Tickets", icon: Ticket, badge: 5 },
  { to: "/visitors", label: "Visitors", icon: Users },
  { to: "/widget", label: "Chat Widget", icon: MessagesSquare },
  { to: "/crm", label: "CRM", icon: UserSquare2 },
  { to: "/ai-center", label: "AI Center", icon: Sparkles },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/automation", label: "Automation", icon: Workflow },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/workforce", label: "Workforce", icon: UsersRound },
  { to: "/organization", label: "Organization", icon: Building2 },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-none">MITRA</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Customer OS</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "text-foreground/70 hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  active ? "bg-primary-foreground/20" : "bg-primary/15 text-primary"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/super-admin"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <Shield className="h-4 w-4" />
          Super Admin
        </Link>
      </div>
    </aside>
  );
}
