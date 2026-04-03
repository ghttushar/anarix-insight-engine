import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageFooterBar } from "@/components/layout/PageFooterBar";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Send, FileText, Calendar, Download, Eye, Clock, Building2, User } from "lucide-react";
import { mockClientReports } from "@/data/mockClientReports";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SortableTableHead, usePinning, sortData, getSortHandler } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-muted",
  generated: "bg-primary/10 text-primary border-primary/20",
  sent: "bg-success/10 text-success border-success/20",
  scheduled: "bg-warning/10 text-warning border-warning/20",
};

const AVAILABLE_SECTIONS = [
  "Campaign Performance", "Ad Spend Analysis", "ROAS & Conversions",
  "Top Products", "Search Terms", "Recommendations",
  "P&L Summary", "Inventory Status", "Competitor Analysis",
];

const REPORT_TEMPLATES = [
  { id: "performance", label: "Performance", desc: "Campaign metrics, ROAS, conversions" },
  { id: "pnl", label: "P&L", desc: "Revenue, costs, profit margins" },
  { id: "advertising", label: "Advertising", desc: "Ad spend, targeting, search terms" },
  { id: "custom", label: "Custom", desc: "Build your own report" },
];

const SCHEDULE_FREQUENCIES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-Weekly" },
  { id: "monthly", label: "Monthly" },
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PINNABLE_FIELDS = ["name", "clientName", "period", "status", "sections", "scheduleCron"];
const SORTABLE_FIELDS = [
  { id: "name", label: "Report Name" },
  { id: "clientName", label: "Client" },
  { id: "status", label: "Status" },
  { id: "period", label: "Period" },
];

const breadcrumbItems = [
  { label: "Reports", href: "/reports/client-portal" },
  { label: "Client Portal" },
];

