import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Search, Plus, Download, Upload, BarChart3, Filter as FilterIcon,
  Users, ChevronLeft,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCRMStore, type CRMTab } from "@/store/crmStore";
import { CRMFilters } from "@/components/crm/CRMFilters";
import { ContactsTable } from "@/components/crm/ContactsTable";
import { CompaniesTable } from "@/components/crm/CompaniesTable";
import { DealsPipeline } from "@/components/crm/DealsPipeline";
import { CustomerProfile360 } from "@/components/crm/CustomerProfile360";
import { CRMAnalytics } from "@/components/crm/CRMAnalytics";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/crm")({
  component: CRMPage,
});

function CRMPage() {
  const isMobile = useIsMobile();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { tab, setTab, search, setSearch, addContact } = useCRMStore();

  const Toolbar = (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b bg-card">
      <Tabs value={tab} onValueChange={(v) => setTab(v as CRMTab)}>
        <TabsList className="h-8">
          <TabsTrigger value="contacts" className="text-xs h-7 px-3">Contacts</TabsTrigger>
          <TabsTrigger value="leads" className="text-xs h-7 px-3">Leads</TabsTrigger>
          <TabsTrigger value="companies" className="text-xs h-7 px-3">Companies</TabsTrigger>
          <TabsTrigger value="deals" className="text-xs h-7 px-3">Deals</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative flex-1 min-w-[180px] max-w-md ml-2">
        <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts, leads, companies, deals…"
          className="pl-8 h-8 rounded-lg text-xs"
        />
      </div>
      <Button
        size="sm" variant={showAnalytics ? "default" : "outline"}
        className="h-8 rounded-lg text-xs gap-1.5"
        onClick={() => setShowAnalytics((v) => !v)}
      >
        <BarChart3 className="h-3.5 w-3.5" />
        Analytics
      </Button>
      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5" onClick={() => toast("Import wizard opened")}>
        <Upload className="h-3.5 w-3.5" /> Import
      </Button>
      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5" onClick={() => toast("Export started")}>
        <Download className="h-3.5 w-3.5" /> Export
      </Button>
      <Button
        size="sm" className="h-8 rounded-lg text-xs gap-1.5"
        onClick={() => {
          addContact({ name: "New Contact", email: "new@example.com", lifecycle: "Lead" });
          toast.success("Contact created");
        }}
      >
        <Plus className="h-3.5 w-3.5" /> Add {tab.slice(0, -1)}
      </Button>
    </div>
  );

  const Center = (
    <div className="flex h-full flex-col bg-background">
      {Toolbar}
      {showAnalytics ? (
        <div className="flex-1 overflow-y-auto p-4">
          <CRMAnalytics />
        </div>
      ) : tab === "contacts" || tab === "leads" ? (
        <ContactsTable leadsOnly={tab === "leads"} />
      ) : tab === "companies" ? (
        <CompaniesTable />
      ) : (
        <DealsPipeline />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-[calc(100vh-7rem)] -mx-4 -my-4 flex flex-col bg-background rounded-2xl border overflow-hidden">
        <div className="flex items-center gap-1 px-2 py-1.5 border-b bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85%]">
              <CRMFilters />
            </SheetContent>
          </Sheet>
          <p className="text-sm font-semibold">CRM</p>
          <div className="ml-auto" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Users className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[90%] sm:max-w-sm">
              <CustomerProfile360 />
            </SheetContent>
          </Sheet>
        </div>
        {Center}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] -mx-4 -my-4 lg:-mx-6 lg:-my-6">
      <ResizablePanelGroup className="rounded-2xl border bg-background overflow-hidden shadow-[var(--shadow-soft)]">
        <ResizablePanel defaultSize={18} minSize={14} maxSize={28}>
          <CRMFilters />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={56} minSize={40}>
          {Center}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={26} minSize={20} maxSize={36}>
          <CustomerProfile360 />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
