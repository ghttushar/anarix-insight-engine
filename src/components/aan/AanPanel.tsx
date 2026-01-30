import { useAan } from "./AanContext";
import { AanConversation } from "./AanConversation";
import { AanDraftPreview } from "./AanDraftPreview";
import { AanInput } from "./AanInput";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function AanPanel() {
  const { isOpen, setIsOpen, context } = useAan();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[420px] flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b border-border">
          {/* Gradient background - Aan only */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5" />
          
          <div className="relative flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">
                  Aan - AI Assistant
                </h2>
                <p className="text-xs text-muted-foreground">
                  by Anarix
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
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

        {/* Conversation Area */}
        <AanConversation />

        {/* Draft Preview (when active) */}
        <AanDraftPreview />

        {/* Input Area */}
        <AanInput />
      </div>
    </>
  );
}
