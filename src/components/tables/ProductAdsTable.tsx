import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status/StatusBadge";
import { mockProductAds, productAdsTotals } from "@/data/mockProductAds";
import { cn } from "@/lib/utils";

interface ProductAdsTableProps {
  searchQuery?: string;
}

export function ProductAdsTable({ searchQuery = "" }: ProductAdsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredAds = mockProductAds.filter((ad) =>
    ad.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.itemId.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedRows.size === filteredAds.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAds.map((a) => a.id)));
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
                  checked={selectedRows.size === filteredAds.length && filteredAds.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="min-w-[300px]">Product Ad</TableHead>
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
              <TableRow
                key={ad.id}
                className={cn(
                  "transition-colors",
                  selectedRows.has(ad.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(ad.id)}
                    onCheckedChange={() => toggleRow(ad.id)}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge status={ad.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={ad.productImage}
                      alt={ad.productName}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{ad.productName}</span>
                      <span className="text-xs text-muted-foreground">
                        {ad.itemId} · {ad.sku}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{ad.adGroupName}</TableCell>
                <TableCell className="text-foreground">{ad.campaignName}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={ad.bidAutomation} disabled />
                </TableCell>
                <TableCell className="text-right">{formatCurrency(ad.minBid)}</TableCell>
                <TableCell className="text-right">{formatCurrency(ad.maxBid)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(ad.productBid)}</TableCell>
                <TableCell className="text-right">{formatNumber(ad.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(ad.clicks)}</TableCell>
                <TableCell className="text-right">{formatPercent(ad.ctr)}</TableCell>
                <TableCell className="text-right">{formatNumber(ad.adUnits)}</TableCell>
                <TableCell className="text-right">{formatPercent(ad.cvr)}</TableCell>
                <TableCell className="text-right">{formatCurrency(ad.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(ad.adSpend)}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={5} className="font-semibold">
                Total ({filteredAds.length} product ads)
              </TableCell>
              <TableCell colSpan={4}></TableCell>
              <TableCell className="text-right">{formatNumber(productAdsTotals.impressions)}</TableCell>
              <TableCell className="text-right">{formatNumber(productAdsTotals.clicks)}</TableCell>
              <TableCell className="text-right">{formatPercent(productAdsTotals.ctr)}</TableCell>
              <TableCell className="text-right">{formatNumber(productAdsTotals.adUnits)}</TableCell>
              <TableCell className="text-right">{formatPercent(productAdsTotals.cvr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(productAdsTotals.cpc)}</TableCell>
              <TableCell className="text-right">{formatCurrency(productAdsTotals.adSpend)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
