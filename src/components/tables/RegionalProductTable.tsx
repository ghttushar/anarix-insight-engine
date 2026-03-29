import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { profitabilityProducts } from "@/data/mockProfitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TablePagination } from "@/components/tables/TablePagination";
import { sortData } from "@/components/tables/SortableTableHead";

interface RegionalProductTableProps {
  searchValue?: string;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const regionAssignments = [
  { region: "United States", flag: "🇺🇸", products: profitabilityProducts.slice(0, 3) },
  { region: "Canada", flag: "🇨🇦", products: profitabilityProducts.slice(3, 4) },
  { region: "Mexico", flag: "🇲🇽", products: profitabilityProducts.slice(4, 5) },
];

export function RegionalProductTable({ searchValue = "", sortField = null, sortDirection = "asc" }: RegionalProductTableProps) {
  const { formatCurrency } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const allProducts = regionAssignments.flatMap((ra) =>
    ra.products.map((p) => ({ ...p, regionName: ra.region, regionFlag: ra.flag }))
  );

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sorted = sortData(filtered, sortField, sortDirection);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totals = filtered.reduce(
    (acc, p) => ({
      units: acc.units + p.units,
      gmv: acc.gmv + p.gmv,
      authSales: acc.authSales + p.authSales,
      adSpend: acc.adSpend + p.adSpend,
      netProfit: acc.netProfit + p.netProfit,
    }),
    { units: 0, gmv: 0, authSales: 0, adSpend: 0, netProfit: 0 }
  );
  const totalMargin = totals.gmv > 0 ? (totals.netProfit / totals.gmv) * 100 : 0;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="sticky left-0 z-20 bg-muted min-w-[300px] border-r border-border">Product Details</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">GMV</TableHead>
              <TableHead className="text-right">Auth Sales</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Net Profit</TableHead>
              <TableHead className="text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((product) => {
              const margin = product.gmv > 0 ? (product.netProfit / product.gmv) * 100 : 0;
              return (
                <TableRow key={product.id} className="hover:bg-muted/30 group">
                  <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors border-r border-border">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.regionFlag} {product.regionName}</span>
                          <span>•</span>
                          <span>{product.itemId}</span>
                          <span>•</span>
                          <span>{product.sku}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-foreground">{formatNumber(product.units)}</TableCell>
                  <TableCell className="text-right text-foreground">{formatCurrency(product.gmv)}</TableCell>
                  <TableCell className="text-right text-foreground">{formatCurrency(product.authSales)}</TableCell>
                  <TableCell className="text-right text-foreground">{formatCurrency(product.adSpend)}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">{formatCurrency(product.netProfit)}</TableCell>
                  <TableCell className="text-right text-foreground">{margin.toFixed(1)}%</TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell className="sticky left-0 z-10 bg-muted border-r border-border font-semibold">Total ({filtered.length} products)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(totals.units)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.gmv)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.authSales)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.adSpend)}</TableCell>
              <TableCell className="text-right font-medium text-foreground">{formatCurrency(totals.netProfit)}</TableCell>
              <TableCell className="text-right text-foreground">{totalMargin.toFixed(1)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filtered.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
