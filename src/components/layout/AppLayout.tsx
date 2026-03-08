import { ReactNode, useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AanCopilotPanel } from "@/components/aan/AanCopilotPanel";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useDensity } from "@/contexts/DensityContext";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen w-full relative">
      <AppSidebar />
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
