import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockInstances } from "@/data/mockAMC";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  provisioning: "bg-warning/10 text-warning",
};

export default function AMCInstances() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">AMC Instances</h1>
          <p className="text-sm text-muted-foreground">Manage your Amazon Marketing Cloud instances</p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instance ID</TableHead>
                <TableHead>Advertiser</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInstances.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-sm">{i.instanceId}</TableCell>
                  <TableCell className="font-medium">{i.advertiserName}</TableCell>
                  <TableCell className="text-muted-foreground">{i.region}</TableCell>
                  <TableCell className="text-muted-foreground">{i.createdAt}</TableCell>
                  <TableCell><Badge className={statusColors[i.status]}>{i.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
