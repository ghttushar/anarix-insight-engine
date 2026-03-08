import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Send, FileText, Calendar, Download, Eye } from "lucide-react";
import { mockClientReports } from "@/data/mockClientReports";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-muted",
  generated: "bg-primary/10 text-primary border-primary/20",
  sent: "bg-success/10 text-success border-success/20",
  scheduled: "bg-warning/10 text-warning border-warning/20",
};

export default function ClientPortal() {
  const sentCount = mockClientReports.filter((r) => r.status === "sent").length;
  const scheduledCount = mockClientReports.filter((r) => r.status === "scheduled").length;
  const uniqueClients = new Set(mockClientReports.map((r) => r.clientName)).size;

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Client Reporting Portal"
          subtitle="Auto-generate branded reports, send on schedule, and provide read-only client dashboard links"
          actions={
            <div className="flex gap-2">
              <Button size="sm" onClick={() => toast.info("Opening report builder...")}><Plus className="mr-2 h-4 w-4" />Create Report</Button>
            </div>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Total Reports</p>
            <p className="text-xl font-semibold text-foreground">{mockClientReports.length}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Clients</p>
            <p className="text-xl font-semibold text-foreground">{uniqueClients}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Sent This Month</p>
            <p className="text-xl font-semibold text-success">{sentCount}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
            <p className="text-xl font-semibold text-warning">{scheduledCount}</p>
          </CardContent></Card>
        </div>

        {/* Reports Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[240px]">Report Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClientReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">{report.period}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusStyles[report.status]}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{report.sections.length} sections</span>
                  </TableCell>
                  <TableCell>
                    {report.scheduleCron ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />{report.scheduleCron}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Opening report preview...")}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Downloading PDF...")}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {report.status !== "sent" && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success(`Report sent to ${report.clientName}`)}>
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
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
