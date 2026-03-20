import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
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
  const filteredTerms = mockSearchTerms.filter((term) =>
    term.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

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
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="min-w-[200px] sticky left-0 z-10 bg-muted/30">Search Term</TableHead>
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
              <TableRow key={term.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-foreground sticky left-0 z-10 bg-background">{term.searchTerm}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={term.productImage} alt={term.productName} className="h-8 w-8 rounded object-cover" />
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{term.productName}</span>
                      <span className="text-xs text-muted-foreground">{term.itemId}</span>
                    </div>
                  </div>
                </TableCell>
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
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={6} className="font-semibold">Total ({filteredTerms.length} search terms)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(searchTermsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(searchTermsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(searchTermsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(searchTermsTotals.adUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(searchTermsTotals.cvr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(searchTermsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(searchTermsTotals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}