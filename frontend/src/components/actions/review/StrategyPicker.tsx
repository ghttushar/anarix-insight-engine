// Strategy picker — one Recommended + N Alternatives. Radio behaviour.
import { Check, Shield, RotateCcw, TrendingUp, Timer, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatValue } from "@/lib/decisions/valueFormat";
import type { Strategy } from "@/lib/decisions/strategies";

interface Props {
  strategies: Strategy[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const RISK_LABEL = { low: "Low risk", medium: "Medium risk", high: "High risk" } as const;
const REV_LABEL  = { reversible: "Reversible", partial: "Partial", one_way: "One-way" } as const;
const CONF_LABEL = { high: "High", medium: "Medium", low: "Low" } as const;

function Chip({ tone, children }: { tone: "muted" | "success" | "warning"; children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 h-5 px-1.5 rounded-full border text-[10.5px] font-medium",
      tone === "success" && "bg-success/10 text-success border-success/25",
      tone === "warning" && "bg-warning/10 text-warning border-warning/25",
      tone === "muted" && "bg-muted/50 text-muted-foreground border-border/70",
    )}>
      {children}
    </span>
  );
}

export function StrategyPicker({ strategies, selectedId, onSelect }: Props) {
  return (
    <ul className="space-y-2">
      {strategies.map((s) => {
        const active = s.id === selectedId;
        const val = formatValue({ cents: s.valueCents, kind: s.valueKind, cadence: s.cadence });
        return (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className={cn(
                "w-full text-left rounded-lg border p-3 transition-all duration-150",
                active
                  ? "border-primary bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.3)_inset,0_10px_28px_-14px_hsl(var(--primary)/0.5)]"
                  : "border-border/70 bg-card hover:bg-muted/30",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                  active ? "border-primary bg-primary" : "border-border",
                )}>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13.5px] font-medium text-foreground">{s.title}</span>
                    {s.recommended && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-primary">
                        <Sparkles className="h-2.5 w-2.5" /> Recommended
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground line-clamp-2">
                    {s.detail}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Chip tone="success">
                      <TrendingUp className="h-2.5 w-2.5" /> {val.text}
                    </Chip>
                    <Chip tone={s.confidence === "high" ? "success" : s.confidence === "low" ? "warning" : "muted"}>
                      <Check className="h-2.5 w-2.5" /> {CONF_LABEL[s.confidence]} confidence
                    </Chip>
                    <Chip tone={s.risk === "low" ? "success" : s.risk === "high" ? "warning" : "muted"}>
                      <AlertTriangle className="h-2.5 w-2.5" /> {RISK_LABEL[s.risk]}
                    </Chip>
                    <Chip tone="muted">
                      <Shield className="h-2.5 w-2.5" /> {REV_LABEL[s.reversibility]}
                    </Chip>
                    <Chip tone="muted">
                      <Timer className="h-2.5 w-2.5" /> {s.execution}
                    </Chip>
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
