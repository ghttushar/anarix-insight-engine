

# Fix Tables, Add Universal Taskbar Features, Fix Filter/Column Controls

## Three Issues Identified

### Issue 1: No universal features in the top taskbar
From the reference images (image-64), the taskbar should include **Ad Type** dropdown (`All`, `SP`, `SB`, `SD`, `SV`), **Frequency** dropdown (`Daily`, `Weekly`, `Monthly`), and **Date Range** selector — positioned in the taskbar alongside the existing Marketplace/Store selector. These are universal controls that persist across modules.

### Issue 2: Filter and Column dropdowns on tables are not functional
The `DataTableToolbar` has the UI but `CampaignManager` passes `onFilter={() => {}}` (empty handler) and does not pass `columns` prop at all. The Filter button opens nothing. The Columns button doesn't render because no columns are provided.

### Issue 3: Tables are visually broken — overlapping/crooked
The root cause is the `Table` component's wrapper uses `overflow-auto` without constraining the table layout. Combined with `min-w-[200px]`+ many columns, the HTML table overflows its container. The `ProductsPnLTable` has a duplicate sticky column header (line 102-103 both say "Product Details"). Several total rows have incorrect `colSpan` counts that don't match the actual number of header columns.

---

## Plan

### Phase 1: Fix the base Table component
**File: `src/components/ui/table.tsx`**
- Add `table-fixed` option or ensure the overflow wrapper constrains properly
- Reduce default cell padding from `p-4` to `px-3 py-2` for data-dense tables (row height 44px per spec)
- Add `whitespace-nowrap` to `TableHead` and `TableCell` defaults to prevent line-wrapping that causes layout shifts

### Phase 2: Add universal controls to AppTaskbar
**File: `src/components/layout/AppTaskbar.tsx`**
Add three new dropdowns between the left area and the right marketplace section:
1. **Ad Type** — Select with options: `All`, `SP`, `SB`, `SD`, `SV`
2. **Frequency** — Select with options: `Daily`, `Weekly`, `Monthly`
3. **Date Range** — Display current range (e.g., "Feb 24, 2026 - Mar 02, 2026") with preset options

**New context file: `src/contexts/FilterContext.tsx`**
- Store `adType`, `frequency`, `dateRange` globally
- Expose setters
- Persist to localStorage

**File: `src/App.tsx`** — Wrap with `FilterProvider`

### Phase 3: Make Filter and Columns functional in CampaignManager
**File: `src/pages/advertising/CampaignManager.tsx`**
- Add `columns` state array with all column definitions and `visible` boolean
- Add `filters` state array for active filters
- Add `filterPanelOpen` state that toggles a filter row (matching image-62: "Where [Campaign Status] [is] [Live]")
- Pass these to `DataTableToolbar` with proper handlers
- Pass `visibleColumns` to each table component

**File: `src/components/advertising/DataTableToolbar.tsx`**
- Add inline filter builder row: field dropdown + operator dropdown + value dropdown + delete button + "+ Add Filter" link
- Add "Cancel" and "Apply" buttons
- Add search + "Clear All" / "Select All" to Columns dropdown (matching image-63)

### Phase 4: Fix all broken tables

**`src/components/profitability/ProductsPnLTable.tsx`**
- Remove duplicate "Product Details" `TableHead` on line 103
- Fix total row colSpan to match actual column count (should be 1, not 2 for product details)

**All advertising tables** (CampaignTable, AdGroupsTable, KeywordTargetingTable, SearchTermsTable, ProductAdsTable, PageTypeTable, PlatformTable):
- Ensure total row `colSpan` values exactly match the number of preceding non-metric columns
- Add `whitespace-nowrap` to all `TableHead` elements
- Ensure `overflow-x-auto` wrapper is on the immediate parent of `<Table>`

**`src/components/tables/CampaignTableTotalRow.tsx`**
- Fix `colSpan={4}` — should be 4 (checkbox + active + status + name) which is correct, but verify it matches when `showTotalBudget` changes

---

## Files Summary

| File | Action |
|------|--------|
| `src/contexts/FilterContext.tsx` | **Create** — ad type, frequency, date range global state |
| `src/components/ui/table.tsx` | **Modify** — tighter padding, nowrap defaults |
| `src/components/layout/AppTaskbar.tsx` | **Modify** — add Ad Type, Frequency, Date Range dropdowns |
| `src/App.tsx` | **Modify** — wrap with FilterProvider |
| `src/components/advertising/DataTableToolbar.tsx` | **Modify** — add inline filter builder + enhanced columns dropdown |
| `src/pages/advertising/CampaignManager.tsx` | **Modify** — wire columns/filters state |
| `src/components/profitability/ProductsPnLTable.tsx` | **Modify** — remove duplicate header, fix colSpan |
| `src/components/tables/AdGroupsTable.tsx` | **Modify** — fix total row colSpan |
| `src/components/tables/KeywordTargetingTable.tsx` | **Modify** — fix total row colSpan |
| `src/components/tables/ProductAdsTable.tsx` | **Modify** — fix total row colSpan |
| `src/components/tables/SearchTermsTable.tsx` | **Modify** — fix total row colSpan |

## Implementation Order
1. Create FilterContext
2. Fix table.tsx base component
3. Add universal taskbar controls
4. Fix ProductsPnLTable duplicate header
5. Fix all total row colSpans across tables
6. Make DataTableToolbar filter/columns functional
7. Wire CampaignManager to toolbar

