import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Play, Download, Clock, Calendar, Eye, BarChart3, Plus, X } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns } from "@/data/mockDayParting";
import { MetricType } from "@/types/dayparting";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const topTabs = [
  { value: "hourly", label: "Hourly Trends" },
  { value: "campaigns", label: "Day Parting Campaigns" },
];

const DAYS_OF_WEEK = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export default function HourlyData() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("hourly");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [metric, setMetric] = useState<MetricType>("roas");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Schedule form state
  const [ruleName, setRuleName] = useState("");
  const [schedStartDate, setSchedStartDate] = useState("");
  const [schedEndDate, setSchedEndDate] = useState("");
  const [noEndDate, setNoEndDate] = useState(false);
  const [recurrence, setRecurrence] = useState<"daily" | "weekly">("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [bidAction, setBidAction] = useState("decrease");
  const [bidPercent, setBidPercent] = useState("30");
  const [hourMode, setHourMode] = useState<"all" | "range">("all");
  const [timeRanges, setTimeRanges] = useState([{ start: "00", end: "06" }]);
  const [selectedScheduleCampaigns, setSelectedScheduleCampaigns] = useState<string[]>(["camp-1", "camp-2"]);

  const summary = calculateHourlySummary(hourlyData);
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const filteredCampaigns = dayPartingCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => { toast.success("Exporting hourly data..."); };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const addTimeRange = () => {
    setTimeRanges((prev) => [...prev, { start: "00", end: "06" }]);
  };

  const removeTimeRange = (idx: number) => {
    setTimeRanges((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleApplyRule = () => {
    if (!ruleName.trim()) { toast.error("Please enter a rule name"); return; }
    toast.success(`Day parting rule "${ruleName}" applied`);
    setScheduleOpen(false);
    setRuleName("");
  };

  const removeScheduleCampaign = (id: string) => {
    setSelectedScheduleCampaigns((prev) => prev.filter((c) => c !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Day Parting"
          subtitle="Analyze hourly performance and manage campaign schedules"
          hideTaskbar
        />

        <AppTaskbar showAdType={false} showFrequency={false} showDateRange={false} />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" onClick={() => setScheduleOpen(!scheduleOpen)}>
            <Plus className="mr-2 h-4 w-4" />{scheduleOpen ? "Cancel" : "Create Day Parting Rule"}
          </Button>
        </div>

        {/* Inline Schedule Creation — Full Settings */}
        {scheduleOpen && (
          <div className="rounded-lg border border-border p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Create Day Parting Rule</h3>

            {/* Selected Campaigns Chips */}
            <div className="space-y-1.5">
              <Label className="text-xs">Campaigns</Label>
              <div className="flex flex-wrap gap-1.5">
                {selectedScheduleCampaigns.map((id) => {
                  const camp = dayPartingCampaigns.find((c) => c.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1 text-xs h-6">
                      {camp?.name || id}
                      <button onClick={() => removeScheduleCampaign(id)} className="rounded-full p-0.5 hover:bg-muted"><X className="h-2.5 w-2.5" /></button>
                    </Badge>
                  );
                })}
                <Select onValueChange={(v) => { if (!selectedScheduleCampaigns.includes(v)) setSelectedScheduleCampaigns((prev) => [...prev, v]); }}>
                  <SelectTrigger className="h-6 w-24 text-[10px] border-dashed"><SelectValue placeholder="+ Add" /></SelectTrigger>
                  <SelectContent>{dayPartingCampaigns.map((c) => <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Rule Name */}
            <div className="space-y-1.5">
              <Label className="text-xs">Rule Name</Label>
              <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} placeholder="e.g., Pause overnight low ROAS" className="h-8 text-sm max-w-xs" />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              <div className="space-y-1.5">
                <Label className="text-xs">Start Date</Label>
                <Input type="date" value={schedStartDate} onChange={(e) => setSchedStartDate(e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End Date</Label>
                <Input type="date" value={schedEndDate} onChange={(e) => setSchedEndDate(e.target.value)} className="h-8 text-sm" disabled={noEndDate} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                  <Checkbox checked={noEndDate} onCheckedChange={(v) => setNoEndDate(!!v)} className="h-3.5 w-3.5" />
                  No End Date
                </label>
              </div>
            </div>

            {/* Recurrence */}
            <div className="space-y-1.5">
              <Label className="text-xs">Recurrence</Label>
              <RadioGroup value={recurrence} onValueChange={(v) => setRecurrence(v as "daily" | "weekly")} className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><RadioGroupItem value="daily" className="h-3.5 w-3.5" />Daily</label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><RadioGroupItem value="weekly" className="h-3.5 w-3.5" />Weekly</label>
              </RadioGroup>
              {recurrence === "weekly" && (
                <div className="flex gap-1.5 mt-2">
                  {DAYS_OF_WEEK.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => toggleDay(d.value)}
                      className={cn(
                        "h-7 w-9 rounded text-[10px] font-medium transition-colors cursor-pointer",
                        selectedDays.includes(d.value) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >{d.label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Bid Adjustment */}
            <div className="space-y-1.5">
              <Label className="text-xs">Bid Adjustment</Label>
              <div className="flex items-center gap-2">
                <Select value={bidAction} onValueChange={setBidAction}>
                  <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase" className="text-xs">Increase by %</SelectItem>
                    <SelectItem value="decrease" className="text-xs">Decrease by %</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={bidPercent} onChange={(e) => setBidPercent(e.target.value)} className="h-8 w-20 text-sm" min="0" max="100" />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>

            {/* Hour of Day */}
            <div className="space-y-1.5">
              <Label className="text-xs">Hour of Day</Label>
              <RadioGroup value={hourMode} onValueChange={(v) => setHourMode(v as "all" | "range")} className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><RadioGroupItem value="all" className="h-3.5 w-3.5" />All Day</label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><RadioGroupItem value="range" className="h-3.5 w-3.5" />Time Range</label>
              </RadioGroup>
              {hourMode === "range" && (
                <div className="space-y-2 mt-2">
                  {timeRanges.map((range, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Select value={range.start} onValueChange={(v) => { const next = [...timeRanges]; next[idx] = { ...next[idx], start: v }; setTimeRanges(next); }}>
                        <SelectTrigger className="h-7 w-20 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={i.toString().padStart(2, "0")} className="text-xs">{i.toString().padStart(2, "0")}:00</SelectItem>)}</SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground">to</span>
                      <Select value={range.end} onValueChange={(v) => { const next = [...timeRanges]; next[idx] = { ...next[idx], end: v }; setTimeRanges(next); }}>
                        <SelectTrigger className="h-7 w-20 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={i.toString().padStart(2, "0")} className="text-xs">{i.toString().padStart(2, "0")}:00</SelectItem>)}</SelectContent>
                      </Select>
                      {timeRanges.length > 1 && (
                        <button onClick={() => removeTimeRange(idx)} className="p-0.5 hover:bg-muted rounded cursor-pointer"><X className="h-3 w-3 text-muted-foreground" /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={addTimeRange} className="text-xs text-primary hover:underline cursor-pointer">+ Add Time Range</button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setScheduleOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleApplyRule}>Apply Day Parting Rule</Button>
            </div>
          </div>
        )}

        {/* Top Tabs */}
        <UnderlineTabs tabs={topTabs} value={activeView} onChange={setActiveView} />

        {activeView === "hourly" && (
          <>
            {/* Campaign & Metric Selectors */}
            <div className="flex items-center gap-4 rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Campaign:</label>
                <Select value={selectedCampaigns[0]} onValueChange={(v) => setSelectedCampaigns([v])}>
                  <SelectTrigger className="w-56 h-7 text-xs"><SelectValue placeholder="Select campaign" /></SelectTrigger>
                  <SelectContent>{dayPartingCampaigns.map((camp) => (<SelectItem key={camp.id} value={camp.id} className="text-xs">{camp.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Metric:</label>
                <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
                  <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
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
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { label: "Spend", value: formatCurrency(summary.totalSpend) },
                { label: "Revenue", value: formatCurrency(summary.totalRevenue) },
                { label: "ROAS", value: `${summary.avgRoas.toFixed(2)}x` },
                { label: "ACOS", value: `${summary.avgAcos.toFixed(1)}%` },
                { label: "Orders", value: summary.totalOrders.toString() },
                { label: "Units", value: summary.totalUnits.toString() },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-border px-3 py-2">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{item.label}</p>
                  <p className="text-lg font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div>
              <h2 className="text-sm font-semibold mb-2">Performance by Hour</h2>
              <HourlyHeatmap data={hourlyData} metric={metric} />
            </div>
          </>
        )}

        {activeView === "campaigns" && (
          <div>
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
                    <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/dayparting/campaigns/${campaign.id}`)}>
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
                          <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/dayparting/campaigns/${campaign.id}`); }} title="View Details"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" title="View Hourly Data"><BarChart3 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
