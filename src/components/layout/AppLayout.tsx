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
    <div className="flex min-h-screen w-full flex-col">
      {/* Universal Top Taskbar */}
      <AppTaskbar />

      {/* Main area: Sidebar + Content + Copilot (inline, same layer) */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
        {/* Copilot Panel - inline, no overlay */}
        <AanCopilotPanel />
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
