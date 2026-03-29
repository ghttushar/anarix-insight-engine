import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockPlatforms, platformsTotals } from "@/data/mockPageTypePlatform";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData } from "./SortableTableHead";

interface PlatformTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

export function PlatformTable({ searchQuery = "", showDeltas = false }: PlatformTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [bidModifiers, setBidModifiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockPlatforms.forEach((p) => { initial[p.id] = p.bidModifier; });
    return initial;
  });

  const filteredPlatforms = mockPlatforms.filter((p) =>
    p.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredPlatforms, sortField, sortDirection);
  const paginatedPlatforms = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const NumCell = ({ formatted, id, metric }: { formatted: string; id: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{formatted}</span>
      {showDeltas && <DeltaBadge value={getDelta(id, metric)} />}
    </div>
  );

  const TotalCell = ({ value, metric }: { value: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{value}</span>
      {showDeltas && <DeltaBadge value={getDelta("total", metric)} />}
    </div>
  );

  const sp = { sortField, sortDirection, onSort: handleSort };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <SortableTableHead field="platform" {...sp} className="min-w-[180px]">Platform</SortableTableHead>
              <SortableTableHead field="bidModifier" {...sp} className="w-32 text-right" align="right">Bid Modifier %</SortableTableHead>
              <SortableTableHead field="impressions" {...sp} className="text-right" align="right">Impressions</SortableTableHead>
              <SortableTableHead field="clicks" {...sp} className="text-right" align="right">Clicks</SortableTableHead>
              <SortableTableHead field="ctr" {...sp} className="text-right" align="right">CTR</SortableTableHead>
              <SortableTableHead field="cpc" {...sp} className="text-right" align="right">CPC</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className="text-right" align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="adSales" {...sp} className="text-right" align="right">Ad Sales</SortableTableHead>
              <SortableTableHead field="roas" {...sp} className="text-right" align="right">ROAS</SortableTableHead>
              <SortableTableHead field="acos" {...sp} className="text-right" align="right">ACOS</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlatforms.map((platform) => (
              <TableRow key={platform.id}>
                <TableCell className="font-medium text-foreground">{platform.platform}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Input type="number" value={bidModifiers[platform.id]} onChange={(e) => setBidModifiers((prev) => ({ ...prev, [platform.id]: parseInt(e.target.value) || 0 }))} className="h-8 w-20 text-right" min={0} max={1000} />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(platform.impressions)} id={platform.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(platform.clicks)} id={platform.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(platform.ctr)} id={platform.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(platform.cpc)} id={platform.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(platform.adSpend)} id={platform.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(platform.adSales)} id={platform.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={platform.roas.toFixed(2)} id={platform.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(platform.acos)} id={platform.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={2} className="font-semibold">Total ({filteredPlatforms.length} platforms)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(platformsTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(platformsTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(platformsTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(platformsTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(platformsTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(platformsTotals.adSales)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={platformsTotals.roas.toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(platformsTotals.acos)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filteredPlatforms.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
