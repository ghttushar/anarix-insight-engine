import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, FileText, MapPin, Megaphone, Target, MousePointerClick, Package, Brain, Search, BarChart3, Clock, CalendarClock, History, ListTodo, Settings, Users, FileStack, ChevronDown, ChevronRight, Sparkles, DollarSign, ShoppingBag, Link, PanelLeftClose, PanelLeftOpen, Blocks, Database, Mail, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarHoverPopup } from "./SidebarHoverPopup";
import { useAan } from "@/components/aan";
import { useTheme } from "@/contexts/ThemeContext";
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
  label: "Workspace",
  icon: Blocks,
  defaultOpen: false,
  items: [{
    title: "Dashboard Builder",
    url: "/workspace",
    icon: Blocks
  }]
}, {
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
  label: "AMC",
  icon: Database,
  items: [{
    title: "Queries",
    url: "/amc/queries",
    icon: Database
  }, {
    title: "Executed Queries",
    url: "/amc/executed",
    icon: FileText
  }, {
    title: "Schedules",
    url: "/amc/schedules",
    icon: CalendarClock
  }, {
    title: "Audiences",
    url: "/amc/audiences",
    icon: Users
  }, {
    title: "Created Audiences",
    url: "/amc/created-audiences",
    icon: Users
  }, {
    title: "Instances",
    url: "/amc/instances",
    icon: Blocks
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
    title: "Invitations",
    url: "/settings/invites",
    icon: Mail
  }, {
    title: "Activity Logs",
    url: "/settings/logs",
    icon: FileStack
  }, {
    title: "Configuration",
    url: "/settings/configuration",
    icon: Wrench
  }]
}];
export function AppSidebar() {
  const {
    state,
    toggleSidebar
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
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [triggerRects, setTriggerRects] = useState<Record<string, DOMRect | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;
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
      setTriggerRects(prev => ({
        ...prev,
        [label]: trigger.getBoundingClientRect()
      }));
    }
    setHoveredGroup(label);
  }, []);
  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredGroup(null), 200);
  }, []);
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);
  const toggleSection = (label: string) => {
    setOpenSection(prev => prev === label ? null : label);
  };
  const isActive = (path: string) => currentPath.startsWith(path);
  return <Sidebar className={cn("border-r border-sidebar-border bg-sidebar transition-all duration-300", collapsed ? "w-14" : "w-60")} collapsible="icon">
      <SidebarContent className="py-4 flex flex-col h-full">
        {/* Logo */}
        <div className={cn("mb-4 flex items-center", collapsed ? "justify-center px-2" : "px-4")}>
          {!collapsed ? <img src={logoSrc} alt="Anarix" className="h-8 w-auto" /> : <img src={logoSrc} alt="Anarix" className="h-7 w-7 object-contain" />}
        </div>

        {/* Aan AI Button - Sleek Redesign */}
        <div className="px-3 mb-4">
          {!collapsed ? <button onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          openWorkspace();
        }} className={cn("group relative w-full rounded-lg text-sm font-medium transition-all overflow-hidden", "border border-primary/30 bg-card hover:border-primary/60", "py-2.5 flex items-center justify-start px-4 gap-3")}>
              {/* Gradient fill on hover */}
              <div className="absolute inset-0 aan-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
              <Sparkles className="h-4 w-4 shrink-0 aan-gradient-text" />
              <span className="font-aan text-aan aan-gradient-text" style={{
            fontSize: "1.5rem",
            lineHeight: 1
          }}>
                Aan
              </span>
            </button> : <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              openWorkspace();
            }} className={cn("group relative flex w-full items-center justify-center rounded-lg p-2.5 transition-all", "border border-primary/30 bg-card hover:border-primary/60")}>
                  <div className="absolute inset-0 rounded-lg aan-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                  <Sparkles className="h-4 w-4 aan-gradient-text" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Open Aan Workspace</TooltipContent>
            </Tooltip>}
        </div>

        {/* Divider */}
        <div className="mx-3 mb-4 border-t border-border" />

        {/* Navigation Groups */}
        <div className="flex-1 overflow-auto">
          {navigationGroups.map(group => <SidebarGroup key={group.label} className="relative">
              {!collapsed ? <Collapsible open={openSection === group.label} onOpenChange={() => toggleSection(group.label)}>
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-sidebar-accent transition-colors rounded-md mx-2">
                      <div className="flex items-center gap-2.5">
                        <group.icon className="h-4 w-4" />
                        <span className="my-0 py-0">{group.label}</span>
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
        </div>

        {/* Collapse/Expand Toggle at Bottom */}
        <div className="mt-auto px-3 pt-4 border-t border-border">
          <button onClick={toggleSidebar} className={cn("flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors", collapsed && "justify-center px-2")} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Collapse</span>
              </>}
          </button>
        </div>

        {/* Hover popups for collapsed state */}
        {collapsed && navigationGroups.map(group => <SidebarHoverPopup key={group.label} items={group.items} isVisible={hoveredGroup === group.label} groupLabel={group.label} triggerRect={triggerRects[group.label] || null} currentPath={currentPath} onMouseEnter={() => handleMouseEnter(group.label)} onMouseLeave={handleMouseLeave} />)}
      </SidebarContent>
    </Sidebar>;
}