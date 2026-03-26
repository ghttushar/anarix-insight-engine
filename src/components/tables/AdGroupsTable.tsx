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

interface AdGroupsTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

export function AdGroupsTable({ searchQuery = "", showDeltas = false }: AdGroupsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredGroups = mockAdGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const paginatedGroups = filteredGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
              <TableHead className="w-24 sticky left-0 z-10 bg-muted">Status</TableHead>
              <TableHead className="min-w-[200px] sticky left-[96px] z-10 bg-muted">Ad Group</TableHead>
              <TableHead className="min-w-[200px]">Campaign</TableHead>
              <TableHead className="text-center">Bid Auto</TableHead>
              <TableHead className="text-right">Min Bid</TableHead>
              <TableHead className="text-right">Max Bid</TableHead>
              <TableHead className="text-right">Target ROAS</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Ad Units</TableHead>
              <TableHead className="text-right">CVR</TableHead>
              <TableHead className="text-right">CPC</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Ad Sales</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">ACOS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGroups.map((group) => (
              <TableRow key={group.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors"><StatusBadge status={group.status} /></TableCell>
                <TableCell className="font-medium sticky left-[96px] z-10 bg-background group-hover:bg-muted transition-colors"><span className="text-primary hover:underline cursor-pointer">{group.name}</span></TableCell>
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
