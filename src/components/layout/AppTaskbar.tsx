import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, CalendarIcon } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { cn } from "@/lib/utils";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useFilter } from "@/contexts/FilterContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

function StatusDot({ status, className }: { status: "connected" | "syncing" | "error"; className?: string }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full", colors[status], className)} />;
}

interface DatePreset {
  label: string;
  getRange: () => { from: Date; to: Date };
}

const today = () => new Date();

const DATE_PRESET_GROUPS: { label: string; presets: DatePreset[] }[] = [
  {
    label: "Days",
    presets: [
      { label: "Today", getRange: () => ({ from: today(), to: today() }) },
      { label: "Yesterday", getRange: () => { const d = subDays(today(), 1); return { from: d, to: d }; } },
      { label: "Last 7 days", getRange: () => ({ from: subDays(today(), 6), to: today() }) },
      { label: "Last 14 days", getRange: () => ({ from: subDays(today(), 13), to: today() }) },
      { label: "Last 30 days", getRange: () => ({ from: subDays(today(), 29), to: today() }) },
    ],
  },
  {
    label: "Weeks",
    presets: [
      { label: "This week", getRange: () => ({ from: startOfWeek(today()), to: today() }) },
      { label: "Last week", getRange: () => { const s = startOfWeek(subWeeks(today(), 1)); return { from: s, to: endOfWeek(s) }; } },
      { label: "2 weeks ago", getRange: () => { const s = startOfWeek(subWeeks(today(), 2)); return { from: s, to: endOfWeek(s) }; } },
    ],
  },
  {
    label: "Months",
    presets: [
      { label: "This month", getRange: () => ({ from: startOfMonth(today()), to: today() }) },
      { label: "Last month", getRange: () => { const s = startOfMonth(subMonths(today(), 1)); return { from: s, to: endOfMonth(s) }; } },
      { label: "Last 3 months", getRange: () => ({ from: subMonths(today(), 3), to: today() }) },
    ],
  },
  {
    label: "Quarters",
    presets: [
      { label: "This quarter", getRange: () => ({ from: startOfQuarter(today()), to: today() }) },
      { label: "Last quarter", getRange: () => { const s = startOfQuarter(subQuarters(today(), 1)); return { from: s, to: endOfQuarter(s) }; } },
    ],
  },
];

interface AppTaskbarProps {
  showAdType?: boolean;
  showFrequency?: boolean;
  showDateRange?: boolean;
}

