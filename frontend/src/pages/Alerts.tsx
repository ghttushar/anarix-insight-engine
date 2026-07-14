// /alerts \u2014 Decision Workspace.
// New: 4 tabs (All / From Meetings / FYI / Done), category sections per tab,
// value-headlined cards, meeting-aware right pane, 3-page carousel with
// daily briefing as default. No Watching, no Stack/Grid, no severity dots.

import { useMemo, useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { SelectionProvider, useSelection } from "@/state/selectionStore";
import { EmptyState } from "@/components/actions/EmptyState";
import { EMPTY_FILTER, type FilterState } from "@/components/actions/FilterSheet";
import { UndoToast } from "@/components/actions/UndoToast";
import { AlertsToolbar } from "@/components/actions/AlertsToolbar";
import { BulkBar } from "@/components/actions/BulkBar";
import { GreetingHeader } from "@/components/actions/GreetingHeader";
import { DailyBriefing } from "@/components/actions/DailyBriefing";
import { CategorySection } from "@/components/actions/CategorySection";
import { DecisionValueCard } from "@/components/actions/DecisionValueCard";
import { ReviewWorkspace } from "@/components/actions/ReviewWorkspace";
import { MeetingReviewView } from "@/components/actions/review/MeetingReviewView";
import { AlertDetailPanel, CLOSED_PANEL, type PanelState } from "@/components/actions/AlertDetailPanel";
import { filterByTab, computeTabCounts, type AlertTabKey } from "@/components/actions/tabs";
import { categorize } from "@/lib/decisions/categories";
import { importanceScore } from "@/lib/decisions/lifecycle";
import type { Decision } from "@/data/mockDecisions";

const MAX_PER_CATEGORY = 8;

function usePersistedState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  return [
    v,
    (n) => {
      setV(n);
      try { sessionStorage.setItem(key, JSON.stringify(n)); } catch { /* noop */ }
    },
  ];
}

