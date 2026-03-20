## Phase 3: Restructure Universal Bar, Fix Sticky Columns, Wire Show Impact, Remove Duplication

Based on your screenshots, the current `AppTaskbar` is wrong. Each screen needs a different control layout in the header area. This plan restructures the header system to match your reference images exactly.

---

### Part A: Restructure PageHeader + AppTaskbar System

**Current problem**: `AppTaskbar` renders the same controls (Ad Type, Frequency, Date Range, Marketplace/Store) on every page. Screenshots show different controls per screen.

**New architecture**:

1. `**PageHeader**` gets a new `topRight` prop for the marketplace/account cluster + J icon + avatar
2. `**AppTaskbar**` is removed from `PageHeader`. Instead, each page renders its own control bar below the title.
3. A new reusable `PageControls` component provides the marketplace cluster + J icon that sits in `topRight`.

**Screenshot-derived control map**:


| Screen (there is no left right top or below the buttons will appere when required, market place is on every page so it'll have a fixed olace on the far right side of the bar, and if there is create campaigne, rule, schedule it'll all come after the universal bar | &nbsp;                               | &nbsp;                       | &nbsp;                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------- | -------------------------------- |
| Campaign Manager (image-110)                                                                                                                                                                                                                                           | Marketplace + Ad Type                | --                           | Frequency + Date Range           |
| Impact Analysis (image-111)                                                                                                                                                                                                                                            | Marketplace + Ad Type                | Time Period vs Impact Period | Metrics                          |
| Targeting Actions (image-112)                                                                                                                                                                                                                                          | Marketplace                          | (none)                       | (none)                           |
| Day Parting (image-113)                                                                                                                                                                                                                                                | Marketplace                          | (none)                       | (none)                           |
| History (image-114)                                                                                                                                                                                                                                                    | Marketplace                          | (none)                       | (none)                           |
| Profit Dashboard (image-107)                                                                                                                                                                                                                                           | marketplace                          | --                           | Date Range + Frequency + Metrics |
| Trends (image-108)                                                                                                                                                                                                                                                     | marketplace                          | &nbsp;                       | Date Range + Metrics             |
| Profit & Loss (image-109)                                                                                                                                                                                                                                              | marketplace                          | &nbsp;                       | Date Range                       |
| Day Parting hourly (image-105)                                                                                                                                                                                                                                         | (use current pattern but simplified) | --                           | &nbsp;                           |


**Files modified**:

- `src/components/layout/PageHeader.tsx` -- add `topRight` prop, remove `<AppTaskbar />` call, render topRight on the title row
- `src/components/layout/PageControls.tsx` -- **NEW** reusable marketplace/J/avatar cluster
- `src/components/layout/AppTaskbar.tsx` -- keep as standalone component but remove from PageHeader; pages that need it import it directly
- All 39 page files that use `<PageHeader>` -- add `topRight={<PageControls />}` and render page-specific controls below

**Implementation approach**: Since modifying all 39 pages is too large for one pass, we'll:

1. Create `PageControls` component
2. Update `PageHeader` to support `topRight` and add `hideTaskbar` as default true
3. Update the 10 key screens (Campaign Manager, Impact Analysis, Targeting Actions, Day Parting, History, Profit Dashboard, Trends, P&L, Geographical, Catalog) with correct per-screen controls
4. Other pages get `hideTaskbar={false}` temporarily to keep working

---

### Part B: Fix Sticky Column Transparency

**Problem**: Sticky columns use `bg-background` but this is not opaque when scrolling horizontally -- data shows through.

**Fix**: Change all sticky `<TableCell>` and `<TableHead>` backgrounds from `bg-background` and `bg-muted/50` to fully opaque values. Use CSS variable directly:

```
// Header sticky cells
className="sticky left-0 z-10 bg-[hsl(var(--muted)/0.5)]" 
// becomes
className="sticky left-0 z-10 bg-muted"

// Body sticky cells  
className="sticky left-0 z-10 bg-background"
// stays but we need to ensure bg-background is not transparent
```

The real issue: `bg-muted/30` and `bg-muted/50` are semi-transparent. Change to `bg-muted` (fully opaque) for header rows, and `bg-background` for body rows (which should already be opaque). The hover state `group-hover:bg-muted` handles the hover case.

**Files**: `CampaignTable.tsx`, `AdGroupsTable.tsx`, `ProductAdsTable.tsx`, `KeywordTargetingTable.tsx`, `SearchTermsTable.tsx`, `ProductTargetingTable.tsx`, `ImpactTable.tsx`, `RegionalTable.tsx`

---

### Part C: Wire Show Impact Toggle to Chart

**Problem**: Show Impact toggle exists but doesn't change the chart.

**Fix in `CampaignManager.tsx**`:

- Pass `showImpact` to `PerformanceChart` as a new prop
- When `showImpact` is true, overlay impact tooltip data on the chart (showing top 5 campaign contributors with % change, matching image-106)
- Add impact data lines to the chart from mock data
- Remove `viewChanges` toggle (user asked to remove it)

**Fix in `PerformanceChart.tsx**`:

- Accept optional `showImpact` prop
- When true, add a custom tooltip that shows top 5 campaign contributors with their % impact (matching the reference screenshot)
- Add additional data series for impact overlay

---

### Part D: Remove Duplicate Buttons in Table Toolbar

**Problem**: Pages like `ProfitabilityDashboard` pass `onDownload` to `DataTableToolbar` AND also put Export/Download buttons in `rightContent`, creating duplicates.

**Fix**: Audit each page's `DataTableToolbar` usage:

- `ProfitabilityDashboard.tsx` -- remove `onDownload` prop since Export is already in `rightContent`
- `TargetingActions.tsx` -- the toolbar and bid controls are on separate rows with different widths; unify into single toolbar row
- `ImpactAnalysis.tsx` -- remove `onFilter` prop (no filter fields provided, button does nothing)

---

### Part E: Column Visibility Actually Hides Columns

**Problem**: Column toggle dropdown works now (Radix fix done), but toggling columns doesn't actually hide them in the table because the table components don't receive `hiddenColumns`.

**Fix in `CampaignManager.tsx**`: Pass `hiddenColumns` set to `CampaignTable` and each sub-table. Each table component needs to conditionally render columns based on visibility.

**Fix in `CampaignTable.tsx**`: Accept `hiddenColumns?: Set<string>` prop and skip rendering `<TableHead>` and `<TableCell>` for hidden column IDs.

Same pattern for all sub-tables.

---

### Summary of Files


| File                            | Change                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `PageHeader.tsx`                | Add `topRight` prop, stop auto-rendering AppTaskbar                                                                   |
| `PageControls.tsx`              | **NEW** -- Marketplace + J icon + Avatar cluster                                                                      |
| `CampaignManager.tsx`           | Add PageControls, per-screen controls bar, pass showImpact to chart, pass hiddenColumns to tables, remove viewChanges |
| `ImpactAnalysis.tsx`            | Add PageControls, per-screen period selectors, remove onFilter                                                        |
| `TargetingActions.tsx`          | Add PageControls, clean toolbar                                                                                       |
| `HourlyData.tsx`                | Add PageControls, move controls below title                                                                           |
| `History.tsx`                   | Add PageControls                                                                                                      |
| `Dashboard.tsx` (profitability) | Add PageControls with "Catalog" label variant                                                                         |
| `Trends.tsx`                    | Add PageControls, move search to table toolbar                                                                        |
| `ProfitLoss.tsx`                | Add PageControls, move search to table toolbar, remove duplicate download                                             |
| `PerformanceChart.tsx`          | Accept showImpact prop, render impact tooltip overlay                                                                 |
| `CampaignTable.tsx`             | Accept hiddenColumns, fix sticky bg opacity                                                                           |
| `AdGroupsTable.tsx`             | Fix sticky bg opacity                                                                                                 |
| `ProductAdsTable.tsx`           | Fix sticky bg opacity                                                                                                 |
| `KeywordTargetingTable.tsx`     | Fix sticky bg opacity                                                                                                 |
| `SearchTermsTable.tsx`          | Fix sticky bg opacity                                                                                                 |
| `ProductTargetingTable.tsx`     | Fix sticky bg opacity                                                                                                 |
| `ImpactTable.tsx`               | Fix sticky bg opacity                                                                                                 |


This is the largest single phase. I recommend splitting implementation into two passes if needed:

- **Pass 1**: Parts B + C + D (sticky fix, impact toggle, dedup) -- 12 files
- **Pass 2**: Parts A + E (header restructure, column visibility) -- 15 files