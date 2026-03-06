import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfitabilityProduct } from "@/types/profitability";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductDetailPanelProps {
  product: ProfitabilityProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

export function ProductDetailPanel({ product, isOpen, onClose }: ProductDetailPanelProps) {
  if (!product || !isOpen) return null;

  const sections = [
    {
      title: "Sales",
      items: [
        { label: "Order Sales", value: fmt(product.authSales) },
        { label: "Refund Sales", value: fmt(-product.refundSales) },
        { label: "Cancelled Sales", value: fmt(-product.cancelledSales) },
      ],
    },
    {
      title: "COGS",
      items: [
        { label: "COGS", value: fmt(-product.cogs * product.units) },
      ],
    },
    {
      title: "Total Expenses",
      items: [
        { label: "Advertising Cost", value: fmt(-product.adSpend) },
        { label: "Commission on Product", value: fmt(-product.commissionProduct) },
        { label: "Commission on Shipping", value: fmt(-product.commissionShipping) },
        { label: "WFS Fulfillment Fee", value: fmt(-product.wfsFulfillmentFee) },
        { label: "Shipping Fees", value: fmt(-product.shippingFees) },
        { label: "Additional Fee", value: fmt(-product.additionalFee) },
      ],
    },
    {
      title: "Total Units",
      items: [
        { label: "Units", value: product.units.toLocaleString() },
        { label: "Refund Units", value: product.refundUnits.toLocaleString() },
        { label: "Cancelled Units", value: product.cancelledUnits.toLocaleString() },
      ],
    },
    {
      title: "Calculated Metrics",
      items: [
        { label: "GMV", value: fmt(product.gmv) },
        { label: "Est. Payout", value: fmt(product.authSales - product.commissionProduct - product.commissionShipping) },
        { label: "Net Profit", value: fmt(product.netProfit), highlight: true },
        { label: "Profit Margin", value: product.profitMargin ? `${product.profitMargin.toFixed(1)}%` : "-" },
      ],
    },
  ];

  return (
    <div className="flex h-full w-[400px] shrink-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border shrink-0">
        <div className="flex items-center gap-3 px-4 py-4">
          <img
            src={product.image}
            alt={product.name}
            className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-sm font-semibold text-foreground line-clamp-1">{product.name}</h2>
            <p className="text-xs text-muted-foreground">{product.itemId} • {product.sku}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
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
                    <span className={cn("font-medium", item.highlight ? "text-success" : "text-foreground")}>
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
  );
}
