import { useState, useMemo } from "react";
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

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const tabs = [
  { value: "campaigns", label: "Campaigns", count: mockCampaigns.length },
  { value: "ad-groups", label: "Ad Groups", count: mockAdGroups.length },
  { value: "product-ads", label: "Product Ads", count: mockProductAds.length },
  { value: "keywords", label: "Keyword Targeting", count: mockKeywords.length },
  { value: "search-terms", label: "Search Terms", count: mockSearchTerms.length },
  { value: "page-type", label: "Page Type", count: mockPageTypes.length },
  { value: "platform", label: "Platform", count: mockPlatforms.length },
];

const COLUMN_DEFS: Record<string, { id: string; label: string }[]> = {
  campaigns: [
    { id: "active", label: "Active" },
    { id: "status", label: "Status" },
    { id: "name", label: "Campaign Name" },
    { id: "dailyBudget", label: "Daily Budget" },
    { id: "totalBudget", label: "Total Budget" },
    { id: "spend", label: "Spend" },
    { id: "sales", label: "Sales" },
    { id: "roas", label: "ROAS" },
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" },
    { id: "acos", label: "ACOS" },
  ],
  "ad-groups": [
    { id: "status", label: "Status" },
    { id: "name", label: "Ad Group" },
    { id: "campaign", label: "Campaign" },
    { id: "bidAuto", label: "Bid Auto" },
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" },
    { id: "adSpend", label: "Ad Spend" },
    { id: "adSales", label: "Ad Sales" },
    { id: "roas", label: "ROAS" },
    { id: "acos", label: "ACOS" },
  ],
  "product-ads": [
    { id: "status", label: "Status" },
    { id: "productAd", label: "Product Ad" },
    { id: "adGroup", label: "Ad Group" },
    { id: "campaign", label: "Campaign" },
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" },
    { id: "adSpend", label: "Ad Spend" },
  ],
  keywords: [
    { id: "status", label: "Status" },
    { id: "keyword", label: "Keyword" },
    { id: "matchType", label: "Match Type" },
    { id: "adGroup", label: "Ad Group" },
    { id: "campaign", label: "Campaign" },
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "adSpend", label: "Ad Spend" },
  ],
  "search-terms": [
    { id: "searchTerm", label: "Search Term" },
    { id: "productAd", label: "Product Ad" },
    { id: "keyword", label: "Keyword" },
    { id: "matchType", label: "Match Type" },
    { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" },
    { id: "adSpend", label: "Ad Spend" },
  ],
  "page-type": [
    { id: "pageType", label: "Page Type" },
    { id: "bidModifier", label: "Bid Modifier" },
    { id: "impressions", label: "Impressions" },
    { id: "adSpend", label: "Ad Spend" },
    { id: "roas", label: "ROAS" },
  ],
  platform: [
    { id: "platform", label: "Platform" },
    { id: "bidModifier", label: "Bid Modifier" },
    { id: "impressions", label: "Impressions" },
    { id: "adSpend", label: "Ad Spend" },
    { id: "roas", label: "ROAS" },
  ],
};

const FILTER_FIELDS: Record<string, string[]> = {
  campaigns: ["Campaign Status", "Campaign Name", "Campaign Type", "Daily Budget", "Spend", "ROAS", "ACOS"],
  "ad-groups": ["Status", "Ad Group Name", "Campaign Name", "Impressions", "ROAS"],
  "product-ads": ["Status", "Product Name", "SKU", "Ad Group", "Campaign"],
  keywords: ["Status", "Keyword", "Match Type", "Ad Group", "Campaign"],
  "search-terms": ["Search Term", "Keyword", "Match Type", "Campaign"],
  "page-type": ["Page Type", "Bid Modifier", "ROAS"],
  platform: ["Platform", "Bid Modifier", "ROAS"],
};

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
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  const currentColumnDefs = COLUMN_DEFS[activeTab] || [];
  const columns = currentColumnDefs.map((c) => ({
    ...c,
    visible: !hiddenColumns.has(c.id),
  }));

  const handleColumnToggle = (columnId: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  };

  const handleSelectAllColumns = () => setHiddenColumns(new Set());
  const handleClearAllColumns = () => setHiddenColumns(new Set(currentColumnDefs.map((c) => c.id)));

  const handleActiveToggle = (id: string, isActive: boolean) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isActive, status: isActive ? "live" : "paused" } : c
      )
    );
  };

  const renderTable = () => {
    switch (activeTab) {
      case "campaigns":
        return <CampaignTable campaigns={campaigns} onActiveToggle={handleActiveToggle} showTotalBudget={isWalmart} searchQuery={searchQuery} />;
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
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Campaign Manager</h1>
          <p className="text-sm text-muted-foreground">Manage and optimize your advertising campaigns</p>
        </div>

        <InlineKPIStrip items={kpiItems} />

        {showChart && (
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-heading text-sm font-medium text-foreground">Performance Trends</h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowChart(false)}><EyeOff className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><Maximize2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="p-4">
              <PerformanceChart data={mockChartData} />
            </div>
          </div>
        )}

        {!showChart && (
          <Button variant="outline" size="sm" onClick={() => setShowChart(true)}>Show Chart</Button>
        )}

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as TabValue)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={activeTab === "campaigns" || activeTab === "ad-groups" || activeTab === "keywords"}
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onSelectAllColumns={handleSelectAllColumns}
          onClearAllColumns={handleClearAllColumns}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          filterFields={FILTER_FIELDS[activeTab] || []}
          onDownload={() => {}}
        />

        {renderTable()}
      </div>
    </AppLayout>
  );
}
