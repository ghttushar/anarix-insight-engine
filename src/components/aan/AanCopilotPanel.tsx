import { X, Calendar, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAan } from "./AanContext";
import { AanConversation } from "./AanConversation";
import { AanDraftPreview } from "./AanDraftPreview";
import { AanInput } from "./AanInput";
import { AanLogo } from "./AanLogo";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AanCopilotPanel() {
  const { mode, closeAan, openWorkspace, context } = useAan();

  const isOpen = mode === "copilot";

  return (
    <div
      className={cn(
        "h-full w-[420px] shrink-0 flex flex-col border-l border-border bg-background transition-all duration-300 ease-out overflow-hidden",
        isOpen ? "max-w-[420px] opacity-100" : "max-w-0 opacity-0 border-l-0"
      )}
    >
      {isOpen && (
        <>
          {/* Header with Aan gradient */}
          <div className="relative overflow-hidden border-b border-border shrink-0">
            <div className="absolute inset-0 aan-gradient opacity-10" />
            <div className="relative flex items-center justify-between px-4 py-4">
              <AanLogo />
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={openWorkspace} className="h-8 w-8" title="Open full workspace">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={closeAan} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Context Bar */}
            <div className="relative flex items-center gap-4 border-t border-border/50 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">Context:</span>
                <span>{context.page}</span>
              </div>
              {context.dateRange && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{context.dateRange}</span>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Area — independent scroll */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <ScrollArea className="flex-1">
              <AanConversation />
            </ScrollArea>
          </div>

          {/* Draft Preview (when active) */}
          <AanDraftPreview />

          {/* Input Area */}
          <div className="shrink-0">
            <AanInput />
          </div>
        </>
      )}
    </div>
  );
}
