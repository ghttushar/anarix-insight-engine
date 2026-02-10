import { ReactNode, useEffect } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppTaskbar } from "./AppTaskbar";
import { AanCopilotPanel } from "@/components/aan/AanCopilotPanel";
import { useAan } from "@/components/aan";

function LayoutInner({ children }: { children: ReactNode }) {
  const { mode } = useAan();
  const { setOpen } = useSidebar();
  const copilotOpen = mode === "copilot";

  // Auto-collapse sidebar when copilot opens
  useEffect(() => {
    if (copilotOpen) {
      setOpen(false);
    }
  }, [copilotOpen, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <AppTaskbar />
        <main className="flex-1 overflow-auto bg-background p-6">
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
