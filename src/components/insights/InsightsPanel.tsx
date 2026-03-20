import { X, AlertTriangle, AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInsights } from "./InsightsContext";
import { InsightCard } from "./InsightCard";

export function InsightsPanel() {
  const {
    isOpen,
    closePanel,
    insights,
    criticalCount,
    attentionCount,
    positiveCount,
  } = useInsights();

  const criticalInsights = insights.filter((i) => i.category === "critical");
  const attentionInsights = insights.filter((i) => i.category === "attention");
  const positiveInsights = insights.filter((i) => i.category === "positive");

  if (!isOpen) return null;

  return (
    <div className="flex h-full w-[420px] shrink-0 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">
                Insights
              </h2>
              <p className="text-xs text-muted-foreground">
                {criticalCount + attentionCount + positiveCount} active insights
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closePanel}
            className="h-8 w-8"
            title="Close insights"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary Pills */}
        <div className="flex items-center gap-2 border-t border-border/50 bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs">
            <AlertTriangle className="h-3 w-3 text-destructive" />
            <span className="font-medium text-destructive">{criticalCount}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs">
            <AlertCircle className="h-3 w-3 text-warning" />
            <span className="font-medium text-warning">{attentionCount}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs">
            <CheckCircle2 className="h-3 w-3 text-success" />
            <span className="font-medium text-success">{positiveCount}</span>
          </div>
        </div>
      </div>

      {/* Content — independent scroll */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="space-y-6 p-4">
          {criticalInsights.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">Critical Alerts</h3>
              </div>
              <div className="space-y-3">
                {criticalInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </section>
          )}

          {attentionInsights.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-semibold text-warning">Worth a Look</h3>
              </div>
              <div className="space-y-3">
                {attentionInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </section>
          )}

          {positiveInsights.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <h3 className="text-sm font-semibold text-success">Wins & Highlights</h3>
              </div>
              <div className="space-y-3">
                {positiveInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
