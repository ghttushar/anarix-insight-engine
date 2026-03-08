import { useState } from "react";
import { Search, Filter, Download, Upload, Columns, ChevronDown, ChevronRight, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CatalogProduct, ColumnGroup } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CatalogProductsTableProps {
  products: CatalogProduct[];
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const initialColumnGroups: ColumnGroup[] = [
  { id: "performance", label: "Product Performance", columns: ["status", "reviews"], isExpanded: true },
  { id: "inventory", label: "Inventory", columns: ["inventoryCount", "inventoryValueCogs", "inventoryValueRetail"], isExpanded: true },
  { id: "revenue", label: "Revenue & Cost", columns: ["price", "cogs", "totalSales", "gmv", "totalUnits", "refundSales", "cancelledSales"], isExpanded: true },
  { id: "ads", label: "Ads", columns: ["advertised", "adSpend"], isExpanded: true },
];

export function CatalogProductsTable({ products }: CatalogProductsTableProps) {
  const { formatCurrency } = useCurrency();
  const [columnGroups, setColumnGroups] = useState<ColumnGroup[]>(initialColumnGroups);
  const [filters, setFilters] = useState<{ field: string; value: string }[]>([
    { field: "Status", value: "PUBLISHED" },
  ]);

  const toggleGroup = (groupId: string) => {
    setColumnGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g))
    );
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: CatalogProduct["status"]) => {
    const variants = {
      published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      unpublished: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return (
      <Badge className={cn("uppercase text-xs font-medium", variants[status])}>
        {status}
      </Badge>
    );
  };

  const totals = products.reduce(
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

  const isGroupExpanded = (groupId: string) => columnGroups.find((g) => g.id === groupId)?.isExpanded;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by Product Name/ID/SKU..." className="pl-10" />
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

        {/* Active Filters */}
        {filters.length > 0 && (
          <div className="flex items-center gap-2">
            {filters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {filter.field} is {filter.value}
                <button
                  onClick={() => removeFilter(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setFilters([])}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {/* Group Headers */}
            <TableRow className="border-b-0">
              <TableHead className="sticky left-0 z-10 bg-muted/50" rowSpan={2}>
                Product Details
              </TableHead>
              {columnGroups.map((group) => (
                <TableHead
                  key={group.id}
                  colSpan={group.isExpanded ? group.columns.length : 1}
                  className="text-center border-l border-border bg-muted/30"
                >
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-center gap-1 w-full"
                  >
                    {group.isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {group.label}
                  </button>
                </TableHead>
              ))}
            </TableRow>

            {/* Column Headers */}
            <TableRow className="bg-muted/50">
              {/* Performance Group */}
              {isGroupExpanded("performance") ? (
                <>
                  <TableHead className="border-l border-border">Status</TableHead>
                  <TableHead>Reviews & Ratings</TableHead>
                </>
              ) : (
                <TableHead className="border-l border-border">...</TableHead>
              )}

              {/* Inventory Group */}
              {isGroupExpanded("inventory") ? (
                <>
                  <TableHead className="text-right border-l border-border">Count</TableHead>
                  <TableHead className="text-right">Value (COGS)</TableHead>
                  <TableHead className="text-right">Value (Retail)</TableHead>
                </>
              ) : (
                <TableHead className="border-l border-border">...</TableHead>
              )}

              {/* Revenue Group */}
              {isGroupExpanded("revenue") ? (
                <>
                  <TableHead className="text-right border-l border-border">Price</TableHead>
                  <TableHead className="text-right">COGS</TableHead>
                  <TableHead className="text-right">Total Sales</TableHead>
                  <TableHead className="text-right">GMV</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Refund Sales</TableHead>
                  <TableHead className="text-right">Cancelled</TableHead>
                </>
              ) : (
                <TableHead className="border-l border-border">...</TableHead>
              )}

              {/* Ads Group */}
              {isGroupExpanded("ads") ? (
                <>
                  <TableHead className="text-center border-l border-border">Advertised</TableHead>
                  <TableHead className="text-right">Ad Spend</TableHead>
                </>
              ) : (
                <TableHead className="border-l border-border">...</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30 group">
                {/* Product Details - Sticky */}
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted min-w-[350px] transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-md border border-border object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground line-clamp-1">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.itemId}</span>
                        <span>•</span>
                        <span>{product.sku}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {product.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Performance */}
                {isGroupExpanded("performance") ? (
                  <>
                    <TableCell className="border-l border-border">
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{formatNumber(product.reviewCount)}</span>
                        <span className="text-muted-foreground">|</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="border-l border-border text-muted-foreground">
                    ...
                  </TableCell>
                )}

                {/* Inventory */}
                {isGroupExpanded("inventory") ? (
                  <>
                    <TableCell className="text-right border-l border-border">
                      {formatNumber(product.inventoryCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.inventoryValueCogs)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.inventoryValueRetail)}
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="border-l border-border text-muted-foreground">
                    ...
                  </TableCell>
                )}

                {/* Revenue */}
                {isGroupExpanded("revenue") ? (
                  <>
                    <TableCell className="text-right border-l border-border">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.cogs)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.totalSales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.gmv)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(product.totalUnits)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.refundSales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.cancelledSales)}
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="border-l border-border text-muted-foreground">
                    ...
                  </TableCell>
                )}

                {/* Ads */}
                {isGroupExpanded("ads") ? (
                  <>
                    <TableCell className="text-center border-l border-border">
                      <Badge
                        variant={product.advertised ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {product.advertised ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.adSpend)}
                    </TableCell>
                  </>
                ) : (
                  <TableCell className="border-l border-border text-muted-foreground">
                    ...
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Total Row */}
            <TableRow className="bg-muted font-medium">
              <TableCell className="sticky left-0 z-10 bg-muted">Total</TableCell>
              {isGroupExpanded("performance") ? (
                <>
                  <TableCell className="border-l border-border">-</TableCell>
                  <TableCell>-</TableCell>
                </>
              ) : (
                <TableCell className="border-l border-border">-</TableCell>
              )}
              {isGroupExpanded("inventory") ? (
                <>
                  <TableCell className="text-right border-l border-border">
                    {formatNumber(totals.inventoryCount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.inventoryValueCogs)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.inventoryValueRetail)}
                  </TableCell>
                </>
              ) : (
                <TableCell className="border-l border-border">-</TableCell>
              )}
              {isGroupExpanded("revenue") ? (
                <>
                  <TableCell className="text-right border-l border-border">-</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.totalSales)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.gmv)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(totals.totalUnits)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.refundSales)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.cancelledSales)}
                  </TableCell>
                </>
              ) : (
                <TableCell className="border-l border-border">-</TableCell>
              )}
              {isGroupExpanded("ads") ? (
                <>
                  <TableCell className="text-center border-l border-border">-</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.adSpend)}
                  </TableCell>
                </>
              ) : (
                <TableCell className="border-l border-border">-</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
