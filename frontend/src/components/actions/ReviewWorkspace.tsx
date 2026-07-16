// Review Workspace — single merged panel (no carousel).
// Hierarchy: title → current state → why it matters → evidence → strategy
// → collapsed { Related signals, Execution plan }.
import { useMemo, useState, useEffect, useRef } from "react";
import { X, Check, Ban, Clock, Share2, Sparkles, Activity, TrendingUp, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { StrategyPicker } from "./review/StrategyPicker";
import { ExecutionPlan } from "./review/ExecutionPlan";
import { RelatedDecisionChip } from "./review/RelatedDecisionChip";
import { AssignMenu } from "./review/AssignMenu";
import { DiscussDrawer } from "./review/DiscussDrawer";
import { SourceGlyph } from "./SourceGlyph";
import { useActionsStore } from "@/state/actionsStore";
import { strategiesFor } from "@/lib/decisions/strategies";
import { relationshipsFor } from "@/lib/decisions/relationships";
import { sourcePillFor, PILL_TONE_CLASS } from "@/lib/decisions/sourcePill";
import { formatValue } from "@/lib/decisions/valueFormat";
import { livingStatusPhrase } from "@/lib/decisions/lifecycle";
import { useLivingTick } from "@/hooks/useLivingClock";
import type { Decision } from "@/data/mockDecisions";
import { toast } from "sonner";

interface Props {
  decision: Decision | null;
  onClose: () => void;
  onOpenDecision?: (id: string) => void;
  /** Unused — kept for backward-compat with existing callers. */
  defaultPage?: 0 | 1 | 2;
}

type State = "healthy" | "trending_up" | "blocked" | "critical" | "recovering";
function quickState(d: Decision): State {
  if (d.severity === "critical") return "critical";
  if (d.status === "in_flight" || d.status === "with_aan") return "recovering";
  if (d.severity === "opportunity") return "trending_up";
  if (d.status === "snoozed") return "blocked";
  return "healthy";
}
const STATE_LABEL: Record<State, string> = {
  healthy: "Healthy", trending_up: "Trending up", blocked: "Blocked",
  critical: "Critical", recovering: "Recovering",
};
const STATE_TONE: Record<State, string> = {
  healthy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  trending_up: "bg-primary/10 text-primary border-primary/25",
  blocked: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25",
  critical: "bg-destructive/10 text-destructive border-destructive/25",
  recovering: "bg-warning/10 text-warning border-warning/25",
};

function Block({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
        {eyebrow}
      </div>
      {children}
    </section>
  );
}

export function ReviewWorkspace({ decision: d, onClose, onOpenDecision }: Props) {
  const { decisions, approve, reject, delegateToAan, snooze } = useActionsStore();
  const [discuss, setDiscuss] = useState(false);
  const tick = useLivingTick();
  const rootRef = useRef<HTMLDivElement>(null);

  const strategies = useMemo(() => (d ? strategiesFor(d) : []), [d]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("");

  useEffect(() => {
    if (!d) return;
    const recommended = strategies.find((s) => s.recommended) || strategies[0];
    if (recommended) setSelectedStrategyId(recommended.id);
  }, [d?.id, strategies]);

  const relationships = useMemo(
    () => (d ? relationshipsFor(d, decisions) : []),
    [d, decisions],
  );
  const relatedById = useMemo(
    () => new Map(decisions.map((x) => [x.id, x] as const)),
    [decisions],
  );

  const selectedStrategy = strategies.find((s) => s.id === selectedStrategyId);

  // Enter → execute (default action). Ignore when typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!d || e.key !== "Enter") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (t && t.closest("[role='dialog']")) return;
      e.preventDefault();
      onExecute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d?.id, selectedStrategyId]);

  if (!d) return null;

  const pill = sourcePillFor(d);
  const isTerminal = d.status === "completed" || d.status === "rejected";
  const isRunning = d.status === "in_flight" || d.status === "with_aan";
  const state = quickState(d);
  const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });

  function onExecute() {
    if (!selectedStrategy) return;
    if (selectedStrategy.id.endsWith(":wait")) snooze(d!.id, "tomorrow");
    else if (selectedStrategy.id.endsWith(":aan")) delegateToAan(d!.id);
    else approve(d!.id);
  }

  return (
    <div
      ref={rootRef}
      className="flex flex-col flex-1 min-h-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-[0_1px_0_hsl(var(--border)/0.5),0_30px_60px_-30px_hsl(var(--primary)/0.25)]"
    >
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
            </div>
            <h2 className="mt-2 font-heading text-[18px] font-semibold text-foreground leading-snug tracking-tight">
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
      </header>

      {/* Body — single merged view */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-5 space-y-6">
          {/* Current state */}
          <Block eyebrow="Current state">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1 h-7 px-2.5 rounded-full border text-[12px] font-medium",
                STATE_TONE[state],
              )}>
                <Activity className="h-3 w-3" /> {STATE_LABEL[state]}
              </span>
              {isRunning && (
                <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-primary/25 bg-primary/5 text-[12px] text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  {livingStatusPhrase(d.domain, tick)}
                </span>
              )}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
              {d.insightDetail || d.insight}
            </p>
          </Block>

          {/* Why it matters */}
          <Block eyebrow="Why it matters">
            <div className="rounded-lg border border-border/70 bg-gradient-to-br from-card to-primary/[0.03] p-4">
              <div className="flex items-baseline gap-3">
                <div className="font-heading text-[26px] font-semibold text-success tabular-nums leading-none">
                  {val.text}
                </div>
                <div className="text-[11.5px] text-muted-foreground">{d.valueCaption}</div>
              </div>
              <div className="mt-2 text-[12.5px] text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-success" /> Business impact if executed as recommended
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
              {d.valueBasis || "This affects near-term revenue and needs a decision within the next 48 hours."}
            </p>
          </Block>

          {/* Evidence */}
          {d.valueInputs && d.valueInputs.length > 0 && (
            <Block eyebrow="Evidence">
              <ul className="space-y-1.5">
                {d.valueInputs.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-muted-foreground">
                    <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={12} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {/* Strategy — always visible */}
          <Block eyebrow="Choose your strategy">
            <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent p-3 shadow-[0_1px_0_hsl(var(--border)/0.5),0_20px_50px_-30px_hsl(var(--primary)/0.35)]">
              <StrategyPicker
                strategies={strategies}
                selectedId={selectedStrategyId}
                onSelect={setSelectedStrategyId}
              />
            </div>
          </Block>

          {/* Collapsed extras */}
          <Accordion type="multiple" className="border-t border-border/60 pt-2">
            {relationships.length > 0 && (
              <AccordionItem value="related" className="border-b-0">
                <AccordionTrigger className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground hover:no-underline py-3">
                  Related signals · {relationships.length}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {relationships.map((r) => {
                      const other = relatedById.get(r.otherId);
                      if (!other) return null;
                      return (
                        <RelatedDecisionChip
                          key={r.otherId + r.type}
                          decision={other}
                          type={r.type}
                          onOpen={(id) => onOpenDecision?.(id)}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="plan" className="border-b-0">
              <AccordionTrigger className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground hover:no-underline py-3">
                Execution plan
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-1">
                  {selectedStrategy && <ExecutionPlan strategy={selectedStrategy} />}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="border-t border-border p-3 flex flex-wrap items-center gap-2 bg-gradient-to-t from-muted/20 to-transparent">
        {isTerminal ? (
          <span className="text-[12.5px] text-muted-foreground px-1">This decision is closed.</span>
        ) : (
          <>
            {/* Spotlight wrapper — animated ring draws the eye without resizing/recoloring the button */}
            <div className="relative max-w-[60%]">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-lg ring-2 ring-primary/40 animate-pulse"
              />
              <Button
                size="sm"
                onClick={onExecute}
                className="relative h-9 pl-3 pr-2 text-[13px] gap-1.5 font-medium w-full"
              >
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  Execute{selectedStrategy ? `: ${selectedStrategy.title}` : " selected strategy"}
                </span>
                <span className="ml-1 inline-flex items-center gap-0.5 h-5 px-1.5 rounded border border-primary-foreground/30 bg-primary-foreground/10 text-[10px] font-mono shrink-0">
                  <CornerDownLeft className="h-2.5 w-2.5" /> Enter
                </span>
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setDiscuss(true)} className="h-9 text-[12.5px] gap-1.5 text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Modify
            </Button>
            <AssignMenu
              onAssign={(_key, label) => {
                if (label === "Aan") delegateToAan(d.id);
                else toast.success(`Assigned to ${label}.`);
              }}
            />
            <Button size="sm" variant="ghost" onClick={() => reject(d.id)} className="h-9 text-[12.5px] gap-1.5 text-muted-foreground">
              <Ban className="h-3.5 w-3.5" /> Reject
            </Button>
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => snooze(d.id, "tomorrow")} className="h-8 text-[12px] gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Snooze
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href + "#" + d.id);
                  toast.success("Link copied.");
                }}
                className="h-8 text-[12px] gap-1.5 text-muted-foreground"
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
