import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AanProvider, AanPanel } from "@/components/aan";
import NotFound from "./pages/NotFound";

import CampaignManager from "./pages/advertising/CampaignManager";
import ImpactAnalysis from "./pages/advertising/ImpactAnalysis";
import TargetingActions from "./pages/advertising/TargetingActions";
import ProfitabilityDashboard from "./pages/profitability/Dashboard";
import ProfitabilityTrends from "./pages/profitability/Trends";
import ProfitLoss from "./pages/profitability/ProfitLoss";
import Geographical from "./pages/profitability/Geographical";
import CatalogProducts from "./pages/catalog/Products";
import Appearance from "./pages/settings/Appearance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <MarketplaceProvider defaultMarketplace="walmart">
        <AanProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/profitability/dashboard" replace />} />
                <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
                <Route path="/profitability/trends" element={<ProfitabilityTrends />} />
                <Route path="/profitability/pnl" element={<ProfitLoss />} />
                <Route path="/profitability/geo" element={<Geographical />} />
                <Route path="/advertising/campaigns" element={<CampaignManager />} />
                <Route path="/advertising/impact" element={<ImpactAnalysis />} />
                <Route path="/advertising/targeting" element={<TargetingActions />} />
                <Route path="/catalog/products" element={<CatalogProducts />} />
                <Route path="/settings/appearance" element={<Appearance />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AanPanel />
            </BrowserRouter>
          </TooltipProvider>
        </AanProvider>
      </MarketplaceProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
