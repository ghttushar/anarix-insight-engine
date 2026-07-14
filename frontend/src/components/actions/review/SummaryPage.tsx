// Summary page — first of three carousel pages inside the Review Workspace.
import { Activity, TrendingUp } from "lucide-react";
import type { Decision } from "@/data/mockDecisions";
import { livingStatusPhrase } from "@/lib/decisions/lifecycle";
import { useLivingTick } from "@/hooks/useLivingClock";
import { sourcePillFor, PILL_TONE_CLASS } from "@/lib/decisions/sourcePill";
import { formatValue } from "@/lib/decisions/valueFormat";
import { cn } from "@/lib/utils";

type State = "healthy" | "trending_up" | "blocked" | "critical" | "recovering";

function quickState(d: Decision): State {
  if (d.severity === "critical") return "critical";
  if (d.status === "in_flight" || d.status === "with_aan") return "recovering";
  if (d.severity === "opportunity") return "trending_up";
  if (d.status === "snoozed") return "blocked";
  return "healthy";
}
const STATE_LABEL: Record<State, string> = {
  healthy: "Healthy",
  trending_up: "Trending up",
  blocked: "Blocked",
  critical: "Critical",
  recovering: "Recovering",
};
const STATE_TONE: Record<State, string> = {
  healthy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  trending_up: "bg-primary/10 text-primary border-primary/25",
  blocked: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25",
  critical: "bg-destructive/10 text-destructive border-destructive/25",
  recovering: "bg-warning/10 text-warning border-warning/25",
};

export function SummaryPage({ decision: d }: { decision: Decision }) {
  const tick = useLivingTick();
  const state = quickState(d);
  const p = sourcePillFor(d);
  const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
  const isAanWorking = d.status === "in_flight" || d.status === "with_aan";

  return (
    <div className="space-y-5">
      <section>
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
          Current state
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("inline-flex items-center gap-1 h-7 px-2.5 rounded-full border text-[12px] font-medium", STATE_TONE[state])}>
            <Activity className="h-3 w-3" /> {STATE_LABEL[state]}
          </span>
          <span className={cn("inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-[12px] font-medium", PILL_TONE_CLASS[p.tone])}>
            <p.Icon size={13} /> {p.label}
          </span>
          {isAanWorking && (
            <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-primary/25 bg-primary/5 text-[12px] text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {livingStatusPhrase(d.domain, tick)}
            </span>
          )}
        </div>
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
          What&apos;s happening
        </div>
        <p className="text-[14px] leading-relaxed text-foreground/90">
          {d.insightDetail || d.insight}
        </p>
      </section>

      <section className="rounded-lg border border-border/70 bg-gradient-to-br from-card to-primary/[0.03] p-4">
        <div className="flex items-baseline gap-3">
          <div className="font-heading text-[28px] font-semibold text-success tabular-nums leading-none">
            {val.text}
          </div>
          <div className="text-[11.5px] text-muted-foreground">{d.valueCaption}</div>
        </div>
        <div className="mt-2 text-[12.5px] text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-success" /> Business impact if executed as recommended
        </div>
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
          Why this matters
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/80">
          {d.valueBasis || "This affects near-term revenue and needs a decision within the next 48 hours."}
        </p>
      </section>
    </div>
  );
}
