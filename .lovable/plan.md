

# Fix: Corrupt Chart Code + Toolbar on One Line

## Issues Found

1. **Corrupt HTML in ProfitabilityTrendChart.tsx** — Line 46 has garbled class: `flex flex-colard p-4 flex flex-col`. Line 80 has literal text `flex-1 min-h-[20` rendered as visible content before the chart div. This is why "flex-1 min-h-[20" appears on screen.

2. **Toolbar split across two lines on Dashboard** — The `ProductsOrdersToggle` and `Upload COGS / Export` buttons are in a `justify-between` row, and the `DataTableToolbar` is on a separate row below. These should be merged into one line when space is available.

## Plan

### 1. Fix ProfitabilityTrendChart.tsx (corrupt code)
- **Line 46**: Fix `flex flex-colard p-4 flex flex-col` → `h-full flex flex-col`
- **Line 80**: Fix `flex-1 min-h-[20<div className="h-[240px]">` → `<div className="flex-1 min-h-[200px]">`

### 2. Merge toolbar row in Dashboard.tsx
- Combine `ProductsOrdersToggle` + `Upload COGS` + `Export` buttons into the same row as the `DataTableToolbar` search/columns/filter controls. Put toggle on left, search in middle area, action buttons on right — all in one `flex items-center justify-between` row.

### 3. Apply same one-line toolbar pattern to other pages
Check and fix toolbar layout consistency in:
- `ProfitLoss.tsx`
- `Geographical.tsx`  
- `Trends.tsx`

All should have toggle/title on left, search + columns + filter + download on right, in a single row.

**Files to edit (~5):**
- `src/components/profitability/ProfitabilityTrendChart.tsx`
- `src/pages/profitability/Dashboard.tsx`
- `src/pages/profitability/ProfitLoss.tsx`
- `src/pages/profitability/Geographical.tsx`
- `src/pages/profitability/Trends.tsx`

