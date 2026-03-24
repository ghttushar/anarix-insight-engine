import { ReactNode, useEffect, useRef, lazy, Suspense } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useDensity } from "@/contexts/DensityContext";
import { cn } from "@/lib/utils";

const AanCopilotPanel = lazy(() => import("@/components/aan/AanCopilotPanel").then(m => ({ default: m.AanCopilotPanel })));

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
      <div className="flex flex-1 h-screen overflow-hidden">
        <main className={cn(
          "flex-1 overflow-auto bg-background min-h-0",
          density === "compact" ? "p-4" : "p-6"
        )}>
          {children}
        </main>
        {showInsights && <InsightsPanel />}
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
