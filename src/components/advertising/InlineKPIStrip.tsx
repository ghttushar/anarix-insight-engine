import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIItem {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage" | "decimal";
  accentColor?: string;
}

interface InlineKPIStripProps {
  items: KPIItem[];
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
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

export function InlineKPIStrip({ items }: InlineKPIStripProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-card p-1">
      {items.map((item, index) => {
        const delta = calculateDelta(item.value, item.previousValue);
        const isPositive = delta > 0;
        const isNeutral = delta === 0;
        const colorClass = accentColors[item.accentColor || "primary"] || "border-l-primary";

        return (
          <div
            key={item.label}
            className={cn(
              "flex flex-1 flex-col gap-1 border-l-4 bg-background/50 px-4 py-3 first:rounded-l-md last:rounded-r-md",
              colorClass
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {item.label}
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl font-semibold text-foreground">
                {formatValue(item.value, item.format)}
              </span>
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  isNeutral
                    ? "bg-muted text-muted-foreground"
                    : isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {isNeutral ? (
                  <Minus className="h-3 w-3" />
                ) : isPositive ? (
                  <ArrowUp className="h-3 w-3" />
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
