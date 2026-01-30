import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPlatforms, platformsTotals } from "@/data/mockPageTypePlatform";
import { cn } from "@/lib/utils";

interface PlatformTableProps {
  searchQuery?: string;
}

export function PlatformTable({ searchQuery = "" }: PlatformTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bidModifiers, setBidModifiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockPlatforms.forEach((p) => {
      initial[p.id] = p.bidModifier;
    });
    return initial;
  });

  const filteredPlatforms = mockPlatforms.filter((p) =>
    p.platform.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedRows.size === filteredPlatforms.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredPlatforms.map((p) => p.id)));
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
                  checked={selectedRows.size === filteredPlatforms.length && filteredPlatforms.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
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
              <TableRow
                key={platform.id}
                className={cn(
                  "transition-colors",
                  selectedRows.has(platform.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(platform.id)}
                    onCheckedChange={() => toggleRow(platform.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{platform.platform}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Input
                      type="number"
                      value={bidModifiers[platform.id]}
                      onChange={(e) =>
                        setBidModifiers((prev) => ({
                          ...prev,
                          [platform.id]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="h-8 w-20 text-right"
                      min={0}
                      max={1000}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatNumber(platform.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(platform.clicks)}</TableCell>
                <TableCell className="text-right">{formatPercent(platform.ctr)}</TableCell>
                <TableCell className="text-right">{formatCurrency(platform.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(platform.adSpend)}</TableCell>
                <TableCell className="text-right">{formatCurrency(platform.adSales)}</TableCell>
                <TableCell className="text-right font-medium">{platform.roas.toFixed(2)}</TableCell>
                <TableCell className="text-right">{formatPercent(platform.acos)}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={3} className="font-semibold">
                Total ({filteredPlatforms.length} platforms)
              </TableCell>
              <TableCell className="text-right">{formatNumber(platformsTotals.impressions)}</TableCell>
              <TableCell className="text-right">{formatNumber(platformsTotals.clicks)}</TableCell>
              <TableCell className="text-right">{formatPercent(platformsTotals.ctr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(platformsTotals.cpc)}</TableCell>
              <TableCell className="text-right">{formatCurrency(platformsTotals.adSpend)}</TableCell>
              <TableCell className="text-right">{formatCurrency(platformsTotals.adSales)}</TableCell>
              <TableCell className="text-right">{platformsTotals.roas.toFixed(2)}</TableCell>
              <TableCell className="text-right">{formatPercent(platformsTotals.acos)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
