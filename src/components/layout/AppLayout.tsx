import { ReactNode, useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AanCopilotPanel } from "@/components/aan/AanCopilotPanel";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useDensity } from "@/contexts/DensityContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function CollapseNotch() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-6 w-6 rounded-full bg-sidebar border border-border/60 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200 shadow-sm"
          style={{
            left: collapsed
              ? "calc(var(--sidebar-width-icon) - 12px)"
              : "calc(var(--sidebar-width) - 12px)",
          }}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{collapsed ? "Expand" : "Collapse"}</TooltipContent>
    </Tooltip>
  );
}

function LayoutInner({ children }: { children: ReactNode }) {
  const { activePanel } = useActivePanel();
  const { setOpen } = useSidebar();
  const { density } = useDensity();

  const showCopilot = activePanel === "copilot";
  const showInsights = activePanel === "insights";

  useEffect(() => {
    if (showCopilot || showInsights) {
      setOpen(false);
    }
  }, [showCopilot, showInsights, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <CollapseNotch />
      <div className="flex flex-1 min-h-screen overflow-hidden">
        <main className={cn(
          "flex-1 overflow-auto bg-background",
          density === "compact" ? "p-4" : "p-6"
        )}>
          {children}
        </main>
        {showInsights && <InsightsPanel />}
        {showCopilot && <AanCopilotPanel />}
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}
