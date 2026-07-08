## Scope

Full rebuild of `/alerts` (both Stack and Grid views). No functionality changes to the store — only UI/layout, richer action affordances, and a shared right-side detail panel. All copy realigned to Anarix's neutral, competent tone.

## Shared foundation (used by both views)

**Unified tab set** (both views, same keys, same counts):
`All · Needs approval · Morning brief · From meetings · FYI · Done`

- `all`: everything currently actionable + fyi
- `needs_approval`: `status === "open"` and `severity !== "fyi"`
- `morning_brief`: overnight digest items + open items created before 8am today
- `from_meetings`: items with `meetingRef` (flattened) + meeting bundles
- `fyi`: `severity === "fyi"` (read-only notifications, no action row)
- `done`: completed / rejected / expired

**Page shell** (matches app standards — see `mem://style/layout-philosophy` + tiered-control-architecture):
- Outer padding reduced: `px-4 py-5` (was `px-6 py-6`), max width lifted to `max-w-[1480px]`.
- Row 1 — Page taskbar (breadcrumb from `AppTaskbar`, unchanged).
- Row 2 — Compact hero: Aan mark 32px · single-line H1 `Action items` · muted subline `"{n} open · {$totalValue} at stake · {crit} critical"`. No cutesy greeting.
- Row 3 — **AlertsToolbar** (mimics existing table toolbars): left = tab pills w/ counts; right = Filter · Sort · **View switcher (Stack | Grid)** as segmented control · overflow menu (Keyboard shortcuts, Clear completed). This is the single, canonical position for the view toggle — no floating placement.
- Row 4 — Optional selection bar (bulk actions) slides in above the list when items selected.

**AlertCore** — shared body model rendered by both views identically:
1. **Value block** (always first, largest visual weight): 20px mono numeric, semantic color (success/destructive/muted), one-line caption below in 12px muted. Same token in both views.
2. **Headline** (15px, `font-medium`, foreground).
3. **Context strip** (13px): source glyph · sourceRef.label · relative time · domain chip. All items styled equal — nothing muted to invisibility.
4. **Participants / meta chips** (when present): `Chip` primitive 12.5px, `border-border bg-card`, never below 12px.
5. **Multi-action choice row** (NEW — replaces the single Approve button):
   - Renders 2–4 typed action options from a new per-decision `actions[]` (see Data). Each has `label`, `verb`, `impact` (short suffix like "reclaim $840/mo"), and `kind` (`primary | safe | destructive`).
   - Plus a persistent **"Write your own…"** action that opens the right panel focused on a text input which routes into the existing `delegateToAan` flow with a free-text intent.
   - Rendered as a horizontal choice list in Stack; as a vertical stack inside expanded card in Grid.
6. **Ask Aan** entry (restored): inline `Ask Aan about this` button (Aan mark + label) that opens the right panel in chat mode, pre-seeded with the alert context. Present on every alert in both views.
7. **Overflow menu (⋯)**: View more · Copy $ rationale · Reject. **Snooze removed entirely.** **Share moved inside overflow** (was cluttering the row).

**Right-side detail panel** — one panel, consistent everywhere:
- Reuses `Sheet` from shadcn, mounted at `AlertsPage`. Slides from right, 520px wide, follows `mem://architecture/navigation-and-layout-system/dual-panel-workflow-logic-v3` (independent scroll, `flex-1 min-h-0`, no backdrop blur).
- Three modes: `detail` (full alert breakdown — value basis, evidence, steps, source), `ask_aan` (chat surface pre-seeded with alert), `custom_action` (textarea + send to Aan).
- Opened from: card expand-more, "View more" overflow, "Ask Aan", "Write your own…".
- Closed on: ESC, marketplace/date change (per `mem://constraints/visual-effects-and-event-logic`).

**Bulk action bar (redesigned)**:
- Docks under the toolbar (not floating bottom) when `selectedCount > 0`.
- Left: `{n} selected · total value {$}`.
- Right: `Approve all` (primary) · `Ask Aan about these` · `Reject` · `Clear`.
- No snooze. Height 44px, matches TableToolbar styling.

## Stack view (rebuilt)

Dense analytical row, matches table density but not a table.
- Row height ~72px collapsed, expands inline for detail (not a modal).
- Grid columns per row: `[checkbox 32] [value 128] [headline+context 1fr] [multi-action row auto] [overflow 32]`.
- Value cell is left-most after checkbox — user reads it first.
- 14px minimum body copy; 15px headline; 12.5px chips; 11.5px only for ALL-CAPS section eyebrows.
- Date bucket headers `TODAY / YESTERDAY / EARLIER` at 11.5px tracked, with a hairline rule.
- FYI rows collapse action row to a single `Got it` dismiss.

## Grid view (rebuilt)

