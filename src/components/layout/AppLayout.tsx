import { ReactNode, useEffect, useRef, lazy, Suspense } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useDensity } from "@/contexts/DensityContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Lazy-load to ensure AanProvider is always mounted before this renders
const AanCopilotPanel = lazy(() => import("@/components/aan/AanCopilotPanel").then(m => ({ default: m.AanCopilotPanel })));

function CollapseNotch() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-sidebar border border-border/60 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200 shadow-sm"
          style={{
            left: collapsed
              ? "calc(var(--sidebar-width-icon) - 28px)"
              : "calc(var(--sidebar-width) - 28px)",
          }}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{collapsed ? "Expand" : "Collapse"}</TooltipContent>
    </Tooltip>
  );
}

function LayoutInner({ children }: { children: ReactNode }) {
  const { dataPanel, aiPanel, hasAnyPanel } = useActivePanel();
  const { open, setOpen } = useSidebar();
  const { density } = useDensity();

  const autoCollapsedRef = useRef(false);
  const prevHasPanelRef = useRef(hasAnyPanel);

  const showInsights = dataPanel === "insights";
  const showCopilot = aiPanel === "copilot";

  useEffect(() => {
    const panelJustOpened = hasAnyPanel && !prevHasPanelRef.current;
    const panelJustClosed = !hasAnyPanel && prevHasPanelRef.current;

    if (panelJustOpened && open) {
      autoCollapsedRef.current = true;
      setOpen(false);
    } else if (panelJustClosed && autoCollapsedRef.current) {
      autoCollapsedRef.current = false;
      setOpen(true);
    }

    prevHasPanelRef.current = hasAnyPanel;
  }, [hasAnyPanel, open, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <CollapseNotch />
      <div className="flex flex-1 h-screen overflow-hidden">
        <main className={cn(
          "flex-1 overflow-auto bg-background",
          density === "compact" ? "p-4" : "p-6"
        )}>
          {children}
        </main>
        {/* Data panel (left of copilot) */}
        {showInsights && <InsightsPanel />}
        {/* AI panel (rightmost) */}
        {showCopilot && <Suspense fallback={null}><AanCopilotPanel /></Suspense>}
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
