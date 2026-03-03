import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSchedules } from "@/data/mockAMC";
import { Plus } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-muted text-muted-foreground",
};

export default function AMCSchedules() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">AMC Schedules</h1>
            <p className="text-sm text-muted-foreground">Manage automated query execution schedules</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />New Schedule</Button>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule Name</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSchedules.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.queryName}</TableCell>
                  <TableCell className="capitalize">{s.frequency}</TableCell>
                  <TableCell className="text-muted-foreground">{s.nextRun}</TableCell>
                  <TableCell><Badge className={statusColors[s.status]}>{s.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
