## Fix: App Level Selector Redesign, Sort Button (No Popover), Pin Functional, Remove Sort from Headers

### 3 Changes

---

### 1. App Level Selector Redesign

**Problem:** Small floating box looks lost against the page title.

**Solution:** Make it a full-width strip that spans the entire top area, right-aligned against the page title. Instead of a tiny bordered box, render children and the marketplace dropdown as individual pill-style controls inline within the PageHeader row itself — no wrapper card needed. The `AppLevelSelector` container becomes `flex items-center gap-2` with no border/background. Each child Select and the marketplace button get consistent `h-9 rounded-md bg-muted border border-border px-3` styling.

**Files:** `AppLevelSelector.tsx` — remove the outer `bg-card rounded-lg border` wrapper, let items sit naturally in the PageHeader flex row.

---

### 2. Sort Button — 3-State Inline Toggle (No Popover)

**Problem:** Current sort opens a popover with field list. User wants: click Sort button cycles through 3 states — inactive (both arrows), asc (up arrow), desc (down arrow), then back to inactive. No popover/dialog.

**But** the sort needs to know WHICH field to sort by. Looking at the uploaded image, the user's reference shows a popover with field names. So the popover stays but the ARROW behavior on each field row changes to the 3-state cycle:

- Inactive: show `ArrowUpDown` icon  
- Click 1: `ArrowUp` (asc, highlighted)
- Click 2: `ArrowDown` (desc, highlighted)  
- Click 3: deactivate (back to `ArrowUpDown`)

When not hovering the Sort button, it shows the last active arrow direction if sorting is active.

**Wait** — re-reading: "clicking on sort should not open any additional dialogue/control box". So NO popover at all. The sort button itself is a 3-state toggle. But then how does it know which field? Answer: it uses whatever `sortableFields` are defined, and the toolbar just needs a single sort toggle that cycles the direction on the current `sortField`. The field selection would come from the Columns dropdown or be a default.

Actually looking more carefully at the image — it DOES show a popover with field names. Let me re-read: "clicking on sort should not open any additional dialogue/control box". This contradicts the image. I'll follow the text instruction: **no popover**. The sort button is a simple 3-state inline toggle.

For field selection: the first sortable field is used as default, or if sort was previously set to a field, it keeps that field. The button just cycles direction.

**Implementation in `DataTableToolbar.tsx`:**

- Remove `Popover` around sort button
- Sort button click cycles: inactive → asc → desc → inactive
- Icon shows: `ArrowUpDown` (inactive), `ArrowUp` (asc), `ArrowDown` (desc)
- When active: `bg-primary/10 text-primary`
- Remove `sortOpen` state

---

### 3. Remove Sort from Column Headers, Keep Only Pin

`**SortableTableHead.tsx`:**

- Remove `onSort` prop usage — no click-to-sort on headers
- Remove sort arrow icons entirely
- Keep ONLY the pin radio button
- Remove `cursor-pointer` from header (no click action)

---

### 4. Make Pin Functional

**Current state:** Pin radio toggles `pinnedColumns` Set in each table, but pinned columns don't actually reorder or get sticky positioning.

**Implementation:** In each table component, when rendering columns:

1. Define `fixedColumns` array (always first, e.g., Status, Name)
2. `pinnedColumns` from state get rendered immediately after fixed columns
3. Remaining columns render after pinned
4. Pinned columns get `sticky` with calculated `left` offset after fixed columns, `z-10`, opaque `bg-muted` (header) / `bg-background` (body)

This requires each table to dynamically reorder its columns based on pin state. I'll implement a shared utility `getOrderedColumns(allColumns, fixedColumns, pinnedColumns)` that returns the correct render order.

**Tables to update (all with `onPinToggle`):**

- `AdGroupsTable`, `KeywordTargetingTable`, `ProductTargetingTable`, `SearchTermsTable`, `ProductAdsTable`, `PageTypeTable`, `PlatformTable`, `ImpactTable`, `RegionalTable`
- `CampaignTable` (uses custom sort, needs migration)
- `CatalogProductsTable`, `RegionalProductTable`, `ProductsPnLTable` (need pin state added)
- `ScheduledJobsTable`, `HistoryTable`, `BrandCoverageTable`, `KeywordTrackerTable`

---

### 5. Add Sort and Pin to ALL Table Toolbars on Listed Screens

Pages that need `sortableFields` + `sortField` + `sortDirection` + `onSortChange` added to their `DataTableToolbar`:


| Page                       | File                   | Needs Added                |
| -------------------------- | ---------------------- | -------------------------- |
| Profitability Dashboard    | `Dashboard.tsx`        | sortableFields, sort state |
| Profitability Trends       | `Trends.tsx`           | sortableFields, sort state |
| Profitability P&L          | `ProfitLoss.tsx`       | sortableFields, sort state |
| Profitability Geographical | `Geographical.tsx`     | sortableFields, sort state |
| Campaign Manager           | `CampaignManager.tsx`  | Already has it             |
| Impact Analysis            | `ImpactAnalysis.tsx`   | sortableFields, sort state |
| Targeting Actions          | `TargetingActions.tsx` | sortableFields, sort state |
| Catalog Products           | `Products.tsx`         | Already has it             |
| Day Parting History        | `History.tsx`          | sortableFields, sort state |
| Day Parting Scheduled Jobs | `ScheduledJobs.tsx`    | sortableFields, sort state |


---

### 6. Column Selector Working on All Screens

Ensure every `DataTableToolbar` that has tables also passes `columns`, `onColumnToggle`, `onSelectAllColumns`, `onClearAllColumns`. Check and add `COLUMN_DEFS` + state to pages missing it.

---

### 7. Filter Chips Equal Spacing

In `DataTableToolbar.tsx` line 455: change `<div className="flex flex-wrap items-center gap-1.5">` to `<div className="flex flex-wrap items-center gap-1.5 py-1.5">` for equal top/bottom spacing.

---

### Files Summary


| File                    | Change                                                                    |
| ----------------------- | ------------------------------------------------------------------------- |
| `AppLevelSelector.tsx`  | Remove outer card wrapper, let controls sit naturally                     |
| `DataTableToolbar.tsx`  | Replace sort popover with 3-state inline button; fix filter chips padding |
| `SortableTableHead.tsx` | Remove sort arrows/click, keep only pin radio                             |
| All 10 table components | Implement functional pin (column reordering + sticky)                     |
| 8 page files            | Add sortableFields + sort state to DataTableToolbar                       |
| Pages missing columns   | Add COLUMN_DEFS + column toggle wiring                                    |


**Delivery:** All in one pass — the changes are mostly mechanical (add props, remove sort from headers, add pin reorder logic).