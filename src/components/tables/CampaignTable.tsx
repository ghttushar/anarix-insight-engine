import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Campaign } from "@/types/campaign";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { CampaignTablePagination } from "./CampaignTablePagination";
import { CampaignTableTotalRow } from "./CampaignTableTotalRow";

interface CampaignTableProps {
  campaigns: Campaign[];
  onActiveToggle?: (id: string, isActive: boolean) => void;
  showTotalBudget?: boolean;
  searchQuery?: string;
}

type SortField = keyof Campaign | null;
type SortDirection = "asc" | "desc";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function CampaignTable({
  campaigns,
  onActiveToggle,
  showTotalBudget = true,
  searchQuery = "",
}: CampaignTableProps) {
  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredCampaigns.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCampaigns.length / pageSize);
  const paginatedCampaigns = sortedCampaigns.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === "asc"
      ? <ArrowUp className="h-4 w-4 text-primary" />
      : <ArrowDown className="h-4 w-4 text-primary" />;
  };

  const allSelected = filteredCampaigns.length > 0 && selectedIds.size === filteredCampaigns.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredCampaigns.length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                />
              </TableHead>
              <TableHead className="w-16">Active</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Campaign Name <SortIcon field="name" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("dailyBudget")}>
                <div className="flex items-center justify-end gap-1">Daily Budget <SortIcon field="dailyBudget" /></div>
              </TableHead>
              {showTotalBudget && (
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("totalBudget")}>
                  <div className="flex items-center justify-end gap-1">Total Budget <SortIcon field="totalBudget" /></div>
                </TableHead>
              )}
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("spend")}>
                <div className="flex items-center justify-end gap-1">Spend <SortIcon field="spend" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("sales")}>
                <div className="flex items-center justify-end gap-1">Sales <SortIcon field="sales" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("roas")}>
                <div className="flex items-center justify-end gap-1">ROAS <SortIcon field="roas" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("impressions")}>
                <div className="flex items-center justify-end gap-1">Impressions <SortIcon field="impressions" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("clicks")}>
                <div className="flex items-center justify-end gap-1">Clicks <SortIcon field="clicks" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("ctr")}>
                <div className="flex items-center justify-end gap-1">CTR <SortIcon field="ctr" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("acos")}>
                <div className="flex items-center justify-end gap-1">ACOS <SortIcon field="acos" /></div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                className={cn(selectedIds.has(campaign.id) && "bg-primary/5")}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(campaign.id)}
                    onCheckedChange={(checked) => handleSelectOne(campaign.id, checked as boolean)}
                    aria-label={`Select ${campaign.name}`}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={campaign.isActive}
                    onCheckedChange={(checked) => onActiveToggle?.(campaign.id, checked)}
                    disabled={campaign.status === "archived" || campaign.status === "completed"}
                  />
                </TableCell>
                <TableCell><StatusBadge status={campaign.status} /></TableCell>
                <TableCell className="font-medium text-foreground">{campaign.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatCurrency(campaign.dailyBudget)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'dailyBudget')} />
                  </div>
                </TableCell>
                {showTotalBudget && (
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-foreground">{campaign.totalBudget ? formatCurrency(campaign.totalBudget) : "—"}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatCurrency(campaign.spend)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'spend')} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatCurrency(campaign.sales)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'sales')} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{campaign.roas.toFixed(2)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'roas')} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatNumber(campaign.impressions)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'impressions')} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatNumber(campaign.clicks)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'clicks')} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatPercent(campaign.ctr)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'ctr')} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-foreground">{formatPercent(campaign.acos)}</span>
                    <DeltaBadge value={getDelta(campaign.id, 'acos')} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <CampaignTableTotalRow campaigns={campaigns} showTotalBudget={showTotalBudget} />
          </TableBody>
        </Table>
      </div>
      
      <CampaignTablePagination
        page={page}
        pageSize={pageSize}
        totalItems={campaigns.length}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      />
    </div>
  );
}
