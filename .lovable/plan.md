## Scope
All changes are UI/presentation in the `/alerts` (Signals) workspace and the shared taskbar. No business logic changes.

---

### 1. Remove the 30-second undo everywhere
- `frontend/src/components/actions/UndoToast.tsx`: keep `publishUndoable` export (still called from store) but make `<UndoToast />` render `null` (dead component). Remove `<UndoToast />` mount from `Alerts.tsx`.
- Keep the inline 5-second undo on the review card (that's the "show undo option" behavior).
- Leave `actionsStore.tsx` `publishUndoable(...)` calls untouched (no visible surface anymore, but rollback still works).

### 2. Rename "Reject" → "Dismiss"
- `ReviewWorkspace.tsx` footer button label + icon stays (`Ban`), label becomes `Dismiss`.
- `DecisionValueCard.tsx` dropdown item "Archive" stays as-is (different concept). Only the Reject label in ReviewWorkspace changes.

### 3. Post-execute redesign in `ReviewWorkspace.tsx`
When `executed` is set:
- Hide the entire "Choose your strategy" `<Block>`.
- Add a subtle glow ring to the header (`animate-pulse` primary/success outer ring around the title container).
- Replace footer post-execute pill with a centered, large in-body message: big check + `Executed: {strategyTitle}` in ~28px heading, verify message below in ~14px muted, small undo button under it. Auto-close countdown remains 5s.
- Footer stays hidden or reduced to a single Close button.

### 4. Strategy cards simplified (`review/StrategyPicker.tsx`)
- Remove ALL chips (Protect $6.9k, Confidence, Risk, Reversible, Timer).
- Keep only: radio dot, title (bump to `text-[16px] font-semibold`), detail text (bump to `text-[14px]` `text-foreground/85`, no clamp).
- Recommended pill stays (small, inline with title).
- Increased padding for airier layout.

### 5. Critical badge on overview card
- `DecisionValueCard.tsx`: when `d.severity === "critical"`, render a small red pill (`⚠ Critical`) next to the source pill row.

### 6. Deduplicate signals on `all` tab
- `frontend/src/lib/decisions/categories.ts`: remove `"Pending This Week"` from `ALL_ORDER` and stop calling `add("Pending This Week", d)` in the `all` branch. Signals appear only in their domain bucket. Keep bucket for `meetings`/`fyi` tabs.

### 7. Single-category filter mode (no scroll-switch)
- `Alerts.tsx`: change `handleRailSelect` behavior — clicking a rail item filters `categoryGroups` to just that category (or clears when re-clicked). Remove `scrollIntoView` and `sectionRefs` scroll logic. Selected rail item stays highlighted.
- `CategoryRail`: add a small "All" option at the top to reset.

### 8. Tighten "Current state" and "Why it matters" copy
In `ReviewWorkspace.tsx`:
- Current state paragraph: font bumped to `text-[15px]`, replace long `insightDetail` with a concise 2-line summary derived from the same text (trim to the first sentence + one impact sentence). For the mock critical decision, tighten `criticalOnlyDecision.ts` `insightDetail` to two crisp sentences.
- Why it matters:
  - Remove the "revenue at risk · next 7 days" caption line (`{d.valueCaption}`).
  - Remove the "Business impact if executed as recommended" line.
  - Keep the big value number and the `valueBasis` paragraph, bump paragraph to `text-[14.5px]`.

### 9. Remove empty Row 2 of `AppTaskbar` on /alerts
- `AppTaskbar.tsx`: change `hasRow2` from `... || true` to a real check (`showAdType || showFrequency || showDateRange || showRunButton || !!children || (islandOff && !hideUtilityCluster)`). On /alerts none of these are set and utility cluster is hidden → Row 2 disappears entirely. Row 1 with breadcrumb + Account/Sync/Aan/View remains.

### 10. Verification
- Run `bun x tsgo --noEmit` after edits.
- Load `/alerts` in Playwright with a viewport of 1377×965, screenshot: confirm single taskbar row, no duplicate "Pending This Week" card, Critical badge visible on the overview card, category rail filters instead of scrolls, strategy cards show only title + brief, click Execute → glow on header + big centered message + 5s undo.

### Files touched
- `frontend/src/pages/Alerts.tsx`
- `frontend/src/components/actions/ReviewWorkspace.tsx`
- `frontend/src/components/actions/UndoToast.tsx`
- `frontend/src/components/actions/DecisionValueCard.tsx`
- `frontend/src/components/actions/CategoryRail.tsx`
- `frontend/src/components/actions/review/StrategyPicker.tsx`
- `frontend/src/lib/decisions/categories.ts`
- `frontend/src/components/layout/AppTaskbar.tsx`
- `frontend/src/data/criticalOnlyDecision.ts` (tighten copy)
