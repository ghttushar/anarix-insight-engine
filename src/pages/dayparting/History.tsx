import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HistoryTable } from "@/components/dayparting/HistoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, RefreshCw } from "lucide-react";
import { executionHistory } from "@/data/mockDayParting";

export default function DayPartingHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("7days");
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

  const handleRetry = (id: string) => {
    console.log("Retry execution:", id);
    // In real app, would trigger a retry
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Execution History</h1>
            <p className="text-sm text-muted-foreground">View past day parting schedule executions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by schedule or campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
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
                {searchQuery && (
                  <p className="text-sm mt-1">Try adjusting your search query</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
