import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, RefreshCw, Download, Plus, Filter, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAan } from "@/components/aan";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

const getContextualActions = (pathname: string, openAan: () => void): ActionItem[] => {
  const commonActions: ActionItem[] = [
    { icon: Sparkles, label: "Ask Aan", onClick: openAan },
  ];

  if (pathname.includes("/profitability")) {
    return [
      ...commonActions,
      { icon: RefreshCw, label: "Refresh", onClick: () => console.log("Refreshing...") },
      { icon: Download, label: "Export", onClick: () => console.log("Exporting...") },
    ];
  }

  if (pathname.includes("/advertising")) {
    return [
      ...commonActions,
      { icon: Plus, label: "New Campaign", onClick: () => console.log("New campaign...") },
      { icon: Filter, label: "Filter", onClick: () => console.log("Filtering...") },
    ];
  }

  if (pathname.includes("/dayparting")) {
    return [
      ...commonActions,
      { icon: Calendar, label: "Schedule", onClick: () => console.log("Creating schedule...") },
    ];
  }

  return commonActions;
};

export function FloatingActionIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const { openPanel } = useAan();

  const actions = getContextualActions(location.pathname, openPanel);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-card/95 backdrop-blur-md border border-border rounded-full shadow-xl",
        "transition-all duration-300 ease-out",
        isExpanded ? "px-2 py-2" : "px-4 py-2"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center gap-2">
        {/* Collapse button */}
        <button
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className={cn(
                "rounded-full transition-all duration-200",
                isExpanded ? "px-3 gap-2" : "px-2"
              )}
            >
              <action.icon className="h-4 w-4 shrink-0" />
              {isExpanded && (
                <span className="text-sm whitespace-nowrap animate-in fade-in duration-200">
                  {action.label}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Keyboard hint */}
        {isExpanded && (
          <div className="pl-2 border-l border-border">
            <span className="text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘K</kbd>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
