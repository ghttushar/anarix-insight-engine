import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockAdGroups, adGroupsTotals } from "@/data/mockAdGroups";
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";
import { SortableTableHead, sortData } from "./SortableTableHead";

interface AdGroupsTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
  onRowClick?: (adGroup: typeof import("@/data/mockAdGroups").mockAdGroups[0]) => void;
}

export function AdGroupsTable({ searchQuery = "", showDeltas = false, onRowClick }: AdGroupsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredGroups = mockAdGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sortedGroups = sortData(filteredGroups, sortField, sortDirection);
  const paginatedGroups = sortedGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
              <TableHead className="w-24 sticky left-0 z-10 bg-muted">Status</TableHead>
              <SortableTableHead field="name" {...sp} className="min-w-[200px] sticky left-[96px] z-10 bg-muted">Ad Group</SortableTableHead>
              <SortableTableHead field="campaignName" {...sp} className="min-w-[200px]">Campaign</SortableTableHead>
              <TableHead className="text-center">Bid Auto</TableHead>
              <SortableTableHead field="minBid" {...sp} className="text-right" align="right">Min Bid</SortableTableHead>
              <SortableTableHead field="maxBid" {...sp} className="text-right" align="right">Max Bid</SortableTableHead>
              <SortableTableHead field="targetRoas" {...sp} className="text-right" align="right">Target ROAS</SortableTableHead>
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
            {paginatedGroups.map((group) => (
              <TableRow key={group.id} className="group cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onRowClick?.(group)}>
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors"><StatusBadge status={group.status} /></TableCell>
                <TableCell className="font-medium sticky left-[96px] z-10 bg-background group-hover:bg-muted transition-colors"><span className="text-primary hover:underline">{group.name}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", group.campaignType === "auto" ? "border-primary/30 bg-primary/5 text-primary" : "border-secondary/30 bg-secondary/5 text-secondary-foreground")}>
                      {group.campaignType === "auto" ? "Auto" : "Manual"}
                    </Badge>
                    <span className="text-foreground">{group.campaignName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center"><Switch checked={group.bidAutomation} disabled /></TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(group.minBid)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(group.maxBid)}</TableCell>
                <TableCell className="text-right text-foreground">{group.targetRoas.toFixed(1)}</TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(group.impressions)} id={group.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(group.clicks)} id={group.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(group.ctr)} id={group.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(group.adUnits)} id={group.id} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(group.cvr)} id={group.id} metric="cvr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(group.cpc)} id={group.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(group.adSpend)} id={group.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(group.adSales)} id={group.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={group.roas.toFixed(2)} id={group.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(group.acos)} id={group.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={7} className="font-semibold">Total ({filteredGroups.length} ad groups)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(adGroupsTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(adGroupsTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(adGroupsTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(adGroupsTotals.adUnits)} metric="adUnits" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(adGroupsTotals.cvr)} metric="cvr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(adGroupsTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(adGroupsTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(adGroupsTotals.adSales)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={adGroupsTotals.roas.toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(adGroupsTotals.acos)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredGroups.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
