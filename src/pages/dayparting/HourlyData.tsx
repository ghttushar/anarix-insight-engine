import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Play, Download, Clock } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns } from "@/data/mockDayParting";
import { MetricType } from "@/types/dayparting";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HourlyData() {
  const navigate = useNavigate();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [metric, setMetric] = useState<MetricType>("roas");

  const summary = calculateHourlySummary(hourlyData);
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const handleExport = () => { toast.success("Exporting hourly data..."); };
  const handleRun = () => { toast.info("Refreshing hourly data..."); };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Hourly Data"
          subtitle="Analyze performance by hour to optimize day parting"
          actions={
            <>
              <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button>
              <Button onClick={() => navigate("/dayparting/scheduled/new")}><Clock className="mr-2 h-4 w-4" />Schedule Day Parting</Button>
            </>
          }
        />

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] max-w-sm">
              <Label className="text-xs text-muted-foreground mb-1 block">Campaign</Label>
              <Select value={selectedCampaigns[0]} onValueChange={(v) => setSelectedCampaigns([v])}>
                <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                <SelectContent>{dayPartingCampaigns.map((camp) => (<SelectItem key={camp.id} value={camp.id}>{camp.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="w-[120px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Metric</Label>
              <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Button onClick={handleRun}><Play className="mr-2 h-4 w-4" />Run</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        <div>
          <h2 className="text-lg font-semibold mb-4">Performance by Hour</h2>
          <HourlyHeatmap data={hourlyData} metric={metric} />
        </div>
      </div>
    </AppLayout>
  );
}
