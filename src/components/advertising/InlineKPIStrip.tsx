import { useState } from "react";
import { ArrowDown, ArrowUp, Minus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KPIItem {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage" | "decimal";
  accentColor?: string;
}

interface AvailableMetric {
  key: string;
  label: string;
  format: "currency" | "number" | "percentage" | "decimal";
}

interface InlineKPIStripProps {
  items: KPIItem[];
  availableMetrics?: AvailableMetric[];
  onMetricChange?: (index: number, metricKey: string) => void;
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case "percentage":
      return `${value.toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    case "number":
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
}

function calculateDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

const accentColors: Record<string, string> = {
  primary: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  destructive: "border-l-destructive",
  accent: "border-l-accent",
};

export function InlineKPIStrip({ items, availableMetrics, onMetricChange }: InlineKPIStripProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-card p-1">
      {items.map((item, index) => {
        const delta = calculateDelta(item.value, item.previousValue);
        const isPositive = delta > 0;
        const isNeutral = delta === 0;
        const colorClass = accentColors[item.accentColor || "primary"] || "border-l-primary";

        return (
          <div
            key={`${item.label}-${index}`}
            className={cn(
              "flex flex-1 flex-col gap-1 border-l-4 bg-background/50 px-4 py-3 first:rounded-l-md last:rounded-r-md",
              colorClass
            )}
          >
            <div className="flex items-center justify-between">
              {availableMetrics && onMetricChange ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[240px] overflow-auto">
                    {availableMetrics.map((metric) => (
                      <DropdownMenuItem
                        key={metric.key}
                        onClick={() => onMetricChange(index, metric.key)}
                        className="text-xs cursor-pointer"
                      >
                        {metric.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl font-semibold text-foreground">
                {formatValue(item.value, item.format)}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  isNeutral
                    ? "bg-muted text-muted-foreground"
                    : isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {isNeutral ? (
                  <Minus className="h-3.5 w-3.5" />
                ) : isPositive ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{Math.abs(delta).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
