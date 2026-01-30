import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilitySummary } from "@/types/profitability";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:max-w-[400px]">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>{summary.dateLabel} Breakdown</span>
          </SheetTitle>
          <p className="text-sm text-muted-foreground">{summary.dateRange}</p>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto">
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
                        item.highlight ? "text-green-600 dark:text-green-400" : "text-foreground"
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
      </SheetContent>
    </Sheet>
  );
}
