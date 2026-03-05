import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ImpactTable } from "@/components/tables/ImpactTable";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, BarChart3, Download, Maximize2, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  mockImpactCampaigns,
  mockImpactAdGroups,
  mockImpactProducts,
  mockImpactKeywords,
  mockImpactSearchTerms,
} from "@/data/mockImpactData";

type ImpactTab = "campaigns" | "ad-groups" | "products" | "keywords" | "search-terms";

const tabs = [
  { value: "campaigns", label: "Campaigns", count: mockImpactCampaigns.length },
  { value: "ad-groups", label: "Ad Groups", count: mockImpactAdGroups.length },
  { value: "products", label: "Products", count: mockImpactProducts.length },
  { value: "keywords", label: "Keywords", count: mockImpactKeywords.length },
  { value: "search-terms", label: "Search Terms", count: mockImpactSearchTerms.length },
];

export default function ImpactAnalysis() {
  const [activeTab, setActiveTab] = useState<ImpactTab>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChart, setShowChart] = useState(true);

  const getTabData = () => {
    switch (activeTab) {
      case "campaigns": return { data: mockImpactCampaigns, showType: true };
      case "ad-groups": return { data: mockImpactAdGroups, showType: false };
      case "products": return { data: mockImpactProducts, showType: false };
      case "keywords": return { data: mockImpactKeywords, showType: false };
      case "search-terms": return { data: mockImpactSearchTerms, showType: false };
      default: return { data: mockImpactCampaigns, showType: true };
    }
  };

  const { data, showType } = getTabData();

  const handleAnalyze = () => {
    toast.info("Analyzing impact comparison...");
  };

  const handleDownload = () => {
    toast.success("Exporting impact data as CSV...");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Impact Analysis" subtitle="Compare performance across time periods to measure campaign impact" />

        {/* Period Selectors */}
        <div className="flex items-center gap-4 rounded-lg bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Baseline:</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />Jan 1 - Jan 7, 2026<ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm font-medium text-muted-foreground">vs</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Impact:</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />Jan 15 - Jan 22, 2026<ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-auto">
            <Button size="sm" className="gap-2" onClick={handleAnalyze}>
              <BarChart3 className="h-4 w-4" />Analyze
            </Button>
          </div>
        </div>

        {showChart && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-medium">Performance Comparison</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowChart(false)}><EyeOff className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><Maximize2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Impact comparison chart — Baseline vs Impact period metrics</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {["Ad Spend", "Ad Sales", "ROAS", "Impressions"].map((metric) => (
                <div key={metric} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showChart && (
          <Button variant="outline" size="sm" onClick={() => setShowChart(true)}>Show Chart</Button>
        )}

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as ImpactTab)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          onFilter={() => {}}
          onDownload={handleDownload}
        />

        <ImpactTable data={data} searchQuery={searchQuery} showType={showType} />
      </div>
    </AppLayout>
  );
}
