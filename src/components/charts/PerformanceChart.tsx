import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartDataPoint, MetricKey } from "@/types/campaign";
import { METRIC_CONFIGS, MAX_VISIBLE_METRICS, DEFAULT_SELECTED_METRICS } from "@/lib/constants/chartColors";
import { ChartContainer, ChartType, ChartMetric } from "./ChartContainer";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  title?: string;
}

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

export function PerformanceChart({ data, title = "Performance Overview" }: PerformanceChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(DEFAULT_SELECTED_METRICS);
  const [chartType, setChartType] = useState<ChartType>("line");

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

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "bar" ? (
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Bar key={config.key} dataKey={config.key} name={config.key} fill={config.color} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          {hasLeftAxis && <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-muted-foreground" />}
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Area key={config.key} type="monotone" dataKey={config.key} name={config.key} stroke={config.color} fill={config.color} fillOpacity={0.15} yAxisId={config.yAxisId || "left"} strokeWidth={2} />
          ))}
        </AreaChart>
      ) : (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
          {hasLeftAxis && <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />}
          {hasRightAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-muted-foreground" />}
          <Tooltip {...tooltipConfig} />
          <Legend />
          {selectedConfigs.map((config) => (
            <Line key={config.key} type="monotone" dataKey={config.key} name={config.key} stroke={config.color} yAxisId={config.yAxisId || "left"} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
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
      expandedChildren={renderChart(500)}
    >
      {renderChart(300)}
    </ChartContainer>
  );
}
