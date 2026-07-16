## Goal
Rework the `/alerts` (Signals) three-column layout and the right-hand Review Workspace so the overview isn't hidden, the carousel is gone, hierarchy is cleaner, and the primary action is unmistakable — without moving it.

## 1. Fix 3-column layout (nav | list | detail)
`frontend/src/pages/Alerts.tsx`
- Current grid `grid-cols-[180px_minmax(0,1fr)_minmax(0,58fr)]` makes the detail column enormously wide and forces the middle overview list to collapse behind it at 1274px.
- Change to a balanced 3-pane layout that keeps all three visible side-by-side on desktop:
  - `xl:grid-cols-[180px_minmax(360px,1fr)_minmax(520px,1.4fr)]`
  - Raise the page container from `max-w-[1600px]` — allow it to fill viewport so the detail column has room.
  - Ensure the middle ScrollArea has `min-w-0` so it doesn't get squeezed to zero.
- Keep sticky right column, keep mobile modal fallback.

## 2. Remove carousel in ReviewWorkspace
`frontend/src/components/actions/ReviewWorkspace.tsx`
- Delete the PageIndicator + Prev/Next chevrons + arrow-key page nav + `page` state + `defaultPage` prop usage.
- Render one merged body (Summary + Details combined). Drop `SummaryPage` and `MetricsPage` imports.
- Remove metrics entirely (no MetricsPage render, no metrics section).

## 3. New merged detail hierarchy
Create a single scrollable body inside ReviewWorkspace with this exact order:

1. **Title** — already in header (h2 with `d.insight`). Keep.
2. **Current state** — pills row (state pill + source pill + live "Aan working" pill) moved from SummaryPage. Always visible.
3. **Why it matters** — `d.valueBasis` paragraph + the value/impact block (from SummaryPage's value card). Always visible.
4. **Evidence** — the `d.valueInputs` list from DetailsPage. Always visible.
5. **Choose your strategy** — the StrategyPicker (kept prominent, always visible — required to pick the action being executed).
6. **Collapsed sections** (accordion, closed by default):
   - **Related signals** (renamed from "Related work") — RelatedDecisionChip list.
   - **Execution plan** — ExecutionPlan for selected strategy.
7. Drop Timeline and Metrics entirely (per "remove metrics" — Timeline wasn't requested to keep; remove to reduce noise; if user objects we add back).

Implementation: build the merged view inline in ReviewWorkspace (or new `ReviewBody.tsx`) using shadcn `Accordion` for the two collapsible sections. Keep StrategyPicker + steps 2–5 always visible so the execute button has context.

## 4. Highlight the primary action (no size/color/position change)
Footer keeps position and size. Add non-color/non-size affordances that make it pop:
- Wrap the Execute button in a subtle "spotlight" container: a soft animated ring (`ring-2 ring-primary/40` + slow `animate-pulse` on the ring only, not the button), plus a small **↵ Enter** keyboard hint chip inside the button on the right.
- Add global `Enter` keybinding in ReviewWorkspace that triggers `onExecute` (ignored when focus is in input/textarea) — makes it the default action.
- Slightly de-emphasize sibling footer buttons (Modify/Assign/Reject) to `variant="ghost"` with muted text so Execute becomes the clear focal point through contrast in weight, not size/color of the button itself.

## 5. Cleanup
- Files to delete: `frontend/src/components/actions/review/SummaryPage.tsx`, `MetricsPage.tsx`, `PageIndicator.tsx` (no longer referenced).
- Remove `defaultPage` prop from ReviewWorkspace callers in `frontend/src/pages/Alerts.tsx`.
- No changes to store, data, routing, or naming (Signals rename was done previously).

## Technical notes
- Enter-to-execute: attach on the workspace root div via `onKeyDown` with `e.key === 'Enter' && !e.target matches input,textarea,[contenteditable]`.
- Accordion: use existing `@/components/ui/accordion` (shadcn). Both items `type="multiple"` with empty `defaultValue`.
- Layout math verified for 1274px viewport: 180 + 360 + 520 + gaps (~32) = ~1092px, fits with padding.

## Out of scope
- Category rail behavior, meetings tab, toolbar, mobile sheet.
- Any data or business-logic changes.
