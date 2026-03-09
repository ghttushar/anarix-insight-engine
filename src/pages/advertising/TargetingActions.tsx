import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Archive, DollarSign } from "lucide-react";
import { mockTargetingActions, mockTargetCampaigns, mockTargetAdGroups } from "@/data/mockTargetingActions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";

type ActionTab = "keyword-action" | "history" | "archive";

const tabs = [
  { value: "keyword-action", label: "Keyword Action" },
  { value: "history", label: "History" },
  { value: "archive", label: "Archive" },
];

export default function TargetingActions() {
  const [activeTab, setActiveTab] = useState<ActionTab>("keyword-action");
  const [searchQuery, setSearchQuery] = useState("");
  const [bidAction, setBidAction] = useState("increase_pct");
  const [bidValue, setBidValue] = useState("");

  const filteredActions = mockTargetingActions.filter((action) => {
    const matchesSearch =
      action.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.normalizedTerm.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "archive") return matchesSearch && action.archived;
    return matchesSearch && !action.archived;
  });

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const handleFetchKeywords = () => { toast.info("Fetching keywords..."); };
  const handleAddKeywords = () => { toast.info("Opening keyword builder..."); };
  const handleDownload = () => { toast.success("Exporting targeting data..."); };
  const handleFilter = () => { toast.info("Opening advanced filters..."); };
  const handleApplyBid = () => {
    if (!bidValue) return;
    toast.success(`Bid adjustment applied: ${bidAction === "set_to" ? "Set to" : bidAction === "increase_pct" ? "Increase by" : "Decrease by"} ${bidValue}${bidAction !== "set_to" ? "%" : ""}`);
    setBidValue("");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Targeting Actions" subtitle="Convert search terms into keyword targets across your campaigns" />

        {/* Action Configuration */}
        <div className="flex items-center gap-4 rounded-lg border border-border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Action Type:</span>
            <Select defaultValue="auto-manual">
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto-manual">Auto to Manual</SelectItem>
                <SelectItem value="manual-manual">Manual to Manual</SelectItem>
                <SelectItem value="new-keywords">New Keywords</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Priority:</span>
            <Select defaultValue="high">
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
            <Select defaultValue="30">
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="60">Last 60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto">
            <Button size="sm" onClick={handleFetchKeywords}>Fetch Keywords</Button>
          </div>
        </div>

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as ActionTab)} />

        <div className="flex items-center justify-between">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search terms..."
            onFilter={() => {}}
            onDownload={handleDownload}
          />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <DollarSign className="h-4 w-4" />Custom Bid
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Adjust Bids</p>
                  <Select value={bidAction} onValueChange={setBidAction}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase_pct">Increase By %</SelectItem>
                      <SelectItem value="decrease_pct">Decrease By %</SelectItem>
                      <SelectItem value="set_to">Set To</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder={bidAction === "set_to" ? "Enter bid value" : "Enter percentage"}
                    value={bidValue}
                    onChange={(e) => setBidValue(e.target.value)}
                    className="h-8 text-xs"
                    step={bidAction === "set_to" ? 0.01 : 1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Are you sure you want to adjust the budget? This action might affect the spends.
                  </p>
                  <Button size="sm" className="w-full" onClick={handleApplyBid} disabled={!bidValue}>
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button size="sm" className="gap-2" onClick={handleAddKeywords}>
              <Plus className="h-4 w-4" />Add Keywords
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="min-w-[200px]">Search Term</TableHead>
                  <TableHead className="min-w-[160px]">Normalized Term</TableHead>
                  <TableHead className="min-w-[140px]">Source Campaign</TableHead>
                  <TableHead className="min-w-[130px]">Source AdGroup</TableHead>
                  <TableHead className="min-w-[150px]">Target Campaign</TableHead>
                  <TableHead className="min-w-[150px]">Target Ad Group</TableHead>
                  <TableHead className="min-w-[120px] text-center">Broad</TableHead>
                  <TableHead className="min-w-[120px] text-center">Exact</TableHead>
                  <TableHead className="min-w-[120px] text-center">Phrase</TableHead>
                  <TableHead className="w-14 text-center">Archive</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">Ad Spend</TableHead>
                  <TableHead className="text-right">Ad Sales</TableHead>
                  <TableHead className="text-right">Ad Units</TableHead>
                  <TableHead className="text-right">CVR</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">ACOS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => {
                  const acos = action.adSales > 0 ? (action.adSpend / action.adSales) * 100 : 0;
                  return (
                    <TableRow key={action.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-medium text-sm">{action.searchTerm}</span>
                          <Select defaultValue={action.termType}>
                            <SelectTrigger className="h-6 w-24 text-[11px] border-dashed">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="generic">Generic</SelectItem>
                              <SelectItem value="branded">Branded</SelectItem>
                              <SelectItem value="competitor">Competitor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{action.normalizedTerm}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{action.sourceCampaignName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{action.sourceAdGroupName}</TableCell>
                      <TableCell>
                        <Select defaultValue={action.targetCampaignId || ""}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>{mockTargetCampaigns.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={action.targetAdGroupId || ""}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>{mockTargetAdGroups.map((ag) => (<SelectItem key={ag.id} value={ag.id}>{ag.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </TableCell>
                      {(["broad", "exact", "phrase"] as const).map((matchType) => (
                        <TableCell key={matchType} className="px-2">
                          <div className={cn(
                            "flex items-center gap-2 rounded-md border px-2 py-1",
                            action.matchTypes[matchType].selected
                              ? "border-primary/30 bg-primary/5"
                              : "border-border bg-muted/20"
                          )}>
                            <Checkbox
                              checked={action.matchTypes[matchType].selected}
                              className="h-3.5 w-3.5"
                            />
                            <Input
                              type="number"
                              value={action.matchTypes[matchType].bid}
                              className="h-6 w-14 border-0 bg-transparent p-0 text-center text-xs shadow-none focus-visible:ring-0"
                              step={0.01}
                            />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(action.impressions)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(action.clicks)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatPercent(action.ctr)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(action.cpc)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(action.adSpend)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(action.adSales)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(action.adUnits)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatPercent(action.cvr)}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{action.roas.toFixed(2)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatPercent(acos)}</TableCell>
                    </TableRow>
                  );
                })}
                {filteredActions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={20} className="h-32 text-center text-muted-foreground">
                      {activeTab === "archive" ? "No archived items found" : activeTab === "history" ? "No history available" : "No targeting actions found. Try fetching keywords."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
