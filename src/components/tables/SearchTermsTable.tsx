import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockSearchTerms, searchTermsTotals } from "@/data/mockSearchTerms";
import { cn } from "@/lib/utils";

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

  const filteredTerms = mockSearchTerms.filter((term) =>
    term.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === filteredTerms.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredTerms.map((t) => t.id)));
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedRows.size === filteredTerms.length && filteredTerms.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">Search Term</TableHead>
              <TableHead className="min-w-[250px]">Product Ad</TableHead>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTerms.map((term) => (
              <TableRow
                key={term.id}
                className={cn(
                  "transition-colors",
                  selectedRows.has(term.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(term.id)}
                    onCheckedChange={() => toggleRow(term.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{term.searchTerm}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={term.productImage}
                      alt={term.productName}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{term.productName}</span>
                      <span className="text-xs text-muted-foreground">{term.itemId}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{term.keyword}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs uppercase", matchTypeColors[term.matchType])}
                  >
                    {term.matchType}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{term.adGroupName}</TableCell>
                <TableCell className="text-muted-foreground">{term.campaignName}</TableCell>
                <TableCell className="text-right">{formatNumber(term.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(term.clicks)}</TableCell>
                <TableCell className="text-right">{formatPercent(term.ctr)}</TableCell>
                <TableCell className="text-right">{formatNumber(term.adUnits)}</TableCell>
                <TableCell className="text-right">{formatPercent(term.cvr)}</TableCell>
                <TableCell className="text-right">{formatCurrency(term.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(term.adSpend)}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={7} className="font-semibold">
                Total ({filteredTerms.length} search terms)
              </TableCell>
              <TableCell className="text-right">{formatNumber(searchTermsTotals.impressions)}</TableCell>
              <TableCell className="text-right">{formatNumber(searchTermsTotals.clicks)}</TableCell>
              <TableCell className="text-right">{formatPercent(searchTermsTotals.ctr)}</TableCell>
              <TableCell className="text-right">{formatNumber(searchTermsTotals.adUnits)}</TableCell>
              <TableCell className="text-right">{formatPercent(searchTermsTotals.cvr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(searchTermsTotals.cpc)}</TableCell>
              <TableCell className="text-right">{formatCurrency(searchTermsTotals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
