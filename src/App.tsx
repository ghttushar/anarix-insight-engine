import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "./pages/NotFound";

// Advertising
import CampaignManager from "./pages/advertising/CampaignManager";
import ImpactAnalysis from "./pages/advertising/ImpactAnalysis";
import TargetingActions from "./pages/advertising/TargetingActions";

// Profitability
import ProfitabilityDashboard from "./pages/profitability/Dashboard";

// Settings
import Appearance from "./pages/settings/Appearance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <MarketplaceProvider defaultMarketplace="walmart">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Default redirect to Campaign Manager */}
              <Route path="/" element={<Navigate to="/advertising/campaigns" replace />} />
              
              {/* Advertising Routes */}
              <Route path="/advertising/campaigns" element={<CampaignManager />} />
              <Route path="/advertising/impact" element={<ImpactAnalysis />} />
              <Route path="/advertising/targeting" element={<TargetingActions />} />
              
              {/* Profitability Routes */}
              <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
              
              {/* Settings Routes */}
              <Route path="/settings/appearance" element={<Appearance />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MarketplaceProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
