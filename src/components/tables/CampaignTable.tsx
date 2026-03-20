import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign, BiddingStrategy } from "@/types/campaign";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, CalendarIcon } from "lucide-react";
import { CampaignTablePagination } from "./CampaignTablePagination";
import { CampaignTableTotalRow } from "./CampaignTableTotalRow";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";

interface CampaignTableProps {
  campaigns: Campaign[];
  onActiveToggle?: (id: string, isActive: boolean) => void;
  onCampaignUpdate?: (id: string, updates: Partial<Campaign>) => void;
  showTotalBudget?: boolean;
  searchQuery?: string;
  viewMode?: "view" | "edit";
  onRowClick?: (id: string) => void;
}

type SortField = keyof Campaign | null;
type SortDirection = "asc" | "desc";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

const BIDDING_OPTIONS: BiddingStrategy[] = ["Dynamic Down", "Dynamic Up/Down", "Fixed"];

function parseDateString(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  try {
    return parse(dateStr, "yyyy-MM-dd", new Date());
  } catch {
    return undefined;
  }
}

function DatePickerCell({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value?: string;
  onChange: (date: string | undefined) => void;
  placeholder?: string;
}) {
  const selected = value ? parseDateString(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-8 w-[130px] justify-start text-left text-xs font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1.5 h-3 w-3" />
          {selected ? format(selected, "MMM dd, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : undefined);
          }}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

export function CampaignTable({
  campaigns,
  onActiveToggle,
  onCampaignUpdate,
  showTotalBudget = true,
  searchQuery = "",
  viewMode = "view",
  onRowClick,
}: CampaignTableProps) {
  const { formatCurrency } = useCurrency();
  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isEdit = viewMode === "edit";

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField]; const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    if (typeof aVal === "number" && typeof bVal === "number") return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    return 0;
  });

  const totalPages = Math.ceil(sortedCampaigns.length / pageSize);
  const paginatedCampaigns = sortedCampaigns.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {isEdit && <TableHead className="w-16">Active</TableHead>}
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="min-w-[200px] cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Campaign Name <SortIcon field="name" /></div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
                <div className="flex items-center gap-1">Start Date <SortIcon field="startDate" /></div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("endDate")}>
                <div className="flex items-center gap-1">End Date <SortIcon field="endDate" /></div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("biddingStrategy")}>
                <div className="flex items-center gap-1">Bidding Strategy <SortIcon field="biddingStrategy" /></div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("dailyBudget")}>
                <div className="flex items-center justify-end gap-1">Budget <SortIcon field="dailyBudget" /></div>
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
              <TableRow key={campaign.id}>
                {isEdit && (
                  <TableCell>
                    <Switch checked={campaign.isActive} onCheckedChange={(checked) => onActiveToggle?.(campaign.id, checked)} disabled={campaign.status === "archived" || campaign.status === "completed"} />
                  </TableCell>
                )}
                <TableCell><StatusBadge status={campaign.status} /></TableCell>
                <TableCell className="font-medium text-foreground">
                  {isEdit ? (
                    <Input defaultValue={campaign.name} className="h-8 text-sm" onBlur={(e) => onCampaignUpdate?.(campaign.id, { name: e.target.value })} />
                  ) : campaign.name}
                </TableCell>
                <TableCell>
                  {isEdit ? (
                    <DatePickerCell
                      value={campaign.startDate}
                      onChange={(date) => onCampaignUpdate?.(campaign.id, { startDate: date || "" })}
                    />
                  ) : <span className="text-sm text-foreground whitespace-nowrap">{campaign.startDate}</span>}
                </TableCell>
                <TableCell>
                  {isEdit ? (
                    <DatePickerCell
                      value={campaign.endDate}
                      onChange={(date) => onCampaignUpdate?.(campaign.id, { endDate: date || undefined })}
                      placeholder="No end date"
                    />
                  ) : <span className="text-sm text-foreground whitespace-nowrap">{campaign.endDate || "—"}</span>}
                </TableCell>
                <TableCell>
                  {isEdit ? (
                    <Select value={campaign.biddingStrategy} onValueChange={(v) => onCampaignUpdate?.(campaign.id, { biddingStrategy: v as BiddingStrategy })}>
                      <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{BIDDING_OPTIONS.map((b) => <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : <span className="text-sm text-foreground whitespace-nowrap">{campaign.biddingStrategy}</span>}
                </TableCell>
                <TableCell className="text-right">
                  {isEdit ? (
                    <Input type="number" defaultValue={campaign.dailyBudget} className="h-8 text-xs w-[100px] text-right" onBlur={(e) => onCampaignUpdate?.(campaign.id, { dailyBudget: parseFloat(e.target.value) || 0 })} />
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-foreground">{formatCurrency(campaign.dailyBudget)}</span>
                      <DeltaBadge value={getDelta(campaign.id, 'dailyBudget')} />
                    </div>
                  )}
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
            <CampaignTableTotalRow campaigns={campaigns} showTotalBudget={showTotalBudget} viewMode={viewMode} />
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
