import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Plus, Archive } from "lucide-react";
import { mockTargetingActions, mockTargetCampaigns, mockTargetAdGroups } from "@/data/mockTargetingActions";
import { cn } from "@/lib/utils";

type ActionTab = "keyword-action" | "history" | "archive";

const tabs = [
  { value: "keyword-action", label: "Keyword Action" },
  { value: "history", label: "History" },
  { value: "archive", label: "Archive" },
];

const termTypeColors: Record<string, string> = {
  branded: "bg-primary/10 text-primary border-primary/20",
  competitor: "bg-destructive/10 text-destructive border-destructive/20",
  generic: "bg-muted text-muted-foreground border-muted",
};

const matchTypeColors: Record<string, string> = {
  broad: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  exact: "bg-green-500/10 text-green-600 border-green-500/20",
  phrase: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function TargetingActions() {
  const [activeTab, setActiveTab] = useState<ActionTab>("keyword-action");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredActions = mockTargetingActions.filter((action) => {
    const matchesSearch =
      action.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.normalizedTerm.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "archive") {
      return matchesSearch && action.archived;
    }
    return matchesSearch && !action.archived;
  });

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === filteredActions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredActions.map((a) => a.id)));
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Targeting Actions
          </h1>
          <p className="text-sm text-muted-foreground">
            Convert search terms into keyword targets across your campaigns
          </p>
        </div>

        {/* Action Configuration */}
        <div className="flex items-center gap-4 rounded-lg bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Action Type:</span>
            <Select defaultValue="auto-manual">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto-manual">Auto to Manual</SelectItem>
                <SelectItem value="manual-manual">Manual to Manual</SelectItem>
                <SelectItem value="new-keywords">New Keywords</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
            <Select defaultValue="last-30">
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7">Last 7 days</SelectItem>
                <SelectItem value="last-14">Last 14 days</SelectItem>
                <SelectItem value="last-30">Last 30 days</SelectItem>
                <SelectItem value="last-60">Last 60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Priority:</span>
            <Select defaultValue="high">
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto">
            <Button size="sm">Fetch Keywords</Button>
          </div>
        </div>

        {/* Tabs */}
        <UnderlineTabs
          tabs={tabs}
          value={activeTab}
          onChange={(v) => setActiveTab(v as ActionTab)}
        />

        {/* Table Toolbar */}
        <div className="flex items-center justify-between">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search terms..."
            onFilter={() => {}}
            onDownload={() => {}}
          />
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Keywords
          </Button>
        </div>

        {/* Targeting Actions Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedRows.size === filteredActions.length && filteredActions.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[200px]">Search Term</TableHead>
                  <TableHead className="min-w-[180px]">Normalized Term</TableHead>
                  <TableHead className="min-w-[150px]">Source Campaign</TableHead>
                  <TableHead className="min-w-[150px]">Target Campaign</TableHead>
                  <TableHead className="min-w-[150px]">Target Ad Group</TableHead>
                  <TableHead className="text-center">Broad</TableHead>
                  <TableHead className="text-center">Exact</TableHead>
                  <TableHead className="text-center">Phrase</TableHead>
                  <TableHead className="w-16 text-center">Archive</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => (
                  <TableRow
                    key={action.id}
                    className={cn(
                      "transition-colors",
                      selectedRows.has(action.id) && "bg-primary/5"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(action.id)}
                        onCheckedChange={() => toggleRow(action.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs capitalize", termTypeColors[action.termType])}
                        >
                          {action.termType}
                        </Badge>
                        <span className="font-medium">{action.searchTerm}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{action.normalizedTerm}</TableCell>
                    <TableCell className="text-muted-foreground">{action.sourceCampaignName}</TableCell>
                    <TableCell>
                      <Select defaultValue={action.targetCampaignId || ""}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTargetCampaigns.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={action.targetAdGroupId || ""}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTargetAdGroups.map((ag) => (
                            <SelectItem key={ag.id} value={ag.id}>
                              {ag.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {/* Match Type Columns */}
                    {(["broad", "exact", "phrase"] as const).map((matchType) => (
                      <TableCell key={matchType} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Checkbox
                            checked={action.matchTypes[matchType].selected}
                            className="mb-1"
                          />
                          <Input
                            type="number"
                            value={action.matchTypes[matchType].bid}
                            className="h-7 w-16 text-center text-xs"
                            step={0.01}
                          />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Archive className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(action.impressions)}</TableCell>
                    <TableCell className="text-right">{formatNumber(action.clicks)}</TableCell>
                    <TableCell className="text-right">{formatPercent(action.ctr)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(action.cpc)}</TableCell>
                    <TableCell className="text-right font-medium">{action.roas.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {filteredActions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={15} className="h-32 text-center text-muted-foreground">
                      {activeTab === "archive"
                        ? "No archived items found"
                        : activeTab === "history"
                        ? "No history available"
                        : "No targeting actions found. Try fetching keywords."}
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
