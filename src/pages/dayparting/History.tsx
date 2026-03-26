import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppLevelSelector } from "@/components/layout/AppLevelSelector";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { HistoryTable } from "@/components/dayparting/HistoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { executionHistory } from "@/data/mockDayParting";
import { toast } from "sonner";
import { useFilter } from "@/contexts/FilterContext";

export default function DayPartingHistory() {
  const { adType, setAdType } = useFilter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredHistory = executionHistory.filter((h) => {
    const matchesSearch =
      h.scheduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.campaignName.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && h.status === activeTab;
  });

  const statusCounts = {
    all: executionHistory.length,
    success: executionHistory.filter((h) => h.status === "success").length,
    failed: executionHistory.filter((h) => h.status === "failed").length,
    cancelled: executionHistory.filter((h) => h.status === "cancelled").length,
  };

  const handleRetry = (id: string) => { toast.info("Retrying execution..."); };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Execution History"
          subtitle="View past day parting schedule executions"
          appLevelSelector={
            <AppLevelSelector>
              <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
                <SelectTrigger className="h-8 w-[130px] text-xs border-border">
                  <SelectValue placeholder="Ad Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs">All Types</SelectItem>
                  <SelectItem value="SP" className="text-xs">Sponsored Products</SelectItem>
                  <SelectItem value="SB" className="text-xs">Sponsored Brands</SelectItem>
                </SelectContent>
              </Select>
            </AppLevelSelector>
          }
        />
        <AppTaskbar>
          <div className="relative min-w-[200px]">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by schedule or campaign..."
              className="h-8 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </AppTaskbar>

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by schedule or campaign..."
          onDownload={() => toast.success("Exporting history...")}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="success">Completed ({statusCounts.success})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({statusCounts.failed})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({statusCounts.cancelled})</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            {filteredHistory.length > 0 ? (
              <HistoryTable history={filteredHistory} onRetry={handleRetry} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No execution history found</p>
                {searchQuery && <p className="text-sm mt-1">Try adjusting your search query</p>}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
