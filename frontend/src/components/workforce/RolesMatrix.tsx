import { useWorkforceStore } from "@/store/workforceStore";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ROLES, PERMISSIONS, RESOURCES, type Permission } from "@/lib/workforce-mock";
import { toast } from "sonner";

export function RolesMatrix() {
  const { permissions, togglePermission } = useWorkforceStore();

  return (
    <Card className="p-0 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Roles & permissions</p>
          <p className="text-[11px] text-muted-foreground">Granular access control per role and resource</p>
        </div>
        <Badge variant="secondary" className="rounded-full text-[10px]">{ROLES.length} roles</Badge>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3 font-medium sticky left-0 bg-muted/40 z-10">Resource / Role</th>
              {ROLES.map((r) => (
                <th key={r} className="p-2 font-medium text-center min-w-[120px]">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map((res) => (
              <tr key={res} className="border-t">
                <td className="p-3 font-medium sticky left-0 bg-card z-10">{res}</td>
                {ROLES.map((role) => {
                  const perms = permissions[role][res] ?? [];
                  return (
                    <td key={role} className="p-2">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {PERMISSIONS.map((p) => (
                          <Pill
                            key={p}
                            label={p}
                            active={perms.includes(p)}
                            onClick={() => {
                              togglePermission(role, res, p);
                              toast.success(`${role} · ${res} · ${p}`);
                            }}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Pill({ label, active, onClick }: { label: Permission; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-1.5 py-0.5 rounded-md text-[9px] font-medium border transition-colors " +
        (active
          ? "bg-primary/15 text-primary border-primary/30"
          : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted")
      }
    >
      {label[0]}
    </button>
  );
}
