import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { CampaignInfoCard } from "@/components/advertising/CampaignInfoCard";
import { AdGroupsTable } from "@/components/tables/AdGroupsTable";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useFilter } from "@/contexts/FilterContext";
import { toast } from "sonner";

type TabValue = "ad-groups" | "product-ads" | "keywords" | "search-terms";

const tabs = [
  { value: "ad-groups", label: "Ad Groups" },
  { value: "product-ads", label: "Product Ads" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];

export default function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { adType } = useFilter();
  const [activeTab, setActiveTab] = useState<TabValue>("ad-groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [showImpact, setShowImpact] = useState(false);

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const campaignName = campaign?.name || `Campaign ${campaignId}`;
  const adTypeLabel = adType === "All" ? "SP" : adType;

  const kpiItems = mockKPIData.slice(0, 4).map((kpi, index) => ({
    label: kpi.label,
    value: kpi.value,
    previousValue: kpi.previousValue,
    format: kpi.format as "currency" | "number" | "percentage" | "decimal",
    accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : "warning",
  }));

  const renderTable = () => {
    switch (activeTab) {
      case "ad-groups": return <AdGroupsTable searchQuery={searchQuery} />;
      case "product-ads": return <ProductAdsTable searchQuery={searchQuery} showAddButton />;
      case "keywords": return <KeywordTargetingTable searchQuery={searchQuery} />;
      case "search-terms": return <SearchTermsTable searchQuery={searchQuery} />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => navigate("/advertising/campaigns")} className="text-primary hover:underline cursor-pointer">Advertising</button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => navigate("/advertising/campaigns")} className="text-primary hover:underline cursor-pointer">{adTypeLabel}</button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-foreground font-medium">{campaignName}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <PageHeader title="Advertising" />

        {/* Universal Bar — always first after title */}
        <AppTaskbar showFrequency showDateRange>
          <Button size="sm" className="gap-1.5 ml-2">
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
        </AppTaskbar>

        {/* Campaign Info Card — below universal bar */}
        {campaign && <CampaignInfoCard campaign={campaign} />}

        {/* Performance Overview Section */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Performance Overview</h2>
          <InlineKPIStrip items={kpiItems} />
          <PerformanceChart data={mockChartData} showImpact={showImpact} onShowImpactChange={setShowImpact} />
        </div>

        {/* Tabs + Table */}
        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as TabValue)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          onDownload={() => toast.success("Exporting data as CSV...")}
        />

        {renderTable()}
      </div>
    </AppLayout>
  );
}
