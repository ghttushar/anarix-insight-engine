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
import { mockPageTypes, pageTypesTotals } from "@/data/mockPageTypePlatform";
import { cn } from "@/lib/utils";

interface PageTypeTableProps {
  searchQuery?: string;
}

export function PageTypeTable({ searchQuery = "" }: PageTypeTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bidModifiers, setBidModifiers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockPageTypes.forEach((pt) => {
      initial[pt.id] = pt.bidModifier;
    });
    return initial;
  });

  const filteredTypes = mockPageTypes.filter((pt) =>
    pt.pageType.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedRows.size === filteredTypes.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredTypes.map((pt) => pt.id)));
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
                  checked={selectedRows.size === filteredTypes.length && filteredTypes.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="min-w-[180px]">Page Type</TableHead>
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
            {filteredTypes.map((pageType) => (
              <TableRow
                key={pageType.id}
                className={cn(
                  "transition-colors",
                  selectedRows.has(pageType.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(pageType.id)}
                    onCheckedChange={() => toggleRow(pageType.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{pageType.pageType}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Input
                      type="number"
                      value={bidModifiers[pageType.id]}
                      onChange={(e) =>
                        setBidModifiers((prev) => ({
                          ...prev,
                          [pageType.id]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="h-8 w-20 text-right"
                      min={0}
                      max={1000}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatNumber(pageType.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(pageType.clicks)}</TableCell>
                <TableCell className="text-right">{formatPercent(pageType.ctr)}</TableCell>
                <TableCell className="text-right">{formatCurrency(pageType.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(pageType.adSpend)}</TableCell>
                <TableCell className="text-right">{formatCurrency(pageType.adSales)}</TableCell>
                <TableCell className="text-right font-medium">{pageType.roas.toFixed(2)}</TableCell>
                <TableCell className="text-right">{formatPercent(pageType.acos)}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={3} className="font-semibold">
                Total ({filteredTypes.length} page types)
              </TableCell>
              <TableCell className="text-right">{formatNumber(pageTypesTotals.impressions)}</TableCell>
              <TableCell className="text-right">{formatNumber(pageTypesTotals.clicks)}</TableCell>
              <TableCell className="text-right">{formatPercent(pageTypesTotals.ctr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(pageTypesTotals.cpc)}</TableCell>
              <TableCell className="text-right">{formatCurrency(pageTypesTotals.adSpend)}</TableCell>
              <TableCell className="text-right">{formatCurrency(pageTypesTotals.adSales)}</TableCell>
              <TableCell className="text-right">{pageTypesTotals.roas.toFixed(2)}</TableCell>
              <TableCell className="text-right">{formatPercent(pageTypesTotals.acos)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
