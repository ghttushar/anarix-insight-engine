import { useState, useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
  BarChart3, Eye, ChevronRight, ArrowUpRight, ArrowDownRight,
  Minus, Target, Percent, Layers, CalendarIcon,
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

interface KPITileProps {
  label: string;
  value: number;
  prev: number;
  format: "currency" | "number";
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  formatCurrency: (v: number) => string;
}

function KPITile({ label, value, prev, format: fmt, icon: Icon, highlight, formatCurrency }: KPITileProps) {
  const delta = getDelta(value, prev);
  const display = fmt === "currency" ? formatCurrency(value) : value.toLocaleString();
  return (
    <div className={cn(
      "rounded-md border border-border/50 px-3 py-2 transition-colors hover:border-border",
      highlight && "bg-primary/5 border-primary/20"
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <Icon className="h-3 w-3 text-muted-foreground/50" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-foreground">{display}</span>
        <DeltaIndicator value={delta.value} trend={delta.trend} />
      </div>
    </div>
  );
}

/* ── Per-Card Date Picker (inline in card header) ── */
function CardDatePicker({
  frequency,
  date,
  onDateChange,
}: {
  frequency: "daily" | "monthly";
  date: Date;
  onDateChange: (d: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
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

function PeriodCard({
  summary,
  label,
  compareTo,
  trendData,
  formatCurrency,
  frequency,
  date,
  onDateChange,
}: {
  summary: ProfitabilitySummary;
  label: string;
  compareTo: ProfitabilitySummary;
  trendData: TrendDataPoint[];
  formatCurrency: (v: number) => string;
  frequency: "daily" | "monthly";
  date: Date;
  onDateChange: (d: Date) => void;
}) {
  const profitMargin = summary.gmv > 0 ? (summary.netProfit / summary.gmv) * 100 : 0;

  const kpis = [
    { label: "GMV", value: summary.gmv, prev: compareTo.gmv, icon: DollarSign, format: "currency" as const },
    { label: "Auth Sales", value: summary.authSales, prev: compareTo.authSales, icon: BarChart3, format: "currency" as const },
    { label: "Net Profit", value: summary.netProfit, prev: compareTo.netProfit, icon: TrendingUp, format: "currency" as const, highlight: true },
    { label: "Orders", value: summary.orders, prev: compareTo.orders, icon: ShoppingCart, format: "number" as const },
    { label: "Units", value: summary.units, prev: compareTo.units, icon: Package, format: "number" as const },
    { label: "Est. Payout", value: summary.estPayout, prev: compareTo.estPayout, icon: DollarSign, format: "currency" as const },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 min-w-0">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-foreground truncate">{label}</h4>
            <CardDatePicker frequency={frequency} date={date} onDateChange={onDateChange} />
          </div>
          <p className="text-[11px] text-muted-foreground">{summary.dateRange}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-semibold text-foreground">{formatCurrency(summary.netProfit)}</div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-[11px] text-muted-foreground">Margin:</span>
            <span className={cn("text-[11px] font-medium", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {kpis.map(k => (
          <KPITile key={k.label} {...k} formatCurrency={formatCurrency} />
        ))}
      </div>
    </div>
  );
}

function ComparisonChart({
  datasets,
}: {
  datasets: { data: TrendDataPoint[]; label: string; color: string }[];
}) {
  const maxLen = Math.max(...datasets.map(d => d.data.length));
  const combined = Array.from({ length: maxLen }, (_, i) => {
    const row: Record<string, any> = { label: datasets[0]?.data[i]?.week ?? `W${i + 1}` };
    datasets.forEach(ds => {
      row[ds.label + " Orders"] = ds.data[i]?.orders ?? 0;
    });
    return row;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col h-full min-w-0">
      <h4 className="text-sm font-semibold text-foreground mb-1">Comparison</h4>
      <p className="text-[11px] text-muted-foreground mb-3">
        {datasets.map(d => d.label).join(" vs ")}
      </p>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combined} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
            {datasets.map((ds, i) => (
              <Area
                key={ds.label}
                type="monotone"
                dataKey={ds.label + " Orders"}
                stroke={ds.color}
                fill={ds.color}
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray={i > 0 ? "5 3" : undefined}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: "11px" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProfitabilityHeroCard({
  summaries, trendDataByPeriod, selectedPeriod, onPeriodChange, onViewBreakdown,
}: ProfitabilityHeroCardProps) {
  const { formatCurrency } = useCurrency();
  const [frequency, setFrequency] = useState<"daily" | "monthly">("daily");
  const [activeView, setActiveView] = useState<"overview" | "breakdown" | "efficiency">("overview");

  // Per-card dates
  const [card1Date, setCard1Date] = useState<Date>(new Date());
  const [card2Date, setCard2Date] = useState<Date>(() => subDays(new Date(), 1));
  const [card3Date, setCard3Date] = useState<Date>(() => subDays(new Date(), 2));

  // Period keys mapping
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
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Frequency toggle */}
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            <button
              onClick={() => {
                setFrequency("daily");
                setCard1Date(new Date());
                setCard2Date(subDays(new Date(), 1));
                setCard3Date(subDays(new Date(), 2));
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
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
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                frequency === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setActiveView(v.key as typeof activeView)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded transition-all",
                  activeView === v.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onViewBreakdown?.(primarySummary)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Full Details <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {activeView === "overview" && (
          <div className="grid grid-cols-4 gap-4 overflow-hidden">
            <PeriodCard
              summary={card1Summary}
              label={card1Label}
              compareTo={card2Summary}
              trendData={card1Trend}
              formatCurrency={formatCurrency}
              frequency={frequency}
              date={card1Date}
              onDateChange={setCard1Date}
            />
            <PeriodCard
              summary={card2Summary}
              label={card2Label}
              compareTo={card1Summary}
              trendData={card2Trend}
              formatCurrency={formatCurrency}
              frequency={frequency}
              date={card2Date}
              onDateChange={setCard2Date}
            />
            <PeriodCard
              summary={card3Summary}
              label={card3Label}
              compareTo={card1Summary}
              trendData={card3Trend}
              formatCurrency={formatCurrency}
              frequency={frequency}
              date={card3Date}
              onDateChange={setCard3Date}
            />
            <ComparisonChart
              datasets={[
                { data: card1Trend, label: card1Label, color: "hsl(var(--primary))" },
                { data: card2Trend, label: card2Label, color: "hsl(var(--chart-2))" },
                { data: card3Trend, label: card3Label, color: "hsl(var(--chart-3))" },
              ]}
            />
          </div>
        )}

        {activeView === "breakdown" && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground font-medium mb-2">Sales Channel Mix</div>
              <div className="h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                      {salesBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`$${val.toLocaleString()}`, ""]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <div className="text-lg font-semibold text-foreground">{organicRatio.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Organic</div>
              </div>
            </div>
            <div className="col-span-8 space-y-2">
              <div className="text-xs text-muted-foreground font-medium mb-2">Channel Breakdown</div>
              {salesBreakdown.map((channel, i) => {
                const pct = primarySummary.gmv > 0 ? (channel.value / primarySummary.gmv) * 100 : 0;
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
                  <div className="text-sm font-semibold text-foreground">${primarySummary.adCost.toLocaleString()}</div>
                </div>
                <div className="rounded-md border border-border/50 px-3 py-2">
                  <div className="text-xs text-muted-foreground">COGS</div>
                  <div className="text-sm font-semibold text-foreground">${primarySummary.breakdown.cogs.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "efficiency" && (
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Target className="h-5 w-5 text-primary mb-2" />
              <div className="text-xs text-muted-foreground mb-1">ROAS</div>
              <div className="text-2xl font-semibold text-foreground">{primarySummary.breakdown.roas.toFixed(1)}x</div>
              <DeltaIndicator {...getDelta(primarySummary.breakdown.roas, secondarySummary.breakdown.roas)} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-2">Return on Ad Spend</div>
            </div>
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Percent className="h-5 w-5 text-chart-2 mb-2" />
              <div className="text-xs text-muted-foreground mb-1">TACoS</div>
              <div className={cn("text-2xl font-semibold", primarySummary.breakdown.tacos < 10 ? "text-success" : "text-destructive")}>{primarySummary.breakdown.tacos.toFixed(1)}%</div>
              <DeltaIndicator {...getDelta(primarySummary.breakdown.tacos, secondarySummary.breakdown.tacos)} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-2">Total Ad Cost of Sale</div>
            </div>
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Layers className="h-5 w-5 text-chart-3 mb-2" />
              <div className="text-xs text-muted-foreground mb-1">Profit Margin</div>
              <div className={cn("text-2xl font-semibold", profitMargin > 20 ? "text-success" : profitMargin > 10 ? "text-foreground" : "text-destructive")}>
                {profitMargin.toFixed(1)}%
              </div>
              <DeltaIndicator {...getDelta(profitMargin, prevMargin)} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-2">Net Profit / GMV</div>
            </div>
            <div className="rounded-md border border-border/50 p-4 flex flex-col items-center text-center">
              <Eye className="h-5 w-5 text-chart-4 mb-2" />
              <div className="text-xs text-muted-foreground mb-1">Return Rate</div>
              <div className={cn("text-2xl font-semibold", primarySummary.orders > 0 && (primarySummary.returns / primarySummary.orders) * 100 > 5 ? "text-destructive" : "text-success")}>
                {primarySummary.orders > 0 ? ((primarySummary.returns / primarySummary.orders) * 100).toFixed(1) : "0.0"}%
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                {primarySummary.returns} returns · {primarySummary.cancelled} cancelled
              </div>
              <div className="text-xs text-muted-foreground">out of {primarySummary.orders} orders</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
