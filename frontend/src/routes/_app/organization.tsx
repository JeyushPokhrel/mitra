import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/StatCard";
import { OrgProfile } from "@/components/workforce/OrgProfile";

export const Route = createFileRoute("/_app/organization")({
  component: OrganizationPage,
});

function OrganizationPage() {
  return (
    <div>
      <PageHeader
        title="Organization"
        description="Profile, branding, domain, and global settings."
      />
      <OrgProfile />
    </div>
  );
}
