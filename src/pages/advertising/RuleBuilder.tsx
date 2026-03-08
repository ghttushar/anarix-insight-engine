import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Play, Pause, FlaskConical } from "lucide-react";
import { mockRules, type AutomationRule } from "@/data/mockRuleBuilder";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartType, ChartMetric } from "@/components/charts/ChartContainer";
import { useCurrency } from "@/contexts/CurrencyContext";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  draft: "bg-muted text-muted-foreground border-muted",
  paused: "bg-warning/10 text-warning border-warning/20",
};

function BacktestChart({ selectedRule, backtestData }: { selectedRule: AutomationRule | null; backtestData: { date: string; savings: number; revenueLoss: number }[] }) {
  const { formatCurrency } = useCurrency();
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["savings", "revenueLoss"]);

  const metrics: ChartMetric[] = [
    { key: "savings", label: "Savings", color: "hsl(var(--success))", active: activeMetrics.includes("savings") },
    { key: "revenueLoss", label: "Revenue Loss", color: "hsl(var(--destructive))", active: activeMetrics.includes("revenueLoss") },
  ];

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "line" ? (
        <LineChart data={backtestData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("savings") && <Line type="monotone" dataKey="savings" stroke="hsl(var(--success))" strokeWidth={2} name="Savings" />}
          {activeMetrics.includes("revenueLoss") && <Line type="monotone" dataKey="revenueLoss" stroke="hsl(var(--destructive))" strokeWidth={2} name="Revenue Loss" />}
        </LineChart>
      ) : chartType === "area" ? (
        <AreaChart data={backtestData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("savings") && <Area type="monotone" dataKey="savings" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} name="Savings" />}
          {activeMetrics.includes("revenueLoss") && <Area type="monotone" dataKey="revenueLoss" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Revenue Loss" />}
        </AreaChart>
      ) : (
        <BarChart data={backtestData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("savings") && <Bar dataKey="savings" fill="hsl(var(--success))" name="Savings" radius={[2, 2, 0, 0]} />}
          {activeMetrics.includes("revenueLoss") && <Bar dataKey="revenueLoss" fill="hsl(var(--destructive))" fillOpacity={0.4} name="Revenue Loss" radius={[2, 2, 0, 0]} />}
        </BarChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <div className="lg:col-span-2">
      <ChartContainer
        title={`Backtest: ${selectedRule?.name || "Select a rule"}`}
        subtitle={selectedRule?.backtestResult?.period}
        metrics={metrics}
        onMetricToggle={toggleMetric}
        chartType={chartType}
        onChartTypeChange={setChartType}
        expandedChildren={renderChart(400)}
      >
        {selectedRule?.backtestResult ? (
          <>
            {renderChart(200)}
            <div className="grid grid-cols-4 gap-3 mt-3 text-xs">
              <div><span className="text-muted-foreground block">Triggered</span><span className="font-medium text-foreground">{selectedRule.backtestResult.triggeredCount} times</span></div>
              <div><span className="text-muted-foreground block">Campaigns Affected</span><span className="font-medium text-foreground">{selectedRule.backtestResult.affectedCampaigns}</span></div>
              <div><span className="text-muted-foreground block">Projected Savings</span><span className="font-medium text-success">{formatCurrency(selectedRule.backtestResult.projectedSavings)}</span></div>
              <div><span className="text-muted-foreground block">Net Impact</span><span className="font-medium text-foreground">{formatCurrency(selectedRule.backtestResult.netImpact)}</span></div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">Select a rule to view backtest results</p>
        )}
      </ChartContainer>
    </div>
  );
}

export default function RuleBuilder() {
  const { formatCurrency } = useCurrency();
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(mockRules[0]);

  const backtestData = selectedRule?.backtestResult?.dailyResults.slice(-14).map((d) => ({
    date: d.date.slice(5),
    savings: +d.savings.toFixed(0),
    revenueLoss: +Math.abs(d.revenueLoss).toFixed(0),
  })) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Rule Builder with Backtesting"
          subtitle="Define automation rules and simulate their historical impact before activating"
          actions={
            <Button size="sm" onClick={() => toast.info("Opening rule creation form...")}><Plus className="mr-2 h-4 w-4" />Create Rule</Button>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Total Rules</p>
            <p className="text-xl font-semibold text-foreground">{mockRules.length}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Active Rules</p>
            <p className="text-xl font-semibold text-foreground">{mockRules.filter((r) => r.status === "active").length}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Total Projected Savings</p>
            <p className="text-xl font-semibold text-success">{formatCurrency(mockRules.reduce((s, r) => s + (r.backtestResult?.projectedSavings || 0), 0))}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Net Impact</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(mockRules.reduce((s, r) => s + (r.backtestResult?.netImpact || 0), 0))}</p>
          </CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BacktestChart selectedRule={selectedRule} backtestData={backtestData} />

          {/* Rule Details */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Rule Details</h3>
            {selectedRule && (
              <Card>
                <CardContent className="pt-4 pb-3 px-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">{selectedRule.name}</span>
                    <Badge variant="outline" className={statusStyles[selectedRule.status]}>{selectedRule.status}</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Condition</span><span className="font-medium text-foreground">{selectedRule.condition}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Action</span><span className="font-medium text-foreground">{selectedRule.action}</span></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info("Running backtest...")}><FlaskConical className="mr-1 h-3 w-3" />Backtest</Button>
                    <Button size="sm" className="flex-1" onClick={() => toast.success("Rule activated")}>
                      {selectedRule.status === "active" ? <><Pause className="mr-1 h-3 w-3" />Pause</> : <><Play className="mr-1 h-3 w-3" />Activate</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Rules Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[200px]">Rule Name</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Triggers (30d)</TableHead>
                <TableHead className="text-right">Savings</TableHead>
                <TableHead className="text-right">Net Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRules.map((rule) => (
                <TableRow key={rule.id} className={cn("cursor-pointer", selectedRule?.id === rule.id && "bg-primary/5")} onClick={() => setSelectedRule(rule)}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="text-muted-foreground">{rule.condition}</TableCell>
                  <TableCell className="text-muted-foreground">{rule.action}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline" className={statusStyles[rule.status]}>{rule.status}</Badge></TableCell>
                  <TableCell className="text-right">{rule.backtestResult?.triggeredCount || "—"}</TableCell>
                  <TableCell className="text-right text-success">{rule.backtestResult ? formatCurrency(rule.backtestResult.projectedSavings) : "—"}</TableCell>
                  <TableCell className="text-right font-medium">{rule.backtestResult ? formatCurrency(rule.backtestResult.netImpact) : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
