# Implementation Plan — Profitability, Advertising, Tablet Fixes

Scope is large. Split into **3 phases** so each batch lands fully verified. Every change ports to tablet view in the same phase. No shortcuts. All mock data populated to 40–50 rows per table with 3–4 pages and functional rows-per-page.

---

## Phase 1 — Profitability Module (Dashboard, Trends, P&L)

### 1.1 Dashboard — Cards "View More" panel
- Expand `PeriodBreakdownPanel` to show all P&L metrics, not the current subset.
- Two collapsible sections (Radix `Collapsible`):
  - **Individual-level metrics** (per-unit values)
  - **Total metrics** (period aggregates)
- Each row shows value + % share of revenue.

### 1.2 Dashboard — Graph section
- Add **Metric multi-select dropdown**, capped at 4 metrics (disable further options when 4 selected).
- Add **Frequency dropdown** (Daily / Weekly / Monthly).
- Chart re-renders on metric/frequency change.
- When user clicks/selects cards in the row above, those cards drive the chart metrics (two-way binding with the dropdown).
- Below the chart: a metric legend strip showing current value + delta for each selected metric.

### 1.3 Dashboard — Products table
- Parent/Child expand-collapse rows in `ProductsPnLTable`.
  - Collapsed: parent ASIN (category) only.
  - Expanded: child rows with **ASIN, SKU, Price, COG, Trends** (clickable trend opens `ProductTrendsModal`).
- Driven by date frequency (day/week/month from filter context).

### 1.4 Trends page
- Add metric multi-select dropdown (max 4).
- Move scatter point logic: each dot = product; selection state persists across view changes (so changing view always has meaning).
- Add **"More Info"** column (rightmost) → opens detail panel mirroring the Dashboard breakdown panel with Trends-specific metrics.
- **Add area-select tool** alongside zoom controls on the scatter chart.
- **App-level search bar** with multi-select product dropdown. Filter persists until chip removed. Graph + table both react.
- Date range supports Days / Weeks / Months presets; table groups data accordingly.
- Table columns: ASIN, SKU, Price, Trends (clickable). **Move Trends** out of far right — group it under the product name cell with ASIN/SKU/Price.
- Orders mode: expanded rows show ASIN, SKU, Price, Trends.

### 1.5 Profit & Loss page
- Remove Catalog dropdown from `AppTaskbar` (already done previously — verify).
- Add product search + multi-select; nothing selected = aggregated all-product view.
- Add every missing P&L metric to `PnLParameterTable` (match the master P&L spec used elsewhere).
- Fix Day/Week/Month toggle: wire to frequency context **OR** delete the toggle and fold into date range dropdown. Choosing the latter for consistency with Dashboard.
- The breakdown section below the table mirrors Dashboard updates from 1.1–1.2.

### 1.6 Tablet parity for all of Phase 1
- All new controls render in the tablet shell (`src/views/...` tablet variants) with touch targets.
- Collapsible rows + dropdowns tested at tablet viewport.

---

## Phase 2 — Advertising Module

### 2.1 Campaign Manager
- **Remove standalone Metric dropdown**. KPI card selections become the chart metrics (already partially linked — make it the single source).
- Chart gets **dual Y-axis**:
  - Left: numeric (0K–100K auto-scaled)
  - Right: percentage (0%–100%)
  - Recharts `YAxis yAxisId="left"` / `"right"`.
- Cap at 4 active metrics (disable extra KPI selection when 4 are on).
- **Show Impact** mode: hover tooltip lists Top 3 + Bottom 2 campaigns for that date.
  - Tooltip footer button **"View in Table"** → navigates to `/advertising/impact` pre-filtered to that date with top/bottom rows.
- Campaign table cells: tag chips under campaign name (Auto/Manual + SP/SB).
- **Alert nudge** icon right of campaign name; click opens campaign insights panel (port behavior from existing app).
- Tagging flow: enforce **one tag per campaign** (single-select tag picker).
- Campaign detail view:
  - Daily Budget field: remove clickable affordance when not editable (no border/hover/cursor).
  - Inner table's Campaign column matches the master Campaign Manager listing exactly.
