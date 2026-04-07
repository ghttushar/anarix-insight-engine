import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageFooterBar } from "@/components/layout/PageFooterBar";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { AppLevelSelector } from "@/components/layout/AppLevelSelector";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { HistoryTable } from "@/components/dayparting/HistoryTable";
import { ScheduledJobsTable } from "@/components/dayparting/ScheduledJobsTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { CreateSchedulePanel } from "@/components/panels/CreateSchedulePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Plus } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns, schedules as initialSchedules, executionHistory } from "@/data/mockDayParting";
import { MetricType, DayPartingSchedule } from "@/types/dayparting";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useFilter } from "@/contexts/FilterContext";
import { SortableTableHead, usePinning, sortData, getSortHandler } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";

const AVAILABLE_METRICS = [
  { key: "spend", label: "Spend", format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
  { key: "revenue", label: "Revenue", format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
  { key: "roas", label: "ROAS", format: (v: number) => `${v.toFixed(2)}x` },
  { key: "acos", label: "ACOS", format: (v: number) => `${v.toFixed(1)}%` },
  { key: "orders", label: "Orders", format: (v: number) => v.toString() },
  { key: "units", label: "Units", format: (v: number) => v.toString() },
  { key: "clicks", label: "Clicks", format: (v: number) => v.toLocaleString() },
  { key: "impressions", label: "Impressions", format: (v: number) => v.toLocaleString() },
  { key: "ctr", label: "CTR", format: (v: number) => `${v.toFixed(2)}%` },
  { key: "cpc", label: "CPC", format: (v: number) => `$${v.toFixed(2)}` },
  { key: "cvr", label: "CVR", format: (v: number) => `${v.toFixed(2)}%` },
  { key: "adSales", label: "Ad Sales", format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
];

const METRIC_VALUES: Record<string, number> = {
  spend: 0, revenue: 0, roas: 0, acos: 0, orders: 0, units: 0,
  clicks: 12450, impressions: 345000, ctr: 3.61, cpc: 0.82, cvr: 4.2, adSales: 0,
};

const PINNABLE_FIELDS = ["name", "status", "budget", "spend", "revenue", "roas", "scheduleCount"];

const breadcrumbItems = [{ label: "Day Parting" }];

export default function HourlyData() {
  const { adType, setAdType } = useFilter();
  const { setDataPanel } = useActivePanel();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [metric, setMetric] = useState<MetricType>("roas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [boxMetrics, setBoxMetrics] = useState<string[]>(["spend", "revenue", "roas", "acos", "orders", "units"]);

  // Campaigns table sort/pin
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE_FIELDS, 300);
  const handleSort = getSortHandler(sortField, setSortField, sortDirection, setSortDirection);

  // Schedules state
  const [schedules, setSchedules] = useState<DayPartingSchedule[]>(initialSchedules);
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  // History state
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");

  const summary = calculateHourlySummary(hourlyData);
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const getMetricValue = (key: string): number => {
    const map: Record<string, number> = {
      spend: summary.totalSpend, revenue: summary.totalRevenue,
      roas: summary.avgRoas, acos: summary.avgAcos,
      orders: summary.totalOrders, units: summary.totalUnits,
      ...METRIC_VALUES,
    };
    map.adSales = summary.totalRevenue;
    return map[key] ?? 0;
  };

  const handleBoxMetricChange = (index: number, newMetric: string) => {
    setBoxMetrics(prev => { const next = [...prev]; next[index] = newMetric; return next; });
  };

  // Campaigns filtering
  const filteredCampaigns = dayPartingCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = sortData(filteredCampaigns, sortField, sortDirection);
  const paginatedCampaigns = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  // Schedules filtering
  const filteredSchedules = schedules.filter((s) =>
    s.name.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
    s.campaignNames.some((c) => c.toLowerCase().includes(scheduleSearch.toLowerCase()))
  );

  const handlePauseResume = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() } : s)
    );
  };

  const handleDeleteClick = (id: string) => {
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (scheduleToDelete) {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete));
      toast.success("Schedule deleted successfully");
      setScheduleToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // History filtering
  const filteredHistory = executionHistory.filter((h) => {
    const matchesSearch =
      h.scheduleName.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.campaignName.toLowerCase().includes(historySearch.toLowerCase());
    if (historyStatusFilter === "all") return matchesSearch;
    return matchesSearch && h.status === historyStatusFilter;
  });

  const statusCounts = {
    all: executionHistory.length,
    success: executionHistory.filter((h) => h.status === "success").length,
    failed: executionHistory.filter((h) => h.status === "failed").length,
  };

  // Analytics heatmap state
  const [analyticsMetric, setAnalyticsMetric] = useState<MetricType>("roas");

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6 overflow-auto">
          <PageHeader
            title="Day Parting"
            subtitle="Analyze hourly performance, manage schedules, and review execution history"
            appLevelSelector={
              <AppLevelSelector>
                <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
                  <SelectTrigger className="h-9 w-[150px] text-sm border-border bg-muted/50 rounded-lg">
                    <SelectValue placeholder="Ad Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All" className="text-xs">All Types</SelectItem>
                    <SelectItem value="SP" className="text-xs">Sponsored Products</SelectItem>
                    <SelectItem value="SB" className="text-xs">Sponsored Brands</SelectItem>
                    <SelectItem value="SD" className="text-xs">Sponsored Display</SelectItem>
                  </SelectContent>
                </Select>
              </AppLevelSelector>
            }
          />
          <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")}>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Campaign</span>
              <Select value={selectedCampaigns[0]} onValueChange={(v) => setSelectedCampaigns([v])}>
                <SelectTrigger className="h-8 w-[200px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue placeholder="Select campaign" /></SelectTrigger>
                <SelectContent>{dayPartingCampaigns.map((camp) => (<SelectItem key={camp.id} value={camp.id} className="text-xs">{camp.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Metrics</span>
              <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
                <SelectTrigger className="h-8 w-[100px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="spend" className="text-xs">Spend</SelectItem>
                  <SelectItem value="revenue" className="text-xs">Revenue</SelectItem>
                  <SelectItem value="roas" className="text-xs">ROAS</SelectItem>
                  <SelectItem value="acos" className="text-xs">ACOS</SelectItem>
                  <SelectItem value="orders" className="text-xs">Orders</SelectItem>
                  <SelectItem value="ctr" className="text-xs">CTR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AppTaskbar>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns & Schedules</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Tab 1: Campaigns & Schedules */}
            <TabsContent value="campaigns" className="mt-4 space-y-6">
              {/* Hero Metrics */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Hourly Trends</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {boxMetrics.map((metricKey, index) => {
                    const metricDef = AVAILABLE_METRICS.find(m => m.key === metricKey) || AVAILABLE_METRICS[0];
                    const value = getMetricValue(metricKey);
                    return (
                      <div key={index} className="rounded-md border border-border bg-card px-3 py-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <Select value={metricKey} onValueChange={(v) => handleBoxMetricChange(index, v)}>
                            <SelectTrigger className="h-5 w-auto border-0 bg-transparent shadow-none p-0 text-[10px] font-medium text-muted-foreground uppercase gap-0.5 cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_METRICS.map((m) => (
                                <SelectItem key={m.key} value={m.key} className="text-xs">{m.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-lg font-semibold text-foreground">{metricDef.format(value)}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="overflow-auto">
                  <HourlyHeatmap data={hourlyData} metric={metric} />
                </div>
              </div>

              {/* Campaigns Table */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Campaigns</h2>
                <DataTableToolbar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search campaigns..."
                  onDownload={() => toast.success("Exporting campaigns...")}
                  showDeltas={showDeltas}
                  onShowDeltasChange={setShowDeltas}
                  leftContent={
                    <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setDataPanel("createSchedule")}>
                      <Plus className="h-3.5 w-3.5" />Create Rule
                    </Button>
                  }
                />
                <div className="rounded-lg border border-border bg-card overflow-auto">
                  <Table>
                    <TableHeader>
                      <tr className="bg-muted/30 hover:bg-muted/30">
                        <SortableTableHead field="name" isFixed className="min-w-[300px]" {...sp}>Campaign</SortableTableHead>
                        <SortableTableHead field="status" align="center" {...sp}>Status</SortableTableHead>
                        <SortableTableHead field="budget" align="right" {...sp} style={ps("budget")} className={cn(pc("budget", true))}>Budget</SortableTableHead>
                        <SortableTableHead field="spend" align="right" {...sp} style={ps("spend")} className={cn(pc("spend", true))}>Spend</SortableTableHead>
                        <SortableTableHead field="revenue" align="right" {...sp} style={ps("revenue")} className={cn(pc("revenue", true))}>Revenue</SortableTableHead>
                        <SortableTableHead field="roas" align="right" {...sp} style={ps("roas")} className={cn(pc("roas", true))}>ROAS</SortableTableHead>
                        <SortableTableHead field="scheduleCount" align="center" {...sp} style={ps("scheduleCount")} className={cn(pc("scheduleCount", true))}>Schedules</SortableTableHead>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {paginatedCampaigns.map((campaign) => (
                        <TableRow
                          key={campaign.id}
                          className={cn(
                            "hover:bg-muted/50 cursor-pointer",
                            selectedCampaigns.includes(campaign.id) && "bg-primary/5"
                          )}
                          onClick={() => setSelectedCampaigns([campaign.id])}
                        >
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={cn("capitalize", campaign.status === "enabled" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell style={ps("budget")} className={cn("text-right", pc("budget"))}>{formatCurrency(campaign.budget)}</TableCell>
                          <TableCell style={ps("spend")} className={cn("text-right", pc("spend"))}>{formatCurrency(campaign.spend)}</TableCell>
                          <TableCell style={ps("revenue")} className={cn("text-right", pc("revenue"))}>{formatCurrency(campaign.revenue)}</TableCell>
                          <TableCell style={ps("roas")} className={cn("text-right", pc("roas"))}>
                            <span className={cn(campaign.roas >= 3 ? "text-success" : "text-foreground")}>{campaign.roas.toFixed(2)}x</span>
                          </TableCell>
                          <TableCell style={ps("scheduleCount")} className={cn("text-center", pc("scheduleCount"))}>
                            {campaign.hasSchedule ? (
                              <Badge variant="secondary" className="gap-1"><Calendar className="h-3 w-3" />{campaign.scheduleCount}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    page={currentPage}
                    pageSize={pageSize}
                    totalItems={filteredCampaigns.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              </div>

              {/* Schedules Table */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Schedules</h2>
                <DataTableToolbar
                  searchValue={scheduleSearch}
                  onSearchChange={setScheduleSearch}
                  searchPlaceholder="Search schedules..."
                  onDownload={() => toast.success("Exporting schedules...")}
                  leftContent={
                    <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setDataPanel("createSchedule")}>
                      <Plus className="h-3.5 w-3.5" />Create Schedule
                    </Button>
                  }
                />
                {filteredSchedules.length > 0 ? (
                  <ScheduledJobsTable schedules={filteredSchedules} onPauseResume={handlePauseResume} onDelete={handleDeleteClick} />
                ) : (
                  <div className="text-center py-12 border border-border rounded-lg bg-card">
                    <p className="text-muted-foreground">No scheduled jobs found</p>
                    {scheduleSearch ? (
                      <p className="text-sm mt-1 text-muted-foreground">Try adjusting your search query</p>
                    ) : (
                      <Button variant="link" onClick={() => setDataPanel("createSchedule")} className="mt-2">Create your first schedule</Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 2: History */}
            <TabsContent value="history" className="mt-4 space-y-4">
              <DataTableToolbar
                searchValue={historySearch}
                onSearchChange={setHistorySearch}
                searchPlaceholder="Search by schedule or campaign..."
                onDownload={() => toast.success("Exporting history...")}
              />
              <Tabs value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                  <TabsTrigger value="success">Completed ({statusCounts.success})</TabsTrigger>
                  <TabsTrigger value="failed">Failed ({statusCounts.failed})</TabsTrigger>
                </TabsList>
              </Tabs>
              {filteredHistory.length > 0 ? (
                <HistoryTable history={filteredHistory} onRetry={() => toast.info("Retrying execution...")} />
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card">
                  <p>No execution history found</p>
                  {historySearch && <p className="text-sm mt-1">Try adjusting your search query</p>}
                </div>
              )}
            </TabsContent>

            {/* Tab 3: Analytics */}
            <TabsContent value="analytics" className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground">Hourly Performance Analysis</h2>
                <Select value={analyticsMetric} onValueChange={(v) => setAnalyticsMetric(v as MetricType)}>
                  <SelectTrigger className="h-8 w-[120px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spend" className="text-xs">Spend</SelectItem>
                    <SelectItem value="revenue" className="text-xs">Revenue</SelectItem>
                    <SelectItem value="roas" className="text-xs">ROAS</SelectItem>
                    <SelectItem value="acos" className="text-xs">ACOS</SelectItem>
                    <SelectItem value="orders" className="text-xs">Orders</SelectItem>
                    <SelectItem value="ctr" className="text-xs">CTR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-auto">
                <HourlyHeatmap data={hourlyData} metric={analyticsMetric} />
              </div>
            </TabsContent>
          </Tabs>

          <PageFooterBar breadcrumbItems={breadcrumbItems} />
        </div>
        <CreateSchedulePanel />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this schedule? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
