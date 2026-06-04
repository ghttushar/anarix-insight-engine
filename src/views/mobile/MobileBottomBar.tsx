import { useNavigate, useLocation } from "react-router-dom";
import { Home, Bell } from "lucide-react";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useInsights } from "@/components/insights";
import { cn } from "@/lib/utils";

/**
 * Mobile bottom navigation. Three slots only: Home, Aan, Notifications.
 * Theme moved to drawer footer. Insights/Alerts moved to taskbar.
 */
export function MobileBottomBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { dataPanel, setDataPanel } = useActivePanel();
  const { criticalCount } = useInsights();

  const baseBtn =
    "relative flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-medium";
  const muted = "text-muted-foreground";
  const active = "text-primary";

  const onHome = pathname.startsWith("/profitability/dashboard");
  const onAan = pathname.startsWith("/aan");

  return (
    <nav
      className="h-14 shrink-0 fixed bottom-0 inset-x-0 z-30 bg-background border-t border-border grid grid-cols-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        onClick={() => navigate("/profitability/dashboard")}
        className={cn(baseBtn, onHome ? active : muted)}
      >
        <Home className="h-5 w-5" strokeWidth={onHome ? 2.4 : 1.8} />
        <span>Home</span>
      </button>

      <button
        onClick={() => navigate("/aan")}
        className={cn(baseBtn, onAan ? active : muted)}
      >
        <AanGlyph className="h-5 w-5 aan-gradient-text" staticEyes />
        <span className="aan-gradient-text font-semibold">Aan</span>
      </button>

      <button
        onClick={() =>
          setDataPanel(dataPanel === "notifications" ? "none" : "notifications")
        }
        className={cn(baseBtn, dataPanel === "notifications" ? active : muted)}
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />
        <span>Alerts</span>
        {criticalCount > 0 && (
          <span className="absolute top-1.5 right-[28%] h-1.5 w-1.5 rounded-full bg-destructive" />
        )}
      </button>
    </nav>
  );
}
