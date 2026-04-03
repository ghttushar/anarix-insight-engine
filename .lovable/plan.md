

## Comprehensive Update: Group By, Universal Sort/Pin with Pin Icon, Breadcrumb & Pagination Layout, Reports Page, Day Parting Metrics

### 7 Changes

---

### 1. Rename "Sort" to "Group By" in DataTableToolbar

**File:** `DataTableToolbar.tsx`

Rename the Sort button label from "Sort" to "Group By". Keep the same popover logic (3-state toggle per field: inactive → asc → desc → inactive). Change the popover header from "Sort by" to "Group by". Rename props from `sortableFields`/`sortField`/`sortDirection`/`onSortChange` is kept internally but the UI text changes. The icon remains `ArrowUpDown`/`ArrowUp`/`ArrowDown`.

---

### 2. Universal Sort + Pin Icon in Every Table Column Header

**File:** `SortableTableHead.tsx`

- Replace the pin radio button (small `h-2.5` circle) with a `Pin` icon from lucide-react
- 4 states: (1) hidden/muted on default, (2) visible at ~40% opacity on column hover, (3) solid `text-primary` when pinned, (4) hover highlight when hovering the pin button itself
- Keep sort arrows (`ArrowUp`/`ArrowDown`/`ArrowUpDown`) — same 3-state logic
- Make both icons slightly larger (`h-3.5 w-3.5`) for better visibility
- Layout per header cell: `[Sort Icon] [Label] [Pin Icon]`

**All 16 table files** that use `SortableTableHead` already get this automatically. Tables that currently use plain `TableHead` (like `HourlyData.tsx` campaigns table, `ClientPortal.tsx` reports table) need to be converted to use `SortableTableHead` with `usePinning` and sort state.

Tables to add sort/pin to:
- `HourlyData.tsx` inline campaigns table → convert to `SortableTableHead`
- `ClientPortal.tsx` reports table → convert to `SortableTableHead`
- Any other tables using raw `TableHead` across all screens

---

### 3. Smaller Breadcrumb + Bottom Breadcrumb on Every Page

**File:** `PageBreadcrumb.tsx`

- Reduce text size from `text-sm` to `text-xs`
- Reduce chevron icon from `h-4 w-4` to `h-3 w-3`
- Reduce gap from `gap-1` to `gap-0.5`

**New Component:** `PageFooterBar.tsx`

A footer bar that sits below the page content (outside any table card) containing:
- Left side: `PageBreadcrumb` (same items as top)
- Right side: nothing (rows per page moves into pagination, see below)

**All page files** that have a `PageHeader` or `PageBreadcrumb` need a matching `PageFooterBar` at the bottom. Pages that don't currently have breadcrumbs need them added (both top and bottom). This includes all screens in Profitability, Advertising, Catalog, Day Parting, Reports, BI, AMC, Workspace, Settings.

---

### 4. Move Rows Per Page Adjacent to Pagination (Right Side)

**File:** `TablePagination.tsx`

Current layout: `[Rows per page (left)] ... [X-Y of Z | < >] (right)`

New layout: `[X-Y of Z] (left) ... [Rows per page | < >] (right)`

Move the rows-per-page selector to sit directly adjacent to the prev/next buttons on the right side. The count label stays on the left.

---

### 5. Reports — Move to Default Navigation + Full Redesign

**Current:** Reports lives under a sidebar group "Reports" with one sub-item "Client Portal" at `/reports/client-portal`.

**Change:** 
- Keep it in sidebar but make it a proper top-level section
- Redesign `ClientPortal.tsx` to serve both agency (ecom manager) and individual brand owner perspectives

**New Reports page features:**
- **User type toggle**: "Agency View" / "Brand Owner View" at the top
- **Agency View**: Multi-client report management (existing functionality, cleaned up)
- **Brand Owner View**: Single-brand custom report builder with:
  - Report template selection (Performance, P&L, Advertising, Custom)
  - Schedule builder: pick day of week + time of day for auto-generation
  - Date range / frequency selection for the report period
  - Section builder with drag-to-reorder
  - Preview panel
- **Shared features**: Report history table with sort/pin, status badges, download/preview/send actions
- Add `AppTaskbar` with date range, `AppLevelSelector`, and proper `DataTableToolbar` on the reports table
- Add `SortableTableHead` with pin/sort to the reports table

**Files:** `ClientPortal.tsx` (major rewrite), possibly new `ReportScheduleBuilder.tsx` component

---

### 6. Day Parting Hero Metrics — Add Metric Dropdown

**File:** `HourlyData.tsx`

Current: 6 static metric boxes (Spend, Revenue, ROAS, ACOS, Orders, Units) with hardcoded labels.

**Change:** Add a small dropdown selector to each metric box header so the user can swap what metric each box displays. Use a `Select` component with available metrics as options. When user changes a metric, the box label and value update accordingly.

Available metrics pool: Spend, Revenue, ROAS, ACOS, Orders, Units, Clicks, Impressions, CTR, CPC, CVR, Ad Sales.

Each box maintains its own selected metric independently.

---

### 7. Component Library Update

**File:** `ComponentLibrary.tsx`

Add/update sections for:
- Updated `SortableTableHead` with Pin icon (not radio) demo
- "Group By" toolbar button demo
- Bottom breadcrumb + smaller breadcrumb demo
- Updated `TablePagination` layout demo
- Day Parting metric dropdown demo

---

### Files Summary

| File | Change |
|---|---|
| `DataTableToolbar.tsx` | Rename Sort → Group By (label + popover header only) |
| `SortableTableHead.tsx` | Replace pin radio with Pin icon, 4 visibility states, larger icons |
| `TablePagination.tsx` | Move rows-per-page to right side adjacent to nav buttons |
| `PageBreadcrumb.tsx` | Reduce size (text-xs, h-3 w-3 chevron) |
| `PageFooterBar.tsx` (new) | Bottom breadcrumb bar for all pages |
| `ClientPortal.tsx` | Full redesign with Agency/Brand Owner views, schedule builder |
| `HourlyData.tsx` | Add per-box metric dropdown to hero metrics |
| All page files (~30+) | Add top + bottom breadcrumb, ensure tables have sort/pin |
| `HourlyData.tsx` campaigns table | Convert to SortableTableHead |
| `ComponentLibrary.tsx` | Update with new component demos |

