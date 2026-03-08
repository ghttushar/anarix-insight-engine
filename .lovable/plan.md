

# Phased Implementation Plan: Full App Polish, Fixes, and New Features

This is a massive scope. To be transparent: implementing everything in a single pass will exceed credit limits. I am breaking this into **6 sequential phases**. You approve and I execute one phase at a time.

---

## Phase 1: Core Layout, Panel, and Table Fixes (Foundation)

These are the broken fundamentals that affect every page.

### 1a. Insights Panel — Remove backdrop blur
**File: `src/components/insights/InsightsPanel.tsx`** line 27
- Remove `bg-black/4 backdrop-blur-[1px]` from backdrop div
- Replace with `bg-transparent`

### 1b. All right panels — open on same layer, not on top of app
Right panels (PeriodBreakdownPanel, ProductDetailPanel, InsightsPanel) currently use `fixed` positioning with `z-50`, which covers the entire app. Change to inline flex layout within AppLayout, same pattern as AanCopilotPanel (which is already inline).

**Files:**
- `src/components/layout/AppLayout.tsx` — Add slots for right panels inline (not fixed overlay)
- `src/components/profitability/PeriodBreakdownPanel.tsx` — Convert from `fixed` to inline flex panel
- `src/components/profitability/ProductDetailPanel.tsx` — Same conversion
- `src/components/insights/InsightsPanel.tsx` — Same conversion

### 1c. Independent scroll on all right panels
All panels already use `ScrollArea` but some have containment issues. Ensure each panel has `h-full flex flex-col` with `overflow-hidden` outer and `overflow-y-auto` inner.

### 1d. Table hover overlap fix
The `overflow-auto` wrapper on `Table` causes hover states to visually overlap when scrolling horizontally. Fix by adding `relative` to `TableRow` and ensuring the hover bg doesn't bleed.

**File: `src/components/ui/table.tsx`** — Add `relative` to `TableRow`

### 1e. Unified table styling
All tables must use the same `Table` component from `src/components/ui/table.tsx`. Audit all table pages to ensure consistent row height (44px), padding (px-3 py-2), and header styling.

### 1f. Taskbar redesign — proper grouping and labels
**File: `src/components/layout/AppTaskbar.tsx`**
- Replace "All" with "Ad Type: All" or use full-form labels so users know what each dropdown is
- Increase height from `h-10` to `h-12`
- Use `bg-muted/30 rounded-md px-2 py-1` container around the left-side filter group
- Proper alignment with consistent spacing

### 1g. Sidebar — remove collapse button from footer, fix nav collapse behavior
**File: `src/components/layout/AppSidebar.tsx`**
- Remove the Collapse button from the footer entirely (sidebar already has the nook arrow on its edge)
- Fix navigation: clicking a nav item (e.g., "Campaign Manager") should NOT collapse the parent section ("Advertising"). The active section should stay open. Only manually clicking the section header should toggle it.
- Keep Profile + Theme toggle in footer, give them more breathing room

### 1h. Remove duplicate controls
Several pages have their own date range / frequency selectors that duplicate the universal taskbar. Remove page-level duplicates from:
- `src/pages/dayparting/HourlyData.tsx` (has its own Date Range selector)
- `src/pages/advertising/TargetingActions.tsx` (has its own Date Range selector)
- Any other page with redundant controls

---

## Phase 2: Unified DataTableToolbar Everywhere + Toolbar Position Consistency

### 2a. Toolbar layout consistency
In Profitability Dashboard, the search bar is part of DataTableToolbar (right-aligned). In the reference images (image-67, image-68), the search is on the LEFT and action buttons (Upload COGS, Export, Columns, Filter, Download) are on the RIGHT.

**File: `src/components/advertising/DataTableToolbar.tsx`**
- Restructure: Search on LEFT, Columns + Filter + Download on RIGHT
- This makes all pages consistent

### 2b. Apply DataTableToolbar to ALL table pages
Every page with a table must use the same `DataTableToolbar` with appropriate `COLUMN_DEFS` and `FILTER_FIELDS`:
- Catalog Products table
- BI Keyword Tracker
- Day Parting tables
- AMC tables
- All advertising sub-tables that don't already have it

