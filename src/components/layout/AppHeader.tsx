import { PanelLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

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
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const marketplaces: MarketplaceOption[] = [
  { id: "walmart", name: "Walmart", icon: WalmartLogo },
  { id: "amazon", name: "Amazon", icon: AmazonLogo },
];

interface AccountOption {
  id: string;
  name: string;
}

const accounts: AccountOption[] = [
  { id: "1", name: "Nadia's Organics" },
  { id: "2", name: "TechGear Pro" },
  { id: "3", name: "HomeStyle Essentials" },
];

export function AppHeader() {
  const { toggleSidebar, state } = useSidebar();
  const collapsed = state === "collapsed";

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

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="font-heading text-xl font-bold text-foreground">Anarix</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Marketplace Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <WalmartLogo className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Walmart</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {marketplaces.map((marketplace) => (
              <DropdownMenuItem key={marketplace.id} className="gap-2">
                <marketplace.icon className="h-4 w-4" />
                {marketplace.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span className="max-w-[150px] truncate">Nadia's Organics</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {accounts.map((account) => (
              <DropdownMenuItem key={account.id}>{account.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
