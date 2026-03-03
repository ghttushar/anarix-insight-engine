

# Universal DataTableToolbar, Taskbar Layout Fix, and Full Profitability Pages

## Three problems to solve

1. **DataTableToolbar only used in Advertising** — needs to be reusable and applied to ALL tables (Profitability ProductsPnLTable, Catalog, BI, DayParting, AMC)
2. **Taskbar layout is cluttered** — controls scattered without visual grouping; needs left group (filters) separated cleanly from right group (marketplace/theme/profile) with proper spacing
3. **Profitability pages are skeletal** — need full interactive pages per the documentation (Dashboard with KPI selection, COGS edit modal, Products/Orders toggle; Trends with scatter chart + product modal; P&L with hierarchical summary + product table; Geography with Coming Soon state)

---

## Phase 1: Fix Taskbar Layout

**File: `src/components/layout/AppTaskbar.tsx`**

Restructure the taskbar into three visual zones with a separator:
- **Left zone**: Ad Type | Frequency | Date Range (grouped with `gap-1.5`, subtle bg container `bg-muted/50 rounded-md px-1 py-0.5`)
- **Center spacer**: `flex-1`
- **Right zone**: Marketplace+Store | Theme toggle | Profile avatar

Add a thin visual divider between left and right via a `Separator` or spacing. This cleans up the "scattered" look.

## Phase 2: Make DataTableToolbar Universal

The existing `DataTableToolbar` already accepts `columns`, `activeFilters`, `filterFields`, `onDownload` etc. The issue is that **no other page uses it**.

**Pages to add DataTableToolbar to:**

| Page | File | Current toolbar |
|------|------|----------------|
| Profitability Dashboard | `ProductsPnLTable.tsx` | Has its own inline toolbar (search, upload COGS, filters, columns, download buttons — all non-functional) |
| Profitability Trends | `Trends.tsx` | No table toolbar |
| Profitability P&L | `ProfitLoss.tsx` | No table toolbar |
| Catalog Products | `CatalogProductsTable.tsx` | Has its own non-functional toolbar |
| BI Keyword Tracker | `KeywordTracker.tsx` | Has its own search |
| DayParting tables | Various | No toolbar |

**Approach**: Replace each page's custom toolbar with `DataTableToolbar`, passing appropriate column definitions and filter fields. Each page defines its own `COLUMN_DEFS` and `FILTER_FIELDS` arrays (same pattern as CampaignManager).

## Phase 3: Rebuild Profitability Pages

### 3a. Dashboard (`src/pages/profitability/Dashboard.tsx`)

Full rebuild with:
- **KPI Period Blocks** (Today, Yesterday, This Month, Last Month) — already exist via `PeriodSummaryCard`
- **Selectable KPI cards** — clicking a card updates the graph below (state: `selectedPeriod`)
- **Graph section** — `ProfitabilityTrendChart` updates based on selected KPI period
- **Products/Orders toggle** below graph (tabs switching table columns)
- **ProductsPnLTable** with `DataTableToolbar` (search, filter, columns, export, Upload COGS button)
- **Inline COGS edit modal** — small dialog with product image, name, SKU, Item ID, current COGS, editable input, Cancel/Change Cost buttons
- **"More" product detail panel** — right-side slide panel (reuse `PeriodBreakdownPanel` pattern) showing per-product financial breakdown
- **Only one KPI panel open at a time** (state management)

### 3b. Trends (`src/pages/profitability/Trends.tsx`)

Full rebuild with:
- Search bar (Item ID / Product Name / SKU)
- Product multi-select with count badge
- Date range selector (Week, Month, Quarter, Year, Custom)
- Metrics selector (large dropdown: Total Sales, Net Profit, Order Sales, etc.)
- Run button
- Download button
- **Scatter chart** with red/yellow/green background zones (already exists, enhance tooltip to show product image)
- **Product table** with dynamic time-based columns
- **Product Trends modal** — dialog with per-product graph, frequency selector, multi-metric lines
- Pagination

### 3c. P&L (`src/pages/profitability/ProfitLoss.tsx`)

Full rebuild with:
- Product multi-select search with count badge + Select All
- Date range selector (Week, Month, Quarter, Year)
- Run button
- Download button
- **P&L Summary Table** (hierarchical, already exists via `PnLParameterTable`) — expand with full row set from documentation (Sales > Organic/SP/SB/SV, Expenses > all sub-items, Orders, Units, Net Profit, ROAS, TACOS)
- **Bottom Product Table** with `DataTableToolbar` (Search, Products/Orders toggle, Filters, Columns, Download)
- **Product "More" modal** — overlay with per-product breakdown (Sales, COGS, Expenses, Units, Inventory, Calculated Metrics)
- Note: Bottom table filters apply immediately (no Run required). Top controls require Run.

### 3d. Geography (`src/pages/profitability/Geographical.tsx`)

- Add "Coming Soon" banner overlay
- Keep existing map + table but disable interactions
- Show informational text: "This feature is coming soon. The UI is ready but data is not yet active."

## Phase 4: Expand Mock Data

**File: `src/data/mockProfitability.ts`**

- Add expanded `pnlData` with all hierarchical rows from the documentation (full Sales breakdown, full Expenses breakdown including Walmart Adjustment, Commission, WFS Fee, etc., Orders by ad type, Units by ad type, Net Profit, ROAS, TACOS)
- Add `profitabilityMetrics` array for Trends metrics dropdown

## Files Summary

| File | Action |
|------|--------|
| `src/components/layout/AppTaskbar.tsx` | Modify — restructure into grouped zones |
| `src/components/profitability/ProductsPnLTable.tsx` | Modify — replace inline toolbar with DataTableToolbar, add COGS edit modal, "More" panel |
| `src/pages/profitability/Dashboard.tsx` | Rewrite — selectable KPI cards, Products/Orders toggle, COGS modal, full interactions |
| `src/pages/profitability/Trends.tsx` | Rewrite — full page with controls, multi-select, scatter chart, dynamic table, product modal |
| `src/pages/profitability/ProfitLoss.tsx` | Rewrite — multi-select, Run paradigm, expanded P&L table, product table with toolbar, "More" modal |
| `src/pages/profitability/Geographical.tsx` | Modify — add Coming Soon overlay |
| `src/data/mockProfitability.ts` | Modify — expand pnlData with all documented rows, add metrics list |
| `src/components/profitability/COGSEditModal.tsx` | Create — inline COGS edit dialog |
| `src/components/profitability/ProductDetailPanel.tsx` | Create — right-side product breakdown panel |
| `src/components/profitability/ProductTrendsModal.tsx` | Create — per-product trends dialog with graph |
| `src/components/profitability/ProductsOrdersToggle.tsx` | Create — Products/Orders table toggle |
| `src/pages/catalog/Products.tsx` | Modify — add DataTableToolbar |
| `src/components/catalog/CatalogProductsTable.tsx` | Modify — integrate DataTableToolbar |

## Implementation Order

1. Fix AppTaskbar layout grouping
2. Expand mockProfitability data
3. Create COGS edit modal, product detail panel, product trends modal
4. Rewrite Dashboard page
5. Rewrite Trends page
6. Rewrite P&L page
7. Update Geography with Coming Soon
8. Add DataTableToolbar to Catalog and remaining pages

