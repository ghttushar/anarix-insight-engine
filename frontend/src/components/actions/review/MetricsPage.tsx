// Metrics page — third of the 3-page carousel. Small trend visual, KPI
// deltas, historical performance, related KPIs.
import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatValue } from "@/lib/decisions/valueFormat";
import type { Decision } from "@/data/mockDecisions";

function Sparkline({ series, positive }: { series: number[]; positive?: boolean }) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const w = 260, h = 60;
  const range = max - min || 1;
  const pts = series
    .map((v, i) => `${(i / (series.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const areaPts = `0,${h} ${pts} ${w},${h}`;
  const tone = positive ? "text-success stroke-emerald-500" : "text-destructive stroke-red-500";
  const fill = positive ? "hsl(var(--success)/0.15)" : "hsl(var(--destructive)/0.12)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full h-16", tone)}>
      <polygon points={areaPts} fill={fill} />
      <polyline points={pts} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function genSeries(seed: number, positive: boolean): number[] {
  const out: number[] = [];
  let v = 50 + (seed % 20);
  for (let i = 0; i < 20; i++) {
    v += (Math.sin(i + seed) * 6 + (positive ? 1.5 : -1.2));
    out.push(Math.max(0, v));
  }
  return out;
}

export function MetricsPage({ decision: d }: { decision: Decision }) {
  const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
  const positive = d.valueKind === "gain" || d.valueKind === "at_risk";
  const seed = d.id.charCodeAt(0) + d.id.charCodeAt(1);
  const series = useMemo(() => genSeries(seed, positive), [seed, positive]);

  const kpis = useMemo(() => {
    const base = Math.abs(d.valueCents) / 100;
    return [
      { label: "Weekly run rate", value: `$${Math.round(base / 4).toLocaleString()}`, delta: positive ? "+6.8%" : "-4.2%", up: positive },
      { label: "Days at risk", value: `${Math.max(3, Math.round(base / 200))} d`, delta: positive ? "-2 d" : "+1 d", up: !positive },
      { label: "Confidence", value: d.severity === "critical" ? "High" : d.severity === "opportunity" ? "Medium" : "Low", delta: "stable", up: true },
      { label: "Reversibility", value: d.domain === "cs" ? "Partial" : "Full", delta: "—", up: true },
    ];
  }, [d, positive]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border/70 bg-gradient-to-br from-card to-primary/[0.03] p-4">
        <div className="flex items-baseline gap-3">
          <div className={cn("font-heading text-[26px] font-semibold tabular-nums leading-none", positive ? "text-success" : "text-destructive")}>
            {val.text}
          </div>
          <div className="text-[11.5px] text-muted-foreground">{d.valueCaption}</div>
        </div>
        <div className="mt-2">
          <Sparkline series={series} positive={positive} />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          {positive ? (
            <TrendingUp className="h-3 w-3 text-success" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          Last 20 days
        </div>
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
          Related KPIs
        </div>
        <div className="grid grid-cols-2 gap-2">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-border/60 bg-card px-3 py-2.5">
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="font-heading text-[18px] font-semibold text-foreground tabular-nums">{k.value}</div>
                <div className={cn("text-[11px] font-medium", k.up ? "text-success" : "text-destructive")}>{k.delta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
          Historical performance
        </div>
        <p className="text-[13px] text-foreground/85 leading-relaxed">
          Similar actions across this domain have delivered a median lift of
          {" "}
          <span className="font-medium text-success">+7.2%</span>{" "}
          within 72 hours, with a <span className="font-medium">92%</span> success rate on the last 40 executions.
        </p>
      </section>
    </div>
  );
}
