import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DensityProvider } from "@/contexts/DensityContext";
import { AccountProvider, useAccounts } from "@/contexts/AccountContext";
import { VisualEffectsProvider } from "@/contexts/VisualEffectsContext";
import { FeatureToggleProvider } from "@/contexts/FeatureToggleContext";
import { ActivePanelProvider } from "@/contexts/ActivePanelContext";
import { AanProvider, AanPanel } from "@/components/aan";
import { InsightsProvider } from "@/components/insights";
import { CreativeFeatures } from "@/features/creative";
import { toast } from "sonner";
import NotFound from "./pages/NotFound";

// Auth & Onboarding
import Login from "./pages/auth/Login";
import ConnectAccounts from "./pages/onboarding/ConnectAccounts";

// Advertising
import CampaignManager from "./pages/advertising/CampaignManager";
import ImpactAnalysis from "./pages/advertising/ImpactAnalysis";
import TargetingActions from "./pages/advertising/TargetingActions";
import BudgetPacing from "./pages/advertising/BudgetPacing";
import SearchHarvesting from "./pages/advertising/SearchHarvesting";
import AnomalyAlerts from "./pages/advertising/AnomalyAlerts";
import CreativeAnalyzer from "./pages/advertising/CreativeAnalyzer";
import RuleBuilder from "./pages/advertising/RuleBuilder";

// Profitability
import ProfitabilityDashboard from "./pages/profitability/Dashboard";
import ProfitabilityTrends from "./pages/profitability/Trends";
import ProfitLoss from "./pages/profitability/ProfitLoss";
import Geographical from "./pages/profitability/Geographical";
import UnifiedPnL from "./pages/profitability/UnifiedPnL";

// Catalog
import CatalogProducts from "./pages/catalog/Products";
import InventoryAds from "./pages/catalog/InventoryAds";

// Business Intelligence
import BrandSOV from "./pages/bi/BrandSOV";
import KeywordTracker from "./pages/bi/KeywordTracker";
import KeywordSOV from "./pages/bi/KeywordSOV";
import ProductSOV from "./pages/bi/ProductSOV";
import CompetitorPricing from "./pages/bi/CompetitorPricing";

// AMC
import AMCQueries from "./pages/amc/Queries";
import AMCExecutedQueries from "./pages/amc/ExecutedQueries";
import AMCSchedules from "./pages/amc/Schedules";
import AMCAudiences from "./pages/amc/Audiences";
import AMCCreatedAudiences from "./pages/amc/CreatedAudiences";
import AMCInstances from "./pages/amc/Instances";

// Day Parting
import HourlyData from "./pages/dayparting/HourlyData";
import DayPartingCampaigns from "./pages/dayparting/Campaigns";
import CampaignDetail from "./pages/dayparting/CampaignDetail";
import DayPartingHistory from "./pages/dayparting/History";
import ScheduledJobs from "./pages/dayparting/ScheduledJobs";
import ScheduleEditor from "./pages/dayparting/ScheduleEditor";
import WorkspaceDashboard from "./pages/workspace/Dashboard";
import HealthScore from "./pages/workspace/HealthScore";
import ClientPortal from "./pages/reports/ClientPortal";

// Settings
import Preferences from "./pages/settings/Preferences";
import Accounts from "./pages/settings/Accounts";
import ConnectAmazon from "./pages/settings/ConnectAmazon";
import ConnectWalmart from "./pages/settings/ConnectWalmart";
import SettingsUsers from "./pages/settings/Users";
import SettingsInvites from "./pages/settings/Invites";
import SettingsLogs from "./pages/settings/Logs";
import SettingsConfiguration from "./pages/settings/Configuration";

const queryClient = new QueryClient();

