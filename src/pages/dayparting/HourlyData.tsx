import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { AppLevelSelector } from "@/components/layout/AppLevelSelector";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { CreateSchedulePanel } from "@/components/panels/CreateSchedulePanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns } from "@/data/mockDayParting";
import { MetricType } from "@/types/dayparting";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useFilter } from "@/contexts/FilterContext";

export default function HourlyData() {
  const navigate = useNavigate();
  const { adType, setAdType } = useFilter();
  const { setDataPanel } = useActivePanel();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [metric, setMetric] = useState<MetricType>("roas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);

  const summary = calculateHourlySummary(hourlyData);
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const filteredCampaigns = dayPartingCampaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6 overflow-auto">
          <PageHeader
            title="Day Parting"
            subtitle="Analyze hourly performance and manage campaign schedules"
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

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Hourly Trends</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { label: "Spend", value: formatCurrency(summary.totalSpend) },
                { label: "Revenue", value: formatCurrency(summary.totalRevenue) },
                { label: "ROAS", value: `${summary.avgRoas.toFixed(2)}x` },
                { label: "ACOS", value: `${summary.avgAcos.toFixed(1)}%` },
                { label: "Orders", value: summary.totalOrders.toString() },
                { label: "Units", value: summary.totalUnits.toString() },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-border bg-card px-3 py-2">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{item.label}</p>
                  <p className="text-lg font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="overflow-auto">
              <HourlyHeatmap data={hourlyData} metric={metric} />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Day Parting Campaigns</h2>
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
                      <TableCell className="font-medium text-primary hover:underline">{campaign.name}</TableCell>
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
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); navigate(`/dayparting/campaigns/${campaign.id}`); }}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <CreateSchedulePanel />
      </div>
    </AppLayout>
  );
}
