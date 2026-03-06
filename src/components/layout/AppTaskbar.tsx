import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

function StatusDot({ status, className }: { status: "connected" | "syncing" | "error"; className?: string }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full", colors[status], className)} />;
}

export function AppTaskbar() {
  const { marketplace, setMarketplace } = useMarketplace();
  const { accounts, currentAccount, setCurrentAccount } = useAccounts();
  const { adType, setAdType, frequency, setFrequency, dateRange, setDateRange } = useFilter();
  const [storeSearch, setStoreSearch] = useState("");
  const [mergedDropdownOpen, setMergedDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex h-14 items-center rounded-lg border border-border bg-card px-4 shrink-0">
      {/* Left Zone: Labeled filter controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ad Type</span>
          <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
            <SelectTrigger className="h-8 w-[110px] text-sm border-0 bg-transparent shadow-none px-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All Types</SelectItem>
              <SelectItem value="SP" className="text-xs">Sponsored Products</SelectItem>
              <SelectItem value="SB" className="text-xs">Sponsored Brands</SelectItem>
              <SelectItem value="SD" className="text-xs">Sponsored Display</SelectItem>
              <SelectItem value="SV" className="text-xs">Sponsored Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
          <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
            <SelectTrigger className="h-8 w-[90px] text-sm border-0 bg-transparent shadow-none px-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Daily", "Weekly", "Monthly"].map((f) => (
                <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm font-normal px-1.5">
                <CalendarIcon className="h-3 w-3" />
                {format(dateRange.from, "MMM dd")} – {format(dateRange.to, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  } else if (range?.from) {
                    setDateRange({ from: range.from, to: range.from });
                  }
                }}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Right Zone: Marketplace + Store */}
      <div className="flex items-center">
        <DropdownMenu open={mergedDropdownOpen} onOpenChange={setMergedDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-medium hover:bg-muted transition-colors max-w-[240px]">
              <img
                src={marketplace === "amazon" ? amazonLogo : walmartLogo}
                alt={marketplace}
                className="h-4 w-auto object-contain"
              />
              <StatusDot status={currentAccount?.status || "connected"} />
              <span className="truncate text-xs">{displayAccountName}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
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
