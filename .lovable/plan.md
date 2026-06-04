
## Scope

Bring the Trends page (desktop + tablet) to 100% parity with the attached PDF, populate every Profitability table to 30 rows with pagination, and wire the scatter → quick tooltip → right-panel full detail flow exactly as shown.

---

## 1. Scatter chart — match PDF exactly

File: `src/components/profitability/ScatterPlotChart.tsx`, `scatterCluster.ts`, `ScatterTooltipCard.tsx`

Axis change (most important):
- **Y axis = Ad Spend ($)**, range **0 → 90**, ticks every 10. Plain dollar labels (`10`, `20`, …`90`), NOT `$k`.
- X axis = Profit Margin (%), range **-30 → 100**, ticks every 10.
- Axes drawn as two arrows meeting at origin (already present), dashed grid, dashed vertical zero line.

Clustering / dots:
- Switch input from `totalSales` → `adSpend`. Update `ScatterDataPoint` type to add `adSpend`, populate from the products' real adSpend (scaled into 0–90 range).
- Cluster cell size 36px (slightly bigger than current 28). Singletons: small filled dot (r≈6) with no number. Clusters: big filled bubble (r 16–26 based on count) with white count badge centered (5, 10, 3 etc., as in PDF).
- Tier colors stay: red <0, amber 0–30, green ≥30 — matches PDF.
- Clicking a cluster: zoom into its bbox so it splits into smaller clusters / singletons. Already working, keep.
- Wheel + drag pan stay.

Quick tooltip (hover on a singleton OR after zooming into a single point):
- Dark popover (`bg-popover` dark variant), exactly like PDF page 2: thumbnail · Product Name · `ID: … | SKU: …` · `Ask Aan` chip top-right · row with `Profit Margin: <green %>` and `Ad Sale: <blue $>` · subtle "Why is this product performing good or bad?" hint above on hover-hold.
- Hovering a multi-point cluster: show "N products in this cluster — click to zoom" mini card (keep current behavior).

Click on singleton dot → opens **right-side detail panel** (see §2), not Aan copilot. "Ask Aan" chip inside tooltip is what routes to Aan with the prefilled prompt.

Right-rail controls: Expand / Zoom in / Zoom out / Reset (already in place).

---

## 2. Product detail right panel (PDF pages 4–5)

Reuse `ProductDetailPanel` (already sticky to viewport). Add an "Ask Aan" handoff section at the bottom showing the same action chips from the PDF: `Apply Suggested Budget`, `Conditional Budget Boost`, `Increase Budget +20%`, `Enable Dayparting`. Clicking any chip opens AanCopilot prefilled with that action.

Open the panel from:
- Click on a singleton scatter dot
- "More" button in the trends table (already wired)

Panel must stay independent of main scroll (already done last round).

---

## 3. Populate all Profitability tables to 30 rows + pagination (2 pages, 15/page)

Data file: `src/data/mockProfitability.ts`
- Expand `profitabilityProducts` from 5 → **30** real-looking SKUs (NapQueen-style names from PDF + variations). Each gets full P&L fields and weekly/daily/monthly numbers.
- Expand `scatterData` to the same 30 entries with `adSpend` distributed across 5–80 and profit margins distributed across -30 to 95, so the chart naturally forms the cluster patterns shown in the PDF (one dense green cluster ~80% / $65, one amber cluster ~25% / $30, a smaller amber cluster ~22% / $40, and a red cluster ~-30% / $8).
- Expand `profitabilityOrders` from 5 → **30** orders.

Pagination:
- `ProductsPnLTable` already has page logic; ensure pageSize default = 15 → 2 pages.
- Trends table on `Trends.tsx` currently has no pagination. Add `TablePagination` (15 rows/page, 2 pages).
- Same for `ProfitLoss`, `Geographical`, `UnifiedPnL`, `Dashboard` product lists where applicable — paginate at 15.

---

## 4. Tablet parity

`Trends.tsx` is shared, so the new scatter + tables work in tablet. Verify:
- Right-rail zoom buttons remain visible at tablet width.
- Tooltip width clamps to viewport.
- Pagination component is touch-friendly (existing buttons are 28px → bump to 36px on `useViewport().isTablet`).

---

## 5. Type + data changes (technical)

```ts
// types/profitability.ts
interface ScatterDataPoint {
  id: string;
  name: string;
  profitMargin: number;
  totalSales: number; // keep for bar/line views
  adSpend: number;    // NEW — drives Y axis in scatter
  quadrant: "winners" | "grow" | "optimize" | "review";
}
```

Update `scatterCluster.ts` to bucket by `adSpend` on Y (replace `totalSales` reference); default cell 36px.
Update `ScatterPlotChart.tsx` Y axis formatter to plain integers, baseDomain Y = [0, 90].
Update `ScatterTooltipCard.tsx` content: show `Profit Margin` green pill + `Ad Sale` blue pill (rename from "Total Sales"), thumbnail, ID/SKU row, "Ask Aan" chip top-right.

---

## Files touched

- `src/types/profitability.ts` (add `adSpend`)
- `src/data/mockProfitability.ts` (30 products, 30 orders, 30 scatter points, adSpend values)
- `src/components/profitability/ScatterPlotChart.tsx` (Y-axis = Ad Spend $, plain labels, bubble sizing)
- `src/components/profitability/scatterCluster.ts` (use adSpend, cell 36)
- `src/components/profitability/ScatterTooltipCard.tsx` (dark theme, Ad Sale pill, action hint)
- `src/components/profitability/ProductDetailPanel.tsx` (add Aan action chips footer)
- `src/components/profitability/ProductsPnLTable.tsx` (pageSize 15)
- `src/pages/profitability/Trends.tsx` (add pagination + open detail panel on dot click)
- `src/pages/profitability/{Dashboard,ProfitLoss,Geographical,UnifiedPnL}.tsx` (paginate to 15)

No backend changes.