Innovative expand/collapse — cards live in a **masonry-ish 2-col grid** on `lg+`, single column below.
- **Collapsed by default** (~180px tall): shows value block, headline, source chip, action-count badge (`3 actions · Ask Aan`), thin colored left rail by severity.
- **Expansion**: click anywhere on the card body toggles to expanded state. Expansion animates height + reveals action choices, evidence sparkline, meeting-origin line, and Ask-Aan inline. Only one card expanded per column at a time (siblings auto-collapse) — this is the "innovative" behavior: the column reflows so the expanded card claims full width if user opts to `Focus` (a small chevron next to the collapse icon), pushing the row into a temporary single-column layout for that section. This gives one-glance context without a modal.
- Card padding `p-5`, border `border-border`, rounded-lg, `bg-card`, subtle shadow only on hover.
- Header rail 4px on the left, tokenized by severity (destructive/success/muted).

## Data / types (additive only, non-breaking)

Extend `Decision`:
```ts
actions?: DecisionActionOption[];  // 2–4; when absent, we synthesize 1 from actionVerb (back-compat)
```
Add:
```ts
interface DecisionActionOption {
  id: string;
  label: string;         // "Reallocate to Prime Movers"
  impact?: string;       // "+$840/mo"
  kind: "primary" | "safe" | "destructive";
}
```
Mock: seed 3–4 options for the 10 most-visible decisions in `mockDecisions.ts`. Others auto-fall-back to `[{ actionVerb }]` synthesis so nothing breaks.

Store additions (in `actionsStore.tsx`):
- `approveWithOption(id, optionId)` → same path as `approve`, tags `chosenOptionId` for the confirmation toast.
- `askAan(id, freeText?)` → opens right panel; when `freeText` present, routes to `delegateToAan(id)` and stores the intent for the "in flight" step list.

Snooze API stays in the store (used elsewhere) but no UI surface calls it from `/alerts`.

## Language pass

- Remove `"You take care of it"`, `"Hi Tushar"`, `"I'm on it"`, `"You handed to me"`.
- Replace with: `Ask Aan to handle`, no greeting (just `Action items`), `In progress`, `Delegated to Aan`.
- Approve label = the option's verb (e.g. `Reallocate`), never `Approve <verb>`.

## File plan

**New**
- `src/components/actions/AlertsToolbar.tsx` — tabs + filter/sort/view/overflow.
- `src/components/actions/ViewSwitcher.tsx` — segmented Stack/Grid control (replaces `ViewModeToggle` which we delete).
- `src/components/actions/ValueBlock.tsx` — canonical value renderer for both views.
- `src/components/actions/ActionChoiceRow.tsx` — multi-option chooser + "Write your own".
- `src/components/actions/AskAanButton.tsx` — inline Ask-Aan trigger.
- `src/components/actions/AlertDetailPanel.tsx` — right-side Sheet with 3 modes.
- `src/components/actions/BulkBar.tsx` — new docked bulk bar (replaces `BulkActionBar` usage here).
- `src/components/actions/StackRow.tsx` — rebuilt row (replaces `DecisionRow` on this page).
- `src/components/actions/GridCard.tsx` — rebuilt card (replaces `DecisionCard`).
- `src/components/actions/FyiRow.tsx` / `FyiCard.tsx` — minimal read-only variants.
- `src/components/actions/tabs.ts` — shared tab keys, labels, filter predicates, counts.

**Rewritten**
- `src/pages/Alerts.tsx` — single orchestrator that computes `pool` via shared `tabs.ts` and hands the same list to either `<StackList/>` or `<GridList/>`. Both share tab state, sort, filter, selection, and the detail panel.

**Deleted**
- `src/components/actions/ViewModeToggle.tsx`
- `src/components/actions/DecisionCard.tsx`, `MeetingBundleCard.tsx`, `QuestionCard.tsx` (superseded by new GridCard family)
- `src/components/actions/DecisionRow.tsx`, `MeetingBundleRow.tsx`, `QuestionRow.tsx` (superseded by StackRow)
- `src/components/actions/SnoozeMenu.tsx` (unused after snooze removal from this surface)
- `src/components/actions/HandledFilters.tsx` (Done tab has no sub-filters anymore)

**Untouched**
- `actionsStore.tsx` public API (only additive), `selectionStore.tsx`, `MeetingWorkspace.tsx`, `UndoToast.tsx`, `KeyboardHelpOverlay.tsx`, `EmptyState.tsx`, `SortMenu.tsx`, `FilterSheet.tsx`, `OverloadBanner.tsx`.

## Consistency checklist (verified against memory)

- Font sizes ≥ 12.5px anywhere non-eyebrow; body 14px; headline 15px; value 20px.
- Foreground color for numbers (`text-foreground`), semantic tokens only.
- No backdrop blur, no right-edge shadow on the panel.
- Right-side panel is a real `/panels/alert-detail/:id` route in standalone mode per `mem://architecture/routing/independent-panel-urls`.
- Toolbar mirrors existing TableToolbar spacing (`h-10`, `gap-2`, border-b).
- Density respects `DensityContext` (compact reduces row from 72→60, card padding 5→4).

## Out of scope

- Store logic changes beyond additive helpers.
- Meeting Workspace sheet (kept as-is).
- Mobile view — separate MobileGate path already governs it.
