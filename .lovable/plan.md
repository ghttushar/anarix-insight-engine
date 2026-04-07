

## Responsive Taskbar Actions + Profitability Hero Card Enhancement

### 3 Changes

---

### 1. Taskbar: Shrink island-off actions to icon-only when panels are open

**File: `src/components/layout/AppTaskbar.tsx`**

- Import `useActivePanel` (already imported via `setDataPanel`) and read `hasAnyPanel`
- When `hasAnyPanel` is true AND `islandOff` is true, render Ask Aan / Insights / Refresh as icon-only tooltip buttons (no text labels) — same as the bell icon pattern
- When no panels are open, keep the current icon + label layout
- This reduces the right-side width when space is constrained by open panels

### 2. Taskbar: Make filter row responsive with overflow handling

**File: `src/components/layout/AppTaskbar.tsx`**

- Add `flex-wrap` to Row 2's left-side filter container so selectors wrap instead of overflowing
- Reduce selector label font sizes and padding slightly when space is tight
- Add `overflow-hidden` on the outer container to prevent horizontal bleed

### 3. Profitability Hero Card: Better metric visibility with proper boxes

**File: `src/components/profitability/ProfitabilityHeroCard.tsx`**

- **SummaryCard**: Replace the inline `grid grid-cols-2` metric layout (lines 176-184) with individually bordered metric boxes — each metric (GMV, Orders, Auth Sales, Ad Cost) gets its own `rounded-md border border-border/50 px-2.5 py-2` container with label on top and value below, making values more scannable
- **Increase card height**: Remove the cramped `gap-y-1.5` spacing, use `gap-2` for the metric grid and increase vertical padding (`pb-3` instead of `pb-2`)
- **Main profit display**: Add a subtle background box around the Net Profit + Margin section (`rounded-md bg-muted/30 px-3 py-2`)
- **Responsive grid**: Change `grid-cols-5` to `grid-cols-5 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2` so cards reflow on smaller viewports instead of getting crushed
- **ForecastCard**: Match the same metric box pattern for consistency

### Files Summary

| File | Change |
|---|---|
| `AppTaskbar.tsx` | Icon-only actions when panels open; flex-wrap on filter row |
| `ProfitabilityHeroCard.tsx` | Boxed metrics, increased height/spacing, responsive grid |

