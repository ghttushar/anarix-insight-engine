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
import { mockKeywords, keywordsTotals } from "@/data/mockKeywords";
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";

interface KeywordTargetingTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

const matchTypeColors: Record<string, string> = {
  broad: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  exact: "bg-green-500/10 text-green-600 border-green-500/20",
  phrase: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function KeywordTargetingTable({ searchQuery = "", showDeltas = false }: KeywordTargetingTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredKeywords = mockKeywords.filter((kw) =>
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.adGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedKeywords = filteredKeywords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
              <TableHead className="min-w-[200px] sticky left-[96px] z-10 bg-muted">Keyword</TableHead>
              <TableHead className="w-24">Match Type</TableHead>
              <TableHead className="min-w-[150px]">Ad Group</TableHead>
              <TableHead className="min-w-[180px]">Campaign</TableHead>
              <TableHead className="text-center">Bid Auto</TableHead>
              <TableHead className="text-right">Min Bid</TableHead>
              <TableHead className="text-right">Max Bid</TableHead>
              <TableHead className="text-right">Bid</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Ad Units</TableHead>
              <TableHead className="text-right">CVR</TableHead>
              <TableHead className="text-right">CPC</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedKeywords.map((keyword) => (
              <TableRow key={keyword.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors"><StatusBadge status={keyword.status} /></TableCell>
                <TableCell className="font-medium text-foreground sticky left-[96px] z-10 bg-background group-hover:bg-muted transition-colors">{keyword.keyword}</TableCell>
                <TableCell><Badge variant="outline" className={cn("text-xs uppercase", matchTypeColors[keyword.matchType])}>{keyword.matchType}</Badge></TableCell>
                <TableCell className="text-foreground">{keyword.adGroupName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", keyword.campaignType === "auto" ? "border-primary/30 bg-primary/5 text-primary" : "border-secondary/30 bg-secondary/5 text-secondary-foreground")}>
                      {keyword.campaignType === "auto" ? "Auto" : "Manual"}
                    </Badge>
                    <span className="text-foreground">{keyword.campaignName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center"><Switch checked={keyword.bidAutomation} disabled /></TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(keyword.minBid)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(keyword.maxBid)}</TableCell>
                <TableCell className="text-right font-medium text-foreground">{formatCurrency(keyword.bid)}</TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(keyword.impressions)} id={keyword.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(keyword.clicks)} id={keyword.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(keyword.ctr)} id={keyword.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(keyword.adUnits)} id={keyword.id} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(keyword.cvr)} id={keyword.id} metric="cvr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(keyword.cpc)} id={keyword.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(keyword.adSpend)} id={keyword.id} metric="adSpend" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={9} className="font-semibold">Total ({filteredKeywords.length} keywords)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(keywordsTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(keywordsTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(keywordsTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(keywordsTotals.adUnits)} metric="adUnits" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(keywordsTotals.cvr)} metric="cvr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(keywordsTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(keywordsTotals.adSpend)} metric="adSpend" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredKeywords.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