export function AppTaskbar({ showAdType = true, showFrequency = true, showDateRange = true }: AppTaskbarProps) {
  const { marketplace, setMarketplace } = useMarketplace();
  const { accounts, currentAccount, setCurrentAccount } = useAccounts();
  const { adType, setAdType, frequency, setFrequency, dateRange, setDateRange } = useFilter();
  const [storeSearch, setStoreSearch] = useState("");
  const [mergedDropdownOpen, setMergedDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [draftRange, setDraftRange] = useState<{ from: Date; to: Date }>(dateRange);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (datePopoverOpen) {
      setDraftRange(dateRange);
    }
  }, [datePopoverOpen]);

  const filteredAccounts = accounts
    .filter((acc) => acc.marketplace === marketplace)
    .filter((acc) => acc.merchantName.toLowerCase().includes(storeSearch.toLowerCase()));

  const displayAccountName = currentAccount?.merchantName || "Select Store";

  useEffect(() => {
    if (mergedDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setStoreSearch("");
    }
  }, [mergedDropdownOpen]);

  const handleApplyDateRange = () => {
    setDateRange(draftRange);
    setDatePopoverOpen(false);
  };

  const handleCancelDateRange = () => {
    setDatePopoverOpen(false);
  };

  const handlePresetClick = (preset: DatePreset) => {
    const range = preset.getRange();
    setDraftRange(range);
  };

  return (
    <div className="flex h-14 items-center rounded-lg border border-border bg-card px-4 shrink-0">
      {/* Left Zone: Labeled filter controls */}
      <div className="flex items-center gap-3">
        {showAdType && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1 cursor-pointer">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ad Type</span>
                <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
                  <SelectTrigger className="h-8 w-[110px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All" className="text-xs cursor-pointer">All Types</SelectItem>
                    <SelectItem value="SP" className="text-xs cursor-pointer">Sponsored Products</SelectItem>
                    <SelectItem value="SB" className="text-xs cursor-pointer">Sponsored Brands</SelectItem>
                    <SelectItem value="SD" className="text-xs cursor-pointer">Sponsored Display</SelectItem>
                    <SelectItem value="SV" className="text-xs cursor-pointer">Sponsored Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>Change ad type filter</TooltipContent>
          </Tooltip>
        )}

        {showFrequency && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1 cursor-pointer">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                  <SelectTrigger className="h-8 w-[90px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Daily", "Weekly", "Monthly"].map((f) => (
                      <SelectItem key={f} value={f} className="text-xs cursor-pointer">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>Change data frequency</TooltipContent>
          </Tooltip>
        )}

        {showDateRange && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1 cursor-pointer">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range</span>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm font-normal px-1.5 cursor-pointer">
                      <CalendarIcon className="h-3 w-3" />
                      {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <div className="flex">
                      {/* Left: Presets */}
                      <div className="w-[180px] border-r border-border p-2 space-y-3 max-h-[380px] overflow-auto">
                        {DATE_PRESET_GROUPS.map((group) => (
                          <div key={group.label}>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">{group.label}</p>
                            {group.presets.map((preset) => (
                              <button
                                key={preset.label}
                                onClick={() => handlePresetClick(preset)}
                                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted transition-colors text-foreground cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                      {/* Right: Calendar */}
                      <div className="flex flex-col">
                        <Calendar
                          mode="range"
                          selected={{ from: draftRange.from, to: draftRange.to }}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDraftRange({ from: range.from, to: range.to });
                            } else if (range?.from) {
                              setDraftRange({ from: range.from, to: range.from });
                            }
                          }}
                          numberOfMonths={2}
                          className="p-3 pointer-events-auto"
                        />
                        {/* Apply / Cancel */}
                        <div className="flex items-center justify-end gap-2 px-3 pb-3">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleCancelDateRange}>Cancel</Button>
                          <Button size="sm" className="h-8 text-xs" onClick={handleApplyDateRange}>Apply</Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TooltipTrigger>
            <TooltipContent>Select date range</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Right Zone: Marketplace + Store */}
      <div className="flex items-center">
        <DropdownMenu open={mergedDropdownOpen} onOpenChange={setMergedDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors max-w-[280px] cursor-pointer">
              <img
                src={marketplace === "amazon" ? amazonLogo : walmartLogo}
                alt={marketplace}
                className="h-5 w-auto object-contain"
              />
              <StatusDot status={currentAccount?.status || "connected"} />
              <span className="truncate text-sm">{displayAccountName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[260px] p-0">
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2">
              Marketplace
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setMarketplace("amazon")} className="flex items-center gap-2 cursor-pointer mx-1">
              <img src={amazonLogo} alt="Amazon" className="h-4 w-auto object-contain" />
              <span>Amazon</span>
              {marketplace === "amazon" && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMarketplace("walmart")} className="flex items-center gap-2 cursor-pointer mx-1">
              <img src={walmartLogo} alt="Walmart" className="h-4 w-auto object-contain" />
              <span>Walmart</span>
              {marketplace === "walmart" && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  placeholder="Search stores..."
                  className="h-8 pl-8 text-sm"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-auto p-1">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => (
                  <DropdownMenuItem
                    key={acc.id}
                    onClick={() => { setCurrentAccount(acc.id); setMergedDropdownOpen(false); }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <StatusDot status={acc.status} />
                    <span className="truncate">{acc.merchantName}</span>
                    {currentAccount?.id === acc.id && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  {storeSearch ? "No matching stores" : `No ${marketplace} stores`}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
