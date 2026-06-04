import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, LayoutGrid, List, BarChart3, Filter as FilterIcon, FileText,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTicketsStore } from "@/store/ticketsStore";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketKanban } from "@/components/tickets/TicketKanban";
import { TicketDetail } from "@/components/tickets/TicketDetail";
import { TicketDashboard } from "@/components/tickets/TicketDashboard";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  const isMobile = useIsMobile();
  const { view, setView, add } = useTicketsStore();

  const Toolbar = (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b bg-card">
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList className="h-8">
          <TabsTrigger value="dashboard" className="text-xs h-7 px-3 gap-1.5">
            <BarChart3 className="h-3 w-3" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs h-7 px-3 gap-1.5">
            <List className="h-3 w-3" /> List
          </TabsTrigger>
          <TabsTrigger value="kanban" className="text-xs h-7 px-3 gap-1.5">
            <LayoutGrid className="h-3 w-3" /> Kanban
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5"
          onClick={() => toast("Export queued")}>
          <FileText className="h-3.5 w-3.5" /> Export
        </Button>
        <Button size="sm" className="h-8 rounded-lg text-xs gap-1.5"
          onClick={() => {
            add({ subject: "New ticket", customer: "—", priority: "Medium" });
            toast.success("Ticket created");
          }}>
          <Plus className="h-3.5 w-3.5" /> New ticket
        </Button>
      </div>
    </div>
  );

  const Center = (
    <div className="flex h-full flex-col bg-background">
      {Toolbar}
      {view === "dashboard" && <TicketDashboard />}
      {view === "list" && <TicketTable />}
      {view === "kanban" && <TicketKanban />}
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-[calc(100vh-7rem)] -mx-4 -my-4 flex flex-col bg-background rounded-2xl border overflow-hidden">
        <div className="flex items-center gap-1 px-2 py-1.5 border-b bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><FilterIcon className="h-4 w-4" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85%]"><TicketFilters /></SheetContent>
          </Sheet>
          <p className="text-sm font-semibold">Tickets</p>
        </div>
        {Center}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] -mx-4 -my-4 lg:-mx-6 lg:-my-6">
      <ResizablePanelGroup className="rounded-2xl border bg-background overflow-hidden shadow-[var(--shadow-soft)]">
        <ResizablePanel defaultSize={18} minSize={14} maxSize={28}>
          <TicketFilters />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={56} minSize={38}>
          {Center}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={26} minSize={20} maxSize={38}>
          <TicketDetail />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
