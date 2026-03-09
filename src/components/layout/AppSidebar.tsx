import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, TrendingUp, FileText, MapPin, Megaphone, Target,
  MousePointerClick, Package, Database, Search, BarChart3, Clock,
  CalendarClock, History, ListTodo, Settings, Users, ChevronDown,
  ChevronRight, Sparkles, Layers, Image, FlaskConical, PackageCheck,
  Send, ChevronLeft, Sun, Moon, User, LogOut,
  Gauge, Wheat, Bell, Activity, Link, Wrench, LayoutDashboard, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarHoverPopup } from "./SidebarHoverPopup";
import { useAan } from "@/components/aan";
import { useTheme } from "@/contexts/ThemeContext";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import logoFull from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-white.png";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isNewFeature?: boolean;
}
interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [{
  label: "Workspace",
  icon: LayoutGrid,
  items: [
    { title: "Dashboard Builder", url: "/workspace", icon: LayoutGrid, isNewFeature: true },
    { title: "Health Score", url: "/workspace/health-score", icon: Activity, isNewFeature: true },
  ]
}, {
  label: "Profitability",
  icon: TrendingUp,
  items: [
    { title: "Dashboard", url: "/profitability/dashboard", icon: LayoutDashboard },
    { title: "Trends", url: "/profitability/trends", icon: TrendingUp },
    { title: "Profit & Loss", url: "/profitability/pnl", icon: FileText },
    { title: "Geographical Data", url: "/profitability/geo", icon: MapPin },
    { title: "Unified P&L", url: "/profitability/unified-pnl", icon: Layers, isNewFeature: true },
  ]
}, {
  label: "Advertising",
  icon: Megaphone,
  items: [
    { title: "Campaign Manager", url: "/advertising/campaigns", icon: Megaphone },
    { title: "Impact Analysis", url: "/advertising/impact", icon: Target },
    { title: "Targeting Actions", url: "/advertising/targeting", icon: MousePointerClick },
    { title: "Budget Pacing", url: "/advertising/budget-pacing", icon: Gauge, isNewFeature: true },
    { title: "Search Harvesting", url: "/advertising/search-harvesting", icon: Wheat, isNewFeature: true },
    { title: "Anomaly Alerts", url: "/advertising/anomaly-alerts", icon: Bell, isNewFeature: true },
    { title: "Creative Analyzer", url: "/advertising/creative-analyzer", icon: Image, isNewFeature: true },
    { title: "Rule Agents", url: "/advertising/rules/agents", icon: FlaskConical },
    { title: "Applied Rules", url: "/advertising/rules/applied", icon: FlaskConical },
  ]
}, {
  label: "Catalog",
  icon: Package,
  items: [
    { title: "Products", url: "/catalog/products", icon: Package },
    { title: "Inventory & Ads", url: "/catalog/inventory-ads", icon: PackageCheck, isNewFeature: true },
  ]
}, {
  label: "AMC",
  icon: Database,
  items: [
    { title: "Queries", url: "/amc/queries", icon: Database },
    { title: "Executed Queries", url: "/amc/executed", icon: FileText },
    { title: "Schedules", url: "/amc/schedules", icon: CalendarClock },
    { title: "Audiences", url: "/amc/audiences", icon: Users },
    { title: "Created Audiences", url: "/amc/created-audiences", icon: Users },
    { title: "Instances", url: "/amc/instances", icon: LayoutGrid },
  ]
}, {
  label: "Business Intelligence",
  icon: BarChart3,
  items: [
    { title: "Brand SOV", url: "/bi/brand-sov", icon: BarChart3 },
    { title: "Keyword Tracker", url: "/bi/keyword-tracker", icon: Search },
    { title: "Keyword SOV", url: "/bi/keyword-sov", icon: BarChart3 },
    { title: "Product SOV", url: "/bi/product-sov", icon: Package },
    { title: "Competitor Pricing", url: "/bi/competitor-pricing", icon: BarChart3, isNewFeature: true },
  ]
}, {
  label: "Day Parting",
  icon: Clock,
  items: [
    { title: "Hourly Data", url: "/dayparting/hourly", icon: Clock },
    { title: "Campaigns", url: "/dayparting/campaigns", icon: CalendarClock },
    { title: "History", url: "/dayparting/history", icon: History },
    { title: "Scheduled Jobs", url: "/dayparting/scheduled", icon: ListTodo },
  ]
}, {
  label: "Reports",
  icon: FileText,
  items: [
    { title: "Client Portal", url: "/reports/client-portal", icon: Send, isNewFeature: true },
  ]
}];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { openWorkspace } = useAan();
  const { resolvedTheme, setTheme } = useTheme();
  const { newFeaturesVisible } = useFeatureToggle();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [triggerRects, setTriggerRects] = useState<Record<string, DOMRect | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const group of navigationGroups) {
      if (group.items.some(item => currentPath.startsWith(item.url))) {
        initial.add(group.label);
      }
    }
    if (initial.size === 0) initial.add("Profitability");
    return initial;
  });

  useEffect(() => {
    for (const group of navigationGroups) {
      if (group.items.some(item => currentPath.startsWith(item.url))) {
        setOpenSections(prev => {
          if (prev.has(group.label)) return prev;
          const next = new Set(prev);
          next.add(group.label);
          return next;
        });
      }
    }
  }, [currentPath]);

  const handleMouseEnter = useCallback((label: string) => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    const trigger = triggerRefs.current[label];
    if (trigger) setTriggerRects(prev => ({ ...prev, [label]: trigger.getBoundingClientRect() }));
    setHoveredGroup(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredGroup(null), 200);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  const toggleSection = (label: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  };

  const isActive = (path: string) => currentPath.startsWith(path);

  const filteredGroups = navigationGroups.map(group => {
    if (newFeaturesVisible) return group;
    const filteredItems = group.items.filter(item => !item.isNewFeature);
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  return (
    <Sidebar className={cn("border-r border-sidebar-border bg-sidebar transition-all duration-300", collapsed ? "w-14" : "w-60")} collapsible="icon">
      <SidebarContent className="py-3 flex flex-col h-full">
        {/* Logo */}
        <div className={cn("flex items-center", collapsed ? "justify-center px-2 mb-3" : "px-4 mb-3")}>
          {!collapsed
            ? <img src={logoSrc} alt="Anarix" className="h-7 w-auto" />
            : <img src={logoSrc} alt="Anarix" className="h-6 w-6 object-contain" />
          }
        </div>

        <div className="mx-3 border-t border-border/50" />

        {/* Aan AI Button — Gradient Background */}
        <div className="px-3 py-3">
          {!collapsed ? (
            <button
              onClick={e => { e.stopPropagation(); e.preventDefault(); openWorkspace(); }}
              className="group relative w-full rounded-lg text-sm font-medium transition-all overflow-hidden aan-gradient py-2.5 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:brightness-110"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-white" />
              <span className="font-aan text-white" style={{ fontSize: "1.4rem", lineHeight: 1 }}>Aan</span>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={e => { e.stopPropagation(); e.preventDefault(); openWorkspace(); }}
                  className="group relative flex w-full items-center justify-center rounded-lg p-2 transition-all aan-gradient shadow-sm hover:shadow-md hover:brightness-110"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Open Aan Workspace</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="mx-3 border-t border-border/50" />

        {/* Navigation Groups */}
        <div className="flex-1 overflow-auto mt-1">
          {filteredGroups.map(group => (
            <SidebarGroup key={group.label} className="relative py-0.5">
              {!collapsed ? (
                <Collapsible open={openSections.has(group.label)} onOpenChange={() => toggleSection(group.label)}>
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors rounded-md mx-2">
                      <div className="flex items-center gap-2">
                        <group.icon className="h-4 w-4" />
                        <span>{group.label}</span>
                      </div>
                      {openSections.has(group.label) ? <ChevronDown className="h-3.5 w-3.5 opacity-50" /> : <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <SidebarGroupContent>
                      <SidebarMenu className="pl-4 border-l border-border/50 ml-5 mt-0.5 space-y-px">
                        {group.items.map(item => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <NavLink
                                to={item.url}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                                  isActive(item.url)
                                    ? "bg-primary/10 text-primary border-l-2 border-primary -ml-[1px] pl-[13px]"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                              >
                                <item.icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button
                          ref={el => { triggerRefs.current[group.label] = el; }}
                          className={cn(
                            "flex items-center justify-center rounded-md p-2 transition-colors text-sidebar-foreground hover:bg-sidebar-accent",
                            hoveredGroup === group.label && "bg-sidebar-accent"
                          )}
                          title={group.label}
                          onMouseEnter={() => handleMouseEnter(group.label)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <group.icon className="h-4 w-4" />
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto px-3 pt-2 border-t border-border/50 space-y-2">
          {/* Theme toggle */}
          <div className={cn("flex items-center", collapsed ? "justify-center" : "px-1")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center h-7 w-7 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "top"}>{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
            </Tooltip>
          </div>

          {/* Profile with Settings in dropdown */}
          {!collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                    <p className="text-[11px] text-muted-foreground truncate">john@anarix.com</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[220px]">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/appearance")}>
                  <Settings className="h-4 w-4" /><span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/accounts")}>
                  <Link className="h-4 w-4" /><span>Accounts</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/team")}>
                  <Users className="h-4 w-4" /><span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/system")}>
                  <Wrench className="h-4 w-4" /><span>System</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/design-system")}>
                  <Palette className="h-4 w-4" /><span>Design System</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" /><span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" /><span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-center rounded-md p-2 hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">JD</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-[220px]">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@anarix.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/appearance")}>
                  <Settings className="h-4 w-4" /><span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/accounts")}>
                  <Link className="h-4 w-4" /><span>Accounts</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/team")}>
                  <Users className="h-4 w-4" /><span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/system")}>
                  <Wrench className="h-4 w-4" /><span>System</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/design-system")}>
                  <Palette className="h-4 w-4" /><span>Design System</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" /><span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" /><span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Hover popups for collapsed state */}
        {collapsed && filteredGroups.map(group => (
          <SidebarHoverPopup
            key={group.label}
            items={group.items}
            isVisible={hoveredGroup === group.label}
            groupLabel={group.label}
            triggerRect={triggerRects[group.label] || null}
            currentPath={currentPath}
            onMouseEnter={() => handleMouseEnter(group.label)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
