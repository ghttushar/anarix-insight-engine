import { Outlet } from "react-router-dom";
import "./website.css";
import AanWebsitePanel from "./components/AanWebsitePanel";

export default function WebsiteLayout() {
  return (
    <div className="website-scope relative min-h-screen bg-background text-foreground antialiased" style={{ transform: "scale(0.9)", transformOrigin: "top center" }}>
      <Outlet />
      {/* Single Aan surface for the website - opened from the Floating Action Island */}
      <AanWebsitePanel />
    </div>
  );
}
