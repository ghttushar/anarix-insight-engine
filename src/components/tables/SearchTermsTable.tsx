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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchTermsTableProps {
  searchQuery?: string;
}

const matchTypeColors: Record<string, string> = {
  broad: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  exact: "bg-green-500/10 text-green-600 border-green-500/20",
  phrase: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function SearchTermsTable({ searchQuery = "" }: SearchTermsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTerms = mockSearchTerms.filter((term) =>
    term.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTerms.length / rowsPerPage);
  const paginatedTerms = filteredTerms.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, filteredTerms.length);

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
      <DeltaBadge value={getDelta(id, metric)} />
    </div>
  );

  return (
    <div className="rounded-lg border border-border">
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
              <TableCell className="text-right text-foreground">{formatNumber(searchTermsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(searchTermsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(searchTermsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(searchTermsTotals.adUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(searchTermsTotals.cvr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(searchTermsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(searchTermsTotals.adSpend)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(searchTermsTotals.adSpend * 3.8)}</TableCell>
              <TableCell className="text-right text-foreground">{(3.8).toFixed(2)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(26.3)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="h-7 w-[65px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{startRow}-{endRow} of {filteredTerms.length}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
