import { useMemo, useState } from "react";
import { X, Check, Reply, Ban, Clock, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImpactChip } from "./chips/ImpactChip";
import { ConfidenceChip } from "./chips/ConfidenceChip";
import { IfIgnoredChip } from "./chips/IfIgnoredChip";
import { SourceGlyph } from "./SourceGlyph";
import { RecommendationBlock } from "./review/RecommendationBlock";
import { AlternativeBlock } from "./review/AlternativeBlock";
import { RelatedDecisionChip } from "./review/RelatedDecisionChip";
import { AuditTrail } from "./review/AuditTrail";
import { ReplayView } from "./review/ReplayView";
import { CompareView } from "./review/CompareView";
import { useActionsStore } from "@/state/actionsStore";
import { lifecycleFor, LIFECYCLE_LABEL } from "@/lib/decisions/lifecycle";
import { recommendationFor, alternativesFor } from "@/lib/decisions/recommendationStructure";
import { relationshipsFor } from "@/lib/decisions/relationships";
import type { Decision } from "@/data/mockDecisions";

interface Props {
  decision: Decision | null;
  onClose: () => void;
  onDiscussAan: (id: string) => void;
  onOpenDecision?: (id: string) => void;
}

type Tab = "decide" | "replay" | "compare" | "audit";

function Block({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
        {eyebrow}
      </div>
      <div className="text-[13.5px] leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export function ReviewWorkspace({ decision: d, onClose, onDiscussAan, onOpenDecision }: Props) {
  const { decisions, approve, reject, delegateToAan, snooze } = useActionsStore();
  const [tab, setTab] = useState<Tab>("decide");

  const relationships = useMemo(() => (d ? relationshipsFor(d, decisions) : []), [d, decisions]);
  const relatedById = useMemo(() => new Map(decisions.map((x) => [x.id, x] as const)), [decisions]);
  const previousOutcomes = useMemo(() => {
    if (!d) return [] as Decision[];
    return decisions
      .filter(
        (x) =>
          x.id !== d.id &&
          x.domain === d.domain &&
          (x.status === "completed" || x.status === "in_flight"),
      )
      .slice(0, 3);
  }, [d, decisions]);

  if (!d) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center border border-dashed border-border rounded-lg bg-card/50">
        <p className="text-[13.5px] text-muted-foreground">Pick a decision on the left to review.</p>
      </div>
    );
  }

  const lc = lifecycleFor(d);
  const isTerminal = lc === "completed_today" || lc === "history";
  const isCompleted = d.status === "completed" || d.status === "in_flight" || d.status === "rejected";
  const parts = recommendationFor(d);
  const alts = alternativesFor(d);

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-4 pb-3 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
              <span>{d.domain}</span>
              <span className="text-border">·</span>
              <span>{d.sourceRef.label}</span>
              <span className="text-border">·</span>
              <span className="text-primary">{LIFECYCLE_LABEL[lc]}</span>
            </div>
            <h2 className="font-heading text-[18px] font-semibold text-foreground leading-snug">
              {d.insight}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <ImpactChip decision={d} />
              <ConfidenceChip decision={d} />
              <IfIgnoredChip decision={d} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
            aria-label="Close review"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="mt-3 flex items-center gap-1 border-b border-transparent -mb-3">
          {(["decide", "replay", "compare", "audit"] as Tab[]).map((k) => {
            const active = tab === k;
            const disabled = k === "replay" && !isCompleted;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                disabled={disabled}
                onClick={() => setTab(k)}
                className={cn(
                  "h-8 px-3 text-[12.5px] rounded-t-md capitalize transition-colors",
                  active
                    ? "text-foreground border-b-2 border-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                  disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                {k}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-4 space-y-5">
          {tab === "decide" && (
            <>
              <Block eyebrow="Why this matters">
                {d.insightDetail || d.valueBasis || "This decision affects revenue trajectory over the next reporting window."}
              </Block>

              <section>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  Recommendation
                </div>
                <RecommendationBlock parts={parts} />
              </section>

              {alts.length > 0 && (
                <section>
                  <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Alternative actions
                  </div>
                  <AlternativeBlock
                    alternatives={alts}
                    onPick={(key) => {
                      if (key === "snooze") snooze(d.id, "tomorrow");
                      else if (key === "delegate") delegateToAan(d.id);
                      else if (key === "reject") reject(d.id);
                    }}
                  />
                </section>
              )}

              {d.valueInputs && d.valueInputs.length > 0 && (
                <Block eyebrow="Evidence">
                  <ul className="space-y-1.5">
                    {d.valueInputs.map((line, i) => (
                      <li key={i} className="flex gap-2 text-[12.5px] text-muted-foreground">
                        <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={12} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {relationships.length > 0 && (
                <section>
                  <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Related decisions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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
                </section>
              )}

              {previousOutcomes.length > 0 && (
                <section>
                  <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                    Previous outcomes
                  </div>
                  <ul className="space-y-1.5">
                    {previousOutcomes.map((p) => (
                      <li key={p.id} className="text-[12.5px] text-muted-foreground">
                        <span className="text-foreground/85">Last time</span>
                        {" · "}
                        {p.status === "rejected" ? "you rejected" : "you approved"}
                        {" · "}
                        {p.insight.slice(0, 90)}
                        {p.insight.length > 90 ? "…" : ""}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <AuditTrail decision={d} />
            </>
          )}

          {tab === "replay" && isCompleted && <ReplayView decision={d} />}
          {tab === "replay" && !isCompleted && (
            <div className="text-[13px] text-muted-foreground py-8">
              Replay opens once this decision has been resolved. It will show the original recommendation, your action, and the final outcome.
            </div>
          )}

          {tab === "compare" && <CompareView subject={d} all={decisions} />}

          {tab === "audit" && <AuditTrail decision={d} defaultOpen />}
        </div>
      </ScrollArea>

      {/* Footer — actions */}
      {tab === "decide" && (
        <footer className="border-t border-border p-3 flex flex-wrap items-center gap-2">
          {isTerminal ? (
            <span className="text-[12.5px] text-muted-foreground px-1">This decision is closed.</span>
          ) : (
            <>
              <Button size="sm" onClick={() => approve(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Check className="h-3.5 w-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDiscussAan(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Modify
              </Button>
              <Button size="sm" variant="outline" onClick={() => reject(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Ban className="h-3.5 w-3.5" /> Reject
              </Button>
              <Button size="sm" variant="outline" onClick={() => delegateToAan(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Reply className="h-3.5 w-3.5" /> Delegate
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 text-[12.5px] gap-1.5" disabled>
                  <UserPlus className="h-3.5 w-3.5" /> Assign
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => snooze(d.id, "tomorrow")}
                  className="h-8 text-[12.5px] gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5" /> Snooze
                </Button>
              </div>
            </>
          )}
        </footer>
      )}
    </div>
  );
}
