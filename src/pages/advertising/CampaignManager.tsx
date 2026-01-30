import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { CampaignTable } from "@/components/tables/CampaignTable";
import { AdGroupsTable } from "@/components/tables/AdGroupsTable";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { PageTypeTable } from "@/components/tables/PageTypeTable";
import { PlatformTable } from "@/components/tables/PlatformTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { mockAdGroups } from "@/data/mockAdGroups";
import { mockProductAds } from "@/data/mockProductAds";
import { mockKeywords } from "@/data/mockKeywords";
import { mockSearchTerms } from "@/data/mockSearchTerms";
import { mockPageTypes, mockPlatforms } from "@/data/mockPageTypePlatform";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Download, EyeOff, Maximize2 } from "lucide-react";

type TabValue = "campaigns" | "ad-groups" | "product-ads" | "keywords" | "search-terms" | "page-type" | "platform";

const tabs = [
  { value: "campaigns", label: "Campaigns", count: mockCampaigns.length },
  { value: "ad-groups", label: "Ad Groups", count: mockAdGroups.length },
  { value: "product-ads", label: "Product Ads", count: mockProductAds.length },
  { value: "keywords", label: "Keyword Targeting", count: mockKeywords.length },
  { value: "search-terms", label: "Search Terms", count: mockSearchTerms.length },
  { value: "page-type", label: "Page Type", count: mockPageTypes.length },
  { value: "platform", label: "Platform", count: mockPlatforms.length },
];

const kpiItems = mockKPIData.map((kpi, index) => ({
  label: kpi.label,
  value: kpi.value,
  previousValue: kpi.previousValue,
  format: kpi.format as "currency" | "number" | "percentage" | "decimal",
  accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : "warning",
}));

export default function CampaignManager() {
  const { isWalmart } = useMarketplace();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeTab, setActiveTab] = useState<TabValue>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChart, setShowChart] = useState(true);
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  const handleActiveToggle = (id: string, isActive: boolean) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isActive, status: isActive ? "live" : "paused" }
          : c
      )
    );
  };

  const renderTable = () => {
    switch (activeTab) {
      case "campaigns":
        return (
          <CampaignTable
            campaigns={campaigns}
            onActiveToggle={handleActiveToggle}
            showTotalBudget={isWalmart}
            searchQuery={searchQuery}
          />
        );
      case "ad-groups":
        return <AdGroupsTable searchQuery={searchQuery} />;
      case "product-ads":
        return <ProductAdsTable searchQuery={searchQuery} />;
      case "keywords":
        return <KeywordTargetingTable searchQuery={searchQuery} />;
      case "search-terms":
        return <SearchTermsTable searchQuery={searchQuery} />;
      case "page-type":
        return <PageTypeTable searchQuery={searchQuery} />;
      case "platform":
        return <PlatformTable searchQuery={searchQuery} />;
      default:
        return null;
    }
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

        {/* KPI Strip */}
        <InlineKPIStrip items={kpiItems} />

        {/* Performance Chart Section */}
        {showChart && (
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-heading text-sm font-medium text-foreground">Performance Trends</h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowChart(false)}>
                  <EyeOff className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <PerformanceChart data={mockChartData} />
            </div>
          </div>
        )}

        {!showChart && (
          <Button variant="outline" size="sm" onClick={() => setShowChart(true)}>
            Show Chart
          </Button>
        )}

        {/* Tab Navigation */}
        <UnderlineTabs
          tabs={tabs}
          value={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
        />

        {/* Table Toolbar */}
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={activeTab === "campaigns" || activeTab === "ad-groups" || activeTab === "keywords"}
          onFilter={() => {}}
          onDownload={() => {}}
        />

        {/* Data Table */}
        {renderTable()}
      </div>
    </AppLayout>
  );
}
