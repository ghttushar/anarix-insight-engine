// Review Workspace \u2014 3-page carousel: Summary / Details / Metrics.
// One dominant action: Execute Selected Strategy. Plus Modify (opens Aan drawer),
// Assign (menu), Reject, Snooze.
import { useMemo, useState, useEffect } from "react";
import { X, Check, Ban, Clock, Share2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PageIndicator } from "./review/PageIndicator";
import { SummaryPage } from "./review/SummaryPage";
import { DetailsPage } from "./review/DetailsPage";
import { MetricsPage } from "./review/MetricsPage";
import { AssignMenu } from "./review/AssignMenu";
import { DiscussDrawer } from "./review/DiscussDrawer";
import { useActionsStore } from "@/state/actionsStore";
import { strategiesFor, type Strategy } from "@/lib/decisions/strategies";
import { sourcePillFor, PILL_TONE_CLASS } from "@/lib/decisions/sourcePill";
import type { Decision } from "@/data/mockDecisions";
import { toast } from "sonner";

interface Props {
  decision: Decision | null;
  onClose: () => void;
  onOpenDecision?: (id: string) => void;
  /** Which page to default to when a new decision is opened. */
  defaultPage?: 0 | 1 | 2;
}

const PAGE_LABELS = ["Summary", "Details", "Metrics"];

export function ReviewWorkspace({ decision: d, onClose, onOpenDecision, defaultPage = 1 }: Props) {
  const { decisions, approve, reject, delegateToAan, snooze } = useActionsStore();
  const [page, setPage] = useState<number>(defaultPage);
  const [discuss, setDiscuss] = useState(false);

  const strategies = useMemo(() => (d ? strategiesFor(d) : []), [d]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("");

  // When the decision changes: reset carousel to defaultPage and re-pick the
  // recommended strategy.
  useEffect(() => {
    if (!d) return;
    setPage(defaultPage);
    const recommended = strategies.find((s) => s.recommended) || strategies[0];
    if (recommended) setSelectedStrategyId(recommended.id);
  }, [d?.id, defaultPage, strategies]);

  // Keyboard nav between carousel pages.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!d) return;
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowLeft") setPage((p) => Math.max(0, p - 1));
      else if (e.key === "ArrowRight") setPage((p) => Math.min(2, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [d]);

  if (!d) return null;

  const pill = sourcePillFor(d);
  const isTerminal = d.status === "completed" || d.status === "rejected";
  const isRunning = d.status === "in_flight" || d.status === "with_aan";
  const selectedStrategy = strategies.find((s) => s.id === selectedStrategyId);

  const onExecute = () => {
    if (!selectedStrategy) return;
    // Wait \u2192 snooze, Aan \u2192 delegate, else \u2192 approve.
    if (selectedStrategy.id.endsWith(":wait")) snooze(d.id, "tomorrow");
    else if (selectedStrategy.id.endsWith(":aan")) delegateToAan(d.id);
    else approve(d.id);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-[0_1px_0_hsl(var(--border)/0.5),0_30px_60px_-30px_hsl(var(--primary)/0.25)]">
      {/* Header */}
      <header className="relative px-5 pt-4 pb-3 border-b border-border">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.04] to-transparent" />
        <div className="relative flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1.5 h-6 px-2 rounded-full border text-[11px] font-medium",
                PILL_TONE_CLASS[pill.tone],
              )}>
                <pill.Icon size={12} /> {pill.label}
              </span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-widest">
                {d.domain}
              </span>
              {isRunning && (
                <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full border border-primary/25 bg-primary/5 text-[11px] text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  Running
                </span>
              )}
            </div>
            <h2 className="mt-2 font-heading text-[18px] font-semibold text-foreground leading-snug tracking-tight line-clamp-2">
              {d.insight}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
            aria-label="Close review"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Carousel indicator */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="h-7 w-7 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <PageIndicator count={3} value={page} onChange={setPage} labels={PAGE_LABELS} />
          <button
            onClick={() => setPage((p) => Math.min(2, p + 1))}
            disabled={page === 2}
            className="h-7 w-7 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Body \u2014 sliding pages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-5">
          {page === 0 && <SummaryPage decision={d} />}
          {page === 1 && (
            <DetailsPage
              decision={d}
              all={decisions}
              onOpenDecision={(id) => onOpenDecision?.(id)}
              onStrategyChange={(s: Strategy) => setSelectedStrategyId(s.id)}
            />
          )}
          {page === 2 && <MetricsPage decision={d} />}
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="border-t border-border p-3 flex flex-wrap items-center gap-2 bg-gradient-to-t from-muted/20 to-transparent">
        {isTerminal ? (
          <span className="text-[12.5px] text-muted-foreground px-1">This decision is closed.</span>
        ) : (
          <>
            <Button size="sm" onClick={onExecute} className="h-9 px-3 text-[13px] gap-1.5 font-medium max-w-[60%]">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Execute{selectedStrategy ? `: ${selectedStrategy.title}` : " selected strategy"}
              </span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDiscuss(true)} className="h-9 text-[12.5px] gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Modify
            </Button>
            <AssignMenu
              onAssign={(_key, label) => {
                if (label === "Aan") delegateToAan(d.id);
                else toast.success(`Assigned to ${label}.`);
              }}
            />
            <Button size="sm" variant="ghost" onClick={() => reject(d.id)} className="h-9 text-[12.5px] gap-1.5">
              <Ban className="h-3.5 w-3.5" /> Reject
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => snooze(d.id, "tomorrow")} className="h-8 text-[12px] gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Snooze
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href + "#" + d.id);
                  toast.success("Link copied.");
                }}
                className="h-8 text-[12px] gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
            </div>
          </>
        )}
      </footer>

      <DiscussDrawer decision={d} open={discuss} onOpenChange={setDiscuss} />
    </div>
  );
}
