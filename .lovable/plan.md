

## Comprehensive Fix: Sticky Taskbar, Universal Pin/Sort, Model Selector, Panel Scroll, Insights→Aan, Ask Aan Tooltip, New Feature Pages

### 8 Changes

---

### 1. Sticky Taskbar Across All Screens (Not Just Profitability)

**Problem:** `AppTaskbar` has `sticky top-0 z-30` in its own wrapper, but the parent `<main>` in `AppLayout.tsx` is the scroll container. The issue is that individual pages wrap content in inner `overflow-auto` divs (e.g., Campaign Manager line 257: `<div className="flex-1 space-y-6 overflow-auto">`), so the sticky only works relative to that inner scroll — NOT the main scroll.

**Fix:** Audit all page files. Ensure the `AppTaskbar` is a direct child of the scroll container in every page. Remove nested `overflow-auto` wrappers that break sticky behavior, or restructure so the taskbar is sticky relative to the correct scroll parent.

**Files:** `CampaignManager.tsx`, `ImpactAnalysis.tsx`, `TargetingActions.tsx`, `Products.tsx` (catalog), `History.tsx`, `ScheduledJobs.tsx`, `Dashboard.tsx` (profitability), `Trends.tsx`, `ProfitLoss.tsx`, `Geographical.tsx` — any page that wraps content in a nested scrollable div.

---

### 2. Universal Sort + Pin in ALL Table Column Headers

**Problem:** `CampaignTable.tsx` still uses plain `<TableHead>` with its own sort icons instead of `SortableTableHead`. Several tables in Profitability (`ProductsPnLTable`, `RegionalProductTable`) and others don't use `SortableTableHead` at all.

**Fix:**
- **CampaignTable.tsx:** Replace all `<TableHead>` with `<SortableTableHead>` using `usePinning` and passing `sortField`, `sortDirection`, `onSort` props. Remove the inline `SortIcon` component.
- **ProductsPnLTable.tsx**, **RegionalProductTable.tsx**, **CatalogProductsTable.tsx** (if it exists or the catalog table equivalent): Add `SortableTableHead` with pin + sort.
- **All existing SortableTableHead tables** (AdGroups, Impact, KeywordTargeting, ProductAds, ProductTargeting, SearchTerms, PageType, Platform, HistoryTable, ScheduledJobsTable, BrandCoverage, KeywordTracker): Verify they pass `onSort`, `sortField`, `sortDirection` and `onPinToggle`, `pinnedColumns`. Any missing props must be added.

**Functional pin requirement:** When a column is pinned, it gets `position: sticky`, `left` offset calculated after fixed columns, `z-10`, and opaque `bg-muted`/`bg-background`. The `usePinning` hook already provides `ps()` for style and `pc()` for className — ensure every table applies both to header AND body cells.

**Files:** All 13+ table component files.

---

### 3. Model Selector Working in Full Screen (Workspace)

**Problem:** `AanInput` uses `selectedModel` and `setSelectedModel` from `useAan()`. The `Popover` with model list is rendered inside `AanInput`. In the workspace (`AanWorkspace`), the input is inside a `fixed inset-0 z-[60]` overlay. The Popover portal may render outside this z-index context.

**Fix:** Add `z-[70]` to the model selector `PopoverContent` in `AanInput.tsx` to ensure it renders above the workspace overlay. Or use `sideOffset` and ensure portal renders inside the workspace container.

**File:** `AanInput.tsx` — add `className="w-64 p-1.5 z-[70]"` to the model PopoverContent.

---

### 4. Independent Scroll for ALL Right-Side Panels

**Current state:**
- `CreateCampaignPanel`: Has `ScrollArea className="flex-1 min-h-0"` ✓
- `CreateSchedulePanel`: Has `ScrollArea className="flex-1 min-h-0"` ✓  
- `ProductDetailPanel`: Has `ScrollArea className="flex-1 overflow-hidden"` — needs `min-h-0`
- `PeriodBreakdownPanel`: Has `ScrollArea className="flex-1 overflow-hidden"` — needs `min-h-0`
- `InsightsPanel`: Has `ScrollArea className="flex-1 min-h-0"` ✓
- `AanCopilotPanel`: Has `ScrollArea className="flex-1 min-h-0"` ✓

**Fix:** Add `min-h-0` to ProductDetailPanel and PeriodBreakdownPanel ScrollArea. Also verify the parent containers are `flex flex-col h-full` — ProductDetailPanel uses `flex h-full w-[360px] shrink-0 flex-col` ✓, PeriodBreakdownPanel uses `flex h-full w-[320px] shrink-0 flex-col` ✓. The issue may be that these panels are rendered as flex siblings inside pages but the parent div doesn't constrain height properly. Ensure the page-level flex container uses `h-full min-h-0`.

