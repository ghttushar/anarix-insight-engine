import { ExternalLink, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProfitabilityProduct } from "@/types/profitability";
import { cn } from "@/lib/utils";

interface ProductsPnLTableProps {
  products: ProfitabilityProduct[];
  visibleColumns?: string[];
  onCogsClick?: (product: ProfitabilityProduct) => void;
  onTrendsClick?: (product: ProfitabilityProduct) => void;
  onMoreClick?: (product: ProfitabilityProduct) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const ALL_COLUMNS = [
  { id: "units", label: "Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.units) },
  { id: "refundUnits", label: "Refund Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.refundUnits) },
  { id: "cancelledUnits", label: "Cancelled Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.cancelledUnits) },
  { id: "gmv", label: "GMV", getValue: (p: ProfitabilityProduct) => formatCurrency(p.gmv) },
  { id: "authSales", label: "Auth Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.authSales) },
  { id: "refundSales", label: "Refund Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.refundSales), className: "text-red-500" },
  { id: "cancelledSales", label: "Cancelled Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.cancelledSales), className: "text-orange-500" },
  { id: "adSpend", label: "Ad Spend", getValue: (p: ProfitabilityProduct) => formatCurrency(p.adSpend) },
  { id: "commissionProduct", label: "Comm. Product", getValue: (p: ProfitabilityProduct) => formatCurrency(p.commissionProduct) },
  { id: "commissionShipping", label: "Comm. Shipping", getValue: (p: ProfitabilityProduct) => formatCurrency(p.commissionShipping) },
  { id: "wfsFulfillmentFee", label: "WFS Fee", getValue: (p: ProfitabilityProduct) => formatCurrency(p.wfsFulfillmentFee) },
  { id: "shippingFees", label: "Shipping Fees", getValue: (p: ProfitabilityProduct) => formatCurrency(p.shippingFees) },
  { id: "cogs", label: "COGS", getValue: (p: ProfitabilityProduct) => formatCurrency(p.cogs) },
  { id: "netProfit", label: "Net Profit", getValue: (p: ProfitabilityProduct) => formatCurrency(p.netProfit), getClassName: (p: ProfitabilityProduct) => p.netProfit >= 0 ? "text-green-600" : "text-red-500" },
  { id: "additionalFee", label: "Additional Fee", getValue: (p: ProfitabilityProduct) => formatCurrency(p.additionalFee) },
];

export function ProductsPnLTable({ products, visibleColumns, onCogsClick, onTrendsClick, onMoreClick }: ProductsPnLTableProps) {
  const cols = visibleColumns
    ? ALL_COLUMNS.filter((c) => visibleColumns.includes(c.id))
    : ALL_COLUMNS;

  const totals = products.reduce(
    (acc, p) => {
      ALL_COLUMNS.forEach((col) => {
        const key = col.id as keyof typeof acc;
        acc[key] = (acc[key] || 0) + ((p as any)[col.id] || 0);
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="sticky left-0 z-20 bg-muted min-w-[300px]">Product Details</TableHead>
            {cols.map((col) => (
              <TableHead key={col.id} className="text-right">{col.label}</TableHead>
            ))}
            <TableHead className="text-center">Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/30 group">
              <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{product.itemId}</span>
                      <span>•</span>
                      <span>{product.sku}</span>
                      <span>•</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {onCogsClick && (
                        <button
                          onClick={() => onCogsClick(product)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          COGS
                        </button>
                      )}
                      {onTrendsClick && (
                        <button
                          onClick={() => onTrendsClick(product)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <TrendingUp className="h-3 w-3" />
                          Trends
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              {cols.map((col) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    "text-right",
                    col.className,
                    col.getClassName ? col.getClassName(product) : undefined
                  )}
                >
                  {col.getValue(product)}
                </TableCell>
              ))}
              <TableCell className="text-center">
                {onMoreClick ? (
                  <button onClick={() => onMoreClick(product)} className="text-xs text-primary hover:underline">More</button>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}

          {/* Total Row */}
          <TableRow className="bg-muted font-medium">
            <TableCell className="sticky left-0 z-10 bg-muted">Total</TableCell>
            {cols.map((col) => {
              const val = totals[col.id] || 0;
              const isNetProfit = col.id === "netProfit";
              return (
                <TableCell
                  key={col.id}
                  className={cn(
                    "text-right",
                    col.className,
                    isNetProfit && (val >= 0 ? "text-green-600" : "text-red-500")
                  )}
                >
                  {col.id.includes("Unit") || col.id === "units" || col.id === "refundUnits" || col.id === "cancelledUnits"
                    ? formatNumber(val)
                    : formatCurrency(val)}
                </TableCell>
              );
            })}
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
