import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, FileText, MapPin, Megaphone, Target, MousePointerClick, Package, Brain, Search, BarChart3, Clock, CalendarClock, History, ListTodo, Settings, Users, FileStack, ChevronDown, ChevronRight, Sparkles, DollarSign, ShoppingBag, Link, Star, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarHoverPopup } from "./SidebarHoverPopup";
import { useAan } from "@/components/aan";
import { useTheme } from "@/contexts/ThemeContext";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
import logoFull from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-white.png";
interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}
interface NavGroup {
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  items: NavItem[];
  defaultOpen?: boolean;
}
const navigationGroups: NavGroup[] = [{
  label: "Profitability",
  icon: DollarSign,
  defaultOpen: true,
  items: [{
    title: "Dashboard",
    url: "/profitability/dashboard",
    icon: LayoutDashboard
  }, {
    title: "Trends",
    url: "/profitability/trends",
    icon: TrendingUp
  }, {
    title: "Profit & Loss",
    url: "/profitability/pnl",
    icon: FileText
  }, {
    title: "Geographical Data",
    url: "/profitability/geo",
    icon: MapPin
  }]
}, {
  label: "Advertising",
  icon: Megaphone,
  defaultOpen: true,
  items: [{
    title: "Campaign Manager",
    url: "/advertising/campaigns",
    icon: Megaphone
  }, {
    title: "Impact Analysis",
    url: "/advertising/impact",
    icon: Target
  }, {
    title: "Targeting Actions",
    url: "/advertising/targeting",
    icon: MousePointerClick
  }]
}, {
  label: "Catalog",
  icon: ShoppingBag,
  items: [{
    title: "Products",
    url: "/catalog/products",
    icon: Package
  }]
}, {
  label: "Business Intelligence",
  icon: Brain,
  items: [{
    title: "Brand SOV",
    url: "/bi/brand-sov",
    icon: Brain
  }, {
    title: "Keyword Tracker",
    url: "/bi/keyword-tracker",
    icon: Search
  }, {
    title: "Keyword SOV",
    url: "/bi/keyword-sov",
    icon: BarChart3
  }, {
    title: "Product SOV",
    url: "/bi/product-sov",
    icon: Package
  }]
}, {
  label: "Day Parting",
  icon: Clock,
  items: [{
    title: "Hourly Data",
    url: "/dayparting/hourly",
    icon: Clock
  }, {
    title: "Campaigns",
    url: "/dayparting/campaigns",
    icon: CalendarClock
  }, {
    title: "History",
    url: "/dayparting/history",
    icon: History
  }, {
    title: "Scheduled Jobs",
    url: "/dayparting/scheduled",
    icon: ListTodo
  }]
}, {
  label: "Settings",
  icon: Settings,
  items: [{
    title: "Preferences",
    url: "/settings/appearance",
    icon: Settings
  }, {
    title: "Accounts",
    url: "/settings/accounts",
    icon: Link
  }, {
    title: "Users",
    url: "/settings/users",
    icon: Users
  }, {
    title: "History Logs",
    url: "/settings/logs",
    icon: FileStack
  }]
}];

// Marketplace icons
const MarketplaceIcon = ({
  marketplace,
  className
}: {
  marketplace: Marketplace;
  className?: string;
}) => {
  return marketplace === "walmart" ? <Star className={className} /> : <Circle className={className} />;
};

