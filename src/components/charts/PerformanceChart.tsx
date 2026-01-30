import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint, MetricKey } from "@/types/campaign";
import { METRIC_CONFIGS, MAX_VISIBLE_METRICS, DEFAULT_SELECTED_METRICS, CHART_COLORS } from "@/lib/constants/chartColors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricSelector } from "./MetricSelector";

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

  const handleMetricToggle = (metricKey: MetricKey) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metricKey)) {
        return prev.filter((m) => m !== metricKey);
      }
      if (prev.length >= MAX_VISIBLE_METRICS) {
        // Replace the oldest selected metric
        return [...prev.slice(1), metricKey];
      }
      return [...prev, metricKey];
    });
  };

  const selectedConfigs = METRIC_CONFIGS.filter((m) => selectedMetrics.includes(m.key));

  // Determine if we need dual Y-axes
  const hasLeftAxis = selectedConfigs.some((m) => m.yAxisId === "left");
  const hasRightAxis = selectedConfigs.some((m) => m.yAxisId === "right");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <MetricSelector
          selectedMetrics={selectedMetrics}
          onToggle={handleMetricToggle}
          maxMetrics={MAX_VISIBLE_METRICS}
        />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              {hasLeftAxis && (
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  className="text-muted-foreground"
                />
              )}
              {hasRightAxis && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number, name: string) => {
                  const config = METRIC_CONFIGS.find((m) => m.key === name);
                  return [formatTooltipValue(value, config?.format || "number"), config?.label || name];
                }}
              />
              <Legend />
              {selectedConfigs.map((config) => (
                <Line
                  key={config.key}
                  type="monotone"
                  dataKey={config.key}
                  name={config.key}
                  stroke={config.color}
                  yAxisId={config.yAxisId || "left"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