**Files:** `ProductDetailPanel.tsx`, `PeriodBreakdownPanel.tsx`, potentially page files that render these panels.

---

### 5. Insights → Aan: Click Recommendation → Auto-Prompt in Aan Copilot

**Problem:** InsightCard action button currently does nothing meaningful.

**Fix:** When user clicks the action button on an InsightCard:
1. Open the Aan copilot panel (`openCopilot()`)
2. Set context to the current page
3. Pre-fill the input with the insight's action text as a prompt

Implementation:
- Add `onActionClick?: (actionText: string) => void` prop to `InsightCard`
- In `InsightsPanel`, pass a handler that calls `useAan().openCopilot()` and sets a pending prompt
- Add `pendingPrompt` / `setPendingPrompt` to `AanContext` so `AanInput` can pick it up and auto-fill

**Files:** `InsightCard.tsx`, `InsightsPanel.tsx`, `InsightsContext.tsx`, `AanContext.tsx`, `AanInput.tsx`

---

### 6. "Ask Aan" Tooltip on Text Selection (New Feature Toggle Only)

**Problem:** User wants a feature where selecting text on any screen shows a small "Ask Aan" tooltip. Clicking it opens the Aan copilot with the selected text + page context pre-filled. Only active when `newFeaturesVisible` is true.

**Implementation:**
- Create `AskAanTooltip.tsx` component that listens to `mouseup` events on `document`
- On text selection (`window.getSelection()`), show a small floating tooltip positioned above the selection with "Ask Aan" label + Sparkles icon
- On click: open copilot via `useAan().openCopilot()`, set context (page from `useLocation()`), and set pending prompt like "What does '[selected text]' mean?"
- Wrap in `useFeatureToggle().newFeaturesVisible` check
- Mount in `AppLayout.tsx`

**Files:** New `src/components/aan/AskAanTooltip.tsx`, `AppLayout.tsx`

---

### 7. Notification Bell → Separate Screen (Not Same as Insights)

**Problem:** User said notification should work like insights but have a different screen. Currently the bell in FloatingActionIsland opens the Insights panel directly.

**Fix:** Create a `NotificationsPanel` that has its own panel type. Add `"notifications"` to `DataPanelType`. The notifications panel shows system notifications (schedule completed, rule triggered, budget alerts) — different content from insights (which are analytical recommendations). The bell in FloatingActionIsland opens this new panel instead of insights.

**Files:** New `src/components/notifications/NotificationsPanel.tsx`, `ActivePanelContext.tsx` (add type), `FloatingActionIsland.tsx` (change bell target), `AppLayout.tsx` (render panel)

---

### 8. Update New Feature Pages to Latest Style

**Problem:** Pages gated behind `newFeaturesVisible` (Workspace Dashboard, Health Score, AMC pages, etc.) may not follow the latest toolbar, table, and layout patterns.

**Fix:** Audit each new feature page:
- Ensure they use `AppTaskbar` with sticky behavior
- Ensure tables use `SortableTableHead` with pin + sort
- Ensure `DataTableToolbar` has sort popover wired
- Ensure consistent card styling (`bg-card rounded-lg border`)

**Files:** `workspace/Dashboard.tsx`, `workspace/HealthScore.tsx`, AMC pages, BI pages, any page marked `isNewFeature: true` in sidebar nav.

---

### Summary

| File | Phase | Change |
|---|---|---|
| `AanInput.tsx` | 1 | Add `z-[70]` to model popover, consume `pendingPrompt` |
| `AanContext.tsx` | 1 | Add `pendingPrompt`/`setPendingPrompt` |
| `ProductDetailPanel.tsx` | 1 | Add `min-h-0` to ScrollArea |
| `PeriodBreakdownPanel.tsx` | 1 | Add `min-h-0` to ScrollArea |
| `CampaignTable.tsx` | 2 | Replace TableHead with SortableTableHead + usePinning |
| All other table files | 2 | Verify/add sort + pin props to SortableTableHead |
| All page files | 2 | Fix nested overflow-auto breaking sticky taskbar |
| `InsightCard.tsx` | 3 | Add `onActionClick` prop |
| `InsightsPanel.tsx` | 3 | Wire action click → Aan copilot |
| `AskAanTooltip.tsx` (new) | 3 | Text selection tooltip feature |
| `AppLayout.tsx` | 3 | Mount AskAanTooltip |
| `NotificationsPanel.tsx` (new) | 3 | New notifications panel |
| `ActivePanelContext.tsx` | 3 | Add "notifications" type |
| `FloatingActionIsland.tsx` | 3 | Bell opens notifications panel |
| New feature page files | 4 | Update to latest patterns |

