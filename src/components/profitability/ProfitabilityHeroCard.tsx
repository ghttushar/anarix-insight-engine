import { useState, useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
  BarChart3, Eye, ChevronRight, ArrowUpRight, ArrowDownRight,
  Minus, Target, Percent, Layers, CalendarIcon, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary, TrendDataPoint } from "@/types/profitability";
import { MorphingNumber } from "@/features/creative/MorphingNumber";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, subDays, subMonths } from "date-fns";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProfitabilityHeroCardProps {
  summaries: ProfitabilitySummary[];
  trendDataByPeriod: Record<string, TrendDataPoint[]>;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onViewBreakdown?: (summary: ProfitabilitySummary) => void;
}

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const ACCENT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

/* ── Helpers ── */

function getDelta(current: number, previous: number): { value: number; trend: "up" | "down" | "neutral" } {
  if (previous === 0) return { value: 0, trend: "neutral" };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(pct) < 0.1) return { value: 0, trend: "neutral" };
  return { value: pct, trend: pct > 0 ? "up" : "down" };
}

function DeltaIndicator({ value, trend, className }: { value: number; trend: string; className?: string }) {
  if (trend === "neutral") return <span className={cn("text-[10px] text-muted-foreground flex items-center gap-0.5", className)}><Minus className="h-2.5 w-2.5" /> 0%</span>;
  return (
    <span className={cn("text-[10px] font-medium flex items-center gap-0.5", trend === "up" ? "text-success" : "text-destructive", className)}>
      {trend === "up" ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
      {trend === "up" ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

/* ── Per-Card Date Picker ── */
function CardDatePicker({
  frequency, date, onDateChange,
}: {
  frequency: "daily" | "monthly";
  date: Date;
  onDateChange: (d: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
          <CalendarIcon className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {frequency === "daily" ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onDateChange(d)}
            className="p-3 pointer-events-auto"
          />
        ) : (
          <div className="p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Select Month</p>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const isSelected = i === date.getMonth();
                return (
                  <button
                    key={i}
                    onClick={() => onDateChange(new Date(date.getFullYear(), i, 1))}
                    className={cn(
                      "px-3 py-2 text-xs rounded-md transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    )}
                  >
                    {format(new Date(2024, i, 1), "MMM")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ── Summary Card (Classic-inspired, compact) ── */
function SummaryCard({
  summary,
  label,
  compareTo,
  accentColor,
  formatCurrency,
  frequency,
  date,
  onDateChange,
  onViewMore,
}: {
  summary: ProfitabilitySummary;
  label: string;
  compareTo: ProfitabilitySummary;
  accentColor: string;
  formatCurrency: (v: number) => string;
  frequency: "daily" | "monthly";
  date: Date;
  onDateChange: (d: Date) => void;
  onViewMore?: () => void;
}) {
  const profitMargin = summary.gmv > 0 ? (summary.netProfit / summary.gmv) * 100 : 0;
  const netDelta = getDelta(summary.netProfit, compareTo.netProfit);

  const metrics = [
    { label: "GMV", value: summary.gmv, fmt: "currency" as const },
    { label: "Orders", value: summary.orders, fmt: "number" as const },
    { label: "Auth Sales", value: summary.authSales, fmt: "currency" as const },
    { label: "Ad Cost", value: summary.adCost, fmt: "currency" as const },
  ];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col" style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}>
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-foreground truncate">{label}</h4>
          <CardDatePicker frequency={frequency} date={date} onDateChange={onDateChange} />
        </div>
        {summary.dateRange && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{summary.dateRange}</p>
        )}
      </div>

      {/* Primary metric */}
      <div className="px-3 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">
            <MorphingNumber value={summary.netProfit} format="currency" decimals={0} />
          </span>
          <DeltaIndicator value={netDelta.value} trend={netDelta.trend} />
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] text-muted-foreground">Margin</span>
          <span className={cn("text-[10px] font-medium", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
            {profitMargin.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Inline metrics grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-3 pb-2 border-t border-border/50 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between">
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
            <span className="text-[11px] font-medium text-foreground">
              {m.fmt === "currency" ? formatCurrency(m.value) : m.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* View More */}
      {onViewMore && (
        <div className="mt-auto border-t border-border/50 px-3 py-1.5">
          <button
            onClick={onViewMore}
            className="flex items-center gap-0.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View More <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Forecast Card ── */
function ForecastCard({
  baseSummary,
  formatCurrency,
}: {
  baseSummary: ProfitabilitySummary;
  formatCurrency: (v: number) => string;
}) {
  // Simple projection: assume current period is ~60% through, project to 100%
  const projectionMultiplier = 1.67;
  const estProfit = baseSummary.netProfit * projectionMultiplier;
  const estGMV = baseSummary.gmv * projectionMultiplier;
  const estOrders = Math.round(baseSummary.orders * projectionMultiplier);
  const confidence = 78;

  const metrics = [
    { label: "Est. GMV", value: formatCurrency(estGMV) },
    { label: "Est. Orders", value: estOrders.toLocaleString() },
    { label: "Confidence", value: `${confidence}%` },
  ];

  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          <h4 className="text-xs font-semibold text-foreground">Forecast</h4>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Projected end-of-period</p>
      </div>

      {/* Primary metric */}
      <div className="px-3 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">
            <MorphingNumber value={estProfit} format="currency" decimals={0} />
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Est. Net Profit</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-y-1.5 px-3 pb-2 border-t border-border/50 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between">
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
            <span className="text-[11px] font-medium text-foreground">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Confidence bar */}
      <div className="mt-auto px-3 pb-3 pt-1">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${confidence}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ── Comparison Chart ── */
function ComparisonChart({
  datasets,
}: {
  datasets: { data: TrendDataPoint[]; label: string; color: string; dashed?: boolean }[];
}) {
  const maxLen = Math.max(...datasets.map(d => d.data.length));
  const combined = Array.from({ length: maxLen }, (_, i) => {
    const row: Record<string, any> = { label: datasets[0]?.data[i]?.week ?? `W${i + 1}` };
    datasets.forEach(ds => {
      row[ds.label] = ds.data[i]?.orders ?? 0;
    });
    return row;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-3 flex flex-col min-w-0">
      <h4 className="text-xs font-semibold text-foreground mb-1">Comparison</h4>
      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combined} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
            {datasets.map((ds) => (
              <Area
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={ds.color}
                fill={ds.color}
                fillOpacity={0.08}
                strokeWidth={1.5}
                strokeDasharray={ds.dashed ? "5 3" : undefined}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: "10px" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Main Exported Component ── */
export function ProfitabilityHeroCard({
  summaries, trendDataByPeriod, selectedPeriod, onPeriodChange, onViewBreakdown,
}: ProfitabilityHeroCardProps) {
  const { formatCurrency } = useCurrency();
  const [frequency, setFrequency] = useState<"daily" | "monthly">("daily");
  const [activeView, setActiveView] = useState<"overview" | "breakdown" | "efficiency">("overview");

  const [card1Date, setCard1Date] = useState<Date>(new Date());
  const [card2Date, setCard2Date] = useState<Date>(() => subDays(new Date(), 1));
  const [card3Date, setCard3Date] = useState<Date>(() => subDays(new Date(), 2));

  const periodKeys = frequency === "daily"
    ? ["today", "yesterday", "this_month"]
    : ["this_month", "last_month", "yesterday"];

  const card1Summary = summaries.find(s => s.period === periodKeys[0]) || summaries[0];
  const card2Summary = summaries.find(s => s.period === periodKeys[1]) || summaries[1];
  const card3Summary = summaries.find(s => s.period === periodKeys[2]) || summaries[2] || summaries[0];

  const card1Trend = trendDataByPeriod[periodKeys[0]] || trendDataByPeriod.this_month;
  const card2Trend = trendDataByPeriod[periodKeys[1]] || trendDataByPeriod.last_month;
  const card3Trend = trendDataByPeriod[periodKeys[2]] || trendDataByPeriod.this_month;

  const card1Label = frequency === "daily" ? format(card1Date, "MMM dd, yyyy") : format(card1Date, "MMMM yyyy");
  const card2Label = frequency === "daily" ? format(card2Date, "MMM dd, yyyy") : format(card2Date, "MMMM yyyy");
  const card3Label = frequency === "daily" ? format(card3Date, "MMM dd, yyyy") : format(card3Date, "MMMM yyyy");

  const primarySummary = card1Summary;
  const secondarySummary = card2Summary;

  const profitMargin = primarySummary.gmv > 0 ? (primarySummary.netProfit / primarySummary.gmv) * 100 : 0;
  const prevMargin = secondarySummary.gmv > 0 ? (secondarySummary.netProfit / secondarySummary.gmv) * 100 : 0;

  // Forecast trend data (projected from card1)
  const forecastTrend = useMemo(() => {
    return card1Trend.map(d => ({ ...d, orders: Math.round(d.orders * 1.67), units: Math.round(d.units * 1.67) }));
  }, [card1Trend]);

  const salesBreakdown = useMemo(() => [
    { name: "Organic", value: primarySummary.breakdown.organic },
    { name: "SP", value: primarySummary.breakdown.sponsoredProducts },
    { name: "SB", value: primarySummary.breakdown.sponsoredBrands },
    { name: "SV", value: primarySummary.breakdown.sponsoredVideo },
  ], [primarySummary]);

  const totalAdSales = primarySummary.breakdown.sponsoredProducts + primarySummary.breakdown.sponsoredBrands + primarySummary.breakdown.sponsoredVideo;
  const organicRatio = primarySummary.gmv > 0 ? (primarySummary.breakdown.organic / primarySummary.gmv) * 100 : 0;

  const views = [
    { key: "overview", label: "Overview" },
    { key: "breakdown", label: "Sales Mix" },
    { key: "efficiency", label: "Efficiency" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            <button
              onClick={() => {
                setFrequency("daily");
                setCard1Date(new Date());
                setCard2Date(subDays(new Date(), 1));
                setCard3Date(subDays(new Date(), 2));
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                frequency === "daily" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Daily
            </button>
            <button
              onClick={() => {
                setFrequency("monthly");
                setCard1Date(new Date());
                setCard2Date(subMonths(new Date(), 1));
                setCard3Date(subMonths(new Date(), 2));
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                frequency === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setActiveView(v.key as typeof activeView)}
                className={cn(
                  "px-2 py-1 text-[11px] font-medium rounded transition-all",
                  activeView === v.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onViewBreakdown?.(primarySummary)}
            className="flex items-center gap-0.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Full Details <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {activeView === "overview" && (
          <div className="grid grid-cols-5 gap-3 overflow-hidden">
            <SummaryCard
              summary={card1Summary}
              label={card1Label}
              compareTo={card2Summary}
              accentColor={ACCENT_COLORS[0]}
              formatCurrency={formatCurrency}
              frequency={frequency}
              date={card1Date}
              onDateChange={setCard1Date}
              onViewMore={() => onViewBreakdown?.(card1Summary)}
            />
            <SummaryCard
              summary={card2Summary}
              label={card2Label}
              compareTo={card1Summary}
              accentColor={ACCENT_COLORS[1]}
              formatCurrency={formatCurrency}
              frequency={frequency}
              date={card2Date}
              onDateChange={setCard2Date}
              onViewMore={() => onViewBreakdown?.(card2Summary)}
            />
            <SummaryCard
              summary={card3Summary}
              label={card3Label}
              compareTo={card1Summary}
              accentColor={ACCENT_COLORS[2]}
              formatCurrency={formatCurrency}
              frequency={frequency}
              date={card3Date}
              onDateChange={setCard3Date}
              onViewMore={() => onViewBreakdown?.(card3Summary)}
            />
            <ForecastCard
              baseSummary={primarySummary}
              formatCurrency={formatCurrency}
            />
            <ComparisonChart
              datasets={[
                { data: card1Trend, label: card1Label, color: "hsl(var(--primary))" },
                { data: card2Trend, label: card2Label, color: "hsl(var(--chart-2))" },
                { data: card3Trend, label: card3Label, color: "hsl(var(--chart-3))" },
                { data: forecastTrend, label: "Forecast", color: "hsl(var(--chart-4))", dashed: true },
              ]}
            />
          </div>
        )}

        {activeView === "breakdown" && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground font-medium mb-2">Sales Channel Mix</div>
              <div className="h-[140px] w-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                      {salesBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, ""]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <div className="text-base font-semibold text-foreground">{organicRatio.toFixed(0)}%</div>
                <div className="text-[10px] text-muted-foreground">Organic</div>
              </div>
            </div>
            <div className="col-span-8 space-y-2">
              <div className="text-xs text-muted-foreground font-medium mb-2">Channel Breakdown</div>
              {salesBreakdown.map((channel, i) => {
                const pct = primarySummary.gmv > 0 ? (channel.value / primarySummary.gmv) * 100 : 0;
                return (
                  <div key={channel.name} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-[11px] text-foreground w-16">{channel.name}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PIE_COLORS[i] }} />
                    </div>
                    <span className="text-[11px] font-medium text-foreground w-20 text-right">${channel.value.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground w-10 text-right">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-2 mt-2 grid grid-cols-3 gap-2">
                <div className="rounded-md border border-border/50 px-2 py-1.5">
                  <div className="text-[10px] text-muted-foreground">Total Ad Sales</div>
                  <div className="text-xs font-semibold text-foreground">${totalAdSales.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-2 py-1.5">
                  <div className="text-[10px] text-muted-foreground">Ad Cost</div>
                  <div className="text-xs font-semibold text-foreground">${primarySummary.adCost.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-2 py-1.5">
                  <div className="text-[10px] text-muted-foreground">COGS</div>
                  <div className="text-xs font-semibold text-foreground">${primarySummary.breakdown.cogs.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "efficiency" && (
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Target className="h-4 w-4 text-primary mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">ROAS</div>
              <div className="text-xl font-semibold text-foreground">{primarySummary.breakdown.roas.toFixed(1)}x</div>
              <DeltaIndicator {...getDelta(primarySummary.breakdown.roas, secondarySummary.breakdown.roas)} className="mt-0.5" />
              <div className="text-[10px] text-muted-foreground mt-1">Return on Ad Spend</div>
            </div>
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Percent className="h-4 w-4 text-chart-2 mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">TACoS</div>
              <div className={cn("text-xl font-semibold", primarySummary.breakdown.tacos < 10 ? "text-success" : "text-destructive")}>{primarySummary.breakdown.tacos.toFixed(1)}%</div>
              <DeltaIndicator {...getDelta(primarySummary.breakdown.tacos, secondarySummary.breakdown.tacos)} className="mt-0.5" />
              <div className="text-[10px] text-muted-foreground mt-1">Total Ad Cost of Sale</div>
            </div>
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Layers className="h-4 w-4 text-chart-3 mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">Profit Margin</div>
              <div className={cn("text-xl font-semibold", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
                {profitMargin.toFixed(1)}%
              </div>
              <DeltaIndicator {...getDelta(profitMargin, prevMargin)} className="mt-0.5" />
              <div className="text-[10px] text-muted-foreground mt-1">Net Profit / GMV</div>
            </div>
            <div className="rounded-md border border-border/50 p-3 flex flex-col items-center text-center">
              <Eye className="h-4 w-4 text-chart-4 mb-1.5" />
              <div className="text-[10px] text-muted-foreground mb-0.5">Return Rate</div>
              <div className={cn("text-xl font-semibold", primarySummary.orders > 0 && (primarySummary.returns / primarySummary.orders) * 100 > 5 ? "text-destructive" : "text-success")}>
                {primarySummary.orders > 0 ? ((primarySummary.returns / primarySummary.orders) * 100).toFixed(1) : "0.0"}%
              </div>
              <div className="text-[10px] text-muted-foreground mt-2">
                {primarySummary.returns} returns · {primarySummary.cancelled} cancelled
              </div>
              <div className="text-[10px] text-muted-foreground">out of {primarySummary.orders} orders</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
