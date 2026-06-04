import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useVisitorStore, type VisitorViewKey, type VisitorSortKey } from "@/store/visitorStore";

const VIEWS: { key: VisitorViewKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "high_intent", label: "High intent" },
  { key: "returning", label: "Returning" },
  { key: "new", label: "New" },
  { key: "vip", label: "VIP" },
];

const SORTS: { key: VisitorSortKey; label: string }[] = [
  { key: "most_active", label: "Most active" },
  { key: "highest_intent", label: "Highest intent" },
  { key: "longest_session", label: "Longest session" },
  { key: "newest", label: "Newest" },
];

export function VisitorFilters() {
  const filters = useVisitorStore((s) => s.filters);
  const setFilter = useVisitorStore((s) => s.setFilter);
  const reset = useVisitorStore((s) => s.resetFilters);

  const hasFilters =
    filters.country || filters.device || filters.source || filters.page || filters.query;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search visitors, pages, countries…"
          value={filters.query}
          onChange={(e) => setFilter("query", e.target.value)}
          className="pl-9 rounded-xl bg-card"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setFilter("view", v.key)}
            className={
              filters.view === v.key
                ? "px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                : "px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-accent"
            }
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v as VisitorSortKey)}>
          <SelectTrigger className="rounded-xl h-9 bg-card text-xs">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.key} value={s.key} className="text-xs">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.device ?? "all"}
          onValueChange={(v) => setFilter("device", v === "all" ? null : v)}
        >
          <SelectTrigger className="rounded-xl h-9 bg-card text-xs">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All devices</SelectItem>
            <SelectItem value="Desktop" className="text-xs">Desktop</SelectItem>
            <SelectItem value="Mobile" className="text-xs">Mobile</SelectItem>
            <SelectItem value="Tablet" className="text-xs">Tablet</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.source ?? "all"}
          onValueChange={(v) => setFilter("source", v === "all" ? null : v)}
        >
          <SelectTrigger className="rounded-xl h-9 bg-card text-xs">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {["all", "Google", "Direct", "Ads", "LinkedIn", "Twitter", "Referral"].map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {s === "all" ? "All sources" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.country ?? "all"}
          onValueChange={(v) => setFilter("country", v === "all" ? null : v)}
        >
          <SelectTrigger className="rounded-xl h-9 bg-card text-xs">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {["all", "India", "USA", "Germany", "UK", "Brazil", "Japan", "France", "Spain", "Canada"].map((c) => (
              <SelectItem key={c} value={c} className="text-xs">
                {c === "all" ? "All countries" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="w-full h-8 rounded-lg text-xs text-muted-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      )}

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Filter className="h-3 w-3" />
        Filters update results instantly
      </div>
    </div>
  );
}
