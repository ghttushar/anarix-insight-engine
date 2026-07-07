// New actions store — self-contained, scoped to the Action Items v2 surface.
// Independent of AanEventsContext (which still powers the FloatingActionIsland
// mini-inbox and PanelRoute in Phase 1; those migrate later).
//
// Responsibilities:
//  - Hold Decisions + DigestItems.
//  - Approve / Reject / Delegate-to-Aan / Snooze — with 30s undo window.
//  - Digest threshold (routes items above → Decide, below → Digest).
//  - Bulk ops (approve N).

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { MOCK_DECISIONS, MOCK_DIGEST_ITEMS, type Decision, type DigestItem, type DecisionStatus } from "@/data/mockDecisions";
import { valueMagnitude } from "@/lib/decisions/valueFormat";

const UNDO_MS = 30_000;
const DEFAULT_DIGEST_THRESHOLD_CENTS = 25_000; // $250

export type SnoozeChoice = "1h" | "tomorrow" | "next_week";

const SNOOZE_MS: Record<SnoozeChoice, number> = {
  "1h": 60 * 60 * 1000,
  tomorrow: 20 * 60 * 60 * 1000,
  next_week: 7 * 24 * 60 * 60 * 1000,
};

interface ActionsStore {
  decisions: Decision[];
  digestItems: DigestItem[];
  digestThresholdCents: number;
  setDigestThresholdCents: (c: number) => void;

  approve: (id: string) => void;
  reject: (id: string) => void;
  delegateToAan: (id: string) => void;
  snooze: (id: string, choice: SnoozeChoice) => void;
  bulkApprove: (ids: string[]) => void;

  /** Decisions above digest threshold — belong on Decide. */
  aboveThreshold: Decision[];
  /** Decisions below threshold — routed into digest. */
  belowThreshold: Decision[];
}

const Ctx = createContext<ActionsStore | undefined>(undefined);

export function ActionsProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Decision[]>(MOCK_DECISIONS);
  const [digestItems] = useState<DigestItem[]>(MOCK_DIGEST_ITEMS);
  const [digestThresholdCents, setDigestThresholdCents] = useState<number>(DEFAULT_DIGEST_THRESHOLD_CENTS);

  // Undo bookkeeping — remembers previous status so we can roll back within 30s.
  const undoTimersRef = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; prev: DecisionStatus }>>(new Map());

  const rollback = useCallback((id: string) => {
    const entry = undoTimersRef.current.get(id);
    if (!entry) return;
    clearTimeout(entry.timer);
    undoTimersRef.current.delete(id);
    setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status: entry.prev, updatedAt: Date.now() } : d)));
    toast.message("Undone. Back to your queue.");
  }, []);

  const setStatus = useCallback((id: string, status: DecisionStatus, extras?: Partial<Decision>) => {
    setDecisions((prev) => {
      const target = prev.find((d) => d.id === id);
      if (!target) return prev;
      // Register undo for terminal-ish transitions.
      if (["with_aan", "in_flight", "rejected", "completed", "snoozed"].includes(status)) {
        // Clear any existing timer for this id.
        const existing = undoTimersRef.current.get(id);
        if (existing) clearTimeout(existing.timer);
        const timer = setTimeout(() => undoTimersRef.current.delete(id), UNDO_MS);
        undoTimersRef.current.set(id, { timer, prev: target.status });
      }
      return prev.map((d) => (d.id === id ? { ...d, status, updatedAt: Date.now(), ...extras } : d));
    });
  }, []);

  const approve = useCallback((id: string) => {
    setStatus(id, "in_flight");
    toast.success("Approved. I'll get to work in 30 seconds.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const reject = useCallback((id: string) => {
    setStatus(id, "rejected");
    toast.message("Rejected. I'll stand down for 24h.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const delegateToAan = useCallback((id: string) => {
    setStatus(id, "with_aan");
    toast.success("On it. I'll draft, execute, and report back.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const snooze = useCallback((id: string, choice: SnoozeChoice) => {
    const until = Date.now() + SNOOZE_MS[choice];
    setStatus(id, "snoozed", { snoozedUntil: until });
    const label = choice === "1h" ? "1 hour" : choice === "tomorrow" ? "tomorrow" : "next week";
    toast.message(`Snoozed until ${label}.`, {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const bulkApprove = useCallback((ids: string[]) => {
    ids.forEach((id) => setStatus(id, "in_flight"));
    toast.success(`Approved ${ids.length} items. I'll execute in 30 seconds.`, {
      duration: UNDO_MS,
      action: {
        label: "Undo all",
        onClick: () => ids.forEach(rollback),
      },
    });
  }, [rollback, setStatus]);

  const { aboveThreshold, belowThreshold } = useMemo(() => {
    const above: Decision[] = [];
    const below: Decision[] = [];
    for (const d of decisions) {
      const mag = valueMagnitude(d.valueKind, d.valueCents);
      if (d.valueKind === "info" || mag >= digestThresholdCents) above.push(d);
      else below.push(d);
    }
    return { aboveThreshold: above, belowThreshold: below };
  }, [decisions, digestThresholdCents]);

  const value = useMemo<ActionsStore>(() => ({
    decisions,
    digestItems,
    digestThresholdCents,
    setDigestThresholdCents,
    approve,
    reject,
    delegateToAan,
    snooze,
    bulkApprove,
    aboveThreshold,
    belowThreshold,
  }), [decisions, digestItems, digestThresholdCents, approve, reject, delegateToAan, snooze, bulkApprove, aboveThreshold, belowThreshold]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useActionsStore(): ActionsStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useActionsStore must be used inside <ActionsProvider>");
  return v;
}
