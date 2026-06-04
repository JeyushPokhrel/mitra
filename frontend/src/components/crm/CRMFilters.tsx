import { useCRMStore } from "@/store/crmStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark, Filter, Search, Star, Tag, Users, Layers, UserCheck,
} from "lucide-react";
import { SAVED_VIEWS, SEGMENTS, OWNERS, SOURCES, TAGS, LIFECYCLES } from "@/lib/crm-mock";
import { cn } from "@/lib/utils";

export function CRMFilters() {
  const s = useCRMStore();

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            value={s.search}
            onChange={(e) => s.setSearch(e.target.value)}
            placeholder="Search CRM…"
            className="pl-8 h-8 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
        <Section icon={Bookmark} title="Saved views">
          {SAVED_VIEWS.map((v) => (
            <FilterRow
              key={v.id}
              label={v.name}
              active={s.view === v.id}
              onClick={() => s.setView(v.id)}
            />
          ))}
        </Section>

        <Section icon={Layers} title="Segments">
          {SEGMENTS.map((seg) => (
            <FilterRow
              key={seg.id}
              label={seg.name}
              right={<Badge variant="secondary" className="rounded-full text-[10px] h-4">{seg.count}</Badge>}
              onClick={() => {}}
            />
          ))}
        </Section>

        <Section icon={Star} title="Lifecycle">
          <FilterRow
            label="All"
            active={s.lifecycleFilter === "all"}
            onClick={() => s.setLifecycleFilter("all")}
          />
          {LIFECYCLES.map((l) => (
            <FilterRow
              key={l}
              label={l}
              active={s.lifecycleFilter === l}
              onClick={() => s.setLifecycleFilter(l)}
            />
          ))}
        </Section>

        <Section icon={UserCheck} title="Ownership">
          <FilterRow label="All owners" active={s.ownerFilter === "all"} onClick={() => s.setOwnerFilter("all")} />
          {OWNERS.map((o) => (
            <FilterRow key={o} label={o} active={s.ownerFilter === o} onClick={() => s.setOwnerFilter(o)} />
          ))}
        </Section>

        <Section icon={Filter} title="Lead source">
          <FilterRow label="All sources" active={s.sourceFilter === "all"} onClick={() => s.setSourceFilter("all")} />
          {SOURCES.map((src) => (
            <FilterRow key={src} label={src} active={s.sourceFilter === src} onClick={() => s.setSourceFilter(src)} />
          ))}
        </Section>

        <Section icon={Tag} title="Tags">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => s.setTagFilter("all")}
              className={cn(
                "px-2 py-0.5 rounded-full border text-[10px]",
                s.tagFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted",
              )}
            >
              All
            </button>
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => s.setTagFilter(t)}
                className={cn(
                  "px-2 py-0.5 rounded-full border text-[10px]",
                  s.tagFilter === t ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <Separator />
      <div className="p-3">
        <Button size="sm" variant="outline" className="w-full h-8 rounded-lg text-xs gap-2">
          <Users className="h-3.5 w-3.5" /> Manage segments
        </Button>
      </div>
    </div>
  );
}

function Section({
  icon: Icon, title, children,
}: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <p className="text-[10px] font-semibold uppercase tracking-wide">{title}</p>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterRow({
  label, active, right, onClick,
}: { label: string; active?: boolean; right?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-md transition-colors",
        active ? "bg-primary/15 text-foreground font-medium" : "hover:bg-muted",
      )}
    >
      <span className="truncate">{label}</span>
      {right}
    </button>
  );
}
