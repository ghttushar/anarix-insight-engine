import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

const mockLogs = [
  { id: "l1", timestamp: "2025-12-02 09:15:32", user: "John Smith", action: "Login", module: "Auth", details: "Successful login from 192.168.1.1" },
  { id: "l2", timestamp: "2025-12-02 09:18:45", user: "John Smith", action: "Campaign Updated", module: "Advertising", details: "Budget changed from $50 to $75 for 'Brand SP'" },
  { id: "l3", timestamp: "2025-12-02 09:22:10", user: "Sarah Johnson", action: "Report Generated", module: "Reports", details: "Weekly Performance Report exported" },
  { id: "l4", timestamp: "2025-12-01 16:42:00", user: "Sarah Johnson", action: "Rule Created", module: "Advertising", details: "Auto-bid rule 'ROAS Target 4x' created" },
  { id: "l5", timestamp: "2025-12-01 14:30:15", user: "John Smith", action: "User Invited", module: "Settings", details: "Invitation sent to alex@partner.com" },
  { id: "l6", timestamp: "2025-12-01 11:05:33", user: "Mike Chen", action: "Query Executed", module: "AMC", details: "Ran 'New-to-Brand Customers' query" },
  { id: "l7", timestamp: "2025-11-30 09:00:00", user: "System", action: "Data Sync", module: "System", details: "Amazon SP data sync completed (245 campaigns)" },
  { id: "l8", timestamp: "2025-11-29 15:20:00", user: "Emily Davis", action: "Account Connected", module: "Settings", details: "Walmart account 'Brand Store' connected" },
];

const moduleColors: Record<string, string> = {
  Auth: "bg-muted text-muted-foreground",
  Advertising: "bg-primary/10 text-primary",
  Reports: "bg-accent/20 text-accent-foreground",
  Settings: "bg-muted text-muted-foreground",
  AMC: "bg-warning/10 text-warning",
  System: "bg-success/10 text-success",
};

export default function Logs() {
  const [search, setSearch] = useState("");

  const filtered = mockLogs.filter(l =>
    !search ||
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.module.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Activity Logs</h1>
          <p className="text-sm text-muted-foreground">Audit trail of all actions performed in the system</p>
        </div>
        <Separator />

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="text-muted-foreground font-mono text-xs">{l.timestamp}</TableCell>
                  <TableCell className="font-medium">{l.user}</TableCell>
                  <TableCell>{l.action}</TableCell>
                  <TableCell><Badge className={moduleColors[l.module] || "bg-muted text-muted-foreground"}>{l.module}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">{l.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
