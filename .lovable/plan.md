

## Comprehensive UI/UX Overhaul Plan

This is a large set of changes spanning ~15 files. I'll group them into logical phases.

---

### 1. Day Parting: Merge Hourly Data + Campaigns into One Page

**Problem**: Hourly Data and Campaigns are separate pages, and scheduling opens a different screen.

**Changes**:
- **`src/pages/dayparting/HourlyData.tsx`** — Rewrite as the unified Day Parting page. Combine campaign table (from Campaigns.tsx) below the heatmap. Add inline schedule creation panel (collapsible) instead of navigating away. Remove the "Schedule Day Parting" button that navigates to `/dayparting/scheduled/new`. The campaign/metric selectors must appear BELOW the AppTaskbar (inside PageHeader), not above it.
- **`src/pages/dayparting/Campaigns.tsx`** — Redirect to `/dayparting/hourly` or remove. Keep the route for backward compat.
- **`src/components/layout/AppSidebar.tsx`** — Update Day Parting nav: merge "Hourly Data" and "Campaigns" into one "Day Parting" item. Keep History and Scheduled Jobs as separate items.

### 2. Heatmap: Show Numbers in Cells

**`src/components/dayparting/HourlyHeatmap.tsx`** — Inside each cell button, render the formatted metric value as a small text element. Reduce font to ~7-8px so it fits within the `h-8` cell. Use contrasting text color (white on dark intensity cells, foreground on light intensity cells).

### 3. Nothing Above Universal Selector Bar (AppTaskbar)

**Problem**: Day Parting has campaign/metric selectors above the taskbar.

**Fix**: In the merged Day Parting page, move campaign/metric selectors into a toolbar row BELOW the PageHeader (which already contains AppTaskbar). This is a page-level fix — ensure no other pages put content above the taskbar.

### 4. Date Range Selector: Add Preset Options + Apply Button

**`src/components/layout/AppTaskbar.tsx`**:
- Replace the bare Calendar popover with a two-panel layout: left side has preset options (matching the reference image: "Today/Yesterday/7 days/14 days", "This week/Last week/2 weeks ago/3 weeks ago", "This month/Last month/2 months/3 months", "Today/Yesterday/2 days/3 days", "Today/Yesterday/7 days/8 days", "This quarter/Last quarter/2 quarters ago/3 quarters ago", "Custom Range") and right side shows the dual calendar.
- Add "Apply" and "Cancel" buttons at the bottom of the popover. Only commit the date range when Apply is clicked.

### 5. Rules: Separate Sidebar Items

**Problem**: Rule Agents and Applied Rules are currently under Advertising group. User wants them as separate top-level sidebar items.

**`src/components/layout/AppSidebar.tsx`**:
- Move "Rule Agents" and "Applied Rules" out of Advertising group into their own "Rules" group in the sidebar, with separate nav items.

### 6. Filter Panel Redesign: Less Space Wasted

**`src/components/advertising/DataTableToolbar.tsx`**:
- Make the filter builder more compact: reduce padding, use inline-flex layout instead of stacked rows. Each filter rule on one line with tighter spacing. Use smaller select widths. Remove the large card wrapper — use a subtle bordered row instead.

### 7. Remove Count Notches from Tabs

**`src/components/advertising/UnderlineTabs.tsx`**:
- Remove the `tab.count` badge rendering entirely. Just show label text.

### 8. Chart Card Double Border Issue

**Problem**: Charts are wrapped in `border border-border bg-card` AND the ChartContainer also has `border border-border bg-card`, creating double borders.

**`src/pages/advertising/CampaignManager.tsx`** — Remove the outer wrapper div's border/bg-card around the PerformanceChart (lines 202-211). Let ChartContainer handle its own border.

**`src/components/charts/ChartContainer.tsx`** — Verify single border. No change needed here since it already has its own border.

### 9. Table Background Consistency

Ensure all tables use consistent styling. Currently some tables have `bg-card` wrappers and some don't.

**Convention**: Tables should use `rounded-lg border border-border` without `bg-card` wrapper (per existing architecture memory). Review and fix pages where tables are inconsistent.

