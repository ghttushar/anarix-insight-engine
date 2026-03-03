import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAudiences } from "@/data/mockAMC";

const statusColors: Record<string, string> = {
  ready: "bg-success/10 text-success",
  building: "bg-primary/10 text-primary",
  expired: "bg-muted text-muted-foreground",
};

export default function AMCAudiences() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">AMC Audiences</h1>
          <p className="text-sm text-muted-foreground">Audiences generated from AMC query results</p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audience Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Source Query</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAudiences.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.size.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{a.source}</TableCell>
                  <TableCell className="text-muted-foreground">{a.createdAt}</TableCell>
                  <TableCell><Badge className={statusColors[a.status]}>{a.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
