import { useCallback, useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ValuePill } from "./ValuePill";
import { SourceGlyph } from "./SourceGlyph";
import { ShareMenu } from "./ShareMenu";
import { SnoozeMenu } from "./SnoozeMenu";
import type { Decision } from "@/data/mockDecisions";
import { useActionsStore, type SnoozeChoice } from "@/state/actionsStore";
import { useSelection } from "@/state/selectionStore";
import { getSourceMeta } from "@/lib/decisions/sourceRegistry";
import { formatValue } from "@/lib/decisions/valueFormat";

interface Props {
  decision: Decision;
  duplicates?: Decision[];
  interactive?: boolean;
}

const STATUS_TONE: Record<Decision["status"], { label: string; className: string }> = {
  open:       { label: "Open",         className: "text-muted-foreground" },
  with_aan:   { label: "With me",      className: "text-primary" },
  in_flight:  { label: "In flight",    className: "text-primary" },
  completed:  { label: "Completed",    className: "text-success" },
  rejected:   { label: "Rejected",     className: "text-muted-foreground" },
  snoozed:    { label: "Snoozed",      className: "text-muted-foreground" },
  expired:    { label: "Expired",      className: "text-muted-foreground" },
};

const SEVERITY_DOT: Record<Decision["severity"], string> = {
  critical:    "bg-destructive",
  opportunity: "bg-primary",
  fyi:         "bg-muted-foreground/40",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function DecisionCard({ decision: d, duplicates = [], interactive = false }: Props) {
  const { approve, reject, delegateToAan, snooze } = useActionsStore();
  let sel: ReturnType<typeof useSelection> | null = null;
  try { sel = useSelection(); } catch { sel = null; }
  const isSelected = interactive && sel ? sel.isSelected(d.id) : false;
  const isFocused = interactive && sel ? sel.focusedId === d.id : false;
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused) cardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isFocused]);

  const isActionable = d.status === "open";
  const isTerminal = ["completed", "rejected", "expired"].includes(d.status);
  const tone = STATUS_TONE[d.status];
  const sourceMeta = getSourceMeta(d.source);

  const onSnooze = useCallback((c: SnoozeChoice) => snooze(d.id, c), [d.id, snooze]);

  return (
    <div
      ref={cardRef}
      data-decision-id={d.id}
      className={cn(
        "group relative rounded-xl border bg-card transition-all",
        isSelected ? "border-primary/60 bg-primary/[0.04]" : "border-border hover:border-border/80 hover:shadow-sm",
        isFocused && "ring-1 ring-primary/50",
      )}
    >
      {/* Header strip */}
      <div className="flex items-center gap-2 px-4 pt-3.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", SEVERITY_DOT[d.severity])} title={d.severity} />
        <SourceGlyph source={d.source} size={12} />
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          {sourceMeta.label}
        </span>
        <span className="text-muted-foreground/60 text-[11px]">·</span>
        <span className="text-[11px] text-muted-foreground truncate">{d.sourceRef.label}</span>
        <span className="text-muted-foreground/60 text-[11px]">·</span>
        <span className="text-[11px] text-muted-foreground">{timeAgo(d.createdAt)}</span>

        <div className="ml-auto flex items-center gap-1.5">
          {duplicates.length > 0 && (
            <span className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
              ×{duplicates.length + 1}
            </span>
          )}
          {d.status === "in_flight" && (
            <span className="text-[10.5px] text-primary uppercase tracking-wider font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> I'm on it
            </span>
          )}
          {isTerminal && (
            <span className={cn("text-[10.5px] uppercase tracking-wider font-semibold", tone.className)}>
              {tone.label}
            </span>
          )}
          {interactive && sel && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => sel!.toggle(d.id)}
              aria-label="Select decision"
              className={cn("ml-1", isSelected || isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
            />
          )}
        </div>
      </div>

      {/* Value hero */}
      <div className="px-4 pt-3 flex items-start gap-3">
        <ValuePill cents={d.valueCents} kind={d.valueKind} cadence={d.cadence} size="md" />
        <span className="text-[12.5px] text-muted-foreground pt-1.5">{d.valueCaption}</span>
      </div>

      {/* Insight */}
      <div className="px-4 pt-3">
        <div className="text-[14.5px] text-foreground leading-snug font-medium">{d.insight}</div>
        {d.insightDetail && (
          <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{d.insightDetail}</p>
        )}
      </div>

      {/* Rationale */}
      {d.valueBasis && (
        <div className="mx-4 mt-3 rounded-md border border-border/60 bg-muted/25 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
            How I got the number
          </div>
          <p className="text-[12.5px] text-foreground/85 leading-relaxed">{d.valueBasis}</p>
          {d.valueInputs && d.valueInputs.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {d.valueInputs.slice(0, 3).map((v, i) => (
                <li key={i} className="text-[11.5px] text-foreground/75 flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">›</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Meeting reference */}
      {d.meetingRef && (
        <div className="mx-4 mt-2 text-[11.5px] text-muted-foreground italic">
          From meeting: {d.meetingRef.title}
        </div>
      )}

      {/* Action footer */}
      <div className="px-4 pt-4 pb-3.5 mt-2 flex items-center gap-1.5 flex-wrap border-t border-border/60">
        {isActionable ? (
          <>
            <Button
              size="sm"
              onClick={() => approve(d.id)}
              className="h-8 px-3 text-[12.5px] gap-1 font-medium"
            >
              {d.actionVerb}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => delegateToAan(d.id)}
              className="h-8 px-2.5 text-[12px]"
              title="Hand this to me — I'll take care of it"
            >
              You take care of it
            </Button>
            <SnoozeMenu onSelect={onSnooze} />
            <ShareMenu itemLabel={d.insight} />
            <div className="ml-auto flex items-center gap-1">
              {d.deepLink && (
                <Button asChild size="sm" variant="ghost" className="h-8 text-[11.5px]">
                  <a href={d.deepLink.href}>
                    {d.deepLink.label} <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="More">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onSelect={() => { navigator.clipboard.writeText(`${formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence }).text} — ${d.valueBasis}`); }}
                  >
                    Copy $ rationale
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => reject(d.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" /> Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <span className={cn("text-[11.5px] uppercase tracking-wider font-semibold", tone.className)}>
              {tone.label}
            </span>
            {d.deepLink && (
              <Button asChild size="sm" variant="ghost" className="h-8 text-[11.5px] ml-auto">
                <a href={d.deepLink.href}>
                  {d.deepLink.label} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
