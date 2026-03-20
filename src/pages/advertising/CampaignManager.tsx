import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
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
import { ProductTargetingTable } from "@/components/tables/ProductTargetingTable";
import { CreateCampaignModal } from "@/components/advertising/CreateCampaignModal";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { mockAdGroups } from "@/data/mockAdGroups";
import { mockProductAds } from "@/data/mockProductAds";
import { mockKeywords } from "@/data/mockKeywords";
import { mockSearchTerms } from "@/data/mockSearchTerms";
import { mockPageTypes, mockPlatforms } from "@/data/mockPageTypePlatform";
import { mockProductTargets } from "@/data/mockProductTargeting";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { Campaign } from "@/types/campaign";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabValue = "campaigns" | "ad-groups" | "product-ads" | "keywords" | "product-targeting" | "search-terms" | "page-type" | "platform";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const tabs = [
  { value: "campaigns", label: "Campaigns" },
  { value: "ad-groups", label: "Ad Groups" },
  { value: "product-ads", label: "Product Ads" },
  { value: "keywords", label: "Keyword Targeting" },
  { value: "product-targeting", label: "Product Targeting" },
  { value: "search-terms", label: "Search Terms" },
  { value: "page-type", label: "Page Type" },
  { value: "platform", label: "Platform" },
];

