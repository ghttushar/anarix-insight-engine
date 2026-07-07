## Goal
Bring back the previously scrapped **Card view** alongside the current **Stack view**, controlled by a toggle at the top of `/alerts`. Both views expose the same data, tabs, filters, sort, bulk actions, and workflows — only the row/bundle presentation changes.

## 1. View toggle (top of page)
- Add a segmented control in `Alerts.tsx` header row (next to Sort / Filter):
  - `Stack` (current dense 2-line row layout) — default
  - `Card` (restored richer card layout)
- Persist choice in `sessionStorage` key `action-items:view-mode`.
- Toggle applies to **all tabs** (`Decide`, `Meetings`, `Questions`, `Handled`).
- Selection, keyboard nav, bulk bar, undo toasts, sort, filters, overload banner all keep working identically in both views.

## 2. Restore Card view (recreated, not just reverted)
Rebuild the pre-v3 card presentation as fresh components that consume the same store + data as Stack view, so the two stay in sync:

- `DecisionCard.tsx` — one decision per card:
  - Header: source glyph + domain + severity chip + time + status pills (dupe / in-flight / stale)
  - Big value pill (size-lg) with caption
  - Insight paragraph (full `insightDetail` when present)
  - Rationale / value basis block
  - Action cluster (primary verb + secondary + snooze + share + dismiss)
  - Selection checkbox, keyboard focus ring
- `MeetingBundleCard.tsx` — meeting bundle as a card:
  - Meeting title, time, attendee chips (initials + hover tooltip), task count summary
  - Click → same right-side `MeetingWorkspace` Sheet as Stack view
  - Share menu in card header
- `QuestionCard.tsx` — question card with asker, context, answer CTA, snooze, share.
- `HandledCard.tsx` — compact card for handled/completed/rejected/expired entries.

Cards render in a responsive grid: `grid-cols-1 lg:grid-cols-2 xl:grid-cols-2` inside the existing bucket sections (Critical / Opportunity / FYI headers unchanged).

## 3. Alerts.tsx wiring
- Add `viewMode` state + toggle UI.
- Each tab's render branches on `viewMode`:
  - `stack` → existing `DecisionRow` / `MeetingBundleRow` / `QuestionRow` / handled rows
  - `card` → new `*Card` components in a grid
- Bucket headers, empty states, overload banner, bulk action bar, keyboard shortcuts, filter sheet, sort menu unchanged.
- Keep `max-w-[1360px]` container.

## 4. Shared plumbing (no behavior change)
- Both views import from the same `actionsStore`, `selectionStore`, `mockDecisions`, `mockMeetings`, `mockQuestions`.
- Same `UndoToast` events, same first-person Aan voice, same colorless source glyphs / brand marks.
- Sort persistence key stays per-tab; view-mode persistence is separate.

## Files
**New**
- `src/components/actions/ViewModeToggle.tsx`
- `src/components/actions/DecisionCard.tsx`
- `src/components/actions/MeetingBundleCard.tsx`
- `src/components/actions/QuestionCard.tsx`
- `src/components/actions/HandledCard.tsx`

**Edited**
- `src/pages/Alerts.tsx` — toggle, view-mode state, branching render per tab

No data, store, or workflow changes. No files deleted.