---

## Phase 3: Page-Specific Fixes

### 3a. Targeting Actions — fix Broad/Exact/Phrase layout
The checkbox + bid input stack is cramped. Restructure to horizontal layout with proper spacing. Checkbox above, bid input below, centered in cell.

### 3b. Day Parting Heatmap — use brand color tints
**File: `src/components/dayparting/HourlyHeatmap.tsx`**
- Replace generic `bg-destructive/20`, `bg-warning/30`, `bg-success/50` with brand periwinkle tints:
  - Lowest: `bg-primary/5`
  - Low: `bg-primary/15`
  - Medium: `bg-primary/30`
  - High: `bg-primary/50`
  - Highest: `bg-primary/70`
- Remove the days checkbox row from HourlyData page

### 3c. Schedule Editor redesign
**File: `src/pages/dayparting/ScheduleEditor.tsx`**
- Currently `max-w-4xl` which wastes right side. Use full width with two-column layout:
  - Left: Form fields (schedule name, action type, campaigns)
  - Right: Time grid + day selector + preview
- Remove Card wrappers, use section headers instead

### 3d. PeriodBreakdownPanel — "View More" opens inline, not overlay
Already addressed in Phase 1b.

---

## Phase 4: New Feature Pages (Part 1)

Create the first 5 competitive features as new pages with routes:

### 4a. Budget Pacing Dashboard
- New route: `/advertising/budget-pacing`
- New file: `src/pages/advertising/BudgetPacing.tsx`
- Visual timeline showing daily budget burn rate vs target
- Projected overspend/underspend alerts
- Campaign-level pacing cards

### 4b. Search Term Harvesting
- New route: `/advertising/search-harvesting`
- New file: `src/pages/advertising/SearchHarvesting.tsx`
- Cards showing high-performing search terms
- "Add as Keyword" action with match type + bid suggestion
- Aan AI explanation per term

### 4c. Marketplace Health Score
- New route: `/workspace/health-score`
- New file: `src/pages/workspace/HealthScore.tsx`
- Single composite score (0-100) with circular progress
- Breakdown: profitability, ad efficiency, inventory health, keyword coverage

### 4d. Cross-Marketplace Unified P&L
- New route: `/profitability/unified-pnl`
- New file: `src/pages/profitability/UnifiedPnL.tsx`
- Side-by-side Amazon + Walmart P&L with Combined column

### 4e. Aan Anomaly Alerts
- New route: part of existing Insights system
- Enhance `src/components/insights/InsightsContext.tsx` with anomaly detection alerts
- In-app notification bell in sidebar

---

## Phase 5: New Feature Pages (Part 2)

### 5a. Creative Performance Analyzer
- New route: `/advertising/creative-analyzer`
- Upload creatives, correlation analysis with CTR/CVR

### 5b. Competitor Price Tracking
- New route: `/bi/competitor-pricing`
- Price timeline chart, correlation with own sales

### 5c. Rule Builder with Backtesting
- New route: `/advertising/rules`
- Rule definition form + historical simulation chart

### 5d. Inventory-Aware Ad Optimization
- New route: `/catalog/inventory-ads`
- Stock level + ad spend correlation dashboard

### 5e. Client Reporting Portal
- New route: `/reports/client-portal`
- Report builder, PDF preview, schedule configuration

---

## Phase 6: Final Polish Pass

- Verify every button works (toast feedback minimum)
- Verify all panels have independent scroll
- Verify all tables are visually identical
- Verify no duplicate controls
- Verify sidebar navigation behavior

---

## Recommended Execution

Each phase is one approval cycle. Phase 1 is the most critical — it fixes the broken foundation. Phases 4-5 add new pages. Phase 6 is the final audit.

**I recommend starting with Phase 1 now.** It addresses the most user-visible issues: panel blur, overlay behavior, table styling, taskbar design, sidebar behavior, and duplicate controls.

