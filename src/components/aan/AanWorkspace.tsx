import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAan } from "./AanContext";
import { AanLogo } from "./AanLogo";
import { AanWorkspaceSidebar } from "./AanWorkspaceSidebar";
import { AanConversation } from "./AanConversation";
import { AanInput } from "./AanInput";

export function AanWorkspace() {
  const { mode, closeAan } = useAan();
  const [activeSection, setActiveSection] = useState("chat");

  const isOpen = mode === "workspace";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeAan}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Anarix
          </Button>
          <div className="h-6 w-px bg-border" />
          <AanLogo />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Aan Sidebar */}
        <AanWorkspaceSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Workspace Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeSection === "chat" ? (
            <>
              <AanConversation />
              <AanInput />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2 capitalize">
                  {activeSection}
                </h2>
                <p className="text-sm text-muted-foreground">
                  This section is coming soon. Use the Chat to interact with Aan.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
