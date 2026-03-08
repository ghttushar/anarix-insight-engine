

# Unified Chart Controls Across All Pages

## What Changes

Create a reusable `ChartContainer` wrapper that provides three standard controls for every chart in the app:

1. **Visualization type dropdown** — switch between Line, Bar, Area, Pie (contextual)
2. **Metric selector** — toggle which data series are visible (contextual per chart)
3. **Expand button** — opens chart in a full-width Dialog for detailed viewing

Remove: Hide button, Download button from all charts.

## New Component: `src/components/charts/ChartContainer.tsx`

A wrapper that renders:
- Header row: title (left) | metric selector + viz type dropdown + expand icon (right)
- Chart content area (children)
- Expand modal: Dialog with the same chart rendered at larger size

Props:
```
title?: string
subtitle?: string
metrics?: { key: string; label: string; color: string; active: boolean }[]
onMetricToggle?: (key: string) => void
chartType: "line" | "bar" | "area" | "pie"
onChartTypeChange: (type) => void
availableChartTypes?: ("line" | "bar" | "area" | "pie")[]
children: ReactNode (the actual Recharts content)
```

## Files to Modify

### 1. `src/components/charts/ChartContainer.tsx` — CREATE
Shared wrapper with viz type Select, metric toggles, and Maximize2 expand button opening a Dialog.

### 2. `src/components/profitability/ProfitabilityTrendChart.tsx` — REWRITE
- Remove hide/show logic, Download button, EyeOff button
- Wrap with ChartContainer
- Add chartType state, render Line/Bar/Area based on selection
- Keep frequency dropdown and metric legend (Orders/Units)

### 3. `src/components/charts/PerformanceChart.tsx` — UPDATE
- Wrap with ChartContainer instead of plain Card
- Move MetricSelector into ChartContainer's metric system
- Add chartType state for viz switching

### 4. `src/components/bi/SOVChart.tsx` — UPDATE
- Replace expand/collapse with ChartContainer
- Add viz type switching (Area default, Line, Bar options)

### 5. `src/components/profitability/ProductTrendsModal.tsx` — UPDATE
- Add viz type dropdown to switch between Line/Bar/Area

### 6. `src/pages/advertising/RuleBuilder.tsx` — UPDATE
- Wrap inline BarChart in ChartContainer with expand + viz type

### 7. `src/pages/advertising/BudgetPacing.tsx` — UPDATE
- Wrap inline AreaChart in ChartContainer with expand + viz type

### 8. `src/pages/dayparting/CampaignDetail.tsx` — UPDATE
- Wrap inline LineChart in ChartContainer

### 9. `src/pages/bi/CompetitorPricing.tsx` — UPDATE
- Wrap inline LineChart in ChartContainer

### 10. `src/components/profitability/ScatterPlotChart.tsx` — SKIP
Scatter/quadrant chart is specialized; viz type switching does not apply.

**~10 files, 1 new component.**

