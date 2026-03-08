import { useCurrency } from "@/contexts/CurrencyContext";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockProductTargets, productTargetsTotals } from "@/data/mockProductTargeting";
import { cn } from "@/lib/utils";

interface ProductTargetingTableProps {
  searchQuery?: string;
}

const targetTypeColors: Record<string, string> = {
  asin: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  category: "bg-teal-500/10 text-teal-600 border-teal-500/20",
};

export function ProductTargetingTable({ searchQuery = "" }: ProductTargetingTableProps) {
  const filteredTargets = mockProductTargets.filter((pt) =>
    pt.targetLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.targetValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.adGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
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
              <TableHead className="min-w-[220px]">Target</TableHead>
              <TableHead className="w-24">Type</TableHead>
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
              <TableHead className="text-right">Ad Sales</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">ACOS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTargets.map((target) => (
              <TableRow key={target.id}>
                <TableCell><StatusBadge status={target.status} /></TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{target.targetLabel}</span>
                    <span className="text-xs text-muted-foreground">{target.targetValue}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs uppercase", targetTypeColors[target.targetType])}>
                    {target.targetType}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">{target.adGroupName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-secondary/30 bg-secondary/5 text-secondary-foreground">
                      Manual
                    </Badge>
                    <span className="text-foreground">{target.campaignName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center"><Switch checked={target.bidAutomation} disabled /></TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(target.minBid)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(target.maxBid)}</TableCell>
                <TableCell className="text-right font-medium text-foreground">{formatCurrency(target.targetBid)}</TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(target.impressions)} id={target.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(target.clicks)} id={target.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(target.ctr)} id={target.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(target.adUnits)} id={target.id} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(target.cvr)} id={target.id} metric="cvr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(target.cpc)} id={target.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(target.adSpend)} id={target.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(target.adSales)} id={target.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={productTargetsTotals.roas ? target.roas.toFixed(2) : "0.00"} id={target.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(target.acos)} id={target.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={9} className="font-semibold">Total ({filteredTargets.length} targets)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(productTargetsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(productTargetsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(productTargetsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(productTargetsTotals.adUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(productTargetsTotals.cvr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(productTargetsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(productTargetsTotals.adSpend)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(productTargetsTotals.adSales)}</TableCell>
              <TableCell className="text-right text-foreground">{productTargetsTotals.roas.toFixed(2)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(productTargetsTotals.acos)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
