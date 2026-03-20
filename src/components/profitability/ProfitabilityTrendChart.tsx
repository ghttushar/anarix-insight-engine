import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartType, ChartMetric } from "@/components/charts/ChartContainer";
import { TrendDataPoint } from "@/types/profitability";
import { cn } from "@/lib/utils";

interface ProfitabilityTrendChartProps {
  data: TrendDataPoint[];
  periodLabel?: string;
}

const METRICS: { key: string; label: string; color: string }[] = [
  { key: "orders", label: "Orders", color: "hsl(var(--primary))" },
  { key: "units", label: "Units", color: "hsl(var(--chart-2))" },
];

export function ProfitabilityTrendChart({ data, periodLabel }: ProfitabilityTrendChartProps) {
  const [frequency, setFrequency] = useState<"weekly" | "daily" | "monthly">("weekly");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["orders", "units"]);

  const metrics: ChartMetric[] = METRICS.map((m) => ({
    ...m,
    active: activeMetrics.includes(m.key),
  }));

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const frequencyDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setFrequency("daily")}>Daily</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFrequency("weekly")}>Weekly</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFrequency("monthly")}>Monthly</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "bar" ? (
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          {activeMetrics.includes("orders") && <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />}
          {activeMetrics.includes("units") && <Bar dataKey="units" fill="hsl(var(--chart-2))" radius={[3, 3, 0, 0]} />}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          {activeMetrics.includes("orders") && <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />}
          {activeMetrics.includes("units") && <Area type="monotone" dataKey="units" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} strokeWidth={2} />}
        </AreaChart>
      ) : (
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
          {activeMetrics.includes("orders") && <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />}
          {activeMetrics.includes("units") && <Line type="monotone" dataKey="units" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={periodLabel || ""}
      subtitle={undefined}
      metrics={metrics}
      onMetricToggle={toggleMetric}
      chartType={chartType}
      onChartTypeChange={setChartType}
      extraControls={frequencyDropdown}
      expandedChildren={renderChart(500)}
      className="h-full"
    >
      {renderChart(200)}
    </ChartContainer>
  );
}
