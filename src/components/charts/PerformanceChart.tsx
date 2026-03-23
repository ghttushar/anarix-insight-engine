import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartDataPoint, MetricKey } from "@/types/campaign";
import { METRIC_CONFIGS, MAX_VISIBLE_METRICS, DEFAULT_SELECTED_METRICS } from "@/lib/constants/chartColors";
import { ChartContainer, ChartType, ChartMetric } from "./ChartContainer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  title?: string;
  showImpact?: boolean;
  onShowImpactChange?: (value: boolean) => void;
}

const IMPACT_MULTIPLIERS: Record<string, number> = {
  spend: 0.85,
  sales: 1.12,
  impressions: 0.92,
  clicks: 1.08,
  roas: 1.15,
  acos: 0.88,
  cpc: 0.95,
  orders: 1.05,
  ctr: 1.03,
};

function formatTooltipValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "number":
      return value.toLocaleString("en-US");
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    default:
      return String(value);
  }
}

export function PerformanceChart({ data, title = "Performance Overview", showImpact = false, onShowImpactChange }: PerformanceChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(DEFAULT_SELECTED_METRICS);
  const [chartType, setChartType] = useState<ChartType>("line");

  const chartData = showImpact
    ? data.map((point) => {
        const impactPoint: Record<string, any> = { ...point };
        selectedMetrics.forEach((key) => {
          const val = point[key as keyof typeof point];
          if (typeof val === "number") {
            impactPoint[`${key}_impact`] = +(val * (IMPACT_MULTIPLIERS[key] || 1)).toFixed(2);
          }
        });
        return impactPoint;
      })
    : data;

  const handleMetricToggle = (metricKey: string) => {
    setSelectedMetrics((prev) => {
      const key = metricKey as MetricKey;
      if (prev.includes(key)) return prev.filter((m) => m !== key);
      if (prev.length >= MAX_VISIBLE_METRICS) return [...prev.slice(1), key];
      return [...prev, key];
    });
  };

  const metrics: ChartMetric[] = METRIC_CONFIGS.map((m) => ({
    key: m.key,
    label: m.label,
    color: m.color,
    active: selectedMetrics.includes(m.key),
  }));

  const selectedConfigs = METRIC_CONFIGS.filter((m) => selectedMetrics.includes(m.key));
  const hasLeftAxis = selectedConfigs.some((m) => m.yAxisId === "left");
  const hasRightAxis = selectedConfigs.some((m) => m.yAxisId === "right");

  const tooltipConfig = {
    contentStyle: {
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
    },
    labelStyle: { color: "hsl(var(--foreground))" },
    formatter: (value: number, name: string) => {
      const config = METRIC_CONFIGS.find((m) => m.key === name);
      return [formatTooltipValue(value, config?.format || "number"), config?.label || name];
    },
  };

  const impactControl = onShowImpactChange ? (
    <div className="flex items-center gap-2">
      <Switch
        id="show-impact-chart"
        checked={showImpact}
        onCheckedChange={onShowImpactChange}
        className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"
      />
      <Label htmlFor="show-impact-chart" className="text-[11px] font-medium text-muted-foreground cursor-pointer whitespace-nowrap">
        Show Impact
      </Label>
    </div>
  ) : undefined;

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "bar" ? (
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Bar key={config.key} dataKey={config.key} name={config.key} fill={config.color} radius={[3, 3, 0, 0]} />
          ))}
          {showImpact && selectedConfigs.map((config) => (
            <Bar key={`${config.key}_impact`} dataKey={`${config.key}_impact`} name={`${config.label} (Impact)`} fill={config.color} fillOpacity={0.4} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          {hasLeftAxis && <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-muted-foreground" />}
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Area key={config.key} type="monotone" dataKey={config.key} name={config.key} stroke={config.color} fill={config.color} fillOpacity={0.15} yAxisId={config.yAxisId || "left"} strokeWidth={2} />
          ))}
          {showImpact && selectedConfigs.map((config) => (
            <Area key={`${config.key}_impact`} type="monotone" dataKey={`${config.key}_impact`} name={`${config.label} (Impact)`} stroke={config.color} fill={config.color} fillOpacity={0.05} yAxisId={config.yAxisId || "left"} strokeWidth={1.5} strokeDasharray="5 3" />
          ))}
        </AreaChart>
      ) : (
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          {hasLeftAxis && <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-muted-foreground" />}
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Line key={config.key} type="monotone" dataKey={config.key} name={config.key} stroke={config.color} yAxisId={config.yAxisId || "left"} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          ))}
          {showImpact && selectedConfigs.map((config) => (
            <Line key={`${config.key}_impact`} type="monotone" dataKey={`${config.key}_impact`} name={`${config.label} (Impact)`} stroke={config.color} yAxisId={config.yAxisId || "left"} strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={title}
      metrics={metrics}
      onMetricToggle={handleMetricToggle}
      chartType={chartType}
      onChartTypeChange={setChartType}
      extraControls={impactControl}
      expandedChildren={renderChart(500)}
    >
      {renderChart(300)}
    </ChartContainer>
  );
}
