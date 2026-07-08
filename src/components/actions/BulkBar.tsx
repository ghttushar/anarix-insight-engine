import { useMemo } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AanMark } from "@/components/branding/AanMark";
import { useSelection } from "@/state/selectionStore";
import { useActionsStore } from "@/state/actionsStore";
import { valueMagnitude, formatValue } from "@/lib/decisions/valueFormat";

/** Docked bulk bar. Sits under the toolbar (not floating), matches TableToolbar style. */
export function BulkBar() {
  const { selected, clear } = useSelection();
  const { decisions, bulkApprove, delegateToAan, reject } = useActionsStore();

  const items = useMemo(
    () => decisions.filter((d) => selected.has(d.id) && d.status === "open"),
    [decisions, selected],
  );

  if (items.length < 1) return null;

  const totalCents = items.reduce((s, d) => s + valueMagnitude(d.valueKind, d.valueCents), 0);
  const totalFmt = totalCents > 0 ? formatValue({ cents: totalCents, kind: "gain" }).text.replace("+ ", "") : null;

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/40 bg-primary/[0.05] px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[13px] font-semibold text-foreground">
          {items.length} selected
        </span>
        {totalFmt && (
          <span className="text-[12.5px] font-mono text-success">total value {totalFmt}</span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => { bulkApprove(items.map((i) => i.id)); clear(); }}
          className="h-8 text-[12.5px] gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" /> Approve all
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => { items.forEach((i) => delegateToAan(i.id)); clear(); }}
          className="h-8 text-[12.5px] gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
        >
          <AanMark size={13} className="text-primary" /> Aan handles all
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => { items.forEach((i) => reject(i.id)); clear(); }}
          className="h-8 text-[12.5px] gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <XCircle className="h-3.5 w-3.5" /> Reject
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={clear}
          className="h-8 w-8 p-0 text-muted-foreground"
          title="Clear selection (Esc)"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