export default function ClientPortal() {
  const [reports, setReports] = useState(mockClientReports);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"agency" | "brand">("agency");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);

  // Sort / pin / pagination
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE_FIELDS, 240);
  const handleSort = getSortHandler(sortField, setSortField, sortDirection, setSortDirection);

  // Create form
  const [reportName, setReportName] = useState("");
  const [clientName, setClientName] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>(["Campaign Performance", "ROAS & Conversions"]);
  const [selectedTemplate, setSelectedTemplate] = useState("performance");
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [scheduleDay, setScheduleDay] = useState("Monday");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [enableSchedule, setEnableSchedule] = useState(false);

  const sentCount = reports.filter((r) => r.status === "sent").length;
  const scheduledCount = reports.filter((r) => r.status === "scheduled").length;
  const uniqueClients = new Set(reports.map((r) => r.clientName)).size;
  const draftCount = reports.filter((r) => r.status === "draft").length;

  const filteredReports = reports.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = sortData(filteredReports, sortField, sortDirection);
  const paginatedReports = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleCreateReport = () => {
    if (!reportName.trim() || (!clientName.trim() && viewMode === "agency") || !period.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    const cronStr = enableSchedule ? `${scheduleFrequency} ${scheduleDay} ${scheduleTime}` : null;

    const newReport = {
      id: `report-${Date.now()}`,
      name: reportName,
      clientName: viewMode === "brand" ? "My Brand" : clientName,
      period,
      status: (enableSchedule ? "scheduled" : "draft") as "draft" | "scheduled",
      sections: selectedSections,
      scheduleCron: cronStr,
      lastGenerated: new Date().toISOString(),
    };

    setReports(prev => [newReport, ...prev]);
    toast.success(enableSchedule ? "Report scheduled successfully" : "Report created successfully");
    resetForm();
    setCreateModalOpen(false);
  };

  const resetForm = () => {
    setReportName("");
    setClientName("");
    setPeriod("");
    setSelectedSections(["Campaign Performance", "ROAS & Conversions"]);
    setSelectedTemplate("performance");
    setEnableSchedule(false);
    setScheduleFrequency("weekly");
    setScheduleDay("Monday");
    setScheduleTime("09:00");
  };

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <AppLayout>
      <div className="space-y-6 min-w-0">
        <PageHeader
          title="Reports"
          subtitle="Generate, schedule, and share branded reports"
          actions={
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setCreateModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Report</Button>
            </div>
          }
        />

        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing reports...")}>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "agency" | "brand")}>
            <TabsList className="h-8">
              <TabsTrigger value="agency" className="text-xs gap-1.5 h-7 px-3">
                <Building2 className="h-3 w-3" />Agency View
              </TabsTrigger>
              <TabsTrigger value="brand" className="text-xs gap-1.5 h-7 px-3">
                <User className="h-3 w-3" />Brand Owner
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </AppTaskbar>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Total Reports</p>
            <p className="text-xl font-semibold text-foreground">{reports.length}</p>
          </CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">{viewMode === "agency" ? "Clients" : "Templates"}</p>
            <p className="text-xl font-semibold text-foreground">{viewMode === "agency" ? uniqueClients : REPORT_TEMPLATES.length}</p>
          </CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Sent</p>
            <p className="text-xl font-semibold text-success">{sentCount}</p>
          </CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Scheduled</p>
            <p className="text-xl font-semibold text-warning">{scheduledCount}</p>
          </CardContent></Card>
        </div>

        {/* Brand Owner — Template Quick Actions */}
        {viewMode === "brand" && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Report Templates</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {REPORT_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setCreateModalOpen(true); }}
                  className="rounded-lg border border-border bg-card p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <FileText className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reports Table */}
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search reports..."
          onDownload={() => toast.success("Exporting reports...")}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
        />

        <div className="rounded-lg border border-border bg-card overflow-auto">
          <Table>
            <TableHeader>
              <tr className="bg-muted/30 hover:bg-muted/30">
                <SortableTableHead field="name" isFixed className="min-w-[240px]" {...sp}>Report Name</SortableTableHead>
                <SortableTableHead field="clientName" {...sp} style={ps("clientName")} className={cn(pc("clientName", true))}>Client</SortableTableHead>
                <SortableTableHead field="period" {...sp} style={ps("period")} className={cn(pc("period", true))}>Period</SortableTableHead>
                <SortableTableHead field="status" align="center" {...sp} style={ps("status")} className={cn(pc("status", true))}>Status</SortableTableHead>
                <SortableTableHead field="sections" {...sp} style={ps("sections")} className={cn(pc("sections", true))}>Sections</SortableTableHead>
                <SortableTableHead field="scheduleCron" {...sp} style={ps("scheduleCron")} className={cn(pc("scheduleCron", true))}>Schedule</SortableTableHead>
                <SortableTableHead field="actions" isFixed align="center" sortField={null} sortDirection="asc" onSort={undefined} pinnedColumns={pinnedColumns} onPinToggle={undefined}>Actions</SortableTableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground" style={ps("clientName")} className={cn("text-muted-foreground", pc("clientName"))}>{report.clientName}</TableCell>
                  <TableCell className="text-muted-foreground" style={ps("period")} className={cn("text-muted-foreground", pc("period"))}>{report.period}</TableCell>
                  <TableCell className="text-center" style={ps("status")} className={cn("text-center", pc("status"))}>
                    <Badge variant="outline" className={statusStyles[report.status]}>{report.status}</Badge>
                  </TableCell>
                  <TableCell style={ps("sections")} className={cn(pc("sections"))}>
                    <span className="text-xs text-muted-foreground">{report.sections.length} sections</span>
                  </TableCell>
                  <TableCell style={ps("scheduleCron")} className={cn(pc("scheduleCron"))}>
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
          <TablePagination
            page={currentPage}
            pageSize={pageSize}
            totalItems={filteredReports.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>

        <PageFooterBar breadcrumbItems={breadcrumbItems} />
      </div>

      {/* Create Report Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewMode === "brand" ? "Create Custom Report" : "Create New Report"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Template Selection (Brand Owner) */}
            {viewMode === "brand" && (
              <div className="space-y-2">
                <Label>Template</Label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={cn(
                        "rounded-md border p-3 text-left text-xs transition-all cursor-pointer",
                        selectedTemplate === t.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <p className="font-medium">{t.label}</p>
                      <p className="text-muted-foreground mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name <span className="text-destructive">*</span></Label>
              <Input id="reportName" placeholder="e.g., Q1 2026 Performance Report" value={reportName} onChange={(e) => setReportName(e.target.value)} />
            </div>

            {viewMode === "agency" && (
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name <span className="text-destructive">*</span></Label>
                <Input id="clientName" placeholder="e.g., Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="period">Reporting Period <span className="text-destructive">*</span></Label>
              <Input id="period" placeholder="e.g., Jan 1 - Mar 31, 2026" value={period} onChange={(e) => setPeriod(e.target.value)} />
            </div>

            <div className="space-y-3">
              <Label>Report Sections <span className="text-destructive">*</span></Label>
              <div className="space-y-2 border border-border rounded-lg p-3">
                {AVAILABLE_SECTIONS.map((section) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox id={section} checked={selectedSections.includes(section)} onCheckedChange={() => handleToggleSection(section)} />
                    <label htmlFor={section} className="text-sm leading-none cursor-pointer">{section}</label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{selectedSections.length} section{selectedSections.length !== 1 ? 's' : ''} selected</p>
            </div>

            {/* Schedule Builder */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Checkbox id="enableSchedule" checked={enableSchedule} onCheckedChange={(v) => setEnableSchedule(!!v)} />
                <label htmlFor="enableSchedule" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Schedule auto-generation
                </label>
              </div>

              {enableSchedule && (
                <div className="grid grid-cols-3 gap-3 pl-6">
                  <div className="space-y-1">
                    <Label className="text-xs">Frequency</Label>
                    <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SCHEDULE_FREQUENCIES.map((f) => (
                          <SelectItem key={f.id} value={f.id} className="text-xs">{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Day</Label>
                    <Select value={scheduleDay} onValueChange={setScheduleDay}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((d) => (
                          <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Time</Label>
                    <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="h-8 text-xs" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreateReport}>{enableSchedule ? "Schedule Report" : "Create Report"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
