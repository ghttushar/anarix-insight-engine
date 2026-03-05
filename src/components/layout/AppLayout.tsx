import { ReactNode, useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AanCopilotPanel } from "@/components/aan/AanCopilotPanel";
import { useAan } from "@/components/aan";
import { useDensity } from "@/contexts/DensityContext";
import { cn } from "@/lib/utils";

function LayoutInner({ children }: { children: ReactNode }) {
  const { mode } = useAan();
  const { setOpen } = useSidebar();
  const { density } = useDensity();
  const copilotOpen = mode === "copilot";

  useEffect(() => {
    if (copilotOpen) {
      setOpen(false);
    }
  }, [copilotOpen, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <main className={cn(
          "flex-1 overflow-auto bg-background",
          density === "compact" ? "p-4" : "p-6"
        )}>
          {children}
        </main>
      </div>
      <AanCopilotPanel />
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
