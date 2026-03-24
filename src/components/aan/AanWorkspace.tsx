import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAan } from "./AanContext";
import { AanWorkspaceSidebar } from "./AanWorkspaceSidebar";
import { AanConversation } from "./AanConversation";
import { AanInput } from "./AanInput";
import { AanArtifactViewer } from "./AanArtifactViewer";
import { MiniSidebar } from "@/components/layout/MiniSidebar";

export function AanWorkspace() {
  const { mode, closeAan, viewingArtifact, closeArtifactView } = useAan();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const isOpen = mode === "workspace";
  if (!isOpen) return null;

  const showSidebar = sidebarExpanded && !viewingArtifact;
  const showArtifactPanel = !!viewingArtifact;

  return (
    <div className="fixed inset-0 z-[60] flex bg-background">
      {/* Mini app sidebar for navigation */}
      <MiniSidebar />

      {/* Aan workspace content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex h-12 items-center justify-between border-b border-border/30 bg-card px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 aan-gradient-text" />
            <span className="font-aan text-lg aan-gradient-text font-bold" style={{ lineHeight: 1 }}>Aan</span>
            <span className="text-xs text-muted-foreground">by Anarix</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (viewingArtifact) closeArtifactView();
                setSidebarExpanded(!sidebarExpanded);
              }}
              className={cn(
                "group relative flex h-7 items-center gap-1 rounded-full border border-border/60 bg-background px-2",
                "hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground"
              )}
            >
              {sidebarExpanded && !viewingArtifact ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <span className="text-xs">
                {sidebarExpanded && !viewingArtifact ? "Hide" : "Show"}
              </span>
            </button>

            <Button variant="ghost" size="icon" onClick={closeAan} className="h-7 w-7 hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && <AanWorkspaceSidebar />}

          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            <AanConversation />
            <AanInput />
          </main>

          {showArtifactPanel && viewingArtifact && (
            <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
          )}
        </div>
      </div>
    </div>
  );
}
