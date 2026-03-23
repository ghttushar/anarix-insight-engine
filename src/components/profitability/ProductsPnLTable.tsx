import { useState } from "react";
import { ExternalLink, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProfitabilityProduct, ProfitabilityOrder } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";

interface ProductsPnLTableProps {
  products: ProfitabilityProduct[];
  orders?: ProfitabilityOrder[];
  mode?: "products" | "orders";
  visibleColumns?: string[];
  onCogsClick?: (product: ProfitabilityProduct) => void;
  onTrendsClick?: (product: ProfitabilityProduct) => void;
  onMoreClick?: (product: ProfitabilityProduct) => void;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  returned: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export function ProductsPnLTable({ products, orders = [], mode = "products", visibleColumns, onCogsClick, onTrendsClick, onMoreClick }: ProductsPnLTableProps) {
  const { formatCurrency } = useCurrency();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const ALL_COLUMNS = [
    { id: "units", label: "Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.units) },
    { id: "refundUnits", label: "Refund Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.refundUnits) },
    { id: "cancelledUnits", label: "Cancelled Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.cancelledUnits) },
    { id: "gmv", label: "GMV", getValue: (p: ProfitabilityProduct) => formatCurrency(p.gmv) },
    { id: "authSales", label: "Auth Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.authSales) },
    { id: "refundSales", label: "Refund Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.refundSales) },
    { id: "cancelledSales", label: "Cancelled Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.cancelledSales) },
    { id: "adSpend", label: "Ad Spend", getValue: (p: ProfitabilityProduct) => formatCurrency(p.adSpend) },
    { id: "commissionProduct", label: "Comm. Product", getValue: (p: ProfitabilityProduct) => formatCurrency(p.commissionProduct) },
    { id: "commissionShipping", label: "Comm. Shipping", getValue: (p: ProfitabilityProduct) => formatCurrency(p.commissionShipping) },
    { id: "wfsFulfillmentFee", label: "WFS Fee", getValue: (p: ProfitabilityProduct) => formatCurrency(p.wfsFulfillmentFee) },
    { id: "shippingFees", label: "Shipping Fees", getValue: (p: ProfitabilityProduct) => formatCurrency(p.shippingFees) },
    { id: "cogs", label: "COGS", getValue: (p: ProfitabilityProduct) => formatCurrency(p.cogs) },
    { id: "netProfit", label: "Net Profit", getValue: (p: ProfitabilityProduct) => formatCurrency(p.netProfit) },
    { id: "additionalFee", label: "Additional Fee", getValue: (p: ProfitabilityProduct) => formatCurrency(p.additionalFee) },
  ];
  const cols = visibleColumns
    ? ALL_COLUMNS.filter((c) => visibleColumns.includes(c.id))
    : ALL_COLUMNS;

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  // Products mode
  if (mode === "products") {
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
                  <TableCell key={col.id} className="text-right">
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

            <TableRow className="bg-muted font-medium">
              <TableCell className="sticky left-0 z-10 bg-muted">Total</TableCell>
              {cols.map((col) => {
                const val = totals[col.id] || 0;
                return (
                  <TableCell key={col.id} className="text-right">
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

  // Orders mode
  const orderTotals = orders.reduce(
    (acc, o) => {
      acc.units += o.units;
      acc.refundUnits += o.refundUnits;
      acc.cancelledUnits += o.cancelledUnits;
      acc.gmv += o.gmv;
      acc.authSales += o.authSales;
      acc.refundSales += o.refundSales;
      acc.cancelledSales += o.cancelledSales;
      acc.adSpend += o.adSpend;
      acc.commissionProduct += o.commissionProduct;
      acc.commissionShipping += o.commissionShipping;
      acc.wfsFulfillmentFee += o.wfsFulfillmentFee;
      acc.shippingFees += o.shippingFees;
      acc.cogs += o.cogs;
      acc.netProfit += o.netProfit;
      acc.additionalFee += o.additionalFee;
      return acc;
    },
    { units: 0, refundUnits: 0, cancelledUnits: 0, gmv: 0, authSales: 0, refundSales: 0, cancelledSales: 0, adSpend: 0, commissionProduct: 0, commissionShipping: 0, wfsFulfillmentFee: 0, shippingFees: 0, cogs: 0, netProfit: 0, additionalFee: 0 }
  );

  const getOrderColumnValue = (order: ProfitabilityOrder, colId: string) => {
    const val = (order as any)[colId];
    if (val === undefined) return "-";
    if (colId.includes("Unit") || colId === "units" || colId === "refundUnits" || colId === "cancelledUnits") return formatNumber(val);
    return formatCurrency(val);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="sticky left-0 z-20 bg-muted min-w-[340px]">Order Details</TableHead>
            {cols.map((col) => (
              <TableHead key={col.id} className="text-right">{col.label}</TableHead>
            ))}
            <TableHead className="text-center">Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <> 
                <TableRow key={order.id} className="hover:bg-muted/30 group cursor-pointer" onClick={() => toggleOrderExpand(order.id)}>
                  <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-muted flex-shrink-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground text-sm">{order.orderId}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{order.flag} {order.country}</span>
                          <span>•</span>
                          <span>{order.date}</span>
                          <span>•</span>
                          <span>{order.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 capitalize", STATUS_STYLES[order.status])}>
                            {order.status}
                          </Badge>
                          <span className="text-xs font-medium text-foreground">{formatCurrency(order.price)}</span>
                          <span className="text-[10px] text-muted-foreground">{order.products.length} item{order.products.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {cols.map((col) => (
                    <TableCell key={col.id} className="text-right">
                      {getOrderColumnValue(order, col.id)}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <span className="text-xs text-muted-foreground">-</span>
                  </TableCell>
                </TableRow>

                {/* Expanded child products */}
                {isExpanded && order.products.map((product, idx) => (
                  <TableRow key={`${order.id}-${product.id}-${idx}`} className="bg-muted/20 hover:bg-muted/40">
                    <TableCell className="sticky left-0 z-10 bg-muted/20 pl-14">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 rounded border border-border object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-foreground line-clamp-1">{product.name}</span>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{product.itemId}</span>
                            <span>•</span>
                            <span>{product.sku}</span>
                            <span>•</span>
                            <span>{formatCurrency(product.price)}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {cols.map((col) => {
                      const colDef = ALL_COLUMNS.find((c) => c.id === col.id);
                      return (
                        <TableCell key={col.id} className="text-right text-xs">
                          {colDef ? colDef.getValue(product) : "-"}
                        </TableCell>
                      );
                    })}
                    <TableCell />
                  </TableRow>
                ))}
              </>
            );
          })}

          <TableRow className="bg-muted font-medium">
            <TableCell className="sticky left-0 z-10 bg-muted">Total for {orders.length} Orders</TableCell>
            {cols.map((col) => {
              const val = (orderTotals as any)[col.id] || 0;
              return (
                <TableCell key={col.id} className="text-right">
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