- **Pin Column** feature: audit every advertising table and add `usePinning` where missing. Default-on across all advertising pages.
- **Filter button**: add to Product-level page and any Campaign Manager subpage missing it.
- **Add Product Ads** modal: strip bid adjustment fields; only product selection allowed here.
- Checkbox alignment: fix in code (`items-center` + consistent `h-4 w-4` slot).

### 2.2 Impact Analysis
- Same dual Y-axis chart as Campaign Manager.
- **Remove all checkboxes** (no row selection, no edit mode).
- Add **Filter button** above table.
- Add **Metric dropdown** above table.

### 2.3 Targeting Actions
- Tabs by marketplace:
  - **Amazon**: Product Action, Keyword Negation, Product Negation (+ existing).
  - **Walmart**: Keyword Action, History, Archives (only).
- Populate functionality for new tabs (mirror existing patterns).
- Search terms table: add row checkboxes. **Add Keyword** button disabled by default, enabled when ≥1 selected.
- App-level **Date Range** presets: Last 3 / 7 / 14 / 30 / 60 days.
- Remove **Archives** column from table. Surface Archives as a bulk action above table + per-row action in row menu.

### 2.4 Tablet parity for Phase 2
- All new controls + dual-axis chart render correctly in tablet shell.

---

## Phase 3 — Global Polish, Data Population, Tablet Sidebar Fix

### 3.1 Tablet sidebar (left nav) fix
- Bug: not expanding/collapsing, height behaves oddly.
- Inspect tablet shell layout (`src/views/tablet/...` + `AppSidebar`). Fix:
  - Sidebar wrapper to `h-[100dvh]` with `flex flex-col`.
  - Collapse trigger wired through `ViewportContext` (touch-friendly).
  - Remove conflicting `overflow-hidden` on parent that traps height.

### 3.2 App-level selector audit
- Walk every page's `AppTaskbar` selectors (metric, frequency, marketplace, date range).
- Verify each is wired to real state (no placeholders, no dead-end mock dropdowns).
- Fix any non-functional ones.

### 3.3 Mock data population
- Expand every primary table dataset to **40–50 rows**:
  - `mockCampaigns`, `mockProductAds`, `mockAdGroups`, `mockKeywords`, `mockProductTargeting`, `mockSearchTerms`, `mockImpactData` (all 5 entities), `mockProfitability`, `mockCatalog`, `mockBrandSOV`, `mockCompetitorPricing`, `mockBudgetPacing`, `mockAnomalyAlerts`, `mockTargetingActions`, etc.
- `TablePagination`: ensure **rows-per-page** selector is functional everywhere it's rendered (25/50/100 + current selection persists).
- Verify pagination shows **3–4 pages** at default page size.

### 3.4 Tablet parity sweep
- Re-run through every Phase 1 + Phase 2 change at tablet viewport.
- Confirm touch scroll, sidebar collapse, dropdowns, and modals all behave.

---

## Technical Notes

- **Files touched (high-level)**:
  - Phase 1: `src/pages/profitability/*.tsx`, `src/components/profitability/*`, `src/data/mockProfitability.ts`.
  - Phase 2: `src/pages/advertising/*.tsx`, `src/components/advertising/*`, `src/components/tables/*`, `src/components/charts/PerformanceChart.tsx` + `ImpactLineChart.tsx`, `src/data/mock*.ts`.
  - Phase 3: `src/views/tablet/*`, `src/components/layout/AppSidebar.tsx`, `src/components/tables/TablePagination.tsx`, all `src/data/mock*.ts`.
- **Charts**: Recharts dual-axis via `yAxisId`. Metric cap enforced in selector component.
- **Persistence**: extend `FilterContext` for product multi-select and frequency where missing.
- **No design system drift**: use existing tokens, periwinkle palette, Satoshi/Noto. No new colors.
- **Safety**: destructive actions keep confirmation modals; Add Keyword / Archives bulk actions get preview confirmation.

## Out of scope
- Marketplace selector hover behavior (already addressed earlier).
- Floating Action Island drag (already addressed earlier).
- Any backend/Supabase work — pure frontend + mock data.

## Validation per phase
- Visual check at desktop (1546px) + tablet shell.
- Click through every new control: dropdown opens, multi-select caps at 4, charts redraw, pagination changes page count, expand/collapse animates.
- Confirm no console errors, no TypeScript errors.

Ready to switch to build mode and execute Phase 1.