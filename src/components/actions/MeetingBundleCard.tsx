import { useMemo } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendeePill } from "./AttendeePill";
import { ValuePill } from "./ValuePill";
import { ShareMenu } from "./ShareMenu";
import { useActionsStore } from "@/state/actionsStore";

interface Props {
  bundleId: string;
  onOpen: (bundleId: string) => void;
}

export function MeetingBundleCard({ bundleId, onOpen }: Props) {
  const { meetings, tasksForBundle, bundleValueCents, bundleOpenCount } = useActionsStore();
  const bundle = meetings.find((m) => m.id === bundleId);
  const tasks = tasksForBundle(bundleId);
  const openCount = bundleOpenCount(bundleId);
  const completedCount = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks]);
  const totalValue = bundleValueCents(bundleId);
  if (!bundle) return null;

  const dt = new Date(bundle.ts);
  const isToday = dt.toDateString() === new Date().toDateString();
  const timeLabel = `${isToday ? "Today" : dt.toLocaleDateString([], { month: "short", day: "numeric" })} · ${dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${bundle.durationMin}m`;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card hover:border-border/80 hover:shadow-sm transition-all overflow-hidden">
      <div className="px-4 pt-3.5 flex items-center gap-2">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Meeting</span>
        <span className="text-muted-foreground/60 text-[11px]">·</span>
        <span className="text-[11px] text-muted-foreground">{timeLabel}</span>
        <div className="ml-auto">
          <ShareMenu itemLabel={bundle.title} />
        </div>
      </div>

      <div className="px-4 pt-2.5">
        <div className="flex items-start gap-2.5 flex-wrap">
          <h3 className="text-[15px] font-semibold text-foreground leading-snug">{bundle.title}</h3>
          {totalValue > 0 && <ValuePill cents={totalValue} kind="gain" size="sm" className="mt-0.5" />}
        </div>
      </div>

      <div className="px-4 pt-3 flex items-center gap-3 flex-wrap">
        <div className="flex -space-x-1.5">
          {bundle.attendees.slice(0, 6).map((a) => (
            <AttendeePill key={a.name} name={a.name} role={a.role} size={24} />
          ))}
          {bundle.attendees.length > 6 && (
            <span className="h-6 w-6 rounded-full bg-muted border border-card text-[10px] font-semibold flex items-center justify-center text-muted-foreground">
              +{bundle.attendees.length - 6}
            </span>
          )}
        </div>
        <span className="text-[12px] text-muted-foreground">
          <span className="text-foreground/80 font-medium">{tasks.length}</span> task{tasks.length === 1 ? "" : "s"}
          {openCount > 0 && <> · <span className="text-primary font-medium">{openCount} open</span></>}
          {completedCount > 0 && <> · <span className="text-success font-medium">{completedCount} done</span></>}
        </span>
      </div>

      <div className="px-4 pt-3 pb-3.5 mt-3 border-t border-border/60 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success transition-[width]" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[11px] text-muted-foreground font-mono tabular-nums w-9 text-right">{progressPct}%</span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(bundleId)}
          className={cn(
            "text-[12.5px] text-primary font-medium inline-flex items-center gap-1 hover:underline",
          )}
        >
          Open workspace <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
