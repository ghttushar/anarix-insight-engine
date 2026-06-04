import { Menu, Bell } from "lucide-react";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useInsights } from "@/components/insights";
import { MobileMarketplacePill } from "./MobileMarketplacePill";

interface Props {
  onOpenDrawer: () => void;
}

/**
 * Mobile top bar.
 * Left: hamburger. Center: brand. Right: marketplace pill + bell.
 * Aan moved out of top bar — reachable from bottom bar.
 */
export function MobileTopBar({ onOpenDrawer }: Props) {
  const { setDataPanel } = useActivePanel();
  const { criticalCount } = useInsights();

  return (
    <header className="h-14 shrink-0 sticky top-0 z-30 bg-background border-b border-border flex items-center px-2 gap-1">
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted active:bg-muted/80 shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center min-w-0 gap-1.5">
        <AnarixLogo variant="full" className="h-5 w-auto shrink-0" />
      </div>

      <div className="ml-auto flex items-center gap-1 shrink-0">
        <MobileMarketplacePill />
        <button
          onClick={() => setDataPanel("notifications")}
          aria-label="Notifications"
          className="relative h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {criticalCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </button>
      </div>
    </header>
  );
}
