import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ImpactTable } from "@/components/tables/ImpactTable";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, BarChart3, Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  mockImpactCampaigns,
  mockImpactAdGroups,
  mockImpactProducts,
  mockImpactKeywords,
  mockImpactSearchTerms,
} from "@/data/mockImpactData";

type ImpactTab = "campaigns" | "ad-groups" | "products" | "keywords" | "search-terms";

const tabs = [
  { value: "campaigns", label: "Campaigns" },
  { value: "ad-groups", label: "Ad Groups" },
  { value: "products", label: "Products" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];

// Build chart data from campaigns comparing baseline vs impact
const impactChartData = mockImpactCampaigns.map((c) => ({
  name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
  "Baseline Spend": c.baseline.adSpend,
  "Impact Spend": c.impact.adSpend,
  "Baseline Sales": c.baseline.adSales,
  "Impact Sales": c.impact.adSales,
}));

export default function ImpactAnalysis() {
  const [activeTab, setActiveTab] = useState<ImpactTab>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="flex items-center gap-4 rounded-lg border border-border p-3">
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

        {/* Performance Comparison Chart */}
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-sm font-medium text-foreground">Performance Comparison</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Maximize2 className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleDownload}><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={impactChartData} barGap={2} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="Baseline Spend" fill="hsl(var(--muted-foreground))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Impact Spend" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Baseline Sales" fill="hsl(var(--muted-foreground) / 0.5)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Impact Sales" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
