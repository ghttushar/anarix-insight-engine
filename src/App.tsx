import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Advertising
import CampaignManager from "./pages/advertising/CampaignManager";

// Profitability
import ProfitabilityDashboard from "./pages/profitability/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default redirect to Campaign Manager */}
          <Route path="/" element={<Navigate to="/advertising/campaigns" replace />} />
          
          {/* Advertising Routes */}
          <Route path="/advertising/campaigns" element={<CampaignManager />} />
          
          {/* Profitability Routes */}
          <Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
