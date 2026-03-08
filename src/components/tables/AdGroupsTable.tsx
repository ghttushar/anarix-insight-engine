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

interface AdGroupsTableProps {
  searchQuery?: string;
}

export function AdGroupsTable({ searchQuery = "" }: AdGroupsTableProps) {
  const filteredGroups = mockAdGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
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
              <TableHead className="min-w-[200px]">Ad Group</TableHead>
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
            {filteredGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell><StatusBadge status={group.status} /></TableCell>
                <TableCell className="font-medium text-foreground">{group.name}</TableCell>
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
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={7} className="font-semibold">Total ({filteredGroups.length} ad groups)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(adGroupsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(adGroupsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(adGroupsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(adGroupsTotals.adUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(adGroupsTotals.cvr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(adGroupsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(adGroupsTotals.adSpend)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(adGroupsTotals.adSales)}</TableCell>
              <TableCell className="text-right text-foreground">{adGroupsTotals.roas.toFixed(2)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(adGroupsTotals.acos)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}