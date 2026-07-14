// Business-metric header. Replaces the old "41 need your judgment / 5 handled"
// line with live business KPIs derived from the corpus.
import { useMemo } from "react";
import { TrendingUp, ShieldCheck, Zap, Activity } from "lucide-react";
import { useActionsStore } from "@/state/actionsStore";
import { briefingFor } from "@/lib/decisions/briefing";
import { formatValue } from "@/lib/decisions/valueFormat";

interface Props {
  name?: string;
}

function Metric({ icon: Icon, label, value, tone }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  tone: "success" | "primary" | "warning" | "muted";
}) {
  const toneClass =
    tone === "success" ? "text-success" :
    tone === "primary" ? "text-primary" :
    tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-8 w-8 rounded-full bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground">
        <Icon size={14} />
      </span>
      <div>
        <div className={`font-heading text-[16px] font-semibold tabular-nums leading-none ${toneClass}`}>
          {value}
        </div>
        <div className="text-[10.5px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export function GreetingHeader({ name = "Tushar" }: Props) {
  const { decisions } = useActionsStore();

  const b = briefingFor(decisions);

  const { openValue, protectedValue, running, opportunities } = useMemo(() => {
    let openValue = 0, protectedValue = 0, running = 0, opportunities = 0;
    const today = new Date().toDateString();
    for (const d of decisions) {
      if (d.status === "open") {
        if (d.valueKind !== "info") openValue += Math.abs(d.valueCents);
        if (d.severity === "opportunity") opportunities += 1;
      }
      if ((d.status === "in_flight" || d.status === "with_aan") && new Date(d.updatedAt).toDateString() === today) {
        if (d.valueKind !== "info") protectedValue += Math.abs(d.valueCents);
      }
      if (d.status === "in_flight" || d.status === "with_aan") running += 1;
    }
    return { openValue, protectedValue, running, opportunities };
  }, [decisions]);

  const openStr = formatValue({ cents: openValue, kind: "gain" }).text;
  const protStr = formatValue({ cents: protectedValue, kind: "gain" }).text;

  return (
    <header className="mb-5">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h1 className="font-heading text-[26px] font-semibold text-foreground leading-tight tracking-tight">
          {b.greeting.replace(/\.$/, "")}, {name}.
        </h1>
        <p className="text-[13.5px] text-muted-foreground">{b.dateline}</p>
      </div>

      <div className="mt-4 flex items-center gap-8 flex-wrap">
        <Metric icon={TrendingUp} label="Opportunity open" value={openStr} tone="success" />
        <Metric icon={ShieldCheck} label="Revenue protected today" value={protStr} tone="success" />
        <Metric icon={Zap} label="Aan running" value={String(running)} tone="primary" />
        <Metric icon={Activity} label="Opportunities today" value={String(opportunities)} tone="muted" />
      </div>
    </header>
  );
}
