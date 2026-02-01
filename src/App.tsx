import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AanProvider, AanPanel } from "@/components/aan";
import NotFound from "./pages/NotFound";

// Advertising
import CampaignManager from "./pages/advertising/CampaignManager";
import ImpactAnalysis from "./pages/advertising/ImpactAnalysis";
import TargetingActions from "./pages/advertising/TargetingActions";

// Profitability
import ProfitabilityDashboard from "./pages/profitability/Dashboard";
import ProfitabilityTrends from "./pages/profitability/Trends";
import ProfitLoss from "./pages/profitability/ProfitLoss";
import Geographical from "./pages/profitability/Geographical";

// Catalog
import CatalogProducts from "./pages/catalog/Products";

// Business Intelligence
import BrandSOV from "./pages/bi/BrandSOV";
import KeywordTracker from "./pages/bi/KeywordTracker";
import KeywordSOV from "./pages/bi/KeywordSOV";
import ProductSOV from "./pages/bi/ProductSOV";

// Day Parting
import HourlyData from "./pages/dayparting/HourlyData";
import DayPartingCampaigns from "./pages/dayparting/Campaigns";
import CampaignDetail from "./pages/dayparting/CampaignDetail";
import DayPartingHistory from "./pages/dayparting/History";
import ScheduledJobs from "./pages/dayparting/ScheduledJobs";
import ScheduleEditor from "./pages/dayparting/ScheduleEditor";

// Settings
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
                
                {/* Profitability */}
                <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
                <Route path="/profitability/trends" element={<ProfitabilityTrends />} />
                <Route path="/profitability/pnl" element={<ProfitLoss />} />
                <Route path="/profitability/geo" element={<Geographical />} />
                
                {/* Advertising */}
                <Route path="/advertising/campaigns" element={<CampaignManager />} />
                <Route path="/advertising/impact" element={<ImpactAnalysis />} />
                <Route path="/advertising/targeting" element={<TargetingActions />} />
                
                {/* Catalog */}
                <Route path="/catalog/products" element={<CatalogProducts />} />
                
                {/* Business Intelligence */}
                <Route path="/bi/brand-sov" element={<BrandSOV />} />
                <Route path="/bi/keyword-tracker" element={<KeywordTracker />} />
                <Route path="/bi/keyword-sov" element={<KeywordSOV />} />
                <Route path="/bi/product-sov" element={<ProductSOV />} />
                
                {/* Day Parting */}
                <Route path="/dayparting/hourly" element={<HourlyData />} />
                <Route path="/dayparting/campaigns" element={<DayPartingCampaigns />} />
                <Route path="/dayparting/campaigns/:campaignId" element={<CampaignDetail />} />
                <Route path="/dayparting/history" element={<DayPartingHistory />} />
                <Route path="/dayparting/scheduled" element={<ScheduledJobs />} />
                <Route path="/dayparting/scheduled/new" element={<ScheduleEditor />} />
                <Route path="/dayparting/scheduled/:scheduleId/edit" element={<ScheduleEditor />} />
                
                {/* Settings */}
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
