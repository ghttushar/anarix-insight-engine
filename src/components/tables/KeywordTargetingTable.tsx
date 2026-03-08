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

interface KeywordTargetingTableProps {
  searchQuery?: string;
}

const matchTypeColors: Record<string, string> = {
  broad: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  exact: "bg-green-500/10 text-green-600 border-green-500/20",
  phrase: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function KeywordTargetingTable({ searchQuery = "" }: KeywordTargetingTableProps) {
  const filteredKeywords = mockKeywords.filter((kw) =>
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.adGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="min-w-[200px]">Keyword</TableHead>
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
            {filteredKeywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell><StatusBadge status={keyword.status} /></TableCell>
                <TableCell className="font-medium text-foreground">{keyword.keyword}</TableCell>
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
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={9} className="font-semibold">Total ({filteredKeywords.length} keywords)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(keywordsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(keywordsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(keywordsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(keywordsTotals.adUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(keywordsTotals.cvr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(keywordsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(keywordsTotals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}