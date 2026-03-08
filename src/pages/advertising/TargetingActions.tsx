import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Archive } from "lucide-react";
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

const termTypeColors: Record<string, string> = {
  branded: "bg-primary/10 text-primary border-primary/20",
  competitor: "bg-destructive/10 text-destructive border-destructive/20",
  generic: "bg-muted text-muted-foreground border-muted",
};

export default function TargetingActions() {
  const [activeTab, setActiveTab] = useState<ActionTab>("keyword-action");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActions = mockTargetingActions.filter((action) => {
    const matchesSearch = action.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) || action.normalizedTerm.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "archive") return matchesSearch && action.archived;
    return matchesSearch && !action.archived;
  });

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const handleFetchKeywords = () => { toast.info("Fetching keywords..."); };
  const handleAddKeywords = () => { toast.info("Opening keyword builder..."); };
  const handleDownload = () => { toast.success("Exporting targeting data..."); };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Targeting Actions" subtitle="Convert search terms into keyword targets across your campaigns" />

        {/* Action Configuration */}
        <div className="flex items-center gap-4 rounded-lg bg-card p-4">
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
          <Button size="sm" className="gap-2" onClick={handleAddKeywords}>
            <Plus className="h-4 w-4" />Add Keywords
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
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
                  <TableRow key={action.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs capitalize", termTypeColors[action.termType])}>{action.termType}</Badge>
                        <span className="font-medium">{action.searchTerm}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{action.normalizedTerm}</TableCell>
                    <TableCell className="text-muted-foreground">{action.sourceCampaignName}</TableCell>
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
                      <TableCell key={matchType} className="text-center px-2">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox checked={action.matchTypes[matchType].selected} />
                          <Input type="number" value={action.matchTypes[matchType].bid} className="h-7 w-16 text-center text-xs" step={0.01} />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Archive className="h-4 w-4 text-muted-foreground" /></Button>
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
                    <TableCell colSpan={14} className="h-32 text-center text-muted-foreground">
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