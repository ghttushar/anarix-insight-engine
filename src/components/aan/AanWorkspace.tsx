import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAan } from "./AanContext";
import { AanWorkspaceSidebar } from "./AanWorkspaceSidebar";
import { AanConversation } from "./AanConversation";
import { AanInput } from "./AanInput";
import { AanArtifactViewer } from "./AanArtifactViewer";

export function AanWorkspace() {
  const { mode, closeAan, viewingArtifact, closeArtifactView } = useAan();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const isOpen = mode === "workspace";
  if (!isOpen) return null;

  // When artifact is being viewed, hide sidebar
  const showSidebar = sidebarExpanded && !viewingArtifact;
  const showArtifactPanel = !!viewingArtifact;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Header - Aan by Anarix branding */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 aan-gradient-text" />
          <span className="font-aan text-aan aan-gradient-text font-bold">Aan</span>
          <span className="text-sm text-muted-foreground">by Anarix</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Creative Sidebar Toggle - Sleek pill design */}
          <button
            onClick={() => {
              if (viewingArtifact) {
                closeArtifactView();
              }
              setSidebarExpanded(!sidebarExpanded);
            }}
            className={cn(
              "group relative flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3",
              "hover:border-primary/50 transition-all overflow-hidden"
            )}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {/* Gradient hover effect */}
            <div className="absolute inset-0 aan-gradient opacity-0 group-hover:opacity-10 transition-opacity" />

            {/* Animated chevrons */}
            <div className="relative flex items-center">
              {sidebarExpanded && !viewingArtifact ? (
                <>
                  <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <ChevronLeft className="h-3.5 w-3.5 -ml-2 opacity-50 transition-transform group-hover:-translate-x-0.5" />
                </>
              ) : (
                <>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  <ChevronRight className="h-3.5 w-3.5 -ml-2 opacity-50 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </div>

            {/* Label - only when sidebar is expanded */}
            {sidebarExpanded && !viewingArtifact && (
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Hide
              </span>
            )}
            {(!sidebarExpanded || viewingArtifact) && (
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Show
              </span>
            )}
          </button>

          <Button variant="ghost" size="icon" onClick={closeAan} className="h-8 w-8 hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Aan Sidebar - hidden when viewing artifact */}
        {showSidebar && <AanWorkspaceSidebar />}

        {/* Workspace Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <AanConversation />
          <AanInput />
        </main>

        {/* Artifact Viewer Panel - shown when artifact selected */}
        {showArtifactPanel && viewingArtifact && (
          <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
        )}
      </div>
    </div>
  );
}
