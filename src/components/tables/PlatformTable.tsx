import { useCurrency } from "@/contexts/CurrencyContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { mockPlatforms, platformsTotals } from "@/data/mockPageTypePlatform";

interface PlatformTableProps {
  searchQuery?: string;
}

export function PlatformTable({ searchQuery = "" }: PlatformTableProps) {
  const [bidModifiers, setBidModifiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockPlatforms.forEach((p) => { initial[p.id] = p.bidModifier; });
    return initial;
  });

  const filteredPlatforms = mockPlatforms.filter((p) =>
    p.platform.toLowerCase().includes(searchQuery.toLowerCase())
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
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="min-w-[150px]">Platform</TableHead>
              <TableHead className="w-32 text-right">Bid Modifier %</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">CPC</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Ad Sales</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">ACOS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlatforms.map((platform) => (
              <TableRow key={platform.id}>
                <TableCell className="font-medium text-foreground">{platform.platform}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Input type="number" value={bidModifiers[platform.id]} onChange={(e) => setBidModifiers((prev) => ({ ...prev, [platform.id]: parseInt(e.target.value) || 0 }))} className="h-8 w-20 text-right" min={0} max={1000} />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(platform.impressions)} id={platform.id} metric="impressions" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatNumber(platform.clicks)} id={platform.id} metric="clicks" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(platform.ctr)} id={platform.id} metric="ctr" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(platform.cpc)} id={platform.id} metric="cpc" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(platform.adSpend)} id={platform.id} metric="adSpend" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatCurrency(platform.adSales)} id={platform.id} metric="adSales" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={platform.roas.toFixed(2)} id={platform.id} metric="roas" /></TableCell>
                <TableCell className="text-right"><NumCell formatted={formatPercent(platform.acos)} id={platform.id} metric="acos" /></TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={2} className="font-semibold">Total ({filteredPlatforms.length} platforms)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(platformsTotals.impressions)}</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(platformsTotals.clicks)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(platformsTotals.ctr)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(platformsTotals.cpc)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(platformsTotals.adSpend)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(platformsTotals.adSales)}</TableCell>
              <TableCell className="text-right text-foreground">{platformsTotals.roas.toFixed(2)}</TableCell>
              <TableCell className="text-right text-foreground">{formatPercent(platformsTotals.acos)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}