import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" />
      <Tabs defaultValue="general">
        <TabsList className="rounded-xl flex-wrap h-auto">
          {["general", "security", "notifications", "privacy", "integrations", "ai"].map(t => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="general" className="mt-4">
          <Card className="p-6 rounded-2xl space-y-4 shadow-[var(--shadow-soft)]">
            <div><Label>Display name</Label><Input defaultValue="Rohan Kapoor" className="mt-1.5 rounded-xl" /></div>
            <div><Label>Email</Label><Input defaultValue="rohan@acme.com" className="mt-1.5 rounded-xl" /></div>
            <div><Label>Language</Label><Input defaultValue="English" className="mt-1.5 rounded-xl" /></div>
            <Button className="rounded-xl">Save</Button>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card className="p-6 rounded-2xl space-y-4 shadow-[var(--shadow-soft)]">
            {["New conversations", "Ticket assignments", "Mentions", "Daily digest"].map(n => (
              <div key={n} className="flex items-center justify-between">
                <Label>{n}</Label>
                <Switch defaultChecked />
              </div>
            ))}
          </Card>
        </TabsContent>
        {["security", "privacy", "integrations", "ai"].map(t => (
          <TabsContent key={t} value={t} className="mt-4">
            <Card className="p-10 text-center rounded-2xl shadow-[var(--shadow-soft)]">
              <p className="font-semibold capitalize">{t} settings</p>
              <p className="text-sm text-muted-foreground mt-1">Configure your {t} preferences here.</p>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
