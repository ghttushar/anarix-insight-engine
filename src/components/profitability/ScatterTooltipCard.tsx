import { Sparkles } from "lucide-react";
import { ScatterDataPoint } from "@/types/profitability";
import { Tier, tierColor } from "./scatterCluster";

interface Props {
  points: ScatterDataPoint[];
  tier: Tier;
  x: number;
  y: number;
  onAskAan: (p: ScatterDataPoint) => void;
}

export function ScatterTooltipCard({ points, tier, x, y, onAskAan }: Props) {
  const isCluster = points.length > 1;
  const head = points[0];
  return (
    <div
      className="pointer-events-auto absolute z-30 w-[280px] rounded-lg border border-border bg-popover p-3 shadow-xl"
      style={{ left: x + 14, top: y - 8, transform: y > 220 ? "translateY(-100%)" : undefined }}
    >
      {isCluster ? (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{points.length} products</span>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: tierColor[tier] }} />
          </div>
          <ul className="mb-2 space-y-1">
            {points.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between text-xs">
                <span className="truncate text-foreground">{p.name}</span>
                <span className="ml-2 shrink-0 text-muted-foreground">{p.profitMargin.toFixed(0)}%</span>
              </li>
            ))}
            {points.length > 4 && (
              <li className="text-[11px] text-muted-foreground">+ {points.length - 4} more</li>
            )}
          </ul>
          <p className="text-[11px] text-muted-foreground">Click to zoom in on this cluster.</p>
        </>
      ) : (
        <>
          <div className="mb-2 flex items-start gap-2">
            <div className="h-10 w-10 shrink-0 rounded-md bg-muted" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{head.name}</p>
              <p className="text-[11px] text-muted-foreground">
                ID: {head.id} · SKU: {head.id.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              Profit Margin: {head.profitMargin.toFixed(1)}%
            </span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              Total Sales: ${head.totalSales.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onAskAan(head)}
            className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10"
          >
            <Sparkles className="h-3 w-3" />
            Ask Aan
          </button>
        </>
      )}
    </div>
  );
}
