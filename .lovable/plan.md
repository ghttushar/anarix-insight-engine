

## Fix: Aan Sidebar Logo, App Level Selector Alignment, Table Sort/Pin Across All Tables

### 3 Issues

1. **Aan Workspace Sidebar** — Currently uses Anarix brand logos (`logo-light-full.svg`, `logo-dark-symbol.svg`). User wants the **Aan logo** (Sparkles icon + "Aan" text) when expanded, and just the Sparkles icon when collapsed.

2. **App Level Selector** — The children items (Catalogue select, Ad Type select) and the marketplace button are different sizes. Need to wrap all items in a uniform container with consistent `h-9` height and `bg-muted/50 rounded-lg border` background on each item.

3. **Table Sorting + Pinning** — Sorting exists ONLY in `CampaignTable.tsx`. No other table has it. Pinning exists only in the `DataTableToolbar` columns dropdown but NOT in table headers. Need to add both to every table across the app.

---

### Fix 1: Aan Workspace Sidebar Logo

**File:** `AanWorkspaceSidebar.tsx`

- Remove imports of `logo-light-full`, `logo-dark-full`, `logo-light-symbol`, `logo-dark-symbol`
- Import `AanLogo` from `./AanLogo`
- Import `Sparkles` from lucide-react
- **Collapsed state (line 76):** Replace `<img src={logoSymbol}>` with `<Sparkles className="h-5 w-5 aan-gradient-text" />`
- **Expanded state (line 130):** Replace `<img src={logoFull}>` with `<AanLogo showByAnarix={false} />` (shows Sparkles + "Aan" text only)

---

### Fix 2: App Level Selector Size Alignment

**File:** `AppLevelSelector.tsx`

- Wrap the entire `<div className="flex items-center gap-2">` children+dropdown in a container with `bg-muted/30 rounded-lg border border-border/50 px-1.5 py-1 gap-1.5`
- Ensure all child `<Select>` triggers passed via `children` inherit `h-9` height by wrapping children in a flex container
- The marketplace trigger already has `h-9` — ensure children selects match by documenting/enforcing `h-9` on all page-level `<SelectTrigger>` elements passed as children (e.g., Catalogue, Ad Type selects in Dashboard, CampaignManager, etc.)

**Files to update children sizing:** All pages that pass children to `AppLevelSelector`:
- `Dashboard.tsx` (profitability) — Catalogue select trigger → `h-9`
- `Trends.tsx` — Catalogue select → `h-9`
- `ProfitLoss.tsx` — Catalogue select → `h-9`
- `Geographical.tsx` — Catalogue select → `h-9`
- `CampaignManager.tsx` — Ad Type select → `h-9`
- `ImpactAnalysis.tsx` — Ad Type select → `h-9`
- `HourlyData.tsx` — Ad Type select → `h-9`
- `History.tsx` — Ad Type select → `h-9`
- `ScheduledJobs.tsx` — Ad Type select → `h-9`

Each child select also gets `bg-muted/50 rounded-lg border border-border` styling to match the marketplace button.

---

### Fix 3: Table Sorting + Pinning — Universal Implementation

**Approach:** Create a reusable `SortableTableHead` component that every table imports. This keeps the logic DRY and ensures consistency.

**New file: `src/components/tables/SortableTableHead.tsx`**

```tsx
interface SortableTableHeadProps {
  children: React.ReactNode;
  field: string;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
  align?: "left" | "right" | "center";
}
```

- Renders `<TableHead>` with click handler calling `onSort(field)`
- Sort icons: `ArrowUpDown` (unsorted, **opacity-0 group-hover:opacity-40** transition), `ArrowUp`/`ArrowDown` (active sort, full opacity, `text-primary`)
- The header cell gets `className="group cursor-pointer"` so arrows appear on hover
- Icons are `h-3 w-3` positioned inline after the label text

**Pin icon in header — Decision: NOT in headers.** Pinning is a column management action, not a per-row action. It belongs in the Columns dropdown (already implemented in `DataTableToolbar`). Adding pin icons to every header would create visual clutter in a data-dense analytical tool. The existing pin/unpin in the Columns dropdown is the correct UX. No change needed here.

