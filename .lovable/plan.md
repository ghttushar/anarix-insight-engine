## Scope
Rebuild Stack and Grid views on `/alerts` to fix alignment, terminology, expand behavior, action layout, and undo. Match the earlier "Phase 2 Meetings" layout inside both views. No business-logic changes — presentation only.

## Global changes (both views)

### Value rendering
- `ValueBlock.tsx`: remove the `Protect` / `+` prefix labels and the `/mo`, `/wk` cadence suffix. Render pure amount only: `$12k`, `$4.8k`, `$1.6k`. Color still driven by `kind` (gain=green, at_risk/cost=red-ish, info=muted). Caption line (e.g., "buyer commit at risk") kept as-is.
- Keep monospace tabular-nums; unchanged sizes.

### Source icon
- `SourceGlyph.tsx`: default size bumped from 11 → 14px; container padding adjusted so it reads clearly next to the meta line.

### Terminology sweep
- Global rename in `src/data/*.ts` and any label strings: `monitor` → `agent` (case-preserving: `Monitor`→`Agent`, `monitor`→`agent`). Examples: `Buy Box monitor` → `Buy Box agent`, `Inventory monitor` → `Inventory agent`, `Campaign monitor` → `Campaign agent`, `Buybox monitor` → `Buybox agent`.
- Em-dash sweep: replace every `—` in decision/meeting/task copy with ` - ` (regular hyphen surrounded by spaces). Applies to `mockDecisions.ts`, `mockMeetings.ts`, `mockMeetingTasks.ts`, and any inline strings in the alert components.

### Action row (`ActionChoiceRow.tsx`)
- Rename "Reject" → "Dismiss" everywhere (button label, aria-labels, dropdown items, bulk bar, detail panel footer). Store status stays `rejected` internally.
- Remove the standalone "View more" button from the action row.
- Consolidate custom-action + Ask Aan: single secondary item labeled **"Write custom action / Discuss with Aan"**. Clicking it opens the right-side Aan chat panel (mini Aan panel already used app-wide), pre-seeded with the decision context. No separate Ask Aan button, no Ask Aan menu item.
- Left-align the action cluster in Stack rows (currently right-aligned). Order: `[Primary action] [caret variants] [Dismiss] [Custom/Discuss with Aan] [⋯ overflow]`. Buttons in a fixed-width slot so rows line up column-wise.

### Expand behavior
- Remove separate expand icon + chevron pair. Single chevron toggle only. Remove the `Maximize2`/`Minimize2` "focus" control that swapped Grid→Stack — that behavior is gone.
- Card expands **in place**. No layout jump between views.

### Undo / completion
- Remove "Clear completed" concept from Stack + Grid toolbars and any bulk bar affordances tied to it.
- On action: card stays in place, shows subtle status gradient + `SettledStrip` with 30s `CountdownRing` and inline **Undo**.
- After 30s: card auto-moves to the **Done** tab (filter reclassification only — decision already has terminal status). No manual clear step.

### Toolbar alignment
- `AlertsToolbar` + tabs row: unify to a single flex row with consistent 12px vertical padding, aligned to the card container's left/right edges (same horizontal inset as cards). Fixes the "toolbar wider than cards" misalignment visible in screenshots.
- Right-side controls (Filter, Sort, Stack/Grid switcher, overflow) share the same baseline; overflow `⋯` sits flush with card right edge.

## Stack view (`StackRow.tsx`)
- Actions cluster moves to **left-aligned** slot immediately after the insight text block (not far-right). Meta row (source, time, meeting ref) sits below insight, action cluster to the right of insight but left-anchored within a fixed 420px zone so all rows align.
- No "View more" button. Clicking the row body opens **inline expansion** below the row (not the right panel). Expanded region contains: `insightDetail`, meeting excerpt if any, and the same action row.
- Right panel opens **only** when user clicks "Write custom action / Discuss with Aan".
- Ambient completion gradient stays; SettledStrip with 30s timer + Undo lives in the row itself.

