import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
  BarChart3, Eye, ChevronRight, ArrowUpRight, ArrowDownRight,
  Minus, Target, Percent, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary, TrendDataPoint } from "@/types/profitability";
import { MorphingNumber } from "@/features/creative/MorphingNumber";

interface ProfitabilityHeroCardProps {
  summaries: ProfitabilitySummary[];
  trendDataByPeriod: Record<string, TrendDataPoint[]>;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onViewBreakdown?: (summary: ProfitabilitySummary) => void;
}

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
];

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

function getDelta(current: number, previous: number): { value: number; trend: "up" | "down" | "neutral" } {
  if (previous === 0) return { value: 0, trend: "neutral" };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(pct) < 0.1) return { value: 0, trend: "neutral" };
  return { value: pct, trend: pct > 0 ? "up" : "down" };
}

function DeltaIndicator({ value, trend, className }: { value: number; trend: string; className?: string }) {
  if (trend === "neutral") return <span className={cn("text-xs text-muted-foreground flex items-center gap-0.5", className)}><Minus className="h-3 w-3" /> 0%</span>;
  return (
    <span className={cn("text-xs font-medium flex items-center gap-0.5", trend === "up" ? "text-success" : "text-destructive", className)}>
      {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {trend === "up" ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

function MiniSparkline({ data, dataKey, color }: { data: TrendDataPoint[]; dataKey: string; color: string }) {
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitabilityHeroCard({
  summaries, trendDataByPeriod, selectedPeriod, onPeriodChange, onViewBreakdown,
}: ProfitabilityHeroCardProps) {
  const [activeView, setActiveView] = useState<"overview" | "breakdown" | "efficiency">("overview");

  const current = summaries.find((s) => s.period === selectedPeriod) || summaries[0];
  const previousIdx = PERIODS.findIndex((p) => p.key === selectedPeriod);
  const previous = previousIdx < summaries.length - 1 ? summaries[previousIdx + 1] : summaries[summaries.length - 1];
  const trendData = trendDataByPeriod[selectedPeriod] || trendDataByPeriod.this_month;

  const profitMargin = current.gmv > 0 ? (current.netProfit / current.gmv) * 100 : 0;
  const prevMargin = previous.gmv > 0 ? (previous.netProfit / previous.gmv) * 100 : 0;

  const salesBreakdown = useMemo(() => [
    { name: "Organic", value: current.breakdown.organic },
    { name: "SP", value: current.breakdown.sponsoredProducts },
    { name: "SB", value: current.breakdown.sponsoredBrands },
    { name: "SV", value: current.breakdown.sponsoredVideo },
  ], [current]);

  const totalAdSales = current.breakdown.sponsoredProducts + current.breakdown.sponsoredBrands + current.breakdown.sponsoredVideo;
  const organicRatio = current.gmv > 0 ? (current.breakdown.organic / current.gmv) * 100 : 0;

  const primaryKPIs = [
    { label: "GMV", value: current.gmv, prev: previous.gmv, icon: DollarSign, format: "currency" as const },
    { label: "Auth Sales", value: current.authSales, prev: previous.authSales, icon: BarChart3, format: "currency" as const },
    { label: "Net Profit", value: current.netProfit, prev: previous.netProfit, icon: TrendingUp, format: "currency" as const, highlight: true },
    { label: "Orders", value: current.orders, prev: previous.orders, icon: ShoppingCart, format: "number" as const },
    { label: "Units", value: current.units, prev: previous.units, icon: Package, format: "number" as const },
    { label: "Est. Payout", value: current.estPayout, prev: previous.estPayout, icon: DollarSign, format: "currency" as const },
  ];

  const views = [
    { key: "overview", label: "Overview" },
    { key: "breakdown", label: "Sales Mix" },
    { key: "efficiency", label: "Efficiency" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header: Period selector + View tabs */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => onPeriodChange(p.key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                selectedPeriod === p.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{current.dateRange}</span>
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setActiveView(v.key as typeof activeView)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded transition-all",
                  activeView === v.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onViewBreakdown?.(current)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Full Details <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {activeView === "overview" && (
          <div className="grid grid-cols-12 gap-4">
            {/* Left: Hero metric + KPI grid */}
            <div className="col-span-8 space-y-4">
              {/* Hero: Net Profit large */}
              <div className="flex items-end gap-6">
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Net Profit</div>
                  <div className="flex items-baseline gap-3">
                    <MorphingNumber value={current.netProfit} format="currency" className="text-3xl font-semibold text-foreground" />
                    <DeltaIndicator {...getDelta(current.netProfit, previous.netProfit)} className="text-sm" />
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Margin: <span className={cn("font-medium", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>{profitMargin.toFixed(1)}%</span>
                    </span>
                    <DeltaIndicator {...getDelta(profitMargin, prevMargin)} />
                  </div>
                </div>
                <MiniSparkline data={trendData} dataKey="orders" color="hsl(var(--primary))" />
              </div>

              {/* KPI Grid: 6 metrics in 2 rows */}
              <div className="grid grid-cols-3 gap-3">
                {primaryKPIs.map((kpi) => {
                  const delta = getDelta(kpi.value, kpi.prev);
                  return (
                    <div
                      key={kpi.label}
                      className={cn(
                        "rounded-md border border-border/50 px-3 py-2.5 transition-colors hover:border-border",
                        kpi.highlight && "bg-primary/5 border-primary/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{kpi.label}</span>
                        <kpi.icon className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <MorphingNumber
                          value={kpi.value}
                          format={kpi.format}
                          decimals={kpi.format === "number" ? 0 : 2}
                          className="text-sm font-semibold text-foreground"
                        />
                        <DeltaIndicator value={delta.value} trend={delta.trend} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Mini trend chart */}
            <div className="col-span-4">
              <div className="text-xs text-muted-foreground font-medium mb-2">Trend</div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="units" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Orders
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--chart-2))" }} /> Units
                </span>
              </div>
            </div>
          </div>
        )}

        {activeView === "breakdown" && (
          <div className="grid grid-cols-12 gap-4">
            {/* Donut chart */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground font-medium mb-2">Sales Channel Mix</div>
              <div className="h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {salesBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`$${val.toLocaleString()}`, ""]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <div className="text-lg font-semibold text-foreground">{organicRatio.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Organic</div>
              </div>
            </div>

            {/* Channel details */}
            <div className="col-span-8 space-y-2">
              <div className="text-xs text-muted-foreground font-medium mb-2">Channel Breakdown</div>
              {salesBreakdown.map((channel, i) => {
                const pct = current.gmv > 0 ? (channel.value / current.gmv) * 100 : 0;
                return (
                  <div key={channel.name} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs text-foreground w-20">{channel.name}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PIE_COLORS[i] }} />
                    </div>
                    <span className="text-xs font-medium text-foreground w-20 text-right">${channel.value.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground w-12 text-right">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}

              <div className="border-t border-border pt-3 mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-md border border-border/50 px-3 py-2">
                  <div className="text-xs text-muted-foreground">Total Ad Sales</div>
                  <div className="text-sm font-semibold text-foreground">${totalAdSales.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-3 py-2">
                  <div className="text-xs text-muted-foreground">Ad Cost</div>
                  <div className="text-sm font-semibold text-foreground">${current.adCost.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-3 py-2">
                  <div className="text-xs text-muted-foreground">COGS</div>
                  <div className="text-sm font-semibold text-foreground">${current.breakdown.cogs.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "efficiency" && (
          <div className="grid grid-cols-4 gap-4">
            {/* ROAS */}
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Target className="h-5 w-5 text-primary mb-2" />
              <div className="text-xs text-muted-foreground mb-1">ROAS</div>
              <div className="text-2xl font-semibold text-foreground">{current.breakdown.roas.toFixed(1)}x</div>
              <DeltaIndicator {...getDelta(current.breakdown.roas, previous.breakdown.roas)} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-2">Return on Ad Spend</div>
            </div>

            {/* TACoS */}
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Percent className="h-5 w-5 text-chart-2 mb-2" />
              <div className="text-xs text-muted-foreground mb-1">TACoS</div>
              <div className={cn("text-2xl font-semibold", current.breakdown.tacos < 10 ? "text-success" : "text-destructive")}>{current.breakdown.tacos.toFixed(1)}%</div>
              <DeltaIndicator {...getDelta(current.breakdown.tacos, previous.breakdown.tacos)} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-2">Total Ad Cost of Sale</div>
            </div>

            {/* Profit Margin */}
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Layers className="h-5 w-5 text-chart-3 mb-2" />
              <div className="text-xs text-muted-foreground mb-1">Profit Margin</div>
              <div className={cn("text-2xl font-semibold", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
                {profitMargin.toFixed(1)}%
              </div>
              <DeltaIndicator {...getDelta(profitMargin, prevMargin)} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-2">Net Profit / GMV</div>
            </div>

            {/* Return & Cancel Rate */}
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Eye className="h-5 w-5 text-chart-4 mb-2" />
              <div className="text-xs text-muted-foreground mb-1">Return Rate</div>
              <div className={cn(
                "text-2xl font-semibold",
                current.orders > 0 && (current.returns / current.orders) * 100 > 5 ? "text-destructive" : "text-success"
              )}>
                {current.orders > 0 ? ((current.returns / current.orders) * 100).toFixed(1) : "0.0"}%
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                {current.returns} returns · {current.cancelled} cancelled
              </div>
              <div className="text-xs text-muted-foreground">out of {current.orders} orders</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
