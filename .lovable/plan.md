

## Universal Table Standardization: Sort Button, Pin Radio, Toolbar Consistency, Card Uniformity

### Current State (Audit Results)

**Toolbar inconsistency:**
- `CatalogProductsTable` has its OWN inline toolbar with `variant="outline"` buttons — completely different from `DataTableToolbar` used everywhere else
- `DataTableToolbar` is used on: Campaign Manager, Profitability Dashboard, Ad Group Detail, but NOT on Catalog

**Pagination placement:**
- `CampaignTable`: pagination is OUTSIDE the card (`space-y-4` separates table card from pagination)
- `AdGroupsTable`, `KeywordTargetingTable`, etc.: pagination is inside the card wrapper at the page level, but the table itself returns `<div className="rounded-lg border">` with `TablePagination` as a sibling — inconsistent
- `ProductsPnLTable`: pagination inside card
- `CatalogProductsTable`: NO pagination at all
- `RegionalProductTable`: NO pagination, NO sorting

**Sorting:**
- `CampaignTable` has its own inline `SortIcon` component (not using `SortableTableHead`)
- Other tables use `SortableTableHead` but only in headers — no toolbar sort button exists
- `ProductsPnLTable`: NO sorting
- `CatalogProductsTable`: NO sorting

**Editable tables (have Switch/Checkbox/Input):**
- `CampaignTable` — Switch, Input, Select, DatePicker (already has Edit mode)
- `KeywordTargetingTable` — Switch (bid toggle)
- `ProductTargetingTable` — Switch (bid toggle)
- `PageTypeTable` — Input (bid modifier)
- `PlatformTable` — Input (bid modifier)
- `SearchTermsTable` — Checkbox (selection)
- `ProductAdsTable` — Checkbox (selection)

**App Level Selector:** Currently `bg-muted/30` — needs solid `bg-card` fill

---

### Plan: 4 Phases

#### Phase 1: DataTableToolbar Updates + AppLevelSelector

**DataTableToolbar.tsx** — Add Sort button after Delta, before Filter:
- New prop: `onSortChange?: (field: string, direction: "asc"|"desc"|null) => void`
- New prop: `sortField?: string | null`, `sortDirection?: "asc"|"desc"`, `sortableFields?: string[]`
- Sort button opens a Popover with a list of sortable fields, each with asc/desc toggle
- Button shows active sort indicator (field name badge) when sorting is active
- Position in toolbar: Upload → Delta → **Sort** → Filter → Columns → Export → Edit

**AppLevelSelector.tsx** — Change container from `bg-muted/30` to `bg-card`:
- Line 45: change to `bg-card rounded-lg border border-border px-1.5 py-1`

#### Phase 2: Replace SortableTableHead Sort Arrows with Pin Radio Buttons

**SortableTableHead.tsx** — Complete redesign:
- Remove all sort arrow icons (ArrowUpDown, ArrowUp, ArrowDown)
- Add a small circular radio/pin indicator instead:
  - Size: `h-2.5 w-2.5` (very small)
  - Default: `opacity-50` border circle, `group-hover:opacity-80`
  - Active (pinned): filled `bg-primary` blue dot, full opacity
  - Click: toggles pin on/off
- New props: `isPinned?: boolean`, `onPinToggle?: (field: string) => void`
- Remove `onSort` from header clicks (sorting moves to toolbar)
- Pin radio appears on ALL non-fixed columns
- Fixed columns (like Status, Name) do NOT get the radio button

**Pin behavior:**
- Pinned column gets `sticky` positioning with `z-10` and opaque background
- Pinned columns render immediately after the last fixed column in the table
- Column order: [Fixed cols (Status, Name)] → [Pinned cols] → [Regular cols]
- Each table defines its `fixedColumns` array (columns that never move)

#### Phase 3: Rebuild ALL Tables with Identical Structure

Every table will follow this exact pattern:
```
<div className="rounded-lg border border-border bg-card">
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          {/* Fixed columns: sticky left, z-20, bg-muted */}
          {/* Pinned columns: sticky, z-10, bg-muted */}
          {/* Regular columns with pin radio */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Data rows */}
        {/* Total row: bg-muted font-medium */}
      </TableBody>
    </Table>
  </div>
  <TablePagination ... />  {/* INSIDE the card */}
</div>
```

**Tables to rebuild (17 total):**

