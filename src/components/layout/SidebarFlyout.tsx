import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SidebarFlyoutProps {
  items: NavItem[];
  isVisible: boolean;
  groupLabel: string;
  triggerRect: DOMRect | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function SidebarFlyout({ 
  items, 
  isVisible, 
  groupLabel, 
  triggerRect,
  onMouseEnter, 
  onMouseLeave 
}: SidebarFlyoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mounted, setMounted] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const isActive = (path: string) => currentPath.startsWith(path);

  if (!mounted || !isVisible || !triggerRect) return null;

  const flyoutContent = (
    <div
      ref={flyoutRef}
      className={cn(
        "fixed z-[9999]",
        "min-w-[220px] rounded-lg border border-border bg-popover p-2 shadow-xl",
        "animate-in fade-in-0 slide-in-from-left-2 duration-150"
      )}
      style={{
        left: `${triggerRect.right + 12}px`,
        top: `${triggerRect.top}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Bridge element to connect trigger to flyout */}
      <div 
        className="absolute -left-4 top-0 h-full w-4" 
        onMouseEnter={onMouseEnter}
      />
      
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {groupLabel}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.url)
                ? "bg-primary/10 text-primary"
                : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  return createPortal(flyoutContent, document.body);
}
