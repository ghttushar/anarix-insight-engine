

## Merge Day Parting Into a Single Screen With Tabs

### Problem
Day Parting currently has 3 separate pages (Hourly Data, History, Scheduled Jobs) plus a drill-down campaign detail view. User wants everything on one screen with no drill-down navigation — just tabs.

### Design

Single page at `/dayparting` with tabs:

```text
┌──────────────────────────────────────────────────┐
│ Page Header: Day Parting                         │
│ AppTaskbar (campaign selector, metric selector)  │
├──────────────────────────────────────────────────┤
│ [Campaigns & Schedules] [History] [Analytics]    │
├──────────────────────────────────────────────────┤
│ Tab content (scrollable)                         │
└──────────────────────────────────────────────────┘
```

**Tab 1 — Campaigns & Schedules (default):** Merges current HourlyData page content (hero metrics, heatmap, campaigns table) with ScheduledJobs content (schedules table with pause/resume/delete). Two sections stacked: first the hourly trends + heatmap, then below it a campaigns table and a schedules table side by side or stacked.

**Tab 2 — History:** The execution history table (currently its own page).

**Tab 3 — Analytics:** The heatmap in larger view with day/hour breakdown — a dedicated analysis view for deeper hourly patterns.

### Changes

**File: `src/pages/dayparting/HourlyData.tsx`**
- Rename to the single Day Parting screen
- Add `Tabs` component with 3 tabs
- Tab 1: Keep existing hero metrics + heatmap + campaigns table. Add schedules table below (import `ScheduledJobsTable`, schedules data, pause/resume/delete logic from ScheduledJobs page). Add delete confirmation `AlertDialog`.
- Tab 2: Import `HistoryTable` and `executionHistory`, render with search filter and status tabs (from History page).
- Tab 3: Larger heatmap with additional day/metric selectors for deep analysis.
- Remove `navigate(`/dayparting/campaigns/${id}`)` from campaign row clicks — no drill-down. Instead, clicking a campaign row could select it for the heatmap filter or open the schedule panel.
- Remove the "View" button column from campaigns table.

**File: `src/App.tsx`**
- Change `/dayparting/hourly` to `/dayparting`
- Add redirect: `/dayparting/hourly` → `/dayparting`, `/dayparting/scheduled` → `/dayparting`, `/dayparting/history` → `/dayparting`
- Remove routes for `/dayparting/campaigns/:campaignId`, `/dayparting/scheduled/new`, `/dayparting/scheduled/:scheduleId/edit`

**File: `src/components/layout/AppSidebar.tsx`**
- Replace 3 Day Parting nav items with single item: `{ title: "Day Parting", url: "/dayparting", icon: Clock }`

**Files to delete (now unused):**
- `src/pages/dayparting/Campaigns.tsx`
- `src/pages/dayparting/History.tsx`
- `src/pages/dayparting/ScheduledJobs.tsx`
- `src/pages/dayparting/CampaignDetail.tsx`
- `src/pages/dayparting/ScheduleEditor.tsx`

**Breadcrumb:** Update to just `[{ label: "Day Parting" }]`

### Files Summary

| File | Change |
|---|---|
| `HourlyData.tsx` | Merge all 3 pages into tabbed single screen, remove drill-down |
| `App.tsx` | Consolidate routes, add redirects |
| `AppSidebar.tsx` | Single nav item for Day Parting |
| `Campaigns.tsx`, `History.tsx`, `ScheduledJobs.tsx`, `CampaignDetail.tsx`, `ScheduleEditor.tsx` | Delete |

