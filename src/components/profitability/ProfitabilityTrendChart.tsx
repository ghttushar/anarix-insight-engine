import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChevronDown, Download, Maximize2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendDataPoint } from "@/types/profitability";
import { cn } from "@/lib/utils";

interface ProfitabilityTrendChartProps {
  data: TrendDataPoint[];
}

export function ProfitabilityTrendChart({ data }: ProfitabilityTrendChartProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [frequency, setFrequency] = useState<"weekly" | "daily" | "monthly">("weekly");
  const [showOrders, setShowOrders] = useState(true);
  const [showUnits, setShowUnits] = useState(true);

  if (!isVisible) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <span className="text-sm text-muted-foreground">Chart hidden</span>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(true)}>
          <Eye className="mr-2 h-4 w-4" />
          Show Chart
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg border border-border bg-card p-4 flex flex-col">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFrequency("daily")}>Daily</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequency("weekly")}>Weekly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFrequency("monthly")}>Monthly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide
          </Button>
        </div>
      </div>

      {/* Chart */}
 flex-1 min-h-[20<div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            {showOrders && (
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {showUnits && (
              <Line
                type="monotone"
                dataKey="units"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => setShowOrders(!showOrders)}
          className={cn(
            "flex items-center gap-2 text-sm transition-opacity",
            !showOrders && "opacity-50"
          )}
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "hsl(var(--primary))" }}
          />
          Orders
        </button>
        <button
          onClick={() => setShowUnits(!showUnits)}
          className={cn(
            "flex items-center gap-2 text-sm transition-opacity",
            !showUnits && "opacity-50"
          )}
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "hsl(var(--chart-2))" }}
          />
          Units
        </button>
      </div>
    </div>
  );
}
