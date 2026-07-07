import { X, Check, Users, Video, FileText, Check as CheckIcon, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MeetingTaskBundle } from "@/data/mockMeetingTasks";
import { useAanEvents } from "./AanEventsContext";

interface Props {
  bundle: MeetingTaskBundle;
  onClose: () => void;
}

function SectionHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[10.5px] uppercase tracking-wider font-semibold text-primary">{label}</h3>
    </div>
  );
}

function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const statusBadge: Record<string, string> = {
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-muted text-muted-foreground border-border",
  pending: "bg-primary/10 text-primary border-primary/30",
};

export function MeetingBundleArtifact({ bundle, onClose }: Props) {
  const { approveMeetingItem, rejectMeetingItem, approveAllMeetingItems, rejectAllMeetingItems } = useAanEvents();
  const pendingCount = bundle.actionItems.filter((it) => it.status === "pending").length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[640px] bg-background border-l border-border shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[9.5px] uppercase tracking-wider font-semibold text-primary">Meeting</span>
            <span className="text-[9px] text-muted-foreground/60">·</span>
            <span className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground">
              {bundle.meetingWhen} · {bundle.duration}
            </span>
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground leading-snug truncate">
            {bundle.meetingTitle}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground shrink-0"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-5 space-y-6">
          {/* Participants */}
          <section>
            <SectionHeader icon={Users} label="Participants" />
            <ul className="space-y-1.5">
              {bundle.participants.map((p) => (
                <li key={p.name} className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground/70 shrink-0">
                    {initials(p.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-foreground leading-tight truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground leading-tight truncate">{p.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Summary */}
          <section>
            <SectionHeader icon={FileText} label="Summary" />
            <p className="text-[13px] text-foreground/85 leading-relaxed">{bundle.summary}</p>
            {bundle.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {bundle.tags.map((t) => (
                  <span key={t} className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-foreground/70">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Transcript */}
          <section>
            <SectionHeader icon={Video} label="Transcript excerpt" />
            <div className="rounded-md border border-border bg-muted/30 px-3.5 py-3 space-y-1.5 max-h-[220px] overflow-auto">
              {bundle.transcriptExcerpt.map((line, i) => (
                <div key={i} className="text-[12px] text-foreground/80 leading-relaxed font-mono">
                  {line}
                </div>
              ))}
            </div>
          </section>

          {/* Action items */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <SectionHeader icon={CheckIcon} label={`Action items · ${bundle.actionItems.length}`} />
              {pendingCount > 0 && (
                <span className="text-[10.5px] text-primary font-semibold">{pendingCount} pending</span>
              )}
            </div>
            <ul className="space-y-2">
              {bundle.actionItems.map((it) => {
                const isPending = it.status === "pending";
                return (
                  <li
                    key={it.id}
                    className={cn(
                      "rounded-md border px-3.5 py-2.5",
                      isPending ? "border-border bg-card" : "border-border/60 bg-muted/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-[13px] font-medium text-foreground leading-snug">{it.title}</span>
                          <span className={cn("text-[9.5px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border", statusBadge[it.status])}>
                            {it.status}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {it.owner} · due {it.due}
                        </div>
                        <p className="mt-1.5 text-[12px] text-foreground/75 leading-snug">{it.detail}</p>
                      </div>
                    </div>
                    {isPending && (
                      <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-border/40">
                        <Button
                          size="sm"
                          onClick={() => approveMeetingItem(bundle.bundleId, it.id)}
                          className="h-7 px-3 text-[11.5px] shadow-none"
                        >
                          <Check className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => rejectMeetingItem(bundle.bundleId, it.id)}
                          className="h-7 px-2.5 text-[11.5px] text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </ScrollArea>

      {/* Sticky footer */}
      <div className="border-t border-border px-6 py-3 flex items-center justify-between gap-2 bg-background">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            disabled={pendingCount === 0}
            onClick={() => approveAllMeetingItems(bundle.bundleId)}
            className="h-8 px-3 text-[12px] shadow-none"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Approve all pending
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pendingCount === 0}
            onClick={() => rejectAllMeetingItems(bundle.bundleId)}
            className="h-8 px-3 text-[12px] text-muted-foreground hover:text-destructive"
          >
            <Ban className="h-3.5 w-3.5 mr-1" />
            Reject all pending
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={onClose} className="h-8 px-3 text-[12px]">
          Close
        </Button>
      </div>
    </div>
  );
}
