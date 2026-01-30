import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredKeywords = mockKeywords.filter((kw) =>
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.adGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kw.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedRows.size === filteredKeywords.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredKeywords.map((k) => k.id)));
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
                  checked={selectedRows.size === filteredKeywords.length && filteredKeywords.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
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
              <TableRow
                key={keyword.id}
                className={cn(
                  "transition-colors",
                  selectedRows.has(keyword.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(keyword.id)}
                    onCheckedChange={() => toggleRow(keyword.id)}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge status={keyword.status} />
                </TableCell>
                <TableCell className="font-medium">{keyword.keyword}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs uppercase", matchTypeColors[keyword.matchType])}
                  >
                    {keyword.matchType}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{keyword.adGroupName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        keyword.campaignType === "auto"
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-secondary/30 bg-secondary/5 text-secondary-foreground"
                      )}
                    >
                      {keyword.campaignType === "auto" ? "Auto" : "Manual"}
                    </Badge>
                    <span className="text-muted-foreground">{keyword.campaignName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={keyword.bidAutomation} disabled />
                </TableCell>
                <TableCell className="text-right">{formatCurrency(keyword.minBid)}</TableCell>
                <TableCell className="text-right">{formatCurrency(keyword.maxBid)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(keyword.bid)}</TableCell>
                <TableCell className="text-right">{formatNumber(keyword.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(keyword.clicks)}</TableCell>
                <TableCell className="text-right">{formatPercent(keyword.ctr)}</TableCell>
                <TableCell className="text-right">{formatNumber(keyword.adUnits)}</TableCell>
                <TableCell className="text-right">{formatPercent(keyword.cvr)}</TableCell>
                <TableCell className="text-right">{formatCurrency(keyword.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(keyword.adSpend)}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={6} className="font-semibold">
                Total ({filteredKeywords.length} keywords)
              </TableCell>
              <TableCell colSpan={4}></TableCell>
              <TableCell className="text-right">{formatNumber(keywordsTotals.impressions)}</TableCell>
              <TableCell className="text-right">{formatNumber(keywordsTotals.clicks)}</TableCell>
              <TableCell className="text-right">{formatPercent(keywordsTotals.ctr)}</TableCell>
              <TableCell className="text-right">{formatNumber(keywordsTotals.adUnits)}</TableCell>
              <TableCell className="text-right">{formatPercent(keywordsTotals.cvr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(keywordsTotals.cpc)}</TableCell>
              <TableCell className="text-right">{formatCurrency(keywordsTotals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
