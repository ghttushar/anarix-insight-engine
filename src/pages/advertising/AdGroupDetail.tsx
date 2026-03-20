import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { ProductAdsTable } from "@/components/tables/ProductAdsTable";
import { KeywordTargetingTable } from "@/components/tables/KeywordTargetingTable";
import { SearchTermsTable } from "@/components/tables/SearchTermsTable";
import { mockCampaigns, mockChartData, mockKPIData } from "@/data/mockCampaigns";
import { mockAdGroups } from "@/data/mockAdGroups";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type TabValue = "product-ads" | "keywords" | "search-terms";

const tabs = [
  { value: "product-ads", label: "Product Ads" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];

export default function AdGroupDetail() {
  const { campaignId, adGroupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>("product-ads");
  const [searchQuery, setSearchQuery] = useState("");

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const adGroup = mockAdGroups.find((ag) => ag.id === adGroupId);
  const campaignName = campaign?.name || `Campaign ${campaignId}`;
  const adGroupName = adGroup?.name || `Ad Group ${adGroupId}`;

  const kpiItems = mockKPIData.slice(0, 4).map((kpi, index) => ({
    label: kpi.label,
    value: kpi.value,
    previousValue: kpi.previousValue,
    format: kpi.format as "currency" | "number" | "percentage" | "decimal",
    accentColor: index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "accent" : "warning",
  }));

  const renderTable = () => {
    switch (activeTab) {
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
              <BreadcrumbLink asChild><button onClick={() => navigate(`/advertising/campaigns/${campaignId}`)} className="hover:underline">{campaignName}</button></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-foreground font-medium">{adGroupName}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader title={adGroupName} subtitle={`Campaign: ${campaignName}`} />

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
