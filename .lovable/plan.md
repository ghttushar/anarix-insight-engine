

## Phase 1: Foundation — Fix Broken Interactions & Layout Consistency

This phase fixes the things that are fundamentally broken right now.

### 1A. Column Dropdown Not Working
**File: `src/components/advertising/DataTableToolbar.tsx`**

The `Tooltip` wrapping `DropdownMenuTrigger` creates a conflict between two Radix portal-based components. The Tooltip intercepts the click and the dropdown never opens.

**Fix**: Remove the `Tooltip`/`TooltipTrigger`/`TooltipContent` wrapper from the Columns button. Use `title` attribute instead for a lightweight tooltip, or restructure so the Tooltip doesn't wrap the DropdownMenuTrigger directly.

### 1B. Table Sticky Columns (Name + Status)
**Files**: `src/components/tables/CampaignTable.tsx`, all other table components that have a "Name" or "Status" column.

Add `sticky left-0 z-10 bg-background` to the first 1–2 columns (Status, Name) in both `<TableHead>` and `<TableCell>` so they stay fixed during horizontal scroll. The second sticky column needs `left-[<width>]` offset.

### 1C. Nothing Above Universal Metric Selector
**File: `src/pages/dayparting/HourlyData.tsx`**

The schedule creation panel renders ABOVE the `<PageHeader>` (which contains AppTaskbar). Move the campaign/metric selectors (lines 239-261) to render AFTER the `<UnderlineTabs>`, not before it. The schedule creation panel (lines 108-231) is fine since it's toggled by a button — but move it below the tabs too.

### 1D. Consistent Table Backgrounds
Apply `bg-background` (not `bg-card`) to all table containers for consistency. Audit all table wrappers to use `rounded-lg border border-border` without extra card wrappers.

---

## Phase 2: UX Affordances — Clickability, Tooltips, Cursor States

This phase makes every interactive element clearly communicate that it's interactive.

### 2A. Global Cursor & Hover States
**Files to update** (all interactive elements):
- `src/components/advertising/UnderlineTabs.tsx` — already has `cursor-pointer` ✓
- `src/components/advertising/InlineKPIStrip.tsx` — already has `cursor-pointer` and tooltip ✓
- `src/components/tables/CampaignTable.tsx` — already has `cursor-pointer hover:bg-muted/50` and tooltip on rows ✓
- `src/components/charts/ChartContainer.tsx` — already has tooltips ✓
- `src/components/layout/AppTaskbar.tsx` — already has tooltips ✓

**Still missing:**
- `src/components/tables/AdGroupsTable.tsx` — needs `cursor-pointer hover:bg-muted/50` on rows
- `src/components/tables/ProductAdsTable.tsx` — same
- `src/components/tables/KeywordTargetingTable.tsx` — same
- `src/components/tables/SearchTermsTable.tsx` — same
- `src/components/tables/ProductTargetingTable.tsx` — same
- `src/components/tables/ImpactTable.tsx` — same
- `src/components/tables/RegionalTable.tsx` — same
- All `<Button>` and `<button>` elements across the app — add `cursor-pointer` where missing
- All `<Select>` triggers — add `cursor-pointer`

### 2B. Tooltip on All Icon-Only Buttons
Scan every `Button` that has no text label (icon-only) and ensure it has a wrapping `Tooltip`. Key files:
- `src/pages/advertising/ImpactAnalysis.tsx` — Maximize2 and Download buttons (lines 97-98)
- Any remaining icon buttons without tooltips

---

## Phase 3: Feature Completion & Polish

### 3A. Fix Tooltip-Dropdown Conflicts Throughout
The pattern of `<Tooltip><TooltipTrigger asChild><DropdownMenuTrigger>` is broken in Radix. Fix ALL instances:
- DataTableToolbar Columns button
- Any other places this pattern exists (check ChartContainer Metrics button — same pattern at line 70-78)

**Fix pattern**: Use a wrapper `<div>` between Tooltip and Dropdown triggers, or remove Tooltip and use `title` attr.

### 3B. Verified Working Features
After audit, these features ARE implemented and working:
- **Create Campaign Modal** ✓ (exists in `CreateCampaignModal.tsx`, wired in `CampaignManager.tsx`)
- **Add Keyword Modal** ✓ (exists in `AddKeywordModal.tsx`, wired in `KeywordTracker.tsx`)
- **Show Impact / View Changes / Hide Chart toggles** ✓ (in `CampaignManager.tsx` lines 137-139, 251-270)
- **Day Parting full schedule settings** ✓ (in `HourlyData.tsx` lines 108-231)
- **Heatmap numbers in cells** ✓ (in `HourlyHeatmap.tsx` lines 169-175)
- **Heatmap totals row/column** ✓ (in `HourlyHeatmap.tsx` lines 200-213)
- **Impact Analysis chart** ✓ (in `ImpactAnalysis.tsx` lines 101-120)
- **PnL expand/collapse all** ✓ (in `PnLParameterTable.tsx` lines 54-55)
- **Date range presets + Apply button** ✓ (in `AppTaskbar.tsx` lines 37-71, 104-116)
- **Sidebar redesign with Rules group** ✓ (in `AppSidebar.tsx` lines 73-78)
- **Pencil edit icon** ✓ (in `DataTableToolbar.tsx` lines 222-240)

### 3C. Add Verification Mandate to Project Knowledge
Add a project knowledge entry requiring post-implementation verification scans and change reports in chat after every prompt.

---

## Summary of Changes Per Phase

### Phase 1 (Foundation)
| File | Change |
|------|--------|
| `DataTableToolbar.tsx` | Fix Tooltip-Dropdown conflict on Columns button |
| `CampaignTable.tsx` | Add sticky Status + Name columns |
| `HourlyData.tsx` | Move campaign/metric selectors below tabs |
| All table wrapper pages | Standardize `bg-background` on table containers |

### Phase 2 (Affordances)
| File | Change |
|------|--------|
| `AdGroupsTable.tsx` | cursor-pointer + hover on rows |
| `ProductAdsTable.tsx` | cursor-pointer + hover on rows |
| `KeywordTargetingTable.tsx` | cursor-pointer + hover on rows |
| `SearchTermsTable.tsx` | cursor-pointer + hover on rows |
| `ProductTargetingTable.tsx` | cursor-pointer + hover on rows |
| `ImpactTable.tsx` | cursor-pointer + hover on rows |
| `RegionalTable.tsx` | cursor-pointer + hover on rows |
| `ImpactAnalysis.tsx` | Tooltips on icon buttons |

### Phase 3 (Polish)
| File | Change |
|------|--------|
| `ChartContainer.tsx` | Fix Tooltip-Dropdown conflict on Metrics button |
| `DataTableToolbar.tsx` | Final Tooltip-Dropdown fix verification |
| Project Knowledge | Add verification mandate |

