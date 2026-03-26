

## Critical Fix: All Outstanding Requirements — Final Comprehensive Implementation

### Audit Summary: What's Actually Missing

After thorough codebase analysis, here is the truth of what exists vs what's broken:

**Actually implemented:**
- Pagination (`TablePagination`) IS in all table components (AdGroups, Keywords, SearchTerms, ProductAds, ProductTargeting, PageType, Platform, Regional, ScheduledJobs, History, BrandCoverage, KeywordTracker, Impact, ProductsPnL)
- Delta toggle state IS wired in CampaignManager, CampaignDetail, AdGroupDetail, TargetingActions, KeywordTracker, HourlyData, ProfitLoss, Dashboard
- CreateSchedulePanel IS rendered as flex sibling in HourlyData and ScheduledJobs
- InlineKPIStrip already supports 5 items with Prev subtitle

**Actually broken / never done:**
1. **3-level campaign hierarchy**: CampaignDetail only has 2 levels (Campaign > AdGroup). Missing Campaign > AdGroup > ProductAd (3rd level with its own detail page)
2. **Floating island NOT draggable**: Still has X close button, no GripVertical drag handle
3. **Toolbar button order wrong**: Current order is `leftContent | Search | ... | Deltas | Columns | Filter | Download | Edit`. Required: `Create | Upload | Search | Delta | Filter | Columns | Export | Edit`
4. **Create buttons NOT in toolbar**: CampaignManager has Create Campaign as a standalone button ABOVE the toolbar (line 218-223), not inside it
5. **Upload button missing**: No upload dialog with drag-and-drop anywhere in toolbar
6. **Edit mode has NO save confirmation**: Pencil toggle just switches mode silently
7. **Delta toggle not passed to child tables**: Pages pass `showDeltas` to `DataTableToolbar` but NOT to the table components (e.g., CampaignDetail renders `<AdGroupsTable searchQuery={searchQuery} />` without `showDeltas`)
8. **BrandSOV, KeywordSOV, ProductSOV, CompetitorPricing** pages have NO DataTableToolbar at all — no delta toggle
9. **Right panels NOT independently scrolling**: CreateSchedulePanel uses `ScrollArea` but the outer `div` with `flex h-full` may not constrain height properly when parent scrolls
10. **Orders view in profitability**: ProductsPnLTable has orders mode but styling may not match expectations
11. **Show Impact toggle NOT in chart toolbar**: It's rendered separately, needs to be inside ChartContainer's toolbar on the left of metric selector

---

### Phase 1: Toolbar Contract + Create in Toolbar + Upload Dialog + Edit Confirmation

**Files: `DataTableToolbar.tsx`, `CampaignManager.tsx`, all pages with toolbars**

1. **Reorder toolbar buttons**: `[leftContent(Create/Upload)] | [Search] | [Delta] | [Filter] | [Columns] | [Export] | [Edit]`
2. **Add `onUpload` prop** to DataTableToolbar — renders Upload icon button that opens new `UploadDialog`
3. **Create `UploadDialog.tsx`** — modal with drag-and-drop zone, file list, upload/cancel buttons
4. **Edit save confirmation**: When edit mode toggles OFF, show AlertDialog "Save changes?" with list + Save/Discard buttons
5. **Move Create Campaign button** into toolbar's `leftContent` in CampaignManager
6. **Wire `showDeltas` from pages to child table components** on ALL pages (CampaignManager, CampaignDetail, AdGroupDetail, etc.)
7. **Add DataTableToolbar** to BrandSOV, KeywordSOV, ProductSOV, CompetitorPricing pages with delta toggle

### Phase 2: 3-Level Campaign Hierarchy

**Files: `App.tsx`, `AdGroupDetail.tsx`, new `ProductAdDetail.tsx`**

1. **CampaignDetail** (Level 1): Click campaign row → shows Campaign info, tabs: Ad Groups, Product Ads, Keywords, Search Terms
2. **AdGroupDetail** (Level 2): Click ad group row → shows AdGroup info, tabs: Product Ads, Keywords, Search Terms. Breadcrumb: Advertising > Campaign > AdGroup
3. **ProductAdDetail** (Level 3 — NEW): Click product ad row → shows Product Ad info. Breadcrumb: Advertising > Campaign > AdGroup > Product Ad. Add Product Ad button available here
4. Add route `/advertising/campaigns/:campaignId/ad-groups/:adGroupId/product-ads/:productAdId`
5. Each level has its own InlineKPIStrip with level-appropriate data and its own edit dialog

