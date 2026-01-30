import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, FileText, MapPin, Megaphone, Target, MousePointerClick, Package, Brain, Search, BarChart3, Clock, CalendarClock, History, ListTodo, Settings, Users, FileStack, ChevronDown, ChevronRight, Sparkles, DollarSign, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarFlyout } from "./SidebarFlyout";
import { useAan } from "@/components/aan";

interface NavItem { title: string; url: string; icon: React.ComponentType<{ className?: string }>; }
interface NavGroup { label: string; icon: React.ComponentType<{ className?: string }>; items: NavItem[]; defaultOpen?: boolean; }

const navigationGroups: NavGroup[] = [
  { label: "Profitability", icon: DollarSign, defaultOpen: true, items: [
    { title: "Dashboard", url: "/profitability/dashboard", icon: LayoutDashboard },
    { title: "Trends", url: "/profitability/trends", icon: TrendingUp },
    { title: "Profit & Loss", url: "/profitability/pnl", icon: FileText },
    { title: "Geographical Data", url: "/profitability/geo", icon: MapPin },
  ]},
  { label: "Advertising", icon: Megaphone, defaultOpen: true, items: [
    { title: "Campaign Manager", url: "/advertising/campaigns", icon: Megaphone },
    { title: "Impact Analysis", url: "/advertising/impact", icon: Target },
    { title: "Targeting Actions", url: "/advertising/targeting", icon: MousePointerClick },
  ]},
  { label: "Catalog", icon: ShoppingBag, items: [{ title: "Products", url: "/catalog/products", icon: Package }]},
  { label: "Business Intelligence", icon: Brain, items: [
    { title: "Brand SOV", url: "/bi/brand-sov", icon: Brain },
    { title: "Keyword Tracker", url: "/bi/keyword-tracker", icon: Search },
    { title: "Keyword SOV", url: "/bi/keyword-sov", icon: BarChart3 },
    { title: "Product SOV", url: "/bi/product-sov", icon: Package },
  ]},
  { label: "Day Parting", icon: Clock, items: [
    { title: "Hourly Data", url: "/dayparting/hourly", icon: Clock },
    { title: "Campaigns", url: "/dayparting/campaigns", icon: CalendarClock },
    { title: "History", url: "/dayparting/history", icon: History },
    { title: "Scheduled Jobs", url: "/dayparting/scheduled", icon: ListTodo },
  ]},
  { label: "Settings", icon: Settings, items: [
    { title: "Appearance", url: "/settings/appearance", icon: Settings },
    { title: "Accounts", url: "/settings/accounts", icon: Settings },
    { title: "Users", url: "/settings/users", icon: Users },
    { title: "History Logs", url: "/settings/logs", icon: FileStack },
  ]},
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { openPanel } = useAan();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => currentPath.startsWith(item.url));
      initial[group.label] = group.defaultOpen || hasActiveItem;
    });
    return initial;
  });

  const toggleGroup = (label: string) => setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <Sidebar className={cn("border-r border-sidebar-border bg-sidebar transition-all duration-300", collapsed ? "w-14" : "w-60")} collapsible="icon">
      <SidebarContent className="py-4">
        {/* Aan AI Entry Point */}
        <div className="px-3 mb-4">
          <button onClick={openPanel} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 text-primary">
            <Sparkles className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Aan AI</span>}
          </button>
        </div>

        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="relative" onMouseEnter={() => collapsed && setHoveredGroup(group.label)} onMouseLeave={() => setHoveredGroup(null)}>
            {!collapsed ? (
              <Collapsible open={openGroups[group.label]} onOpenChange={() => toggleGroup(group.label)}>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    <div className="flex items-center gap-2">
                      <group.icon className="h-4 w-4" />
                      {group.label}
                    </div>
                    {openGroups[group.label] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink to={item.url} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive(item.url) ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                              <item.icon className="h-4 w-4 shrink-0" />
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
                      <button className="flex items-center justify-center rounded-md p-2 transition-colors text-sidebar-foreground hover:bg-sidebar-accent" title={group.label}>
                        <group.icon className="h-4 w-4" />
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarFlyout items={group.items} isVisible={hoveredGroup === group.label} groupLabel={group.label} />
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
