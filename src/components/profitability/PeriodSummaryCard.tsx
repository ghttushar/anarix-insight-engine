import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { PeriodBreakdownPanel } from "./PeriodBreakdownPanel";

interface PeriodSummaryCardProps {
  summary: ProfitabilitySummary;
  accentColor?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export function PeriodSummaryCard({ summary, accentColor = "hsl(var(--primary))" }: PeriodSummaryCardProps) {
  const [showPanel, setShowPanel] = useState(false);

  const metrics = [
    { label: "GMV", value: formatCurrency(summary.gmv) },
    { label: "Auth Sales", value: formatCurrency(summary.authSales) },
    { label: "Orders", value: formatNumber(summary.orders) },
    { label: "Units", value: formatNumber(summary.units) },
    { label: "Returns", value: formatNumber(summary.returns) },
    { label: "Cancelled", value: formatNumber(summary.cancelled) },
    { label: "Ad Cost", value: formatCurrency(summary.adCost) },
    { label: "Est. Payout", value: formatCurrency(summary.estPayout) },
    { label: "Net Profit", value: formatCurrency(summary.netProfit), highlight: true },
  ];

  return (
    <>
      <div
        className={cn(
          "relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-sm",
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-lg"
        )}
        style={{ "--accent-color": accentColor } as React.CSSProperties}
      >
        {/* Accent bar */}
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
          style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}80)` }}
        />

        {/* Period label */}
        <div className="min-w-[120px] pl-3">
          <div className="font-medium text-foreground">{summary.dateLabel}</div>
          <div className="text-xs text-muted-foreground">{summary.dateRange}</div>
        </div>

        {/* Metrics row */}
        <div className="flex flex-1 flex-wrap items-center gap-4 lg:gap-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col min-w-[70px]">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{metric.label}</span>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  metric.highlight ? "text-success" : "text-foreground"
                )}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* View More button */}
        <button
          onClick={() => setShowPanel(true)}
          className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View More
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Breakdown Panel */}
      <PeriodBreakdownPanel
        summary={summary}
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </>
  );
}
