import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SOVChart } from "@/components/bi/SOVChart";
import { SOVKPIStrip } from "@/components/bi/SOVKPIStrip";
import { BrandCoverageTable } from "@/components/bi/BrandCoverageTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { brands, sovTrendData, sovMetrics } from "@/data/mockBrandSOV";
import { toast } from "sonner";

export default function BrandSOV() {
  const [keyword, setKeyword] = useState("memory foam mattress");
  const [dateRange, setDateRange] = useState("today");
  const [position, setPosition] = useState("all");
  const [frequency, setFrequency] = useState("hourly");

  const handleExport = () => { toast.success("Exporting SOV data..."); };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Brand Share of Voice"
          subtitle="Track brand visibility across search results"
          actions={
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />Export
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border bg-card">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search keyword..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10" />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Date Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Position" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="1">Position 1</SelectItem>
              <SelectItem value="1-3">Top 3</SelectItem>
              <SelectItem value="1-10">Top 10</SelectItem>
            </SelectContent>
          </Select>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Frequency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Button>Run</Button>
        </div>

        <SOVKPIStrip metrics={sovMetrics} />
        <SOVChart data={sovTrendData} title="Share of Voice Trend" subtitle={`Jan 31 (${frequency})`} />

        <div>
          <h2 className="text-lg font-semibold mb-4">Brand Coverage</h2>
          <BrandCoverageTable brands={brands} onViewTrend={(brandId) => console.log("View trend for brand:", brandId)} />
        </div>
      </div>
    </AppLayout>
  );
}
