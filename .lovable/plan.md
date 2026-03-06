

# Fix: Panel Exclusivity, PeriodBreakdown Location, and Blur Removal

## Problems Identified

1. **PeriodBreakdownPanel opens inline** next to the PeriodSummaryCard (inside the card's own render tree) instead of as a right-side viewing panel
2. **All 3 panels open simultaneously** — ProductDetailPanel, InsightsPanel, and AanCopilotPanel are all visible at once (screenshot 3)
3. **Backdrop blur on AanSplitView** — line 60 of `AanSplitView.tsx` has `backdrop-blur-[1px]`
4. **No mutual exclusivity logic** — panels operate independently with no awareness of each other

## Panel Exclusivity Rules (From Your Spec)

- Only ONE data/viewing panel at a time (ProductDetail, PeriodBreakdown, Insights — mutually exclusive)
- Aan Copilot is also mutually exclusive with all of them
- Opening any panel closes all others
- AanSplitView (artifact viewer) follows same rules

## Plan

### 1. Create a centralized ActivePanel context

**New file: `src/contexts/ActivePanelContext.tsx`**

- Define panel types: `"none" | "insights" | "copilot" | "productDetail" | "periodBreakdown" | "aanSplit"`
- Provide `activePanel`, `setActivePanel(panel)`, and `closePanel()`
- Setting any panel automatically closes the previous one
- Store associated data (e.g., which product, which summary) in the context

### 2. Rewire InsightsContext

**File: `src/components/insights/InsightsContext.tsx`**

- `openPanel()` calls `setActivePanel("insights")` instead of local `setIsOpen(true)`
- `isOpen` derived from `activePanel === "insights"`

### 3. Rewire AanContext

**File: `src/components/aan/AanContext.tsx`**

- `openCopilot()` calls `setActivePanel("copilot")`
- `openSplit()` calls `setActivePanel("aanSplit")`
- Mode derived from active panel state

### 4. Move PeriodBreakdownPanel to page-level right-side slot

**File: `src/components/profitability/PeriodSummaryCard.tsx`**

- Remove local `showPanel` state and `<PeriodBreakdownPanel>` render
- "View More" calls a callback prop `onViewMore(summary)` instead

**File: `src/pages/profitability/Dashboard.tsx`**

- Add state for `breakdownSummary`
- Pass `onViewMore` to each `PeriodSummaryCard`
- Render `PeriodBreakdownPanel` as a right-side flex sibling (same slot as `ProductDetailPanel`)
- Opening one closes the other (use ActivePanel context)

### 5. Remove blur from AanSplitView

**File: `src/components/aan/AanSplitView.tsx`**

- Line 60: Remove `backdrop-blur-[1px]` from the backdrop div
- Change to `bg-black/4` only (no blur)

### 6. Wire AppLayout to ActivePanel context

**File: `src/components/layout/AppLayout.tsx`**

- InsightsPanel and AanCopilotPanel already render here
- Both check `activePanel` to determine visibility

### 7. Wrap app with ActivePanelProvider

**File: `src/App.tsx`**

- Add `<ActivePanelProvider>` wrapper

## Execution Order

1. Create `ActivePanelContext`
2. Update `InsightsContext` to use it
3. Update `AanContext` to use it
4. Update `PeriodSummaryCard` — remove embedded panel, add `onViewMore` prop
5. Update `Dashboard.tsx` — manage breakdown panel at page level with exclusivity
6. Remove blur from `AanSplitView`
7. Wrap in `App.tsx`

