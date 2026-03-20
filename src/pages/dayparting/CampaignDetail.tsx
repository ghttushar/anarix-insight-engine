import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { dayPartingCampaigns, schedules, calculateHourlySummary } from "@/data/mockDayParting";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartType, ChartMetric } from "@/components/charts/ChartContainer";

function HourlyPerformanceChart({ data }: { data: { hour: string; roas: number; spend: number }[] }) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["roas", "spend"]);

  const metrics: ChartMetric[] = [
    { key: "roas", label: "ROAS", color: "hsl(var(--primary))", active: activeMetrics.includes("roas") },
    { key: "spend", label: "Spend", color: "hsl(var(--muted-foreground))", active: activeMetrics.includes("spend") },
  ];

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const tooltipStyle = {
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
  };

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "bar" ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={2} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={tooltipStyle} />
          {activeMetrics.includes("roas") && <Bar dataKey="roas" fill="hsl(var(--primary))" name="ROAS" radius={[3, 3, 0, 0]} />}
          {activeMetrics.includes("spend") && <Bar dataKey="spend" fill="hsl(var(--muted-foreground))" fillOpacity={0.4} name="Spend" radius={[3, 3, 0, 0]} />}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={2} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v.toFixed(1)}x`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
          <Tooltip contentStyle={tooltipStyle} />
          {activeMetrics.includes("roas") && <Area yAxisId="left" type="monotone" dataKey="roas" name="ROAS" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />}
          {activeMetrics.includes("spend") && <Area yAxisId="right" type="monotone" dataKey="spend" name="Spend" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} strokeWidth={1} />}
        </AreaChart>
      ) : (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={2} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v.toFixed(1)}x`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
          <Tooltip contentStyle={tooltipStyle} />
          {activeMetrics.includes("roas") && <Line yAxisId="left" type="monotone" dataKey="roas" name="ROAS" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />}
          {activeMetrics.includes("spend") && <Line yAxisId="right" type="monotone" dataKey="spend" name="Spend" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" dot={false} />}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title="Hourly Performance"
      metrics={metrics}
      onMetricToggle={toggleMetric}
      chartType={chartType}
      onChartTypeChange={setChartType}
      expandedChildren={renderChart(450)}
    >
      {renderChart(250)}
    </ChartContainer>
  );
}

export default function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const campaign = dayPartingCampaigns.find((c) => c.id === campaignId);
  const campaignSchedules = schedules.filter((s) => s.campaignIds.includes(campaignId || ""));

  if (!campaign) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Campaign not found</p>
          <Button variant="link" onClick={() => navigate("/dayparting/campaigns")}>
            Back to campaigns
          </Button>
        </div>
      </AppLayout>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const hourlyAggregated = Array.from({ length: 24 }, (_, hour) => {
    const hourData = campaign.hourlyData.filter((d) => d.hour === hour);
    const avgRoas = hourData.reduce((sum, d) => sum + d.roas, 0) / hourData.length;
    const avgSpend = hourData.reduce((sum, d) => sum + d.spend, 0) / hourData.length;
    return { hour: `${hour.toString().padStart(2, "0")}:00`, roas: avgRoas, spend: avgSpend };
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} title="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-semibold text-foreground">{campaign.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline" className={cn("capitalize", campaign.status === "enabled" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>
                {campaign.status}
              </Badge>
              {campaign.hasSchedule && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {campaign.scheduleCount} active schedule(s)
                </span>
              )}
            </div>
          </div>
          <Button onClick={() => navigate("/dayparting/scheduled/new")}>
            <Clock className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Budget</CardTitle></CardHeader><CardContent><p className="text-xl font-semibold">{formatCurrency(campaign.budget)}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Spend</CardTitle></CardHeader><CardContent><p className="text-xl font-semibold">{formatCurrency(campaign.spend)}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Revenue</CardTitle></CardHeader><CardContent><p className="text-xl font-semibold">{formatCurrency(campaign.revenue)}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">ROAS</CardTitle></CardHeader><CardContent><p className={cn("text-xl font-semibold", campaign.roas >= 3 ? "text-success" : "text-foreground")}>{campaign.roas.toFixed(2)}x</p></CardContent></Card>
        </div>

        {/* Hourly Performance Chart */}
        <HourlyPerformanceChart data={hourlyAggregated} />

        {/* Heatmap */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Performance Heatmap</h2>
          <HourlyHeatmap data={campaign.hourlyData} metric="roas" />
        </div>

        {/* Active Schedules */}
        {campaignSchedules.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Active Schedules</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaignSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/dayparting/scheduled/${schedule.id}/edit`)}>
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-sm text-muted-foreground">{schedule.actionType.replace("_", " ")} • {schedule.hours.length} hours • {schedule.repeatType}</p>
                    </div>
                    <Badge variant="outline" className={cn(schedule.status === "active" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>{schedule.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
