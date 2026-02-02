import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, RefreshCw, Download, Plus, Filter, Calendar, X, Camera, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAan } from "@/components/aan";
import { useInsights } from "@/components/insights";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import logoFull from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-white.png";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

const getContextualActions = (
  pathname: string,
  openAan: () => void,
  openInsights: () => void,
  criticalCount: number
): ActionItem[] => {
  const commonActions: ActionItem[] = [
    { icon: Sparkles, label: "Ask Aan", onClick: openAan },
    {
      icon: Lightbulb,
      label: criticalCount > 0 ? `Insights (${criticalCount})` : "Insights",
      onClick: openInsights,
      highlight: criticalCount > 0,
    },
  ];

  if (pathname.includes("/profitability")) {
    return [
      ...commonActions,
      { icon: RefreshCw, label: "Refresh", onClick: () => toast.info("Refreshing data...") },
      { icon: Download, label: "Export", onClick: () => toast.success("Export started") },
    ];
  }

  if (pathname.includes("/advertising")) {
    return [
      ...commonActions,
      { icon: Plus, label: "New Campaign", onClick: () => toast.info("Opening campaign creator...") },
      { icon: Filter, label: "Filter", onClick: () => toast.info("Opening filters...") },
    ];
  }

  if (pathname.includes("/dayparting")) {
    return [
      ...commonActions,
      { icon: Calendar, label: "Schedule", onClick: () => toast.info("Creating schedule...") },
    ];
  }

  return commonActions;
};

// Routes where floating island should be hidden
const hiddenRoutes = [
  "/login",
  "/onboarding",
  "/settings",
  "/settings/preferences",
  "/settings/accounts",
  "/settings/accounts/connect",
];

export function FloatingActionIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const location = useLocation();
  const { openPanel } = useAan();
  const { openPanel: openInsights, criticalCount } = useInsights();
  const { resolvedTheme } = useTheme();

  // Hide on specific routes
  const shouldHide = hiddenRoutes.some((route) => location.pathname.startsWith(route));
  if (shouldHide) return null;

  const actions = getContextualActions(location.pathname, openPanel, openInsights, criticalCount);
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

  const takeScreenshot = async () => {
    setIsCapturing(true);
    try {
      setIsVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `anarix-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Screenshot saved!");
    } catch (error) {
      toast.error("Failed to capture screenshot");
      console.error("Screenshot error:", error);
    } finally {
      setIsVisible(true);
      setIsCapturing(false);
    }
  };

  // Collapsed state - show Anarix logo orb
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-sm flex items-center justify-center overflow-hidden border border-border bg-card hover:shadow-md transition-all hover:scale-105"
      >
        <img src={logoSrc} alt="Anarix" className="h-7 w-7 object-contain" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-card/95 backdrop-blur-md border border-border rounded-full shadow-sm",
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
                isExpanded ? "px-3 gap-2" : "px-2",
                action.highlight && "text-destructive"
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

          {/* Screenshot button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={takeScreenshot}
            disabled={isCapturing}
            className={cn(
              "rounded-full transition-all duration-200",
              isExpanded ? "px-3 gap-2" : "px-2"
            )}
          >
            <Camera className={cn("h-4 w-4 shrink-0", isCapturing && "animate-pulse")} />
            {isExpanded && (
              <span className="text-sm whitespace-nowrap animate-in fade-in duration-200">
                {isCapturing ? "Capturing..." : "Screenshot"}
              </span>
            )}
          </Button>
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
