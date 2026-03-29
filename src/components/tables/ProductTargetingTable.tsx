import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockProductTargets, productTargetsTotals } from "@/data/mockProductTargeting";
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData } from "./SortableTableHead";

interface ProductTargetingTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

const targetTypeColors: Record<string, string> = {
  asin: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  category: "bg-teal-500/10 text-teal-600 border-teal-500/20",
};

export function ProductTargetingTable({ searchQuery = "", showDeltas = false }: ProductTargetingTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set());
  const handlePinToggle = (field: string) => { setPinnedColumns(prev => { const next = new Set(prev); if (next.has(field)) next.delete(field); else next.add(field); return next; }); };

  const filteredTargets = mockProductTargets.filter((pt) =>
    pt.targetLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.targetValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.adGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(filteredTargets, sortField, sortDirection);
  const paginatedTargets = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-24 sticky left-0 z-10 bg-muted">Status</TableHead>
              <SortableTableHead field="targetLabel" {...sp} className="min-w-[220px] sticky left-[96px] z-10 bg-muted">Target</SortableTableHead>
              <TableHead className="w-24">Type</TableHead>
              <SortableTableHead field="adGroupName" {...sp} className="min-w-[150px]">Ad Group</SortableTableHead>
              <SortableTableHead field="campaignName" {...sp} className="min-w-[180px]">Campaign</SortableTableHead>
              <TableHead className="text-center">Bid Auto</TableHead>
              <SortableTableHead field="minBid" {...sp} className="text-right" align="right">Min Bid</SortableTableHead>
              <SortableTableHead field="maxBid" {...sp} className="text-right" align="right">Max Bid</SortableTableHead>
              <SortableTableHead field="targetBid" {...sp} className="text-right" align="right">Bid</SortableTableHead>
              <SortableTableHead field="impressions" {...sp} className="text-right" align="right">Impressions</SortableTableHead>
              <SortableTableHead field="clicks" {...sp} className="text-right" align="right">Clicks</SortableTableHead>
              <SortableTableHead field="ctr" {...sp} className="text-right" align="right">CTR</SortableTableHead>
              <SortableTableHead field="adUnits" {...sp} className="text-right" align="right">Ad Units</SortableTableHead>
              <SortableTableHead field="cvr" {...sp} className="text-right" align="right">CVR</SortableTableHead>
              <SortableTableHead field="cpc" {...sp} className="text-right" align="right">CPC</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className="text-right" align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="adSales" {...sp} className="text-right" align="right">Ad Sales</SortableTableHead>
              <SortableTableHead field="roas" {...sp} className="text-right" align="right">ROAS</SortableTableHead>
              <SortableTableHead field="acos" {...sp} className="text-right" align="right">ACOS</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTargets.map((target) => (
              <TableRow key={target.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors"><StatusBadge status={target.status} /></TableCell>
                <TableCell className="sticky left-[96px] z-10 bg-background group-hover:bg-muted transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{target.targetLabel}</span>
                    <span className="text-xs text-muted-foreground">{target.targetValue}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs uppercase", targetTypeColors[target.targetType])}>
                    {target.targetType}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">{target.adGroupName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-secondary/30 bg-secondary/5 text-secondary-foreground">Manual</Badge>
                    <span className="text-foreground">{target.campaignName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center"><Switch checked={target.bidAutomation} disabled /></TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(target.minBid)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(target.maxBid)}</TableCell>
                <TableCell className="text-right font-medium text-foreground">{formatCurrency(target.targetBid)}</TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(target.impressions)} id={target.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(target.clicks)} id={target.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(target.ctr)} id={target.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(target.adUnits)} id={target.id} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(target.cvr)} id={target.id} metric="cvr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(target.cpc)} id={target.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(target.adSpend)} id={target.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(target.adSales)} id={target.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={target.roas.toFixed(2)} id={target.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(target.acos)} id={target.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={9} className="font-semibold">Total ({filteredTargets.length} targets)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(productTargetsTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(productTargetsTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(productTargetsTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(productTargetsTotals.adUnits)} metric="adUnits" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(productTargetsTotals.cvr)} metric="cvr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(productTargetsTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(productTargetsTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(productTargetsTotals.adSales)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={productTargetsTotals.roas.toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(productTargetsTotals.acos)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredTargets.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
