import { Search, Filter, Download, Upload, Columns, ExternalLink, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export function ProductsPnLTable({ products }: ProductsPnLTableProps) {
  const totals = products.reduce(
    (acc, product) => ({
      units: acc.units + product.units,
      refundUnits: acc.refundUnits + product.refundUnits,
      cancelledUnits: acc.cancelledUnits + product.cancelledUnits,
      gmv: acc.gmv + product.gmv,
      authSales: acc.authSales + product.authSales,
      refundSales: acc.refundSales + product.refundSales,
      cancelledSales: acc.cancelledSales + product.cancelledSales,
      adSpend: acc.adSpend + product.adSpend,
      commissionProduct: acc.commissionProduct + product.commissionProduct,
      commissionShipping: acc.commissionShipping + product.commissionShipping,
      wfsFulfillmentFee: acc.wfsFulfillmentFee + product.wfsFulfillmentFee,
      shippingFees: acc.shippingFees + product.shippingFees,
      cogs: acc.cogs + product.cogs,
      netProfit: acc.netProfit + product.netProfit,
      additionalFee: acc.additionalFee + product.additionalFee,
    }),
    {
      units: 0,
      refundUnits: 0,
      cancelledUnits: 0,
      gmv: 0,
      authSales: 0,
      refundSales: 0,
      cancelledSales: 0,
      adSpend: 0,
      commissionProduct: 0,
      commissionShipping: 0,
      wfsFulfillmentFee: 0,
      shippingFees: 0,
      cogs: 0,
      netProfit: 0,
      additionalFee: 0,
    }
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-border p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload COGS
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Columns className="mr-2 h-4 w-4" />
            Columns
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="sticky left-0 z-10 bg-muted/50 min-w-[300px]">Product Details</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">Refund Units</TableHead>
              <TableHead className="text-right">Cancelled Units</TableHead>
              <TableHead className="text-right">GMV</TableHead>
              <TableHead className="text-right">Auth Sales</TableHead>
              <TableHead className="text-right">Refund Sales</TableHead>
              <TableHead className="text-right">Cancelled Sales</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Comm. Product</TableHead>
              <TableHead className="text-right">Comm. Shipping</TableHead>
              <TableHead className="text-right">WFS Fee</TableHead>
              <TableHead className="text-right">Shipping Fees</TableHead>
              <TableHead className="text-right">COGS</TableHead>
              <TableHead className="text-right">Net Profit</TableHead>
              <TableHead className="text-right">Additional Fee</TableHead>
              <TableHead className="text-center">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30">
                <TableCell className="sticky left-0 z-10 bg-card">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-md border border-border object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.itemId}</span>
                        <span>•</span>
                        <span>{product.sku}</span>
                        <span>•</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button className="text-xs text-primary hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          COGS
                        </button>
                        <button className="text-xs text-primary hover:underline flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trends
                        </button>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatNumber(product.units)}</TableCell>
                <TableCell className="text-right text-red-500">{formatNumber(product.refundUnits)}</TableCell>
                <TableCell className="text-right text-orange-500">{formatNumber(product.cancelledUnits)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.gmv)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.authSales)}</TableCell>
                <TableCell className="text-right text-red-500">{formatCurrency(product.refundSales)}</TableCell>
                <TableCell className="text-right text-orange-500">{formatCurrency(product.cancelledSales)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.adSpend)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.commissionProduct)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.commissionShipping)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.wfsFulfillmentFee)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.shippingFees)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.cogs)}</TableCell>
                <TableCell className={cn("text-right font-medium", product.netProfit >= 0 ? "text-green-600" : "text-red-500")}>
                  {formatCurrency(product.netProfit)}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(product.additionalFee)}</TableCell>
                <TableCell className="text-center">
                  <button className="text-xs text-primary hover:underline">More</button>
                </TableCell>
              </TableRow>
            ))}

            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium">
              <TableCell className="sticky left-0 z-10 bg-muted/50">Total</TableCell>
              <TableCell className="text-right">{formatNumber(totals.units)}</TableCell>
              <TableCell className="text-right text-red-500">{formatNumber(totals.refundUnits)}</TableCell>
              <TableCell className="text-right text-orange-500">{formatNumber(totals.cancelledUnits)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.gmv)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.authSales)}</TableCell>
              <TableCell className="text-right text-red-500">{formatCurrency(totals.refundSales)}</TableCell>
              <TableCell className="text-right text-orange-500">{formatCurrency(totals.cancelledSales)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.adSpend)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.commissionProduct)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.commissionShipping)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.wfsFulfillmentFee)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.shippingFees)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.cogs)}</TableCell>
              <TableCell className={cn("text-right", totals.netProfit >= 0 ? "text-green-600" : "text-red-500")}>
                {formatCurrency(totals.netProfit)}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(totals.additionalFee)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