// Status dot component
const StatusDot = ({
  status,
  className
}: {
  status: "connected" | "syncing" | "error";
  className?: string;
}) => {
  const statusColors = {
    connected: "bg-emerald-500",
    syncing: "bg-amber-500",
    error: "bg-red-500"
  };
  return <div className={cn("h-2 w-2 rounded-full", statusColors[status], className)} />;
};
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const {
    openWorkspace
  } = useAan();
  const {
    resolvedTheme
  } = useTheme();
  const {
    marketplace,
    setMarketplace
  } = useMarketplace();
  const {
    accounts,
    currentAccount,
    setCurrentAccount
  } = useAccounts();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [triggerRects, setTriggerRects] = useState<Record<string, DOMRect | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Theme-aware logo
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

  // Mutex accordion - only one section open at a time
  const [openSection, setOpenSection] = useState<string | null>(() => {
    for (const group of navigationGroups) {
      const hasActiveItem = group.items.some(item => currentPath.startsWith(item.url));
      if (hasActiveItem || group.defaultOpen) return group.label;
    }
    return null;
  });
  const handleMouseEnter = useCallback((label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    const trigger = triggerRefs.current[label];
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setTriggerRects(prev => ({
        ...prev,
        [label]: rect
      }));
    }
    setHoveredGroup(label);
  }, []);
  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredGroup(null);
    }, 200);
  }, []);
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  const toggleSection = (label: string) => {
    setOpenSection(prev => prev === label ? null : label);
  };
  const isActive = (path: string) => currentPath.startsWith(path);

  // Filter accounts by current marketplace
  const filteredAccounts = accounts.filter(acc => acc.marketplace === marketplace);
  const displayAccountName = currentAccount?.merchantName || "Select Account";
  return <Sidebar className={cn("border-r border-sidebar-border bg-sidebar transition-all duration-300", collapsed ? "w-14" : "w-60")} collapsible="icon">
      <SidebarContent className="py-4">
        {/* Logo at top */}
        <div className={cn("mb-4 flex items-center", collapsed ? "justify-center px-2" : "px-4")}>
          {!collapsed ? <img src={logoSrc} alt="Anarix" className="h-8 w-auto" /> : <img src={logoSrc} alt="Anarix" className="h-7 w-7 object-contain" />}
        </div>

        {/* Marketplace Selector */}
        <div className="px-3 mb-2">
          {!collapsed ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                  <span className="flex items-center gap-2">
                    <MarketplaceIcon marketplace={marketplace} className="h-4 w-4" />
                    <span className="capitalize">{marketplace}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] bg-popover border border-border z-50">
                <DropdownMenuItem onClick={() => setMarketplace("walmart")} className="flex items-center gap-2 cursor-pointer">
                  <Star className="h-4 w-4" />
                  <span>Walmart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMarketplace("amazon")} className="flex items-center gap-2 cursor-pointer">
                  <Circle className="h-4 w-4" />
                  <span>Amazon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground hover:bg-accent transition-colors">
                      <MarketplaceIcon marketplace={marketplace} className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-[160px] bg-popover border border-border z-50">
                    <DropdownMenuItem onClick={() => setMarketplace("walmart")} className="flex items-center gap-2 cursor-pointer">
                      <Star className="h-4 w-4" />
                      <span>Walmart</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMarketplace("amazon")} className="flex items-center gap-2 cursor-pointer">
                      <Circle className="h-4 w-4" />
                      <span>Amazon</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="capitalize">{marketplace}</span>
              </TooltipContent>
            </Tooltip>}
        </div>

        {/* Account Selector */}
        <div className="px-3 mb-4">
          {!collapsed ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                  <span className="flex items-center gap-2">
                    <StatusDot status={currentAccount?.status || "connected"} />
                    <span className="truncate max-w-[140px]">{displayAccountName}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px] bg-popover border border-border z-50">
                <ScrollArea className="max-h-[300px]">
                  {filteredAccounts.length > 0 ? filteredAccounts.map(acc => <DropdownMenuItem key={acc.id} onClick={() => setCurrentAccount(acc.id)} className="flex items-center gap-2 cursor-pointer">
                        <StatusDot status={acc.status} />
                        <span className="truncate">{acc.merchantName}</span>
                      </DropdownMenuItem>) : <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      No {marketplace} accounts
                    </div>}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu> : <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground hover:bg-accent transition-colors">
                      <StatusDot status={currentAccount?.status || "connected"} className="h-2.5 w-2.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-[200px] bg-popover border border-border z-50">
                    <ScrollArea className="max-h-[300px]">
                      {filteredAccounts.length > 0 ? filteredAccounts.map(acc => <DropdownMenuItem key={acc.id} onClick={() => setCurrentAccount(acc.id)} className="flex items-center gap-2 cursor-pointer">
                            <StatusDot status={acc.status} />
                            <span className="truncate">{acc.merchantName}</span>
                          </DropdownMenuItem>) : <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                          No {marketplace} accounts
                        </div>}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">
                {displayAccountName}
              </TooltipContent>
            </Tooltip>}
        </div>

        {/* Divider */}
        <div className="mx-3 mb-4 border-t border-border" />

        {/* Aan AI Entry Point - Opens Full Workspace */}
        <div className="px-3 mb-4">
          {!collapsed ? <button onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          openWorkspace();
        }} className="w-full rounded-lg text-sm font-medium transition-all aan-gradient text-white hover:opacity-90 py-[5px] flex items-center justify-start px-[20px] gap-[10px] text-center">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="font-aan text-aan">Aan</span>
            </button> : <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              openWorkspace();
            }} className="flex w-full items-center justify-center rounded-lg p-2.5 transition-all aan-gradient text-white hover:opacity-90">
                  <Sparkles className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Open Aan Workspace
              </TooltipContent>
            </Tooltip>}
        </div>

        {/* Divider */}
        <div className="mx-3 mb-4 border-t border-border" />

        {navigationGroups.map(group => <SidebarGroup key={group.label} className="relative">
            {!collapsed ? <Collapsible open={openSection === group.label} onOpenChange={() => toggleSection(group.label)}>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-sidebar-accent transition-colors rounded-md mx-2">
                    <div className="flex items-center gap-2.5">
                      <group.icon className="h-4 w-4" />
                      <span>{group.label}</span>
                    </div>
                    {openSection === group.label ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <SidebarGroupContent>
                    <SidebarMenu className="pl-4 border-l-2 border-border ml-5 mt-1">
                      {group.items.map(item => <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink to={item.url} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive(item.url) ? "bg-primary/10 text-primary border-l-2 border-primary -ml-[2px] pl-[14px]" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible> : <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button ref={el => {
                  triggerRefs.current[group.label] = el;
                }} className={cn("flex items-center justify-center rounded-md p-2 transition-colors text-sidebar-foreground hover:bg-sidebar-accent", hoveredGroup === group.label && "bg-sidebar-accent")} title={group.label} onMouseEnter={() => handleMouseEnter(group.label)} onMouseLeave={handleMouseLeave}>
                        <group.icon className="h-5 w-5" />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>}
          </SidebarGroup>)}

        {/* Render all hover popups via portal when collapsed */}
        {collapsed && navigationGroups.map(group => <SidebarHoverPopup key={group.label} items={group.items} isVisible={hoveredGroup === group.label} groupLabel={group.label} triggerRect={triggerRects[group.label] || null} currentPath={currentPath} onMouseEnter={() => handleMouseEnter(group.label)} onMouseLeave={handleMouseLeave} />)}
      </SidebarContent>
    </Sidebar>;
}