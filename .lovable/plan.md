

# Fix: Card Height Alignment Across All Pages

## Problem
Cards in grid layouts have mismatched heights because child elements don't stretch to fill their grid cells. This affects:
- Profitability Dashboard: Period summary cards column vs. trend chart
- Geographical: Map vs. RegionStatsPanel
- Health Score: Composite score card vs. dimension grid
- Budget Pacing, RuleBuilder, CompetitorPricing: Side-by-side panels in 3-column grids
- KPI summary rows (4-col grids) across multiple pages

## Root Cause
Grid children don't have `h-full` applied, so they only take their intrinsic height. CSS Grid makes cells equal height, but the card/div inside the cell doesn't stretch.

## Fix

### 1. Profitability Dashboard (`src/pages/profitability/Dashboard.tsx`)
- Line 138: Add `h-full` to the trend chart wrapper `<div>` so it stretches to match the stacked cards column
- In `ProfitabilityTrendChart.tsx`: Add `h-full` to the outer `rounded-lg border` div and make the chart area flex-grow

### 2. Geographical (`src/pages/profitability/Geographical.tsx`)
- Line 27: Add `h-full` to the map wrapper div's child (`GeographyMap`)
- Line 33: Add `h-full` to the stats panel wrapper
- In `GeographyMap.tsx`: Add `h-full` to outer container
- In `RegionStatsPanel.tsx`: Add `h-full` to outer container

### 3. Health Score (`src/pages/workspace/HealthScore.tsx`)
- Line 48: Card already has `flex items-center justify-center` but needs `h-full`
- DimensionCard (line 108): Add `h-full` to `<Card>`

### 4. Budget Pacing (`src/pages/advertising/BudgetPacing.tsx`)
- Line 60 KPI grid: Cards are fine (simple content), but add `h-full` to each `<Card>` for safety
- Line 81 alerts vs chart grid: Add `h-full` to alerts container and chart container

### 5. RuleBuilder (`src/pages/advertising/RuleBuilder.tsx`)
- Line 65 grid: Add `h-full` to both children divs

### 6. CompetitorPricing (`src/pages/bi/CompetitorPricing.tsx`)
- Line 53 grid: Add `h-full` to chart and alerts column

### 7. KPI summary grids (multiple pages)
Pages with `grid-cols-4 gap-4` KPI cards — ensure each `<Card>` has `h-full`:
- `BudgetPacing.tsx` (line 60)
- `RuleBuilder.tsx` (line 46)
- `CompetitorPricing.tsx` (line 34)
- `InventoryAds.tsx` (line 48)
- `ClientPortal.tsx` (line 39)
- `UnifiedPnL.tsx` (line 41)
- `HourlyData.tsx` (line 69)

### 8. Trend chart component (`ProfitabilityTrendChart.tsx`)
- Make outer div `h-full flex flex-col`
- Make chart area `flex-1` instead of fixed `h-[240px]`

### 9. GeographyMap component
- Make outer div accept and apply `h-full`

### 10. RegionStatsPanel component
- Add `h-full` to outer div

## Summary
The fix is systematic: every direct child of a CSS grid cell that contains a card/panel must have `h-full` so it stretches to match sibling cells. For flex-based charts, convert fixed heights to `flex-1` within a `flex flex-col h-full` parent.

Files to edit (~12):
- `src/pages/profitability/Dashboard.tsx`
- `src/pages/profitability/Geographical.tsx`
- `src/pages/workspace/HealthScore.tsx`
- `src/pages/advertising/BudgetPacing.tsx`
- `src/pages/advertising/RuleBuilder.tsx`
- `src/pages/bi/CompetitorPricing.tsx`
- `src/pages/catalog/InventoryAds.tsx`
- `src/pages/reports/ClientPortal.tsx`
- `src/pages/profitability/UnifiedPnL.tsx`
- `src/pages/dayparting/HourlyData.tsx`
- `src/components/profitability/ProfitabilityTrendChart.tsx`
- `src/components/profitability/GeographyMap.tsx`
- `src/components/profitability/RegionStatsPanel.tsx`

