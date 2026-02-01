import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Play, Download, Clock } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns } from "@/data/mockDayParting";
import { MetricType } from "@/types/dayparting";
import { useNavigate } from "react-router-dom";

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export default function HourlyData() {
  const navigate = useNavigate();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [dateRange, setDateRange] = useState("7days");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [metric, setMetric] = useState<MetricType>("roas");

  const summary = calculateHourlySummary(hourlyData);

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Hourly Data</h1>
            <p className="text-sm text-muted-foreground">Analyze performance by hour to optimize day parting</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate("/dayparting/scheduled/new")}>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Day Parting
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] max-w-sm">
              <Label className="text-xs text-muted-foreground mb-1 block">Campaign</Label>
              <Select
                value={selectedCampaigns[0]}
                onValueChange={(v) => setSelectedCampaigns([v])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {dayPartingCampaigns.map((camp) => (
                    <SelectItem key={camp.id} value={camp.id}>
                      {camp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="14days">Last 14 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[120px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Metric</Label>
              <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
            <div className="flex items-end">
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Run
              </Button>
            </div>
          </div>

          {/* Day selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Days:</span>
            <div className="flex items-center gap-3">
              {DAYS.map((day) => (
                <div key={day.value} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  />
                  <Label htmlFor={`day-${day.value}`} className="text-sm cursor-pointer">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{formatCurrency(summary.totalSpend)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{formatCurrency(summary.totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">ROAS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-success">{summary.avgRoas.toFixed(2)}x</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">ACOS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.avgAcos.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Units</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.totalUnits}</p>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Performance by Hour</h2>
          <HourlyHeatmap data={hourlyData} metric={metric} />
        </div>
      </div>
    </AppLayout>
  );
}
