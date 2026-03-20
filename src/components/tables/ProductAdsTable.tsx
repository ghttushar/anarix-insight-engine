import { useCurrency } from "@/contexts/CurrencyContext";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockProductAds, productAdsTotals } from "@/data/mockProductAds";

interface ProductAdsTableProps {
  searchQuery?: string;
}

export function ProductAdsTable({ searchQuery = "" }: ProductAdsTableProps) {
  const filteredAds = mockProductAds.filter((ad) =>
    ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.itemId.toLowerCase().includes(searchQuery.toLowerCase())
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
              <TableHead className="w-24 sticky left-0 z-10 bg-muted/30">Status</TableHead>
              <TableHead className="min-w-[300px] sticky left-[96px] z-10 bg-muted/30">Product Ad</TableHead>
              <TableHead className="min-w-[150px]">Ad Group</TableHead>
              <TableHead className="min-w-[150px]">Campaign</TableHead>
              <TableHead className="text-center">Bid Auto</TableHead>
              <TableHead className="text-right">Min Bid</TableHead>
              <TableHead className="text-right">Max Bid</TableHead>
              <TableHead className="text-right">Product Bid</TableHead>
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
            {filteredAds.map((ad) => (
              <TableRow key={ad.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-10 bg-background"><StatusBadge status={ad.status} /></TableCell>
                <TableCell className="sticky left-[96px] z-10 bg-background">
                  <div className="flex items-center gap-3">
                    <img src={ad.productImage} alt={ad.productName} className="h-10 w-10 rounded-md object-cover" />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{ad.productName}</span>
                      <span className="text-xs text-muted-foreground">{ad.itemId} · {ad.sku}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{ad.adGroupName}</TableCell>
                <TableCell className="text-foreground">{ad.campaignName}</TableCell>
                <TableCell className="text-center"><Switch checked={ad.bidAutomation} disabled /></TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(ad.minBid)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(ad.maxBid)}</TableCell>
                <TableCell className="text-right font-medium text-foreground">{formatCurrency(ad.productBid)}</TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(ad.impressions)} id={ad.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(ad.clicks)} id={ad.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(ad.ctr)} id={ad.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(ad.adUnits)} id={ad.id} metric="adUnits" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(ad.cvr)} id={ad.id} metric="cvr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(ad.cpc)} id={ad.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(ad.adSpend)} id={ad.id} metric="adSpend" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={8} className="font-semibold">Total ({filteredAds.length} product ads)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(productAdsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(productAdsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(productAdsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(productAdsTotals.adUnits)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(productAdsTotals.cvr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(productAdsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(productAdsTotals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}