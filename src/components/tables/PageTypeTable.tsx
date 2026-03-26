import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockPageTypes, pageTypesTotals } from "@/data/mockPageTypePlatform";
import { TablePagination } from "./TablePagination";

interface PageTypeTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

export function PageTypeTable({ searchQuery = "", showDeltas = false }: PageTypeTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [bidModifiers, setBidModifiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockPageTypes.forEach((pt) => { initial[pt.id] = pt.bidModifier; });
    return initial;
  });

  const filteredTypes = mockPageTypes.filter((pt) =>
    pt.pageType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTypes = filteredTypes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  return (
    <div className="rounded-lg border border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="min-w-[180px]">Page Type</TableHead>
              <TableHead className="w-32 text-right">Bid Modifier %</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">CPC</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Ad Sales</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">ACOS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTypes.map((pageType) => (
              <TableRow key={pageType.id}>
                <TableCell className="font-medium text-foreground">{pageType.pageType}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Input type="number" value={bidModifiers[pageType.id]} onChange={(e) => setBidModifiers((prev) => ({ ...prev, [pageType.id]: parseInt(e.target.value) || 0 }))} className="h-8 w-20 text-right" min={0} max={1000} />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(pageType.impressions)} id={pageType.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(pageType.clicks)} id={pageType.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(pageType.ctr)} id={pageType.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(pageType.cpc)} id={pageType.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(pageType.adSpend)} id={pageType.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(pageType.adSales)} id={pageType.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={pageType.roas.toFixed(2)} id={pageType.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(pageType.acos)} id={pageType.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={2} className="font-semibold">Total ({filteredTypes.length} page types)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(pageTypesTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(pageTypesTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(pageTypesTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(pageTypesTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(pageTypesTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(pageTypesTotals.adSales)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={pageTypesTotals.roas.toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(pageTypesTotals.acos)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredTypes.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
