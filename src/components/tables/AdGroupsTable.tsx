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
import { AdGroup } from "@/types/advertising";
import { mockAdGroups, adGroupsTotals } from "@/data/mockAdGroups";
import { cn } from "@/lib/utils";

interface AdGroupsTableProps {
  searchQuery?: string;
}

export function AdGroupsTable({ searchQuery = "" }: AdGroupsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredGroups = mockAdGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (selectedRows.size === filteredGroups.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredGroups.map((g) => g.id)));
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
                  checked={selectedRows.size === filteredGroups.length && filteredGroups.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
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
              <TableRow
                key={group.id}
                className={cn(
                  "transition-colors",
                  selectedRows.has(group.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(group.id)}
                    onCheckedChange={() => toggleRow(group.id)}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge status={group.status} />
                </TableCell>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        group.campaignType === "auto"
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-secondary/30 bg-secondary/5 text-secondary-foreground"
                      )}
                    >
                      {group.campaignType === "auto" ? "Auto" : "Manual"}
                    </Badge>
                    <span className="text-muted-foreground">{group.campaignName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={group.bidAutomation} disabled />
                </TableCell>
                <TableCell className="text-right">{formatCurrency(group.minBid)}</TableCell>
                <TableCell className="text-right">{formatCurrency(group.maxBid)}</TableCell>
                <TableCell className="text-right">{group.targetRoas.toFixed(1)}</TableCell>
                <TableCell className="text-right">{formatNumber(group.impressions)}</TableCell>
                <TableCell className="text-right">{formatNumber(group.clicks)}</TableCell>
                <TableCell className="text-right">{formatPercent(group.ctr)}</TableCell>
                <TableCell className="text-right">{formatNumber(group.adUnits)}</TableCell>
                <TableCell className="text-right">{formatPercent(group.cvr)}</TableCell>
                <TableCell className="text-right">{formatCurrency(group.cpc)}</TableCell>
                <TableCell className="text-right">{formatCurrency(group.adSpend)}</TableCell>
                <TableCell className="text-right">{formatCurrency(group.adSales)}</TableCell>
                <TableCell className="text-right font-medium">{group.roas.toFixed(2)}</TableCell>
                <TableCell className="text-right">{formatPercent(group.acos)}</TableCell>
              </TableRow>
            ))}
            {/* Total Row */}
            <TableRow className="bg-muted/50 font-medium hover:bg-muted/50">
              <TableCell colSpan={4} className="font-semibold">
                Total ({filteredGroups.length} ad groups)
              </TableCell>
              <TableCell colSpan={4}></TableCell>
              <TableCell className="text-right">{formatNumber(adGroupsTotals.impressions)}</TableCell>
              <TableCell className="text-right">{formatNumber(adGroupsTotals.clicks)}</TableCell>
              <TableCell className="text-right">{formatPercent(adGroupsTotals.ctr)}</TableCell>
              <TableCell className="text-right">{formatNumber(adGroupsTotals.adUnits)}</TableCell>
              <TableCell className="text-right">{formatPercent(adGroupsTotals.cvr)}</TableCell>
              <TableCell className="text-right">{formatCurrency(adGroupsTotals.cpc)}</TableCell>
              <TableCell className="text-right">{formatCurrency(adGroupsTotals.adSpend)}</TableCell>
              <TableCell className="text-right">{formatCurrency(adGroupsTotals.adSales)}</TableCell>
              <TableCell className="text-right">{adGroupsTotals.roas.toFixed(2)}</TableCell>
              <TableCell className="text-right">{formatPercent(adGroupsTotals.acos)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
