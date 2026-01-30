import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KPICardsRow } from "@/components/cards/KPICardsRow";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { CampaignTable } from "@/components/tables/CampaignTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Campaign } from "@/types/campaign";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabValue = "campaigns" | "ad-groups" | "product-ads" | "keywords" | "search-terms" | "page-type" | "platform";

export default function CampaignManager() {
  const { isWalmart } = useMarketplace();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeTab, setActiveTab] = useState<TabValue>("campaigns");

  const handleActiveToggle = (id: string, isActive: boolean) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isActive, status: isActive ? "live" : "paused" }
          : c
      )
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Campaign Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and optimize your advertising campaigns
          </p>
        </div>

        {/* KPI Cards */}
        <KPICardsRow data={mockKPIData} />

        {/* Performance Chart */}
        <PerformanceChart data={mockChartData} />

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="ad-groups">Ad Groups</TabsTrigger>
            <TabsTrigger value="product-ads">Product Ads</TabsTrigger>
            <TabsTrigger value="keywords">Keyword Targeting</TabsTrigger>
            <TabsTrigger value="search-terms">Search Terms</TabsTrigger>
            <TabsTrigger value="page-type">Page Type</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Campaigns Table */}
        {activeTab === "campaigns" && (
          <CampaignTable
            campaigns={campaigns}
            onActiveToggle={handleActiveToggle}
            showTotalBudget={isWalmart}
          />
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "campaigns" && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              {activeTab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} view coming soon.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
