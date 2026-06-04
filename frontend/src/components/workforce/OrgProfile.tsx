import { useWorkforceStore } from "@/store/workforceStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2, Globe, Upload, ArrowRightLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function OrgProfile() {
  const { organization, updateOrganization } = useWorkforceStore();
  const o = organization;

  return (
    <div className="space-y-4">
      <Card className="p-5 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {o.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{o.name}</h2>
              <Badge variant="secondary" className="rounded-full text-[10px]">{o.plan}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{o.description}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {o.domain}</span>
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {o.industry}</span>
              <span>{o.region} · {o.timezone}</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-lg text-xs gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Logo
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Seats used" value={`${o.seatsUsed}/${o.seats}`} progress={(o.seatsUsed / o.seats) * 100} />
          <Stat label="Employees" value={o.employees.toString()} />
          <Stat label="AI features" value={o.aiEnabled ? "Enabled" : "Disabled"} icon={Sparkles} tone="primary" />
        </div>
      </Card>

      <Card className="p-5 rounded-2xl">
        <p className="text-sm font-semibold mb-3">Organization details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Name" value={o.name} onChange={(v) => updateOrganization({ name: v })} />
          <Field label="Domain" value={o.domain} onChange={(v) => updateOrganization({ domain: v })} />
          <Field label="Website" value={o.website} onChange={(v) => updateOrganization({ website: v })} />
          <Field label="Industry" value={o.industry} onChange={(v) => updateOrganization({ industry: v })} />
          <div className="space-y-1.5">
            <Label className="text-[11px]">Region</Label>
            <Select value={o.region} onValueChange={(v) => updateOrganization({ region: v })}>
              <SelectTrigger className="h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["APAC","EMEA","NA","LATAM"].map((r) => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px]">Timezone</Label>
            <Select value={o.timezone} onValueChange={(v) => updateOrganization({ timezone: v })}>
              <SelectTrigger className="h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Asia/Kolkata","America/New_York","Europe/London","Europe/Berlin","Asia/Tokyo"].map((t) =>
                  <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-5 rounded-2xl">
        <p className="text-sm font-semibold mb-3">Settings</p>
        <ToggleRow
          title="Enable Mira AI features"
          desc="AI Copilot, suggested replies, sentiment analysis"
          checked={o.aiEnabled}
          onChange={(v) => updateOrganization({ aiEnabled: v })}
        />
        <ToggleRow title="Custom domain branding" desc="Use chat.mitra.app on the widget" checked={true} onChange={() => {}} />
        <ToggleRow title="Audit logging" desc="Track all admin actions" checked={true} onChange={() => {}} />
      </Card>

      <Card className="p-5 rounded-2xl border-destructive/30">
        <p className="text-sm font-semibold text-destructive mb-1">Ownership</p>
        <p className="text-xs text-muted-foreground">Current owner: <span className="font-medium text-foreground">{o.owner}</span></p>
        <Button size="sm" variant="outline" className="mt-3 rounded-lg text-xs gap-1.5"
          onClick={() => toast("Transfer flow opened")}>
          <ArrowRightLeft className="h-3.5 w-3.5" /> Transfer ownership
        </Button>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px]">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs rounded-lg" />
    </div>
  );
}

function Stat({
  label, value, progress, icon: Icon, tone,
}: { label: string; value: string; progress?: number; icon?: React.ComponentType<{ className?: string }>; tone?: "primary" }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className={`h-3 w-3 ${tone === "primary" ? "text-primary" : "text-muted-foreground"}`} />}
      </div>
      <p className="text-sm font-semibold mt-1">{value}</p>
      {progress != null && <Progress value={progress} className="h-1 mt-2" />}
    </div>
  );
}

function ToggleRow({
  title, desc, checked, onChange,
}: { title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-b-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