### Phase 3: Floating Island Draggable + Show Impact in Chart + Right Panel Independent Scroll

**Files: `FloatingActionIsland.tsx`, `PerformanceChart.tsx`/`ChartContainer.tsx`, panel components**

1. **Floating Island**: Replace X with `GripVertical`. Add `onMouseDown` drag handler, track position with `useState({ x, y })`, apply via `style={{ left, top }}` instead of centering. Remove close/reopen logic entirely
2. **Show Impact toggle**: Move into `ChartContainer` toolbar, left of metric selector. Remove from standalone position in pages
3. **Right panel scroll fix**: Ensure all right panels have parent container with `h-full` and panel itself uses `position: sticky` or the flex parent constrains height via `min-h-0 overflow-hidden`

### Phase 4: Full Screen-by-Screen Audit + Verification Report

After implementation, audit every screen:

| Screen | Create in Toolbar | Delta Toggle | Pagination | Upload | Edit Confirm | Panel Scroll |
|---|---|---|---|---|---|---|
| Campaign Manager | Create Campaign | yes | yes | yes | yes | yes |
| Campaign Detail | — | yes→table | yes | — | yes | — |
| Ad Group Detail | — | yes→table | yes | — | yes | — |
| Product Ad Detail | Add Product Ad | yes→table | yes | — | — | — |
| Targeting Actions | Add Keyword | yes | yes | — | — | — |
| Day Parting Hourly | Create Rule | yes | yes | — | — | yes |
| Scheduled Jobs | Create Schedule | yes | yes | — | — | yes |
| Budget Pacing | — | yes | yes | — | — | — |
| Profitability Dash | — | yes | yes | Upload COGS | — | yes |
| Profit & Loss | — | yes | yes | — | — | yes |
| Brand SOV | — | yes | yes | — | — | — |
| Keyword Tracker | Add Keyword | yes | yes | — | — | — |
| Keyword/Product SOV | — | yes | yes | — | — | — |
| Competitor Pricing | — | yes | yes | — | — | — |

Post-implementation: detailed changes report listing every file modified and what was verified.

---

### Files Summary

| File | Phase | Change |
|---|---|---|
| `DataTableToolbar.tsx` | 1 | Reorder buttons, add onUpload prop, edit save confirmation dialog |
| `UploadDialog.tsx` | 1 | **NEW** — drag-and-drop upload modal |
| `CampaignManager.tsx` | 1 | Move Create into toolbar leftContent, pass showDeltas to tables |
| `CampaignDetail.tsx` | 1,2 | Pass showDeltas to tables, wire AdGroup click to level 2 |
| `AdGroupDetail.tsx` | 1,2 | Pass showDeltas to tables, wire ProductAd click to level 3 |
| `ProductAdDetail.tsx` | 2 | **NEW** — Level 3 detail page |
| `App.tsx` | 2 | Add route for product ad detail |
| `BrandSOV.tsx` | 1 | Add DataTableToolbar with delta toggle |
| `KeywordSOV.tsx` | 1 | Add DataTableToolbar with delta toggle |
| `ProductSOV.tsx` | 1 | Add DataTableToolbar with delta toggle |
| `CompetitorPricing.tsx` | 1 | Add DataTableToolbar with delta toggle |
| `FloatingActionIsland.tsx` | 3 | Draggable with GripVertical, remove close logic |
| `ChartContainer.tsx` | 3 | Add showImpact toggle prop to chart toolbar |
| `PerformanceChart.tsx` | 3 | Pass showImpact to ChartContainer instead of standalone |
| `CreateSchedulePanel.tsx` | 3 | Fix independent scroll container |
| `CreateCampaignPanel.tsx` | 3 | Fix independent scroll container |
| `ProductDetailPanel.tsx` | 3 | Fix independent scroll container |
| `PeriodBreakdownPanel.tsx` | 3 | Fix independent scroll container |
| All table components | 1 | Accept and use showDeltas prop from parent |