## Grid view (`GridCard.tsx`)
- Remove `Maximize2` focus button (was swapping to stack). Keep single chevron.
- Expanded card = exactly **2× collapsed height** (measured via CSS `min-h` set from collapsed measurement, or fixed heights: collapsed ~140px, expanded ~280px).
- Two-column CSS grid changed to **column-based masonry** using `columns-2 gap-4` with `break-inside-avoid` on cards. This way expanding a left-column card only pushes cards below it in the same column; the right column is untouched. Same for right-column expands.
- Action row: left-aligned inside expanded body, same button set as Stack. "Dismiss" replaces "Reject". No "View more".
- Right panel opens only for "Write custom action / Discuss with Aan".
- SettledStrip w/ 30s undo lives in the card; auto-migrates to Done tab after timer.

## Meeting layout in Stack + Grid
Match the older Phase 2 Meetings design (screenshots `image-219`, `image-220`, `image-221`) but rendered as native rows/cards.

### Meeting summary row/card (parent)
- Left: purple `M` avatar (28px rounded).
- Title: `Meeting name` + meta line: date · time · duration.
- Attendee pills: initial chip (colored) + name + role, e.g., `PS Priya Shah · Anarix account lead`.
- Right-side stats: `N attendees · N tasks · N open · $X committed`.
- Thin progress bar on the far right with % completed.
- Clicking expands **inline**:

### Expanded meeting body
- `MEETING WORKSPACE` eyebrow, title, datetime.
- Attendee pills row.
- Three-up stat cards: TASKS / OPEN / COMMITTED.
- SUMMARY paragraph + collapsible "Transcript excerpt".
- `ACTION ITEMS` list — each item is a compact row with:
  - Value chip (`+ $4.8k /mo` style — note: meetings keep the value chip with cadence since screenshots show it; this is the one exception to the value-simplification rule, per the reference design).
  - Task text, owner pill.
  - Right-side actions: `Mark completed` primary + `Write custom action / Discuss with Aan` secondary + `⋯`.
- Header action: `Mark all completed`.
- Remove "You take care of it" / "With Aan" labels — replace with the unified custom-action button.

### Grid variant
- Same content, laid out as a wider card spanning both columns when expanded (via `column-span: all` on the masonry container).

## Files touched (edits only, no new files unless noted)
- `src/components/actions/ValueBlock.tsx` — strip prefix/cadence.
- `src/components/actions/SourceGlyph.tsx` — larger default size.
- `src/components/actions/ActionChoiceRow.tsx` — Dismiss rename, remove View more, unified custom/Aan button, left-align layout.
- `src/components/actions/StackRow.tsx` — left-align actions, inline expansion, remove View more/focus, meeting-row variant.
- `src/components/actions/GridCard.tsx` — remove focus button, single chevron, 2× expand height, column-safe layout, meeting-card variant.
- `src/components/actions/AlertsToolbar.tsx` + `src/pages/Alerts.tsx` — toolbar/card alignment, remove Clear completed, masonry container for grid, auto-migrate-to-Done after 30s.
- `src/components/actions/AlertDetailPanel.tsx` — repurposed to Ask-Aan-only mini panel (opens only on custom-action click). Rename/trim accordingly.
- `src/components/actions/BulkBar.tsx` — Dismiss rename, drop clear-completed action.
- `src/components/actions/MeetingWorkspace.tsx` + `MeetingTaskRow.tsx` — refit as inline expansion body used by both Stack and Grid; drop "You take care of it".
- `src/data/mockDecisions.ts`, `src/data/mockMeetings.ts`, `src/data/mockMeetingTasks.ts` — monitor→agent and em-dash sweep.

## Out of scope
- Filters, sort, tab logic, data schema, store logic beyond the auto-migrate timer.
- No visual changes to the hero/header.
- No changes outside `/alerts`.
