import { cn } from "@/lib/utils";
import { HourlyDataPoint, MetricType } from "@/types/dayparting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HourlyHeatmapProps {
  data: HourlyDataPoint[];
  metric: MetricType;
  onCellClick?: (hour: number, dayOfWeek: number) => void;
  selectedCells?: Set<string>;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatValue = (value: number, metric: MetricType): string => {
  switch (metric) {
    case "spend":
    case "revenue":
      return `$${value.toFixed(0)}`;
    case "roas":
      return `${value.toFixed(2)}x`;
    case "acos":
    case "ctr":
    case "cvr":
      return `${value.toFixed(1)}%`;
    case "orders":
    case "units":
    case "impressions":
    case "clicks":
      return value.toFixed(0);
    default:
      return value.toFixed(2);
  }
};

const getMetricValue = (point: HourlyDataPoint, metric: MetricType): number => {
  return point[metric] as number;
};

export function HourlyHeatmap({ data, metric, onCellClick, selectedCells }: HourlyHeatmapProps) {
  // Create a grid structure from data
  const grid: Record<string, HourlyDataPoint> = {};
  data.forEach((point) => {
    const key = `${point.dayOfWeek}-${point.hour}`;
    if (!grid[key]) {
      grid[key] = point;
    } else {
      // Average if multiple data points
      const existing = grid[key];
      grid[key] = {
        ...existing,
        spend: (existing.spend + point.spend) / 2,
        revenue: (existing.revenue + point.revenue) / 2,
        orders: Math.round((existing.orders + point.orders) / 2),
        units: Math.round((existing.units + point.units) / 2),
        roas: (existing.roas + point.roas) / 2,
        acos: (existing.acos + point.acos) / 2,
        ctr: (existing.ctr + point.ctr) / 2,
        cvr: (existing.cvr + point.cvr) / 2,
      };
    }
  });

  // Calculate min/max for color scaling
  const values = Object.values(grid).map((p) => getMetricValue(p, metric));
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const getIntensity = (value: number): number => {
    return (value - minValue) / range;
  };

  const getColor = (intensity: number, isGoodHigher: boolean): string => {
    const effectiveIntensity = isGoodHigher ? intensity : 1 - intensity;
    
    if (effectiveIntensity < 0.2) return "bg-primary/5";
    if (effectiveIntensity < 0.4) return "bg-primary/15";
    if (effectiveIntensity < 0.6) return "bg-primary/30";
    if (effectiveIntensity < 0.8) return "bg-primary/50";
    return "bg-primary/70";
  };

  const isHigherBetter = ["revenue", "roas", "orders", "units", "clicks", "ctr", "cvr"].includes(metric);

  return (
    <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header row with hours */}
        <div className="grid grid-cols-[60px_repeat(24,1fr)] gap-1 mb-1">
          <div className="text-xs font-medium text-muted-foreground"></div>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="text-xs font-medium text-muted-foreground text-center py-1"
            >
              {hour.toString().padStart(2, "0")}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="grid grid-cols-[60px_repeat(24,1fr)] gap-1 mb-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              {day}
            </div>
            {HOURS.map((hour) => {
              const key = `${dayIndex}-${hour}`;
              const point = grid[key];
              const value = point ? getMetricValue(point, metric) : 0;
              const intensity = point ? getIntensity(value) : 0;
              const isSelected = selectedCells?.has(key);

              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "h-8 rounded transition-all duration-150",
                        point ? getColor(intensity, isHigherBetter) : "bg-muted/30",
                        isSelected && "ring-2 ring-primary ring-offset-1",
                        onCellClick && "cursor-pointer hover:opacity-80"
                      )}
                      onClick={() => onCellClick?.(hour, dayIndex)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div className="font-medium">{day} {hour.toString().padStart(2, "0")}:00</div>
                    {point ? (
                      <div className="text-muted-foreground">
                        {metric}: {formatValue(value, metric)}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No data</div>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isHigherBetter ? "Low" : "High"}
          </span>
          <div className="flex rounded overflow-hidden">
            <div className="h-4 w-8 bg-primary/5" />
            <div className="h-4 w-8 bg-primary/15" />
            <div className="h-4 w-8 bg-primary/30" />
            <div className="h-4 w-8 bg-primary/50" />
            <div className="h-4 w-8 bg-primary/70" />
          </div>
          <span className="text-xs text-muted-foreground">
            {isHigherBetter ? "High" : "Low"}
          </span>
        </div>
      </div>
    </div>
  );
}
