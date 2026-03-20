## Comprehensive Fix & Feature Completion Plan

This plan addresses all the gaps identified: missing features, broken UX affordances, and incomplete implementations from the previous round.

---

### Phase 1: Show Impact Toggle on Campaign Manager

**File: `src/pages/advertising/CampaignManager.tsx**`

- Add `showImpact` and `viewChanges` state toggles
- Render a row above the PerformanceChart with "Show Impact" and "View Changes" toggle switches (matching reference image layout)
- Add "Hide Chart" link and fullscreen icon on the right side of that row
- When Show Impact is on, overlay impact data on the chart tooltip (show top 5 campaign contributors with % change)

---

### Phase 2: Day Parting Schedule — Full Settings Inline

**File: `src/pages/dayparting/HourlyData.tsx**`

- Replace the minimal collapsible schedule form with the full settings from the reference image:
  - **Campaigns**: Horizontal scrolling chip/tag bar for selecting campaigns (matching reference: `SP | Catch all | Auto`, etc.)
  - **Rule Name** input field
  - **Date Range**: Start Date / End Date with "No End Date" checkbox
  - **Recurrence**: Radio group (Daily / Weekly) with day-of-week checkboxes
  - **Bid Adjustment**: Select (Increase by % / Decrease by %) + numeric input
  - **Hour of Day**: Radio (All Day / Time Range) with start/end time pickers and "+ Add Time Range"
  - **Cancel** and **Apply Day Parting Rule** buttons at bottom right
- The "Hourly Trends" / "Day Parting Campaigns" tabs at the top (matching reference) to toggle between heatmap view and campaign list view
- Move "Create Day Parting Rule" button to the top right of the page header

---

### Phase 3: Create Campaign Modal

**File: `src/components/advertising/CreateCampaignModal.tsx**` (new)

- Modal dialog with fields: Campaign Name, Campaign Type (SP/SB/SD/SV), Bidding Strategy, Daily Budget, Start Date, End Date, Status
- Validation: name required, budget > 0

**File: `src/pages/advertising/CampaignManager.tsx**`

- Add "Create Campaign" button in PageHeader actions
- Wire modal open/close and add new campaign to state

---

### Phase 4: Add Keyword Modal Fix

**File: `src/pages/bi/KeywordTracker.tsx**`

- The AddKeywordModal exists and is wired. Verify it opens. The `isAddModalOpen` state and `setIsAddModalOpen(true)` on the button click look correct. Check if the modal component renders properly — it does exist at `src/components/bi/AddKeywordModal.tsx`. This appears functional already; may just need testing.

---

### Phase 5: Filter Space Optimization

**File: `src/components/advertising/DataTableToolbar.tsx**`

- Make filter builder even more compact:
  - Reduce the panel padding from `p-3` to `p-2`
  - Make all filter selects narrower: field `w-[120px]`, operator `w-[90px]`, value `w-[100px]`
  - Use `gap-1` instead of `gap-1.5` between elements
  - Remove the border wrapper; use a subtle `bg-muted/30` background instead
  - Active filter badges: reduce to `h-5` with `text-[10px]`

---

### Phase 6: Clickable/Selectable Affordances Across the App

Multiple files need hover/cursor/tooltip improvements:

`**src/components/advertising/UnderlineTabs.tsx**`

- Add `cursor-pointer` explicitly to tab buttons
- Add subtle hover background `hover:bg-muted/50 rounded-t-md px-3` for better click target visibility

`**src/components/advertising/InlineKPIStrip.tsx**`

- When `availableMetrics` is provided, add `cursor-pointer` and `hover:bg-muted/50` to the KPI card container
- Add tooltip: "Click to change metric"

`**src/components/tables/CampaignTable.tsx**`

- Add `cursor-pointer hover:bg-muted/50` to clickable table rows
- Add tooltip on row hover: "Click to view details"

`**src/components/charts/ChartContainer.tsx**`

- Add tooltips to the expand button, metrics button, and chart type selector
- Ensure all buttons have `cursor-pointer`

`**src/components/dayparting/HourlyHeatmap.tsx**`

- When `onCellClick` is provided, add tooltip "Click to select" on each cell

`**src/components/layout/AppTaskbar.tsx**`

- Add tooltips to Ad Type, Frequency, Date Range controls: "Change ad type", "Change frequency", "Select date range"

`**src/components/layout/AppSidebar.tsx**`

- Ensure all nav items show `cursor-pointer` (already done via NavLink, but verify collapsed state buttons)

---

### Phase 7: Heatmap — Add "Hourly Total" Row and "Daily Total" Column

**File: `src/components/dayparting/HourlyHeatmap.tsx**`

- Add a summary "Hourly Total" row at the bottom (matching reference image)
- Add a "Daily Total" column at the right end
- Style totals row/column with slightly different background

---

### Phase 8: Day Parting Tabs — Hourly Trends vs Day Parting Campaigns

**File: `src/pages/dayparting/HourlyData.tsx**`

- Add UnderlineTabs at the top: "Hourly Trends" | "Day Parting Campaigns"
- "Hourly Trends" shows heatmap + chart toggle
- "Day Parting Campaigns" shows the campaigns table with schedule status
- This matches the reference image showing two top-level tabs

&nbsp;

### Phase 9 : redesign profitablity PnL table,  also where there are many expadable arows like in pnl table and anywhere else give universal expand and colaps arrow in the head of the table3

---

### Summary of Files Modified/Created


| File                                                 | Change                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| `src/pages/advertising/CampaignManager.tsx`          | Show Impact/View Changes toggles, Create Campaign button          |
| `src/components/advertising/CreateCampaignModal.tsx` | **New** — Create Campaign dialog                                  |
| `src/pages/dayparting/HourlyData.tsx`                | Full inline schedule settings, tabs for Hourly Trends / Campaigns |
| `src/components/dayparting/HourlyHeatmap.tsx`        | Hourly Total row, Daily Total column                              |
| `src/components/advertising/DataTableToolbar.tsx`    | Tighter filter layout                                             |
| `src/components/advertising/UnderlineTabs.tsx`       | Hover affordance, cursor                                          |
| `src/components/advertising/InlineKPIStrip.tsx`      | Cursor + tooltip for swappable metrics                            |
| `src/components/tables/CampaignTable.tsx`            | Row hover + cursor for clickable rows                             |
| `src/components/charts/ChartContainer.tsx`           | Tooltips on all action buttons                                    |
| `src/components/layout/AppTaskbar.tsx`               | Tooltips on filter controls                                       |
