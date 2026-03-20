import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Play, Download, Clock, Calendar, Eye, BarChart3, ChevronDown, Plus } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns, schedules } from "@/data/mockDayParting";
import { MetricType } from "@/types/dayparting";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HourlyData() {
  const navigate = useNavigate();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [metric, setMetric] = useState<MetricType>("roas");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const summary = calculateHourlySummary(hourlyData);
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const filteredCampaigns = dayPartingCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => { toast.success("Exporting hourly data..."); };
  const handleRun = () => { toast.info("Refreshing hourly data..."); };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Day Parting"
          subtitle="Analyze hourly performance and manage campaign schedules"
          actions={
            <>
              <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
              <Button onClick={handleRun}><Play className="mr-2 h-4 w-4" />Refresh Data</Button>
            </>
          }
        />

        {/* Campaign & Metric Selectors — BELOW taskbar */}
        <div className="flex items-center gap-4 rounded-lg border border-border p-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">Campaign:</label>
            <Select value={selectedCampaigns[0]} onValueChange={(v) => setSelectedCampaigns([v])}>
              <SelectTrigger className="w-64 h-8 text-sm"><SelectValue placeholder="Select campaign" /></SelectTrigger>
              <SelectContent>{dayPartingCampaigns.map((camp) => (<SelectItem key={camp.id} value={camp.id}>{camp.name}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">Metric:</label>
            <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
              <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="spend">Spend</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="roas">ROAS</SelectItem>
                <SelectItem value="acos">ACOS</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="ctr">CTR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Spend", value: formatCurrency(summary.totalSpend) },
            { label: "Revenue", value: formatCurrency(summary.totalRevenue) },
            { label: "ROAS", value: `${summary.avgRoas.toFixed(2)}x`, className: "text-success" },
            { label: "ACOS", value: `${summary.avgAcos.toFixed(1)}%` },
            { label: "Orders", value: summary.totalOrders.toString() },
            { label: "Units", value: summary.totalUnits.toString() },
          ].map((item) => (
            <Card key={item.label} className="h-full">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">{item.label}</CardTitle></CardHeader>
              <CardContent><p className={`text-xl font-semibold ${item.className || ""}`}>{item.value}</p></CardContent>
            </Card>
          ))}
        </div>

        {/* Heatmap */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Performance by Hour</h2>
          <HourlyHeatmap data={hourlyData} metric={metric} />
        </div>

        {/* Inline Schedule Creation */}
        <Collapsible open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              {scheduleOpen ? "Hide" : "Create"} Day Parting Schedule
              <ChevronDown className={cn("h-4 w-4 transition-transform", scheduleOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="rounded-lg border border-border p-4 space-y-4">
              <h3 className="text-sm font-semibold">New Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Schedule Name</label>
                  <input className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g., Pause overnight" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Action</label>
                  <Select defaultValue="pause">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pause">Pause Campaign</SelectItem>
                      <SelectItem value="reduce_budget">Reduce Budget</SelectItem>
                      <SelectItem value="increase_budget">Increase Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Select hours on the heatmap above to define the schedule window.</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { toast.success("Schedule created"); setScheduleOpen(false); }}>Save Schedule</Button>
                <Button size="sm" variant="ghost" onClick={() => setScheduleOpen(false)}>Cancel</Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Campaigns Table */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Campaigns</h2>
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search campaigns..."
            onDownload={() => toast.success("Exporting campaigns...")}
          />
          <div className="mt-3 rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="min-w-[300px]">Campaign</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-center">Schedules</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("capitalize", campaign.status === "enabled" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.budget)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.spend)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(campaign.roas >= 3 ? "text-success" : "text-foreground")}>{campaign.roas.toFixed(2)}x</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {campaign.hasSchedule ? (
                        <Badge variant="secondary" className="gap-1"><Calendar className="h-3 w-3" />{campaign.scheduleCount}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/dayparting/campaigns/${campaign.id}`)} title="View Details"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View Hourly Data"><BarChart3 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
