import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/StatCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrgProfile } from "@/components/workforce/OrgProfile";
import { TeamsList } from "@/components/workforce/TeamsList";
import { RolesMatrix } from "@/components/workforce/RolesMatrix";
import { AgentsTable } from "@/components/workforce/AgentsTable";
import { Scheduling } from "@/components/workforce/Scheduling";

export const Route = createFileRoute("/_app/workforce")({
  component: WorkforcePage,
});

function WorkforcePage() {
  return (
    <div>
      <PageHeader
        title="Workforce & Organization"
        description="Manage agents, teams, roles, permissions, and shift scheduling."
      />
      <Tabs defaultValue="agents">
        <TabsList className="h-9 mb-4">
          <TabsTrigger value="organization" className="text-xs h-7 px-3">Organization</TabsTrigger>
          <TabsTrigger value="teams" className="text-xs h-7 px-3">Teams</TabsTrigger>
          <TabsTrigger value="agents" className="text-xs h-7 px-3">Agents</TabsTrigger>
          <TabsTrigger value="roles" className="text-xs h-7 px-3">Roles & permissions</TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs h-7 px-3">Scheduling</TabsTrigger>
        </TabsList>
        <TabsContent value="organization"><OrgProfile /></TabsContent>
        <TabsContent value="teams"><TeamsList /></TabsContent>
        <TabsContent value="agents"><AgentsTable /></TabsContent>
        <TabsContent value="roles"><RolesMatrix /></TabsContent>
        <TabsContent value="schedule"><Scheduling /></TabsContent>
      </Tabs>
    </div>
  );
}
