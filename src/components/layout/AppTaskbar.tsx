import { useState, useRef, useEffect } from "react";
import { Sun, Moon, ChevronDown, User, Settings, LogOut, Search, Check, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import { useFilter } from "@/contexts/FilterContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

function StatusDot({ status, className }: { status: "connected" | "syncing" | "error"; className?: string }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full", colors[status], className)} />;
}

export function AppTaskbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
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
    <div className="flex h-12 items-center justify-between border-b border-border bg-card px-4 shrink-0">
      {/* Left: Universal Controls */}
      <div className="flex items-center gap-2">
        {/* Ad Type */}
        <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
          <SelectTrigger className="h-8 w-[90px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "SP", "SB", "SD", "SV"].map((t) => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Frequency */}
        <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
          <SelectTrigger className="h-8 w-[100px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Daily", "Weekly", "Monthly"].map((f) => (
              <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-normal">
              <CalendarIcon className="h-3.5 w-3.5" />
              {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
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

      {/* Right: Marketplace/Store + Theme + Profile */}
      <div className="flex items-center gap-2">
        {/* Merged Marketplace + Store Selector */}
        <DropdownMenu open={mergedDropdownOpen} onOpenChange={setMergedDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors max-w-[260px]">
              <img
                src={marketplace === "amazon" ? amazonLogo : walmartLogo}
                alt={marketplace}
                className="h-4 w-auto object-contain"
              />
              <StatusDot status={currentAccount?.status || "connected"} />
              <span className="truncate">{displayAccountName}</span>
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

        {/* Light/Dark Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-muted transition-colors"
          title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
        </button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md hover:bg-muted px-2 py-1 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">JD</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@anarix.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer"><User className="h-4 w-4" /><span>Profile</span></DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer"><Settings className="h-4 w-4" /><span>Settings</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive"><LogOut className="h-4 w-4" /><span>Logout</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