### 10. View/Edit Toggle: Subtle Pencil Icon on Far Right

**`src/components/advertising/DataTableToolbar.tsx`**:
- Replace the View/Edit toggle buttons with a single subtle pencil icon button positioned on the far right of the toolbar (after download button). When in edit mode, the pencil is highlighted. Remove the loud toggle UI.

### 11. Impact Analysis: Fix Missing Graph

**`src/pages/advertising/ImpactAnalysis.tsx`**:
- Replace the placeholder "Impact comparison chart" div (line 88-89) with an actual PerformanceChart or a bar chart comparing baseline vs impact period metrics using mock data.

### 12. Redesign Sidebar: Larger, More Visible

**`src/components/layout/AppSidebar.tsx`**:
- Increase expanded width from `w-60` to `w-64`
- Increase font sizes: group labels from `text-[11px]` to `text-xs`, nav items from `text-[13px]` to `text-sm`
- Increase icon sizes from `h-3.5 w-3.5` to `h-4 w-4` for nav items
- Increase padding on nav items for better clickability
- Make Aan button more distinct: add more vertical spacing/margin, make it visually separate from the logo with a clear gap

### 13. Aan Button: Separate from Logo

**`src/components/layout/AppSidebar.tsx`**:
- Increase gap between logo and Aan button (increase `mb-3` to `mb-4` on logo, increase `py-3` to `py-4` on Aan container)
- Add a subtle label "AI Assistant" below the Aan button when expanded

### 14. Light Mode Text Visibility Fixes

**`src/index.css`** — Audit and fix any CSS variables that produce low-contrast text in light mode. Check `--muted-foreground` value to ensure it's dark enough.

Review specific components where text might be invisible (sidebar muted text, chart labels, etc.).

### 15. Campaign Manager: Deep Navigation (Breadcrumb Drill-down)

**Problem**: Reference images show breadcrumbs like "Advertising > SP > Catch All > Manual > PCT" — clicking a table row should drill into campaign detail, then ad group detail.

This is a larger feature. For now:
- **`src/pages/advertising/CampaignManager.tsx`** — Add `onClick` row handler to navigate to a campaign detail route when clicking a campaign row.
- **`src/App.tsx`** — Add route `/advertising/campaigns/:campaignId` for campaign detail view.
- **Create `src/pages/advertising/CampaignDetail.tsx`** — New page showing campaign-level data with breadcrumb, KPIs, chart, and tabs for Ad Groups/Product Ads/Targeting/Search Terms. Clicking an ad group row navigates to `/advertising/campaigns/:campaignId/:adGroupId`.
- **Create `src/pages/advertising/AdGroupDetail.tsx`** — Ad group detail with breadcrumb, KPIs, chart, and tabs for Product Ads/Targeting/Search Terms.

### Summary of Files Modified/Created

| File | Change |
|------|--------|
| `src/pages/dayparting/HourlyData.tsx` | Merge with Campaigns, inline scheduling |
| `src/components/dayparting/HourlyHeatmap.tsx` | Show numbers in cells |
| `src/components/layout/AppSidebar.tsx` | Sidebar redesign, Rules separation, Day Parting merge, Aan spacing |
| `src/components/layout/AppTaskbar.tsx` | Date range presets + Apply button |
| `src/components/advertising/UnderlineTabs.tsx` | Remove count notches |
| `src/components/advertising/DataTableToolbar.tsx` | Filter compact redesign, View/Edit pencil icon |
| `src/pages/advertising/CampaignManager.tsx` | Fix double chart border, row click navigation |
| `src/pages/advertising/ImpactAnalysis.tsx` | Add actual chart |
| `src/components/charts/ChartContainer.tsx` | No change (already correct) |
| `src/App.tsx` | Add campaign/ad-group detail routes |
| `src/pages/advertising/CampaignDetail.tsx` | **New** — Campaign drill-down page |
| `src/pages/advertising/AdGroupDetail.tsx` | **New** — Ad group drill-down page |
| `src/index.css` | Light mode contrast fixes |

