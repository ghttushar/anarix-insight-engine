import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockExecutedQueries } from "@/data/mockAMC";
import { Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  running: "bg-primary/10 text-primary",
};

export default function AMCExecutedQueries() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Executed Queries</h1>
          <p className="text-sm text-muted-foreground">View query execution history and results</p>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Results</TableHead>
                <TableHead>Executed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExecutedQueries.map(eq => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.queryName}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[eq.status]}>
                      {eq.status === "running" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      {eq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{eq.executionTime}</TableCell>
                  <TableCell>{eq.resultsCount > 0 ? eq.resultsCount.toLocaleString() : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{eq.executedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
