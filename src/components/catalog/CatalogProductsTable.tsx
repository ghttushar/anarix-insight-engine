import { useState } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CatalogProduct, ColumnGroup } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TablePagination } from "@/components/tables/TablePagination";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { sortData } from "@/components/tables/SortableTableHead";

interface CatalogProductsTableProps {
  products: CatalogProduct[];
  searchQuery?: string;
  showDeltas?: boolean;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function CatalogProductsTable({ products, searchQuery = "", showDeltas = false, sortField = null, sortDirection = "asc" }: CatalogProductsTableProps) {
  const { formatCurrency } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = sortData(filtered, sortField, sortDirection);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: CatalogProduct["status"]) => {
    const variants = {
      published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      unpublished: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return <Badge className={cn("uppercase text-xs font-medium", variants[status])}>{status}</Badge>;
  };

  const totals = filtered.reduce(
    (acc, p) => ({
      inventoryCount: acc.inventoryCount + p.inventoryCount,
      inventoryValueCogs: acc.inventoryValueCogs + p.inventoryValueCogs,
      inventoryValueRetail: acc.inventoryValueRetail + p.inventoryValueRetail,
      totalSales: acc.totalSales + p.totalSales,
      gmv: acc.gmv + p.gmv,
      totalUnits: acc.totalUnits + p.totalUnits,
      refundSales: acc.refundSales + p.refundSales,
      cancelledSales: acc.cancelledSales + p.cancelledSales,
      adSpend: acc.adSpend + p.adSpend,
    }),
    { inventoryCount: 0, inventoryValueCogs: 0, inventoryValueRetail: 0, totalSales: 0, gmv: 0, totalUnits: 0, refundSales: 0, cancelledSales: 0, adSpend: 0 }
  );

  const NumCell = ({ formatted, id, metric }: { formatted: string; id: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{formatted}</span>
      {showDeltas && <DeltaBadge value={getDelta(id, metric)} />}
    </div>
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="sticky left-0 z-10 bg-muted min-w-[350px]">Product Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="text-right">Inventory</TableHead>
              <TableHead className="text-right">Value (COGS)</TableHead>
              <TableHead className="text-right">Value (Retail)</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">COGS</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">GMV</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">Refund Sales</TableHead>
              <TableHead className="text-right">Cancelled</TableHead>
              <TableHead className="text-center">Advertised</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30 group">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted min-w-[350px] transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover" />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.itemId}</span><span>•</span><span>{product.sku}</span>
                      </div>
                      {product.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{formatNumber(product.reviewCount)}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(product.inventoryCount)} id={product.id} metric="inventoryCount" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.inventoryValueCogs)} id={product.id} metric="inventoryValueCogs" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.inventoryValueRetail)} id={product.id} metric="inventoryValueRetail" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.price)} id={product.id} metric="price" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.cogs)} id={product.id} metric="cogs" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.totalSales)} id={product.id} metric="totalSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.gmv)} id={product.id} metric="gmv" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(product.totalUnits)} id={product.id} metric="totalUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.refundSales)} id={product.id} metric="refundSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.cancelledSales)} id={product.id} metric="cancelledSales" /></TableCell>
                <TableCell className="text-center">
                  <Badge variant={product.advertised ? "default" : "secondary"} className="text-xs">
                    {product.advertised ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(product.adSpend)} id={product.id} metric="adSpend" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell className="sticky left-0 z-10 bg-muted font-semibold">Total ({filtered.length} products)</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(totals.inventoryCount)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.inventoryValueCogs)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.inventoryValueRetail)}</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.totalSales)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.gmv)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(totals.totalUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.refundSales)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.cancelledSales)}</TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filtered.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
