import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import amazonLogo from "@/assets/amazon-logo.png";
import walmartLogo from "@/assets/walmart-logo.png";

function StatusDot({ status, className }: { status: "connected" | "syncing" | "error"; className?: string }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full", colors[status], className)} />;
}

interface AppLevelSelectorProps {
  children?: ReactNode;
}

export function AppLevelSelector({ children }: AppLevelSelectorProps) {
  const { marketplace, setMarketplace } = useMarketplace();
  const { accounts, currentAccount, setCurrentAccount } = useAccounts();
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
    <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg border border-border/50 px-1.5 py-1">
      {children && <div className="flex items-center gap-1.5 [&_button]:h-9 [&_button]:text-sm">{children}</div>}
      <DropdownMenu open={mergedDropdownOpen} onOpenChange={setMergedDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-3 h-9 text-sm font-medium hover:bg-muted transition-colors max-w-[280px] cursor-pointer">
            <img
              src={marketplace === "amazon" ? amazonLogo : walmartLogo}
              alt={marketplace}
              className="h-5 w-auto object-contain"
            />
            <StatusDot status={currentAccount?.status || "connected"} className="h-2.5 w-2.5" />
            <span className="truncate text-sm font-medium">{displayAccountName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px] p-0">
          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2">
            Marketplace
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setMarketplace("amazon")} className="flex items-center gap-2 cursor-pointer mx-1">
            <img src={amazonLogo} alt="Amazon" className="h-4 w-auto object-contain" />
            <span className="text-xs">Amazon</span>
            {marketplace === "amazon" && <Check className="h-3 w-3 ml-auto text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMarketplace("walmart")} className="flex items-center gap-2 cursor-pointer mx-1">
            <img src={walmartLogo} alt="Walmart" className="h-4 w-auto object-contain" />
            <span className="text-xs">Walmart</span>
            {marketplace === "walmart" && <Check className="h-3 w-3 ml-auto text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Search stores..."
                className="h-7 pl-7 text-xs"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[180px] overflow-auto p-1">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => (
                <DropdownMenuItem
                  key={acc.id}
                  onClick={() => { setCurrentAccount(acc.id); setMergedDropdownOpen(false); }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <StatusDot status={acc.status} />
                  <span className="truncate text-xs">{acc.merchantName}</span>
                  {currentAccount?.id === acc.id && <Check className="h-3 w-3 ml-auto text-primary" />}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                {storeSearch ? "No matching stores" : `No ${marketplace} stores`}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
