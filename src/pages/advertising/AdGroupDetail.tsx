import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AddProductAdsModal } from "@/components/advertising/AddProductAdsModal";
import { AdGroupSettingsPanel } from "@/components/advertising/AdGroupSettingsPanel";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { AdGroupInfoCard } from "@/components/advertising/AdGroupInfoCard";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { mockAdGroups } from "@/data/mockAdGroups";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import { useFilter } from "@/contexts/FilterContext";
import { toast } from "sonner";
import { PageFooterBar } from "@/components/layout/PageFooterBar";

type TabValue = "product-ads" | "keywords" | "search-terms";

const tabs = [
  { value: "product-ads", label: "Product Ads" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/campaigns" },
  { label: "Ad Group Detail" },
];
export default function AdGroupDetail() {
  const { campaignId, adGroupId } = useParams();
  const navigate = useNavigate();
  const { adType } = useFilter();
  const [activeTab, setActiveTab] = useState<TabValue>("product-ads");
  const [searchQuery, setSearchQuery] = useState("");
  const [showImpact, setShowImpact] = useState(false);
  const [showDeltas, setShowDeltas] = useState(false);
  const [addProductAdOpen, setAddProductAdOpen] = useState(false);

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const adGroup = mockAdGroups.find((ag) => ag.id === adGroupId);
  const campaignName = campaign?.name || `Campaign ${campaignId}`;
  const adGroupName = adGroup?.name || `Ad Group ${adGroupId}`;
  const adTypeLabel = adType === "All" ? "SP" : adType;

  const kpiItems = mockKPIData.slice(0, 5).map((kpi, index) => ({
    label: kpi.label,
    value: kpi.value,
    previousValue: kpi.previousValue,
    format: kpi.format as "currency" | "number" | "percentage" | "decimal",
    accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : index === 3 ? "warning" : "destructive",
  }));

  const renderTable = () => {
    switch (activeTab) {
      case "product-ads": return <ProductAdsTable searchQuery={searchQuery} showAddButton showDeltas={showDeltas} onRowClick={(pa) => navigate(`/advertising/campaigns/${campaignId}/${adGroupId}/${pa.id}`)} />;
      case "keywords": return <KeywordTargetingTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      case "search-terms": return <SearchTermsTable searchQuery={searchQuery} showDeltas={showDeltas} />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-4">
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
                <BreadcrumbLink asChild>
                  <button onClick={() => navigate(`/advertising/campaigns/${campaignId}`)} className="text-primary hover:underline cursor-pointer">{campaignName}</button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-foreground font-medium">{adGroupName}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageHeader title="Advertising" />

          <AppTaskbar showFrequency showDateRange>
            <Button size="sm" className="gap-1.5 ml-2">
              <Play className="h-3.5 w-3.5" />Run
            </Button>
          </AppTaskbar>

          {adGroup && <AdGroupInfoCard adGroup={adGroup} />}

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Performance Overview</h2>
            <InlineKPIStrip items={kpiItems} />
            <PerformanceChart data={mockChartData} showImpact={showImpact} onShowImpactChange={setShowImpact} />
          </div>

          <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as TabValue)} />

          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
            onDownload={() => toast.success("Exporting data as CSV...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            leftContent={
              activeTab === "product-ads" ? (
                <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => setAddProductAdOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />Add Product Ad
                </Button>
              ) : undefined
            }
          />

          {renderTable()}
          <PageFooterBar breadcrumbItems={breadcrumbItems} />
        </div>

        {adGroup && <AdGroupSettingsPanel adGroup={adGroup} />}
      </div>
      <AddProductAdsModal open={addProductAdOpen} onOpenChange={setAddProductAdOpen} />
    </AppLayout>
  );
}
