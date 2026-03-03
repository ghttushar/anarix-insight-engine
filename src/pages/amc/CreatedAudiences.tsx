import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockCreatedAudiences } from "@/data/mockAMC";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-muted text-muted-foreground",
};

const typeColors: Record<string, string> = {
  lookalike: "bg-primary/10 text-primary",
  retargeting: "bg-warning/10 text-warning",
  custom: "bg-accent/20 text-accent-foreground",
};

export default function AMCCreatedAudiences() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Created Audiences</h1>
          <p className="text-sm text-muted-foreground">Audiences created for activation in DSP campaigns</p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audience Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreatedAudiences.map(ca => (
                <TableRow key={ca.id}>
                  <TableCell className="font-medium">{ca.name}</TableCell>
                  <TableCell><Badge className={typeColors[ca.type]}>{ca.type}</Badge></TableCell>
                  <TableCell>{ca.size.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{ca.lastUpdated}</TableCell>
                  <TableCell><Badge className={statusColors[ca.status]}>{ca.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
