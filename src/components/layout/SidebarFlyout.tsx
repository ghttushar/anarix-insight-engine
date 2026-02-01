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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function SidebarFlyout({ items, isVisible, groupLabel, onMouseEnter, onMouseLeave }: SidebarFlyoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath.startsWith(path);

  if (!isVisible) return null;

  return (
    <>
      {/* Invisible bridge to prevent gap issues */}
      <div
        className="absolute left-full top-0 h-full w-2 z-50"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <div
        className={cn(
          "absolute left-[calc(100%+8px)] top-0 z-50",
          "min-w-[200px] rounded-lg border border-border bg-popover p-2 shadow-lg",
          "animate-in fade-in-0 slide-in-from-left-2 duration-150"
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
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
    </>
  );
}
