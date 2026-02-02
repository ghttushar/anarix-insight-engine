import { PanelLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";

// Walmart logo SVG component
const WalmartLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" />
  </svg>
);

// Amazon logo SVG component
const AmazonLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z" />
  </svg>
);

interface MarketplaceOption {
  id: Marketplace;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const marketplaces: MarketplaceOption[] = [
  { id: "walmart", name: "Walmart", icon: WalmartLogo },
  { id: "amazon", name: "Amazon", icon: AmazonLogo },
];

export function AppHeader() {
  const { toggleSidebar, state } = useSidebar();
  const collapsed = state === "collapsed";
  const { marketplace, setMarketplace } = useMarketplace();
  const { accounts } = useAccounts();

  const currentMarketplace = marketplaces.find((m) => m.id === marketplace) || marketplaces[0];
  const MarketplaceIcon = currentMarketplace.icon;

  const primaryAccount = accounts[0];
  const accountDisplayName = primaryAccount?.merchantName || "Select Account";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Marketplace Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MarketplaceIcon className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">{currentMarketplace.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {marketplaces.map((mp) => (
              <DropdownMenuItem key={mp.id} className="gap-2" onClick={() => setMarketplace(mp.id)}>
                <mp.icon className="h-4 w-4" />
                {mp.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="max-w-[150px] truncate">{accountDisplayName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <DropdownMenuItem key={account.id} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <div className="flex flex-col">
                    <span className="font-medium">{account.merchantName}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {account.marketplace} • {account.accountType}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No accounts connected</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