function AlertsInner() {
  const { decisions } = useActionsStore();
  const { clear, selected } = useSelection();

  const [tab, setTab] = usePersistedState<AlertTabKey>("alerts:tab", "all");
  const [query, setQuery] = usePersistedState<string>("alerts:query", "");
  const [density, setDensity] = usePersistedState<"comfortable" | "compact">(
    "alerts:density", "comfortable",
  );
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelState>(CLOSED_PANEL);
  const closePanel = useCallback(() => setPanel(CLOSED_PANEL), []);

  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const toggleExpanded = useCallback((k: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }, []);

  const counts = useMemo(() => computeTabCounts(decisions), [decisions]);
  const pool = useMemo(() => filterByTab(decisions, tab), [decisions, tab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pool
      .filter((d) => {
        if (filter.sources.size && !filter.sources.has(d.source)) return false;
        if (filter.domains.size && !filter.domains.has(d.domain)) return false;
        if (
          q &&
          !`${d.insight} ${d.sourceRef.label} ${d.domain}`
            .toLowerCase()
            .includes(q)
        )
          return false;
        return true;
      })
      .sort((a, b) => importanceScore(b) - importanceScore(a));
  }, [pool, filter, query]);

  const categoryGroups = useMemo(() => categorize(tab, filtered), [tab, filtered]);

  const selectedDecision = useMemo(
    () => decisions.find((d) => d.id === selectedId) ?? null,
    [decisions, selectedId],
  );

  const selectedMeetingBundle = useMemo(() => {
    if (!selectedMeetingId) return null;
    const first = decisions.find((d) => d.meetingRef?.bundleId === selectedMeetingId);
    return first
      ? { bundleId: selectedMeetingId, title: first.meetingRef!.title }
      : null;
  }, [decisions, selectedMeetingId]);

  const onSelectDecision = useCallback((id: string) => {
    setSelectedId(id);
    setSelectedMeetingId(null);
  }, []);

  const onSelectMeeting = useCallback((bundleId: string) => {
    setSelectedMeetingId(bundleId);
    setSelectedId(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (panel.decisionId) closePanel();
        else if (selected.size > 0) clear();
        else if (selectedId) setSelectedId(null);
        else if (selectedMeetingId) setSelectedMeetingId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.decisionId, closePanel, selected.size, clear, selectedId, selectedMeetingId]);

  const total = filtered.length;
  const isSearchEmpty = query.trim().length > 0 && total === 0;
  const isEmpty = total === 0;

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />

      {/* Ambient background layer for the living aesthetic */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-primary/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-400/[0.04] blur-[120px]" />
        <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      <div className={`px-4 py-5 max-w-[1600px] mx-auto w-full ${density === "compact" ? "text-[13px]" : ""}`}>
        <GreetingHeader name="Tushar" />

        <AlertsToolbar
          tab={tab}
          onTabChange={setTab}
          counts={counts}
          query={query}
          onQueryChange={setQuery}
          density={density}
          onDensityChange={setDensity}
          filter={filter}
          onFilterChange={setFilter}
          filterSheetOpen={filterSheetOpen}
          onFilterSheetOpenChange={setFilterSheetOpen}
        />

        <BulkBar />

        <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] items-start">
          {/* Left: category-grouped queue */}
          <ScrollArea className="h-[calc(100vh-300px)] pr-2">
            {isEmpty ? (
              <EmptyState
                variant={
                  isSearchEmpty ? "search"
                  : tab === "done" ? "none"
                  : "needs_me"
                }
              />
            ) : (
              categoryGroups.map((cat) => {
                const showAll = expandedCats.has(cat.key);
                const visible = showAll ? cat.items : cat.items.slice(0, MAX_PER_CATEGORY);
                const hidden = cat.items.length - visible.length;
                return (
                  <CategorySection
                    key={cat.key}
                    label={cat.label}
                    count={cat.items.length}
                    defaultOpen={cat.defaultOpen}
                  >
                    {visible.map((d: Decision) => (
                      <DecisionValueCard
                        key={d.id}
                        decision={d}
                        selected={selectedId === d.id || (d.meetingRef?.bundleId === selectedMeetingId)}
                        onSelect={() => onSelectDecision(d.id)}
                        onSelectMeeting={
                          d.meetingRef ? (bundleId) => onSelectMeeting(bundleId) : undefined
                        }
                      />
                    ))}
                    {hidden > 0 && (
                      <div className="px-4 py-2 border-t border-border/40 bg-muted/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[12px] text-muted-foreground hover:text-foreground"
                          onClick={() => toggleExpanded(cat.key)}
                        >
                          Show {hidden} more
                        </Button>
                      </div>
                    )}
                    {showAll && cat.items.length > MAX_PER_CATEGORY && (
                      <div className="px-4 py-2 border-t border-border/40 bg-muted/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[12px] text-muted-foreground hover:text-foreground"
                          onClick={() => toggleExpanded(cat.key)}
                        >
                          Collapse
                        </Button>
                      </div>
                    )}
                  </CategorySection>
                );
              })
            )}
          </ScrollArea>

          {/* Right: workspace \u2014 daily briefing / meeting view / review workspace */}
          <div className="hidden xl:flex flex-col h-[calc(100vh-300px)] sticky top-4">
            {selectedDecision ? (
              <ReviewWorkspace
                decision={selectedDecision}
                onClose={() => setSelectedId(null)}
                onOpenDecision={(id) => onSelectDecision(id)}
                defaultPage={1}
              />
            ) : selectedMeetingBundle ? (
              <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border/70 bg-card p-5">
                <MeetingReviewView
                  bundleId={selectedMeetingBundle.bundleId}
                  bundleTitle={selectedMeetingBundle.title}
                  all={decisions}
                  onOpen={onSelectDecision}
                />
              </div>
            ) : (
              <DailyBriefing />
            )}
          </div>
        </div>
      </div>

      {/* Below xl: modal review sheet */}
      {(selectedDecision || selectedMeetingBundle) && (
        <div className="xl:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col p-3 animate-in fade-in duration-150 overflow-auto">
          {selectedDecision ? (
            <ReviewWorkspace
              decision={selectedDecision}
              onClose={() => setSelectedId(null)}
              onOpenDecision={(id) => onSelectDecision(id)}
              defaultPage={1}
            />
          ) : selectedMeetingBundle ? (
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <MeetingReviewView
                bundleId={selectedMeetingBundle.bundleId}
                bundleTitle={selectedMeetingBundle.title}
                all={decisions}
                onOpen={onSelectDecision}
              />
              <div className="mt-4">
                <Button size="sm" variant="outline" onClick={() => setSelectedMeetingId(null)}>Close</Button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <AlertDetailPanel state={panel} onOpenChange={(o) => { if (!o) closePanel(); }} />
      <UndoToast />
    </AppLayout>
  );
}

export default function AlertsPage() {
  return (
    <ActionsProvider>
      <SelectionProvider>
        <AlertsInner />
      </SelectionProvider>
    </ActionsProvider>
  );
}
