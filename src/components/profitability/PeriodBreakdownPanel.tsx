import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PeriodBreakdownPanelProps {
  summary: ProfitabilitySummary;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function PeriodBreakdownPanel({ summary, isOpen, onClose }: PeriodBreakdownPanelProps) {
  const breakdown = summary.breakdown;

  const sections = [
    {
      title: "Sales Breakdown",
      items: [
        { label: "Organic", value: formatCurrency(breakdown.organic) },
        { label: "Sponsored Products", value: formatCurrency(breakdown.sponsoredProducts) },
        { label: "Sponsored Brands", value: formatCurrency(breakdown.sponsoredBrands) },
        { label: "Sponsored Video", value: formatCurrency(breakdown.sponsoredVideo) },
      ],
    },
    {
      title: "Orders & Units",
      items: [
        { label: "Total Orders", value: summary.orders.toString() },
        { label: "Total Units", value: summary.units.toString() },
        { label: "Returns", value: summary.returns.toString() },
        { label: "Cancelled", value: summary.cancelled.toString() },
      ],
    },
    {
      title: "Costs",
      items: [
        { label: "COGS", value: formatCurrency(breakdown.cogs) },
        { label: "Ad Spend", value: formatCurrency(summary.adCost) },
        { label: "Total Expenses", value: formatCurrency(breakdown.totalExpenses) },
      ],
    },
    {
      title: "Calculated Metrics",
      items: [
        { label: "Net Profit", value: formatCurrency(summary.netProfit), highlight: true },
        { label: "TACOS", value: formatPercent(breakdown.tacos) },
        { label: "ROAS", value: breakdown.roas.toFixed(2) + "x" },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop - same as Aan panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/4 backdrop-blur-[1px] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel - Aan-style slide-in */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header with gradient accent */}
        <div className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5" />
          <div className="relative flex items-center justify-between px-4 py-4">
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">
                {summary.dateLabel} Breakdown
              </h2>
              <p className="text-xs text-muted-foreground">{summary.dateRange}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span
                        className={cn(
                          "font-medium",
                          item.highlight ? "text-success" : "text-foreground"
                        )}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
