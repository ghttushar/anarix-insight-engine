import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { AdGroupsTable } from "@/components/tables/AdGroupsTable";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
  const [activeTab, setActiveTab] = useState<TabValue>("ad-groups");
  const [searchQuery, setSearchQuery] = useState("");

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const campaignName = campaign?.name || `Campaign ${campaignId}`;

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
      case "product-ads": return <ProductAdsTable searchQuery={searchQuery} />;
      case "keywords": return <KeywordTargetingTable searchQuery={searchQuery} />;
      case "search-terms": return <SearchTermsTable searchQuery={searchQuery} />;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><button onClick={() => navigate("/advertising/campaigns")} className="hover:underline">Advertising</button></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><button onClick={() => navigate("/advertising/campaigns")} className="hover:underline">Campaign Manager</button></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-foreground font-medium">{campaignName}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader title={campaignName} subtitle={`Campaign type: ${campaign?.type || "auto"} · Status: ${campaign?.status || "live"}`} />

        <InlineKPIStrip items={kpiItems} />

        <PerformanceChart data={mockChartData} />

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as TabValue)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          onDownload={() => {}}
        />

        {renderTable()}
      </div>
    </AppLayout>
  );
}