const COLUMN_DEFS: Record<string, { id: string; label: string }[]> = {
  campaigns: [
    { id: "active", label: "Active" }, { id: "status", label: "Status" }, { id: "name", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" }, { id: "endDate", label: "End Date" },
    { id: "biddingStrategy", label: "Bidding Strategy" }, { id: "dailyBudget", label: "Budget" },
    { id: "totalBudget", label: "Total Budget" }, { id: "spend", label: "Spend" },
    { id: "sales", label: "Sales" }, { id: "roas", label: "ROAS" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "ctr", label: "CTR" }, { id: "acos", label: "ACOS" },
  ],
  "ad-groups": [
    { id: "status", label: "Status" }, { id: "name", label: "Ad Group" }, { id: "campaign", label: "Campaign" },
    { id: "bidAuto", label: "Bid Auto" }, { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" }, { id: "adSpend", label: "Ad Spend" }, { id: "adSales", label: "Ad Sales" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "product-ads": [
    { id: "status", label: "Status" }, { id: "productAd", label: "Product Ad" }, { id: "adGroup", label: "Ad Group" },
    { id: "campaign", label: "Campaign" }, { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "ctr", label: "CTR" }, { id: "adSpend", label: "Ad Spend" },
  ],
  keywords: [
    { id: "status", label: "Status" }, { id: "keyword", label: "Keyword" }, { id: "matchType", label: "Match Type" },
    { id: "adGroup", label: "Ad Group" }, { id: "campaign", label: "Campaign" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" },
  ],
  "product-targeting": [
    { id: "status", label: "Status" }, { id: "target", label: "Target" }, { id: "type", label: "Type" },
    { id: "adGroup", label: "Ad Group" }, { id: "campaign", label: "Campaign" }, { id: "impressions", label: "Impressions" },
    { id: "clicks", label: "Clicks" }, { id: "adSpend", label: "Ad Spend" }, { id: "adSales", label: "Ad Sales" },
    { id: "roas", label: "ROAS" }, { id: "acos", label: "ACOS" },
  ],
  "search-terms": [
    { id: "searchTerm", label: "Search Term" }, { id: "productAd", label: "Product Ad" }, { id: "keyword", label: "Keyword" },
    { id: "matchType", label: "Match Type" }, { id: "impressions", label: "Impressions" }, { id: "clicks", label: "Clicks" },
    { id: "adSpend", label: "Ad Spend" },
  ],
  "page-type": [
    { id: "pageType", label: "Page Type" }, { id: "bidModifier", label: "Bid Modifier" },
    { id: "impressions", label: "Impressions" }, { id: "adSpend", label: "Ad Spend" }, { id: "roas", label: "ROAS" },
  ],
  platform: [
    { id: "platform", label: "Platform" }, { id: "bidModifier", label: "Bid Modifier" },
    { id: "impressions", label: "Impressions" }, { id: "adSpend", label: "Ad Spend" }, { id: "roas", label: "ROAS" },
  ],
};

const FILTER_FIELDS: Record<string, string[]> = {
  campaigns: ["Campaign Status", "Campaign Name", "Campaign Type", "Daily Budget", "Spend", "ROAS", "ACOS", "Bidding Strategy"],
  "ad-groups": ["Status", "Ad Group Name", "Campaign Name", "Impressions", "ROAS"],
  "product-ads": ["Status", "Product Name", "SKU", "Ad Group", "Campaign"],
  keywords: ["Status", "Keyword", "Match Type", "Ad Group", "Campaign"],
  "product-targeting": ["Status", "Target", "Type", "Ad Group", "Campaign"],
  "search-terms": ["Search Term", "Keyword", "Match Type", "Campaign"],
  "page-type": ["Page Type", "Bid Modifier", "ROAS"],
  platform: ["Platform", "Bid Modifier", "ROAS"],
};

const AVAILABLE_METRICS = [
  { key: "impressions", label: "Impressions", format: "number" as const },
  { key: "clicks", label: "Clicks", format: "number" as const },
  { key: "spend", label: "Ad Spend", format: "currency" as const },
  { key: "sales", label: "Ad Sales", format: "currency" as const },
  { key: "orders", label: "Ad Orders", format: "number" as const },
  { key: "roas", label: "ROAS", format: "decimal" as const },
  { key: "acos", label: "ACOS", format: "percentage" as const },
  { key: "ctr", label: "CTR", format: "percentage" as const },
  { key: "cpc", label: "CPC", format: "currency" as const },
];

export default function CampaignManager() {
  const navigate = useNavigate();
  const { isWalmart } = useMarketplace();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeTab, setActiveTab] = useState<TabValue>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(
    mockKPIData.slice(0, 4).map((k) => k.label)
  );

  // Show Impact & Chart visibility
  const [showImpact, setShowImpact] = useState(false);
  const [chartVisible, setChartVisible] = useState(true);

  // Create Campaign Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const kpiItems = mockKPIData
    .filter((kpi) => selectedKPIs.includes(kpi.label))
    .map((kpi, index) => ({
      label: kpi.label,
      value: kpi.value,
      previousValue: kpi.previousValue,
      format: kpi.format as "currency" | "number" | "percentage" | "decimal",
      accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : "warning",
    }));

  const currentColumnDefs = COLUMN_DEFS[activeTab] || [];
  const columns = currentColumnDefs.map((c) => ({ ...c, visible: !hiddenColumns.has(c.id) }));

  const handleColumnToggle = (columnId: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId); else next.add(columnId);
      return next;
    });
  };

  const handleSelectAllColumns = () => setHiddenColumns(new Set());
  const handleClearAllColumns = () => setHiddenColumns(new Set(currentColumnDefs.map((c) => c.id)));

  const handleActiveToggle = (id: string, isActive: boolean) => {
    setCampaigns((prev) =>
      prev.map((c) => c.id === id ? { ...c, isActive, status: isActive ? "live" : "paused" } : c)
    );
  };

  const handleCampaignUpdate = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const handleKPISwap = (index: number, newMetricKey: string) => {
    const metric = AVAILABLE_METRICS.find((m) => m.key === newMetricKey);
    if (!metric) return;
    setSelectedKPIs((prev) => {
      const next = [...prev];
      next[index] = metric.label;
      return next;
    });
  };

  const handleCreateCampaign = (data: { name: string; type: string; biddingStrategy: string; dailyBudget: number; startDate: string; endDate?: string }) => {
    const newCampaign: Campaign = {
      id: `camp-new-${Date.now()}`,
      name: data.name,
      status: "live",
      isActive: true,
      biddingStrategy: data.biddingStrategy as any,
      type: data.type as any,
      dailyBudget: data.dailyBudget,
      totalBudget: data.dailyBudget * 30,
      spend: 0,
      sales: 0,
      roas: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      acos: 0,
      orders: 0,
      cpc: 0,
      units: 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const renderTable = () => {
    switch (activeTab) {
      case "campaigns": return <CampaignTable campaigns={campaigns} onActiveToggle={handleActiveToggle} onCampaignUpdate={handleCampaignUpdate} showTotalBudget={isWalmart} searchQuery={searchQuery} viewMode={viewMode} onRowClick={(id) => navigate(`/advertising/campaigns/${id}`)} />;
      case "ad-groups": return <AdGroupsTable searchQuery={searchQuery} />;
      case "product-ads": return <ProductAdsTable searchQuery={searchQuery} />;
      case "keywords": return <KeywordTargetingTable searchQuery={searchQuery} />;
      case "product-targeting": return <ProductTargetingTable searchQuery={searchQuery} />;
      case "search-terms": return <SearchTermsTable searchQuery={searchQuery} />;
      case "page-type": return <PageTypeTable searchQuery={searchQuery} />;
      case "platform": return <PlatformTable searchQuery={searchQuery} />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Campaign Manager"
          subtitle="Manage and optimize your advertising campaigns"
          actions={
            <Button size="sm" className="gap-1.5" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          }
        />

        <InlineKPIStrip
          items={kpiItems}
          availableMetrics={AVAILABLE_METRICS}
          onMetricChange={handleKPISwap}
        />

        {/* Chart Controls Row */}
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Switch id="show-impact" checked={showImpact} onCheckedChange={setShowImpact} className="h-5 w-9 [&>span]:h-4 [&>span]:w-4" />
              <Label htmlFor="show-impact" className="text-xs font-medium text-muted-foreground cursor-pointer">Show Impact</Label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setChartVisible(!chartVisible)} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {chartVisible ? "Hide Chart" : "Show Chart"}
            </button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {chartVisible ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {chartVisible && <PerformanceChart data={mockChartData} showImpact={showImpact} />}

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

      <CreateCampaignModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </AppLayout>
  );
}
