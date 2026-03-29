import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Brand } from "@/types/bi";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData } from "@/components/tables/SortableTableHead";

interface BrandCoverageTableProps {
  brands: Brand[];
  onViewTrend?: (brandId: string) => void;
}

export function BrandCoverageTable({ brands, onViewTrend }: BrandCoverageTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set());
  const handlePinToggle = (field: string) => { setPinnedColumns(prev => { const next = new Set(prev); if (next.has(field)) next.delete(field); else next.add(field); return next; }); };

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(brands, sortField, sortDirection);
  const paginatedBrands = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const sp = { sortField, sortDirection, onSort: handleSort };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <SortableTableHead field="id" {...sp} className="w-[60px]">SI No</SortableTableHead>
            <SortableTableHead field="name" {...sp}>Brand</SortableTableHead>
            <SortableTableHead field="productCount" {...sp} className="text-right" align="right">Product Count</SortableTableHead>
            <SortableTableHead field="appearance" {...sp} className="text-right" align="right">Appearance(%)</SortableTableHead>
            <SortableTableHead field="organicSOV" {...sp} className="text-right" align="right">Organic SOV(%)</SortableTableHead>
            <SortableTableHead field="sponsoredSOV" {...sp} className="text-right" align="right">Sponsored SOV(%)</SortableTableHead>
            <SortableTableHead field="totalSOV" {...sp} className="text-right" align="right">Total SOV(%)</SortableTableHead>
            <SortableTableHead field="viewTrend" {...sp} className="text-center w-[100px]" align="center">View Trend</SortableTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBrands.map((brand, index) => (
            <TableRow key={brand.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{(currentPage - 1) * pageSize + index + 1}</TableCell>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell className="text-right">{brand.productCount}</TableCell>
              <TableCell className="text-right">{brand.appearance.toFixed(1)}%</TableCell>
              <TableCell className="text-right">{brand.organicSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-right">{brand.sponsoredSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-right font-medium">{brand.totalSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="sm" onClick={() => onViewTrend?.(brand.id)} className="h-8 text-primary hover:text-primary/80">
                  <TrendingUp className="h-4 w-4 mr-1" />View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={brands.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
