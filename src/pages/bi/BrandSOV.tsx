import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { SOVChart } from "@/components/bi/SOVChart";
import { SOVKPIStrip } from "@/components/bi/SOVKPIStrip";
import { BrandCoverageTable } from "@/components/bi/BrandCoverageTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";
import { brands, sovTrendData, sovMetrics } from "@/data/mockBrandSOV";
import { toast } from "sonner";

export default function BrandSOV() {
  const [keyword, setKeyword] = useState("memory foam mattress");
  const [dateRange, setDateRange] = useState("today");
  const [position, setPosition] = useState("all");
  const [frequency, setFrequency] = useState("hourly");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Brand Share of Voice" subtitle="Track brand visibility across search results" />

        <AppTaskbar>
          <div className="relative min-w-[180px] max-w-[240px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search keyword..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-8 h-9 text-xs" />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Date Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue placeholder="Position" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="1">Position 1</SelectItem>
              <SelectItem value="1-3">Top 3</SelectItem>
              <SelectItem value="1-10">Top 10</SelectItem>
            </SelectContent>
          </Select>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue placeholder="Frequency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5">
            <Play className="h-3.5 w-3.5" />Run
          </Button>
        </AppTaskbar>

        <SOVKPIStrip metrics={sovMetrics} />
        <SOVChart data={sovTrendData} title="Share of Voice Trend" subtitle={`Jan 31 (${frequency})`} />

        <div>
          <h2 className="text-lg font-semibold mb-4">Brand Coverage</h2>
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search brands..."
            onDownload={() => toast.success("Exporting SOV data...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
          />
          <BrandCoverageTable brands={brands} onViewTrend={(brandId) => console.log("View trend for brand:", brandId)} showDeltas={showDeltas} />
        </div>
      </div>
    </AppLayout>
  );
}
