import { useState } from "react";
import { X, Download, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAan } from "./AanContext";
import { AanLogo } from "./AanLogo";

// Mock campaign data for report view
const mockCampaignData = [
  { name: "SP | Catch All Brand", impressions: "433,245", clicks: "3,595", spend: "$3,245.60", sales: "$10,812.35", roas: "3.33" },
  { name: "SP | New Victory Launch", impressions: "53,421", clicks: "1,087", spend: "$1,923.40", sales: "$8,078.28", roas: "4.20" },
  { name: "SP | Generic Keywords", impressions: "287,654", clicks: "2,341", spend: "$2,876.30", sales: "$5,177.34", roas: "1.80" },
  { name: "SP | Competitor Conquest", impressions: "156,789", clicks: "987", spend: "$1,543.20", sales: "$6,789.45", roas: "4.40" },
  { name: "SP | Retargeting Pool", impressions: "98,432", clicks: "654", spend: "$1,385.10", sales: "$6,097.82", roas: "4.40" },
];

export function AanSplitView() {
  const { mode, currentArtifact, closeAan, openCopilot } = useAan();
  const [currentVersion, setCurrentVersion] = useState(1);
  const [editInput, setEditInput] = useState("");
  const versions = [1, 2, 3]; // Mock versions

  const isOpen = mode === "split";

  if (!currentArtifact) return null;

  const handleEditSubmit = () => {
    if (!editInput.trim()) return;
    // Would create new version here
    setCurrentVersion((v) => v + 1);
    setEditInput("");
  };

  // Extract KPI values from changes
  const getKpiValue = (field: string) => {
    const change = currentArtifact.changes.find((c) => c.field === field);
    return change?.after?.toString() || "N/A";
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/4 transition-opacity"
          onClick={() => openCopilot()}
        />
      )}

      {/* Split Panel - 50% width, NO shadow */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[50vw] min-w-[600px] flex-col border-l border-border bg-background transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 aan-gradient opacity-10" />

          <div className="relative flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <AanLogo showByAnarix={false} />
              <div className="h-6 w-px bg-border" />
              <div>
                <h2 className="font-heading text-sm font-semibold text-foreground">
                  {currentArtifact.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentArtifact.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Version Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    v{currentVersion}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {versions.map((v) => (
                    <DropdownMenuItem
                      key={v}
                      onClick={() => setCurrentVersion(v)}
                    >
                      Version {v}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => openCopilot()}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Artifact Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-lg border border-border bg-card p-6">
            {/* Report-specific content with KPI cards + table */}
            {currentArtifact.type === "report" && (
              <div className="space-y-6">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Total Ad Spend
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {getKpiValue("Total Ad Spend")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Total Ad Sales
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {getKpiValue("Total Ad Sales")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Overall ROAS
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {getKpiValue("Overall ROAS")}
                    </p>
                  </div>
                </div>

                {/* Campaign Table */}
                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Campaign Breakdown
                  </h4>
                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Campaign</TableHead>
                          <TableHead className="text-right font-semibold">Impr</TableHead>
                          <TableHead className="text-right font-semibold">Clicks</TableHead>
                          <TableHead className="text-right font-semibold">Spend</TableHead>
                          <TableHead className="text-right font-semibold">Sales</TableHead>
                          <TableHead className="text-right font-semibold">ROAS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCampaignData.map((campaign, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{campaign.impressions}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{campaign.clicks}</TableCell>
                            <TableCell className="text-right">{campaign.spend}</TableCell>
                            <TableCell className="text-right">{campaign.sales}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{campaign.roas}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Key Insights */}
                {currentArtifact.changes.length > 4 && (
                  <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                      Key Insights
                    </h4>
                    <div className="space-y-3">
                      {currentArtifact.changes.slice(4).map((change, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3"
                        >
                          <span className="text-sm font-medium">{change.field}</span>
                          <span className="text-sm text-primary font-medium">
                            {change.after}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generated timestamp */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    Generated: {new Date().toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric", 
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Audit-specific content */}
            {currentArtifact.type === "audit" && (
              <div className="space-y-6">
                {/* Health Score Card */}
                <div className="flex items-center gap-6 rounded-lg border border-border bg-muted/30 p-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary bg-primary/10">
                    <span className="text-2xl font-bold text-primary">
                      {getKpiValue("Health Score").replace("/100", "")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Account Health Score</h3>
                    <p className="text-sm text-muted-foreground">
                      {getKpiValue("Optimization Score")} optimization grade • {getKpiValue("Campaigns Reviewed")} analyzed
                    </p>
                  </div>
                </div>

                {/* Audit Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {currentArtifact.changes.slice(1, 5).map((change, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {change.field}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {change.after}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Items */}
                {currentArtifact.changes.length > 5 && (
                  <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                      Recommended Actions
                    </h4>
                    <div className="space-y-3">
                      {currentArtifact.changes.slice(5).map((change, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3"
                        >
                          <span className="text-sm font-medium">{change.field}</span>
                          <span className="text-sm text-primary font-medium">
                            {change.after}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Non-report/audit artifact content (bid changes, etc.) */}
            {currentArtifact.type !== "report" && currentArtifact.type !== "audit" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {currentArtifact.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {currentArtifact.description}
                </p>
                {currentArtifact.changes.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3"
                  >
                    <span className="text-sm font-medium">{change.field}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground line-through">
                        {change.before}
                      </span>
                      <span className="text-primary font-medium">
                        → {change.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mini Edit Chat */}
        <div className="border-t border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">
              Editing: {currentArtifact.title} (v{currentVersion})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              placeholder="Message Aan to edit this artifact..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
            />
            <Button size="icon" onClick={handleEditSubmit} disabled={!editInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
