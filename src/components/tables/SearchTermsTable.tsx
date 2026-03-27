import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockSearchTerms, searchTermsTotals } from "@/data/mockSearchTerms";
import { cn } from "@/lib/utils";
import { TablePagination } from "./TablePagination";

interface SearchTermsTableProps {
  searchQuery?: string;
  showDeltas?: boolean;
}

const matchTypeColors: Record<string, string> = {
  broad: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  exact: "bg-green-500/10 text-green-600 border-green-500/20",
  phrase: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function SearchTermsTable({ searchQuery = "", showDeltas = false }: SearchTermsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredTerms = mockSearchTerms.filter((term) =>
    term.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTerms = filteredTerms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginatedTerms.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedTerms.map((t) => t.id)));
    }
  };

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
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-10 sticky left-0 z-10 bg-muted">
                <Checkbox checked={selectedRows.size === paginatedTerms.length && paginatedTerms.length > 0} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead className="min-w-[200px] sticky left-[40px] z-10 bg-muted">Search Term</TableHead>
              <TableHead className="min-w-[150px]">Keyword</TableHead>
              <TableHead className="w-24">Match Type</TableHead>
              <TableHead className="min-w-[150px]">Ad Group</TableHead>
              <TableHead className="min-w-[180px]">Campaign</TableHead>
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
            {paginatedTerms.map((term) => (
              <TableRow key={term.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted transition-colors">
                  <Checkbox checked={selectedRows.has(term.id)} onCheckedChange={() => toggleRow(term.id)} />
                </TableCell>
                <TableCell className="font-medium text-foreground sticky left-[40px] z-10 bg-background group-hover:bg-muted transition-colors">{term.searchTerm}</TableCell>
                <TableCell className="text-foreground">{term.keyword}</TableCell>
                <TableCell><Badge variant="outline" className={cn("text-xs uppercase", matchTypeColors[term.matchType])}>{term.matchType}</Badge></TableCell>
                <TableCell className="text-foreground">{term.adGroupName}</TableCell>
                <TableCell className="text-foreground">{term.campaignName}</TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(term.impressions)} id={term.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(term.clicks)} id={term.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(term.ctr)} id={term.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(term.adUnits)} id={term.id} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(term.cvr)} id={term.id} metric="cvr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(term.cpc)} id={term.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(term.adSpend)} id={term.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(term.adSpend * 3.8)} id={term.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={(3.8).toFixed(2)} id={term.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(26.3)} id={term.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell colSpan={6} className="font-semibold">Total ({filteredTerms.length} search terms)</TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(searchTermsTotals.impressions)} metric="impressions" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(searchTermsTotals.clicks)} metric="clicks" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(searchTermsTotals.ctr)} metric="ctr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatNumber(searchTermsTotals.adUnits)} metric="adUnits" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(searchTermsTotals.cvr)} metric="cvr" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(searchTermsTotals.cpc)} metric="cpc" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(searchTermsTotals.adSpend)} metric="adSpend" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatCurrency(searchTermsTotals.adSpend * 3.8)} metric="adSales" /></TableCell>
              <TableCell className="text-right"><TotalCell value={(3.8).toFixed(2)} metric="roas" /></TableCell>
              <TableCell className="text-right"><TotalCell value={formatPercent(26.3)} metric="acos" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredTerms.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