function WelcomeToasts() {
  const { hasAccounts } = useAccounts();

  useEffect(() => {
    if (hasAccounts) {
      const timer1 = setTimeout(() => {
        toast.success("Welcome to Anarix! Your data is syncing...");
      }, 2000);

      const timer2 = setTimeout(() => {
        toast.info("💡 Tip: Press ⌘K to open the command palette", {
          duration: 5000,
        });
      }, 8000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [hasAccounts]);

  return null;
}

function AppRoutes() {
  const { hasAccounts, isOnboarding } = useAccounts();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isOnboarding && !hasAccounts ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/profitability/dashboard" replace />
          )
        }
      />

      {/* Auth & Onboarding */}
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding/connect" element={<ConnectAccounts />} />

      {/* Sandbox */}
      <Route path="/workspace" element={<WorkspaceDashboard />} />
      <Route path="/workspace/:dashboardId" element={<WorkspaceDashboard />} />
      <Route path="/workspace/health-score" element={<HealthScore />} />

      {/* Profitability */}
      <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
      <Route path="/profitability/trends" element={<ProfitabilityTrends />} />
      <Route path="/profitability/pnl" element={<ProfitLoss />} />
      <Route path="/profitability/geo" element={<Geographical />} />
      <Route path="/profitability/unified-pnl" element={<UnifiedPnL />} />

      {/* Advertising */}
      <Route path="/advertising/campaigns" element={<CampaignManager />} />
      <Route path="/advertising/impact" element={<ImpactAnalysis />} />
      <Route path="/advertising/targeting" element={<TargetingActions />} />
      <Route path="/advertising/budget-pacing" element={<BudgetPacing />} />
      <Route path="/advertising/search-harvesting" element={<SearchHarvesting />} />
      <Route path="/advertising/anomaly-alerts" element={<AnomalyAlerts />} />
      <Route path="/advertising/creative-analyzer" element={<CreativeAnalyzer />} />
      <Route path="/advertising/rules" element={<RuleBuilder />} />

      {/* Catalog */}
      <Route path="/catalog/products" element={<CatalogProducts />} />
      <Route path="/catalog/inventory-ads" element={<InventoryAds />} />

      {/* Business Intelligence */}
      <Route path="/bi/brand-sov" element={<BrandSOV />} />
      <Route path="/bi/keyword-tracker" element={<KeywordTracker />} />
      <Route path="/bi/keyword-sov" element={<KeywordSOV />} />
      <Route path="/bi/product-sov" element={<ProductSOV />} />
      <Route path="/bi/competitor-pricing" element={<CompetitorPricing />} />

      {/* AMC */}
      <Route path="/amc/queries" element={<AMCQueries />} />
      <Route path="/amc/executed" element={<AMCExecutedQueries />} />
      <Route path="/amc/schedules" element={<AMCSchedules />} />
      <Route path="/amc/audiences" element={<AMCAudiences />} />
      <Route path="/amc/created-audiences" element={<AMCCreatedAudiences />} />
      <Route path="/amc/instances" element={<AMCInstances />} />

      {/* Day Parting */}
      <Route path="/dayparting/hourly" element={<HourlyData />} />
      <Route path="/dayparting/campaigns" element={<DayPartingCampaigns />} />
      <Route path="/dayparting/campaigns/:campaignId" element={<CampaignDetail />} />
      <Route path="/dayparting/history" element={<DayPartingHistory />} />
      <Route path="/dayparting/scheduled" element={<ScheduledJobs />} />
      <Route path="/dayparting/scheduled/new" element={<ScheduleEditor />} />
      <Route path="/dayparting/scheduled/:scheduleId/edit" element={<ScheduleEditor />} />

      {/* Reports */}
      <Route path="/reports/client-portal" element={<ClientPortal />} />

      {/* Settings */}
      <Route path="/settings/appearance" element={<Preferences />} />
      <Route path="/settings/accounts" element={<Accounts />} />
      <Route path="/settings/accounts/connect/amazon" element={<ConnectAmazon />} />
      <Route path="/settings/accounts/connect/walmart" element={<ConnectWalmart />} />
      <Route path="/settings/users" element={<SettingsUsers />} />
      <Route path="/settings/invites" element={<SettingsInvites />} />
      <Route path="/settings/logs" element={<SettingsLogs />} />
      <Route path="/settings/configuration" element={<SettingsConfiguration />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DensityProvider>
        <AccountProvider>
          <MarketplaceProvider defaultMarketplace="walmart">
            <FilterProvider>
              <ActivePanelProvider>
                <AanProvider>
                  <InsightsProvider>
                    <VisualEffectsProvider>
                      <FeatureToggleProvider>
                        <TooltipProvider>
                          <Toaster />
                          <Sonner position="bottom-left" />
                          <BrowserRouter>
                            <CreativeFeatures>
                              <WelcomeToasts />
                              <AppRoutes />
                              <AanPanel />
                            </CreativeFeatures>
                          </BrowserRouter>
                        </TooltipProvider>
                      </FeatureToggleProvider>
                    </VisualEffectsProvider>
                  </InsightsProvider>
                </AanProvider>
              </ActivePanelProvider>
            </FilterProvider>
          </MarketplaceProvider>
        </AccountProvider>
      </DensityProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
