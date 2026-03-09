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

const AVAILABLE_SECTIONS = [
  "Campaign Performance",
  "Ad Spend Analysis",
  "ROAS & Conversions",
  "Top Products",
  "Search Terms",
  "Recommendations"
];

export default function ClientPortal() {
  const [reports, setReports] = useState(mockClientReports);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [clientName, setClientName] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>(["Campaign Performance", "ROAS & Conversions"]);

  const sentCount = reports.filter((r) => r.status === "sent").length;
  const scheduledCount = reports.filter((r) => r.status === "scheduled").length;
  const uniqueClients = new Set(reports.map((r) => r.clientName)).size;

  const handleToggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleCreateReport = () => {
    if (!reportName.trim() || !clientName.trim() || !period.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    const newReport = {
      id: `report-${Date.now()}`,
      name: reportName,
      clientName: clientName,
      period: period,
      status: "draft" as const,
      sections: selectedSections,
      scheduleCron: null,
      lastGenerated: new Date().toISOString(),
    };

    setReports(prev => [newReport, ...prev]);
    toast.success("Report created successfully");
    
    // Reset form
    setReportName("");
    setClientName("");
    setPeriod("");
    setSelectedSections(["Campaign Performance", "ROAS & Conversions"]);
    setCreateModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Client Reporting Portal"
          subtitle="Auto-generate branded reports, send on schedule, and provide read-only client dashboard links"
          actions={
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setCreateModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Report</Button>
            </div>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Total Reports</p>
            <p className="text-xl font-semibold text-foreground">{reports.length}</p>
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
              {reports.map((report) => (
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

      {/* Create Report Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name <span className="text-destructive">*</span></Label>
              <Input
                id="reportName"
                placeholder="e.g., Q1 2026 Performance Report"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name <span className="text-destructive">*</span></Label>
              <Input
                id="clientName"
                placeholder="e.g., Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Reporting Period <span className="text-destructive">*</span></Label>
              <Input
                id="period"
                placeholder="e.g., Jan 1 - Mar 31, 2026"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Report Sections <span className="text-destructive">*</span></Label>
              <div className="space-y-2 border border-border rounded-lg p-4">
                {AVAILABLE_SECTIONS.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={section}
                      checked={selectedSections.includes(section)}
                      onCheckedChange={() => handleToggleSection(section)}
                    />
                    <label
                      htmlFor={section}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {section}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedSections.length} section{selectedSections.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
