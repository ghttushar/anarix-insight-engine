import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAan } from "./AanContext";
import { AanWorkspaceSidebar } from "./AanWorkspaceSidebar";
import { AanBreadcrumb } from "./AanBreadcrumb";
import { AanConversation } from "./AanConversation";
import { AanInput } from "./AanInput";

export function AanWorkspace() {
  const { mode, closeAan } = useAan();

  const isOpen = mode === "workspace";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <AanBreadcrumb />
        <Button
          variant="ghost"
          size="icon"
          onClick={closeAan}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Aan Sidebar */}
        <AanWorkspaceSidebar />

        {/* Workspace Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <AanConversation />
          <AanInput />
        </main>
      </div>
    </div>
  );
}