| Table | Fixed Columns | Has Edit | Has Total Row |
|---|---|---|---|
| CampaignTable | Status, Type, Name | Yes (Switch, Input, Select, Date) | Yes |
| AdGroupsTable | Status, Name, Campaign | No | Yes |
| KeywordTargetingTable | Status, Keyword, Match, AdGroup, Campaign | Yes (Switch) | Yes |
| ProductTargetingTable | Status, Target, Type, AdGroup, Campaign | Yes (Switch) | Yes |
| SearchTermsTable | Checkbox, Term, Match, Campaign | Yes (Checkbox) | Yes |
| ProductAdsTable | Checkbox, Product, AdGroup, Campaign | Yes (Checkbox) | Yes |
| PageTypeTable | Page Type | Yes (Input bid modifier) | Yes |
| PlatformTable | Platform | Yes (Input bid modifier) | Yes |
| ImpactTable | Name | No | No |
| RegionalTable | Region | No | No |
| RegionalProductTable | Product Details | No | No (add it) |
| ProductsPnLTable | Product Details | No | Yes |
| CatalogProductsTable | Product Details | No | Yes |
| ScheduledJobsTable | Campaign | No | No |
| HistoryTable | Execution Time | No | No |
| BrandCoverageTable | Brand | No | No |
| KeywordTrackerTable | Keyword | No | No |

**CatalogProductsTable** — Delete the inline custom toolbar entirely. The parent page (`Products.tsx`) will use `DataTableToolbar` like every other page.

**CampaignTable** — Move pagination inside the card. Refactor `SortIcon` to use the new `SortableTableHead` radio pattern. Remove inline sorting — sorting will be handled via toolbar.

**RegionalProductTable** — Add sorting via toolbar, add pagination, add total row.

**ProductsPnLTable** — Add sorting via toolbar.

#### Phase 4: Wire Toolbar on Every Page

Every page that has a table must wire `DataTableToolbar` with:
- `sortableFields` (list of column field names)
- `sortField` / `sortDirection` / `onSortChange` 
- `columns` / `onColumnToggle` (for Columns dropdown)
- `showViewToggle={true}` if the table has editable elements
- `showDeltas` / `onShowDeltasChange` 
- `onDownload` (Export)
- `filterFields` (Filter)

Pages to update:
- `CampaignManager.tsx` — already has toolbar, add sort props
- `CampaignDetail.tsx` (Ad Groups tab) — add toolbar if missing
- `AdGroupDetail.tsx` — add toolbar for Keywords, Product Targeting, Search Terms, Product Ads tabs
- `Products.tsx` (Catalog) — replace inline toolbar with `DataTableToolbar`
- `Dashboard.tsx` (Profitability) — already has toolbar, add sort props
- `ProfitLoss.tsx` — add sort props
- `Geographical.tsx` — add sort props
- `ImpactAnalysis.tsx` — add sort props
- `HourlyData.tsx` — add sort props if table exists
- `ScheduledJobs.tsx` — add sort props
- `History.tsx` — add sort props
- `BrandSOV.tsx` — add sort props
- `KeywordTracker.tsx` — add sort props

---

### Files Summary

| File | Phase | Change |
|---|---|---|
| `DataTableToolbar.tsx` | 1 | Add Sort button with popover (after Delta, before Filter) |
| `AppLevelSelector.tsx` | 1 | Change to solid `bg-card` background |
| `SortableTableHead.tsx` | 2 | Replace sort arrows with pin radio buttons |
| `CampaignTable.tsx` | 3 | Pagination inside card, remove inline sort, use pin radios |
| `AdGroupsTable.tsx` | 3 | Standardize structure, add pin radios |
| `KeywordTargetingTable.tsx` | 3 | Standardize, add Edit support, add pin radios |
| `ProductTargetingTable.tsx` | 3 | Standardize, add Edit support, add pin radios |
| `SearchTermsTable.tsx` | 3 | Standardize, add Edit support, add pin radios |
| `ProductAdsTable.tsx` | 3 | Standardize, add Edit support, add pin radios |
| `PageTypeTable.tsx` | 3 | Standardize, add Edit support, add pin radios |
| `PlatformTable.tsx` | 3 | Standardize, add Edit support, add pin radios |
| `ImpactTable.tsx` | 3 | Standardize, add pin radios |
| `RegionalTable.tsx` | 3 | Standardize, add pin radios |
| `RegionalProductTable.tsx` | 3 | Add sorting, pagination, total row, pin radios |
| `ProductsPnLTable.tsx` | 3 | Add sorting, add pin radios |
| `CatalogProductsTable.tsx` | 3 | Remove inline toolbar, standardize structure, add pagination, sorting, pin radios |
| `ScheduledJobsTable.tsx` | 3 | Standardize, add pin radios |
| `HistoryTable.tsx` | 3 | Standardize, add pin radios |
| `BrandCoverageTable.tsx` | 3 | Standardize, add pin radios |
| `KeywordTrackerTable.tsx` | 3 | Standardize, add pin radios |
| `CampaignTableTotalRow.tsx` | 3 | Ensure compatible with new structure |
| `Products.tsx` (catalog page) | 4 | Wire DataTableToolbar instead of inline |
| All page files with tables | 4 | Wire sort, columns, edit, delta consistently |

**Delivery:** Phase 1+2 together (toolbar + pin radios), then Phase 3+4 together (all tables + all pages).

