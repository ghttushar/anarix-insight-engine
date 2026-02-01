import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { PeriodBreakdownPanel } from "./PeriodBreakdownPanel";
import { MorphingNumber } from "@/features/creative/MorphingNumber";

interface PeriodSummaryCardProps {
  summary: ProfitabilitySummary;
  accentColor?: string;
}

export function PeriodSummaryCard({ summary, accentColor = "hsl(var(--primary))" }: PeriodSummaryCardProps) {
  const [showPanel, setShowPanel] = useState(false);

  // Reduced to 5 key metrics for clean single-line display
  const metrics = [
    { label: "GMV", value: summary.gmv, format: "currency" as const },
    { label: "Auth Sales", value: summary.authSales, format: "currency" as const },
    { label: "Orders", value: summary.orders, format: "number" as const },
    { label: "Ad Cost", value: summary.adCost, format: "currency" as const },
    { label: "Net Profit", value: summary.netProfit, format: "currency" as const, highlight: true },
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

        {/* Metrics row - single line with morphing numbers */}
        <div className="flex flex-1 items-center gap-4 lg:gap-6 overflow-hidden">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col min-w-[80px]">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{metric.label}</span>
              <MorphingNumber
                value={metric.value}
                format={metric.format}
                decimals={metric.format === "number" ? 0 : 2}
                className={cn(
                  "text-sm whitespace-nowrap",
                  metric.highlight ? "text-success" : "text-foreground"
                )}
              />
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
