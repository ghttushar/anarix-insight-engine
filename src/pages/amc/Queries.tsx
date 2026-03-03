import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockQueries } from "@/data/mockAMC";
import { Plus, Play, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-muted text-muted-foreground",
};

export default function AMCQueries() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">AMC Queries</h1>
            <p className="text-sm text-muted-foreground">Create and manage Amazon Marketing Cloud queries</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />New Query</Button>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>SQL Preview</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQueries.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.name}</TableCell>
                  <TableCell><Badge className={statusColors[q.status]}>{q.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{q.lastRun}</TableCell>
                  <TableCell className="text-muted-foreground">{q.createdBy}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono max-w-[200px] truncate">{q.sqlPreview}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Play className="h-4 w-4 mr-2" />Run</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
