import { useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, RefreshCw, Download, Camera, Lightbulb, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAan } from "@/components/aan";
import { useInsights } from "@/components/insights";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

const hiddenRoutes = ["/login", "/onboarding", "/settings"];

export function FloatingActionIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const location = useLocation();
  const { openPanel } = useAan();
  const { openPanel: openInsights, criticalCount } = useInsights();

  const shouldHide = hiddenRoutes.some((route) => location.pathname.startsWith(route));

  if (shouldHide) return null;

  const actions: ActionItem[] = [
    { icon: Sparkles, label: "Ask Aan", onClick: () => openPanel() },
    { icon: Lightbulb, label: criticalCount > 0 ? `Insights (${criticalCount})` : "Insights", onClick: openInsights, highlight: criticalCount > 0 },
    { icon: RefreshCw, label: "Refresh", onClick: () => toast.info("Refreshing data...") },
    { icon: Download, label: "Export", onClick: () => toast.success("Export started") },
  ];

  const takeScreenshot = async () => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.body, { useCORS: true, allowTaint: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `anarix-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Screenshot saved!");
    } catch {
      toast.error("Failed to capture screenshot");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget.closest('[data-island]') as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: rect.left + rect.width / 2,
      startPosY: rect.top,
    };

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.startPosX + dx,
        y: dragRef.current.startPosY + dy,
      });
    };

    const handleUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, []);

  const style: React.CSSProperties = position
    ? { left: `${position.x}px`, top: `${position.y}px`, transform: "translateX(-50%)" }
    : { left: "50%", bottom: "24px", transform: "translateX(-50%)" };

  return (
    <div
      data-island
      className={cn(
        "fixed z-50",
        "bg-card/95 backdrop-blur-md border border-border rounded-full",
        "transition-all duration-300 ease-out",
        isExpanded ? "px-2 py-2" : "px-4 py-2",
        isDragging && "cursor-grabbing"
      )}
      style={style}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <button
          onMouseDown={handleDragStart}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing"
          title="Drag to reposition"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-border" />

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

          <Button
            variant="ghost"
            size="sm"
            onClick={takeScreenshot}
            disabled={isCapturing}
            className={cn("rounded-full transition-all duration-200", isExpanded ? "px-3 gap-2" : "px-2")}
          >
            <Camera className={cn("h-4 w-4 shrink-0", isCapturing && "animate-pulse")} />
            {isExpanded && (
              <span className="text-sm whitespace-nowrap animate-in fade-in duration-200">
                {isCapturing ? "Capturing..." : "Screenshot"}
              </span>
            )}
          </Button>
        </div>

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