**Tables to add sorting to (13 tables):**

Each table needs:
1. Import `SortableTableHead`
2. Add `sortField` and `sortDirection` state
3. Add `handleSort` function
4. Sort data before pagination
5. Replace plain `<TableHead>` with `<SortableTableHead>` for all metric columns

| Table File | Sortable Columns |
|---|---|
| `AdGroupsTable.tsx` | Ad Group, Campaign, Min Bid, Max Bid, Target ROAS, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend, Ad Sales, ROAS, ACOS |
| `KeywordTargetingTable.tsx` | Keyword, Ad Group, Campaign, Bid, Impressions, Clicks, CTR, CPC, Spend, Sales, ROAS, ACOS |
| `ProductTargetingTable.tsx` | Target, Ad Group, Campaign, Bid, Impressions, Clicks, CTR, CPC, Spend, Sales, ROAS, ACOS |
| `SearchTermsTable.tsx` | Search Term, Campaign, Impressions, Clicks, CTR, CPC, Spend, Sales, ROAS, ACOS |
| `ProductAdsTable.tsx` | Product Ad, Ad Group, Campaign, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend, Ad Sales, ROAS, ACOS |
| `PageTypeTable.tsx` | Page Type, Bid Modifier, Impressions, Clicks, CTR, CPC, Spend, Sales, ROAS, ACOS |
| `PlatformTable.tsx` | Platform, Bid Modifier, Impressions, Clicks, CTR, CPC, Spend, Sales, ROAS, ACOS |
| `ImpactTable.tsx` | Name, Impressions, Clicks, CTR, Spend, Sales, ROAS, ACOS |
| `RegionalTable.tsx` | Region, Units, GMV, Auth Sales, Ad Spend, Net Profit, Margin |
| `RegionalProductTable.tsx` | Product, Units, GMV, Auth Sales, Ad Spend, Net Profit, Margin |
| `ScheduledJobsTable.tsx` | Campaign, Action, Frequency, Next Run, Status |
| `HistoryTable.tsx` | Execution Time, Schedule, Campaign, Action, Status, Duration |
| `BrandCoverageTable.tsx` | Brand, Products, SOV values |
| `KeywordTrackerTable.tsx` | Keyword, Region, Added, Last Updated, Status |
| `ProductsPnLTable.tsx` | Product, all metric columns |

**Also update `CampaignTable.tsx`:** Change existing sort icons to use the new opacity-on-hover pattern (currently always visible at full opacity when unsorted).

---

### Files Summary

| File | Change |
|---|---|
| `SortableTableHead.tsx` | **NEW** — Reusable sortable header with hover-opacity arrows |
| `AanWorkspaceSidebar.tsx` | Use AanLogo/Sparkles instead of Anarix logos |
| `AppLevelSelector.tsx` | Wrap in unified container with background |
| `CampaignTable.tsx` | Refactor to use SortableTableHead, add hover opacity |
| `AdGroupsTable.tsx` | Add sorting with SortableTableHead |
| `KeywordTargetingTable.tsx` | Add sorting |
| `ProductTargetingTable.tsx` | Add sorting |
| `SearchTermsTable.tsx` | Add sorting |
| `ProductAdsTable.tsx` | Add sorting |
| `PageTypeTable.tsx` | Add sorting |
| `PlatformTable.tsx` | Add sorting |
| `ImpactTable.tsx` | Add sorting |
| `RegionalTable.tsx` | Add sorting |
| `RegionalProductTable.tsx` | Add sorting |
| `ScheduledJobsTable.tsx` | Add sorting |
| `HistoryTable.tsx` | Add sorting |
| `BrandCoverageTable.tsx` | Add sorting |
| `KeywordTrackerTable.tsx` | Add sorting |
| `ProductsPnLTable.tsx` | Add sorting |
| 9 page files | Fix child select sizing for AppLevelSelector |

**Delivery:** All changes in one pass. The `SortableTableHead` component makes this efficient — each table just swaps `<TableHead>` for `<SortableTableHead>` and adds ~10 lines of sort state/logic.

