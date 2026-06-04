import { useCRMStore } from "@/store/crmStore";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CompaniesTable() {
  const s = useCRMStore();
  const filtered = s.companies.filter((c) =>
    !s.search ? true : c.name.toLowerCase().includes(s.search.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Contacts</TableHead>
            <TableHead>Open deals</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow
              key={c.id}
              className={cn("cursor-pointer", s.selectedCompanyId === c.id && "bg-primary/10")}
              onClick={() => s.selectCompany(c.id)}
            >
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary text-[10px] font-semibold flex items-center justify-center">
                    {c.logo}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.website}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{c.industry}</TableCell>
              <TableCell className="text-sm tabular-nums">{c.employees.toLocaleString()}</TableCell>
              <TableCell className="text-sm tabular-nums">${c.revenue}M</TableCell>
              <TableCell className="text-sm">{c.contacts}</TableCell>
              <TableCell>
                {c.openDeals > 0 ? (
                  <Badge className="rounded-full text-[10px]">{c.openDeals}</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{c.team}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{c.country}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
