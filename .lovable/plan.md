

## Functional Column Pinning + Missing Tables + Component Library Update

### Problem Summary

1. **Pin radio exists in 13 tables** but is purely visual — clicking it toggles state but columns do not move or become sticky
2. **4 tables** have no pin at all: `CampaignTable`, `CatalogProductsTable`, `ProductsPnLTable`, `RegionalProductTable`
3. **Component Library** is missing sections for: AppLevelSelector, DataTableToolbar (updated with Sort button), Table with Pin Radio, ProfitabilityHeroCard, Upload Dialog, Prompt Suggestion Notch

---

### Phase 1: Make Pin Functional in SortableTableHead + All Tables

**Approach:** Rather than reordering columns (which requires restructuring every table's JSX), pinning will apply `sticky` positioning with `left` offset and opaque background to pinned columns. This is the pragmatic approach — pinned columns freeze in place during horizontal scroll.

**SortableTableHead.tsx changes:**
- Accept new prop `isPinnedSticky?: boolean` and `stickyLeft?: number`
- When `isPinnedSticky` is true, apply `sticky` + `left-[Xpx]` + `z-10` + `bg-muted` to the `<TableHead>`
- Export a helper function `getPinnedStyle(field, pinnedColumns, fixedWidths)` that returns inline style `{ position: 'sticky', left: calculatedOffset, zIndex: 10 }` for use in both header and body cells

**Each table component changes (13 existing + 4 new):**
- For header: pass `isPinnedSticky` and computed `stickyLeft` to `SortableTableHead`
- For body cells: apply matching sticky styles when column is pinned using the same offset calculation
- Pinned columns get opaque `bg-muted` (header) / `bg-background` (body) to prevent bleed-through

**Tables to ADD pin support to:**

| Table | Change |
|---|---|
| `CampaignTable.tsx` | Replace custom `SortIcon` headers with `SortableTableHead`, add `pinnedColumns` state, add pin toggle |
| `CatalogProductsTable.tsx` | Replace plain `TableHead` with `SortableTableHead`, add `pinnedColumns` state |
| `ProductsPnLTable.tsx` | Replace plain `TableHead` with `SortableTableHead`, add `pinnedColumns` state |
| `RegionalProductTable.tsx` | Replace plain `TableHead` with `SortableTableHead`, add `pinnedColumns` state |

**Pin offset calculation logic (shared utility in SortableTableHead.tsx):**
```
function getColumnPinStyle(field, pinnedColumns, columnWidths) {
  // Fixed columns have predefined left offsets
  // Pinned columns stack after the last fixed column
  // Each pinned column's left = sum of fixed widths + sum of preceding pinned widths
  return { position: 'sticky', left: calculatedLeft, zIndex: 10 }
}
```

Each table defines a `COLUMN_WIDTHS` map (e.g., `{ impressions: 120, clicks: 100 }`) and a `FIXED_COLUMNS` array. The pin style is computed per-render based on current `pinnedColumns` Set.

---

### Phase 2: Component Library Update

**New sections to add to `ComponentLibrary.tsx`:**

1. **App Level Metric Selector** — Static render of the inline pill-style selector strip showing marketplace + ad type + account dropdowns
2. **DataTable Toolbar (Updated)** — Show the current toolbar with Sort (3-state), Delta, Filter, Columns, Export buttons including active states
3. **Table with Column Pinning** — Static table showing pin radio buttons in headers (unpinned dot at 60% opacity, pinned solid blue dot), with annotation explaining behavior
4. **Profitability Hero Card** — Static render showing the Overview tab with Net Profit, KPI tiles, and sparkline
5. **Upload Dialog** — Static anatomy of the drag-and-drop upload dialog with file list

**Existing sections to update:**
- **DataTable Toolbar strip** (line ~1560): Add Sort button, Delta button to the toolbar anatomy
- **Table section** (line ~577): Add pin radio dots to the column headers

---

### Files to Edit

| File | Phase | Change |
|---|---|---|
| `SortableTableHead.tsx` | 1 | Add sticky pin styles, export `getColumnPinStyle` utility |
| `AdGroupsTable.tsx` | 1 | Apply sticky styles to pinned columns in header + body |
| `KeywordTargetingTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `ProductTargetingTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `SearchTermsTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `ProductAdsTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `PageTypeTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `PlatformTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `ImpactTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `RegionalTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `HistoryTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `ScheduledJobsTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `BrandCoverageTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `KeywordTrackerTable.tsx` | 1 | Apply sticky styles to pinned columns |
| `CampaignTable.tsx` | 1 | Replace custom headers with SortableTableHead, add pin state + sticky |
| `CatalogProductsTable.tsx` | 1 | Add SortableTableHead, pin state + sticky |
| `ProductsPnLTable.tsx` | 1 | Add SortableTableHead, pin state + sticky |
| `RegionalProductTable.tsx` | 1 | Add SortableTableHead, pin state + sticky |
| `ComponentLibrary.tsx` | 2 | Add new sections, update existing toolbar/table sections |

**Delivery:** Phase 1 (all tables functional pinning) then Phase 2 (Component Library).

