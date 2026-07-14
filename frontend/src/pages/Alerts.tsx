// /alerts — Decision OS. Lifecycle-grouped queue + in-pane Review Workspace.
// Situations merge duplicate/related decisions. No ViewSwitcher, no SortMenu.

import { useMemo, useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { SelectionProvider, useSelection } from "@/state/selectionStore";
import { EmptyState } from "@/components/actions/EmptyState";
import { EMPTY_FILTER, type FilterState } from "@/components/actions/FilterSheet";
import { KeyboardHelpOverlay } from "@/components/actions/KeyboardHelpOverlay";
import { UndoToast } from "@/components/actions/UndoToast";
import { AlertsToolbar } from "@/components/actions/AlertsToolbar";
import { BulkBar } from "@/components/actions/BulkBar";
import { GreetingHeader } from "@/components/actions/GreetingHeader";
import { QueueSection, MAX_VISIBLE } from "@/components/actions/QueueSection";
import { DecisionRowLite } from "@/components/actions/DecisionRowLite";
import { SituationRow } from "@/components/actions/SituationRow";
import { ReviewWorkspace } from "@/components/actions/ReviewWorkspace";
import { AlertDetailPanel, CLOSED_PANEL, type PanelState } from "@/components/actions/AlertDetailPanel";
import { filterByTab, computeTabCounts, type AlertTabKey } from "@/components/actions/tabs";
import { useDecideKeyboard } from "@/components/actions/useDecideKeyboard";
import {
  lifecycleFor,
  LIFECYCLE_ORDER,
  LIFECYCLE_DEFAULT_EXPANDED,
  importanceScore,
  type Lifecycle,
} from "@/lib/decisions/lifecycle";
import { groupBySituation, type Situation } from "@/lib/decisions/groupSituations";
import type { Decision } from "@/data/mockDecisions";

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
      try {
        sessionStorage.setItem(key, JSON.stringify(n));
      } catch {
        /* noop */
      }
    },
  ];
}

function AlertsInner() {
  const { decisions } = useActionsStore();
  const { clear, selected } = useSelection();

  const [tab, setTab] = usePersistedState<AlertTabKey>("alerts:tab", "needs_me");
  const [query, setQuery] = usePersistedState<string>("alerts:query", "");
  const [density, setDensity] = usePersistedState<"comfortable" | "compact">(
    "alerts:density",
    "comfortable",
  );
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelState>(CLOSED_PANEL);
  const closePanel = useCallback(() => setPanel(CLOSED_PANEL), []);

  // Per-section "show all" toggle for the Show N more tail.
  const [expandedSections, setExpandedSections] = useState<Set<Lifecycle>>(
    () => new Set(),
  );
  const toggleExpanded = useCallback((lc: Lifecycle) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(lc)) next.delete(lc);
      else next.add(lc);
      return next;
    });
  }, []);

  useDecideKeyboard(true);

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

  // Group by lifecycle, then within each lifecycle, group by situation.
  const groups = useMemo(() => {
    const byLc = new Map<Lifecycle, Decision[]>();
    for (const d of filtered) {
      const lc = lifecycleFor(d);
      if (!byLc.has(lc)) byLc.set(lc, []);
      byLc.get(lc)!.push(d);
    }
    const out = new Map<Lifecycle, Situation[]>();
    for (const [lc, list] of byLc) {
      const sits = groupBySituation(list).sort((a, b) => b.totalCents - a.totalCents);
      out.set(lc, sits);
    }
    return out;
  }, [filtered]);

  const selectedDecision = useMemo(
    () => decisions.find((d) => d.id === selectedId) ?? null,
    [decisions, selectedId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (panel.decisionId) closePanel();
        else if (selected.size > 0) clear();
        else if (selectedId) setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.decisionId, closePanel, selected.size, clear, selectedId]);

  const total = filtered.length;
  const isSearchEmpty = query.trim().length > 0 && total === 0;
  const isEmpty = total === 0;

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />

      <div
        className={`px-4 py-5 max-w-[1600px] mx-auto w-full ${
          density === "compact" ? "text-[13px]" : ""
        }`}
      >
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

        <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] items-start">
          {/* Queue column */}
          <ScrollArea className="h-[calc(100vh-260px)] pr-2">
            {isEmpty ? (
              <EmptyState
                variant={
                  isSearchEmpty
                    ? "search"
                    : tab === "needs_me"
                    ? "needs_me"
                    : tab === "watching"
                    ? "watching"
                    : "none"
                }
              />
            ) : (
              LIFECYCLE_ORDER.map((lc) => {
                const situations = groups.get(lc) || [];
                if (situations.length === 0) return null;
                const totalDecisions = situations.reduce(
                  (n, s) => n + s.decisions.length,
                  0,
                );
                const max = MAX_VISIBLE[lc];
                const showAll = expandedSections.has(lc);
                const visibleSituations = showAll ? situations : situations.slice(0, max);
                const hidden = situations.length - visibleSituations.length;
                return (
                  <QueueSection
                    key={lc}
                    lifecycle={lc}
                    count={totalDecisions}
                    defaultOpen={LIFECYCLE_DEFAULT_EXPANDED[lc]}
                  >
                    {visibleSituations.map((sit) => {
                      if (sit.merged) {
                        return (
                          <SituationRow
                            key={sit.key}
                            situation={sit}
                            selectedId={selectedId}
                            onSelect={(id) => setSelectedId(id)}
                          />
                        );
                      }
                      const d = sit.decisions[0];
                      return (
                        <DecisionRowLite
                          key={d.id}
                          decision={d}
                          selected={selectedId === d.id}
                          onSelect={() => setSelectedId(d.id)}
                          onReview={() => setSelectedId(d.id)}
                        />
                      );
                    })}
                    {hidden > 0 && (
                      <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[12px] text-muted-foreground hover:text-foreground"
                          onClick={() => toggleExpanded(lc)}
                        >
                          Show {hidden} more
                        </Button>
                      </div>
                    )}
                    {showAll && situations.length > max && (
                      <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[12px] text-muted-foreground hover:text-foreground"
                          onClick={() => toggleExpanded(lc)}
                        >
                          Collapse
                        </Button>
                      </div>
                    )}
                  </QueueSection>
                );
              })
            )}
          </ScrollArea>

          {/* Review Workspace column — desktop */}
          <div className="hidden xl:flex flex-col h-[calc(100vh-260px)] sticky top-4">
            <ReviewWorkspace
              decision={selectedDecision}
              onClose={() => setSelectedId(null)}
              onDiscussAan={(id) => setPanel({ decisionId: id, mode: "custom" })}
              onOpenDecision={(id) => setSelectedId(id)}
            />
          </div>
        </div>
      </div>

      {/* Below xl: Review Workspace opens as a full-screen sheet */}
      {selectedDecision && (
        <div className="xl:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col p-3 animate-in fade-in duration-150">
          <ReviewWorkspace
            decision={selectedDecision}
            onClose={() => setSelectedId(null)}
            onDiscussAan={(id) => setPanel({ decisionId: id, mode: "custom" })}
            onOpenDecision={(id) => setSelectedId(id)}
          />
        </div>
      )}

      <AlertDetailPanel
        state={panel}
        onOpenChange={(o) => {
          if (!o) closePanel();
        }}
      />

      <KeyboardHelpOverlay />
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
