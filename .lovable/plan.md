
# Complete Implementation Plan: Business Intelligence, Day Parting & Bug Fixes

## Overview

This plan covers three major areas:
1. **Bug Fixes & UI Polish** - Fix all reported issues across the app
2. **Business Intelligence Section** - Build Brand SOV, Keyword Tracker, Keyword SOV, Product SOV
3. **Day Parting Section** - Fully functional end-to-end implementation with all screens

---

## Part 1: Bug Fixes & UI Polish

### 1.1 Remove Unwanted Horizontal Scroll in Profitability Dashboard

**Problem**: Period Summary Cards have horizontal overflow showing ugly scrollbars (visible in user screenshot image-22.png)

**Fix Location**: `src/components/profitability/PeriodSummaryCard.tsx`

**Solution**:
- Remove `overflow-x-auto` from the metrics row
- Use flex-wrap or a responsive grid instead
- Ensure metrics fit without scrolling on desktop

### 1.2 Modern Custom Scrollbars App-Wide

**Problem**: Default browser scrollbars look outdated

**Fix Location**: `src/index.css`

**Solution**: Add custom scrollbar CSS:
```css
/* Modern Scrollbars */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Hide scrollbar when not needed */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### 1.3 Fix Table Overlapping Issues in Profitability

**Problem**: Table headers and sticky columns overlap incorrectly (visible in image-23.png and image-24.png)

**Fix Locations**: 
- `src/components/profitability/ProductsPnLTable.tsx`
- `src/components/tables/RegionalTable.tsx`

**Solution**:
- Fix z-index hierarchy for sticky columns
- Add proper background colors to sticky cells in both light/dark modes
- Ensure header row has highest z-index
- Add left shadow to indicate sticky column boundary

### 1.4 Fix Geography Map and Buttons

**Problem**: Map appears to be missing or broken, zoom buttons not working (image-25.png shows the issue)

**Fix Location**: 
- `src/components/profitability/GeographyMap.tsx`
- `src/pages/profitability/Geographical.tsx`

**Solution**:
- Fix SVG viewBox and state paths for proper rendering
- Ensure zoom state properly updates the transform
- Wire up region selection to update the stats panel
- Add visual feedback for selected regions
- Fix State/Product level toggle functionality

### 1.5 Fix Alignment Issues Throughout the App

**Problems Identified**:
- Inconsistent padding in card headers
- Misaligned toolbar buttons
- Table column alignment issues

**Solution**:
- Audit all components for consistent padding (use `p-4` for cards, `p-6` for main content)
- Ensure all toolbar button groups use `gap-2`
- Fix table header alignment with body cells

### 1.6 Fix Sidebar Hover Flyout Navigation

**Problem**: Flyout not appearing or disappearing too quickly

**Fix Locations**:
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/SidebarFlyout.tsx`

**Solution**:
- Add proper mouse event handling with delay
- Keep flyout open when mouse is over it
- Add pointer-events handling for smooth transitions
- Use `onMouseEnter`/`onMouseLeave` on both trigger and flyout
- Add a small overlap/padding area for easier mouse movement

---

## Part 2: Business Intelligence Section

Based on the reference screenshots (image-20.png for Brand SOV, image-21.png for Keyword Tracker):

### 2.1 Brand SOV Page

**Route**: `/bi/brand-sov`

**Page Structure**:

**Header Controls Row**:
- Keyword dropdown (searchable)
- Date Range picker
- Position dropdown (All, 1, 2, 3...)
- Frequency dropdown (Hourly)
- Brand dropdown

**KPI Strip** (5 metrics):
- Your Brand (Napqueen 2.5%)
- Organic SOV (%) with delta
- Sponsored SOV (%) with delta  
- Total SOV (%) with delta
- Product Count (Unique)

**Stacked Area Chart**:
- Shows SOV over time by brand
- Color-coded by brand
- Time range label ("Jan 31 (Hourly)")
- Expandable/collapsible
- Legend with brand names and colors

**Brand Coverage Table**:
- Columns: SI No, Brand, Product Count (Unique), Appearance(%), Organic SOV(%), Sponsored SOV(%), Total SOV(%), View Trend
- Each row has View Trend button that links to trend view
- Pagination at bottom

### 2.2 Keyword Tracker Page

**Route**: `/bi/keyword-tracker`

**Tabs**: Active(51) | Inactive(23)

**Controls**:
- Search by keyword input
- Add Keyword button (primary)

**Table Columns**:
- Keyword
- Added At (timestamp with timezone)
- Updated At (timestamp with timezone)
- Region (flag + code)
- Channels (icon indicators)
- Status (toggle)
- Action (delete button)

### 2.3 Keyword SOV Page

**Route**: `/bi/keyword-sov`

**Structure**: Similar to Brand SOV but focused on keywords
- Keyword filter
- Date range
- Position filter
- SOV metrics for keywords
- Trend chart
- Keywords table with SOV data

### 2.4 Product SOV Page

**Route**: `/bi/product-sov`

**Structure**:
- Product filter (with image/name/SKU)
- Date range
- Position filter
- Product-level SOV metrics
- Performance chart
- Products table with SOV rankings

---

## Part 3: Day Parting Section (Fully Functional End-to-End)

Based on the PDF flowchart (page_1.jpg), there are approximately 25+ screens for Day Parting:

### 3.1 Navigation Structure

**Sidebar Items**:
- Hourly Data (landing)
- Campaigns
- History
- Scheduled Jobs

### 3.2 Hourly Data Page (Main Entry Point)

**Route**: `/dayparting/hourly`

**Breadcrumb**: Day Parting > Hourly Data

**Controls Row**:
- Campaign dropdown (multi-select)
- Date Range dropdown
- Day of Week filter (Mon-Sun checkboxes)
- Run button

**Heatmap Grid**:
- Y-axis: Hours (0-23)
- X-axis: Days of week or dates
- Cell color intensity = performance metric
- Cell shows value on hover

**Metrics Summary Below Grid**:
- Spend, Revenue, ROAS, ACOS, Orders, Units

**Actions at Bottom**:
- "Schedule Day Parting" button
- "View Details" for individual hours

### 3.3 Campaign Selection Flow

When user clicks on a campaign from the grid:

**Route**: `/dayparting/campaigns/:campaignId`

**Breadcrumb**: Day Parting > Campaigns > [Campaign Name]

**Page Shows**:
- Campaign-specific heatmap
- Performance metrics for this campaign
- Hourly breakdown table
- Trend chart (hourly performance over time)
- Schedule configuration panel

### 3.4 Schedule Day Parting Modal/Page

**Route**: `/dayparting/schedule/new` (or modal)

**Form Fields**:
- Campaign selection (if not pre-selected)
- Schedule Name
- Action Type dropdown (Pause/Reduce Budget/Increase Budget)
- Time Selection Grid (select hours to apply action)
- Days of Week selection
- Start Date / End Date
- Repeat options (Daily, Weekly, Custom)

**Preview Section**:
- Shows what will happen when schedule runs
- Estimated budget impact

**Buttons**:
- Cancel, Save as Draft, Activate Schedule

### 3.5 History Page

**Route**: `/dayparting/history`

**Breadcrumb**: Day Parting > History

**Tabs**: All | Completed | Failed | Cancelled

**Table Columns**:
- Execution Date/Time
- Campaign
- Action Taken
- Status (Success/Failed/Partial)
- Details (expandable)
- Duration
- Actions (View, Retry)

**Filters**:
- Date range
- Campaign filter
- Status filter

### 3.6 Scheduled Jobs Page

**Route**: `/dayparting/scheduled`

**Breadcrumb**: Day Parting > Scheduled Jobs

**Table Columns**:
- Schedule Name
- Campaign(s)
- Action Type
- Frequency
- Next Run
- Status (Active/Paused/Completed)
- Actions (Edit, Pause/Resume, Delete)

**Controls**:
- Search
- Create New Schedule button
- Bulk actions (Pause/Delete selected)

### 3.7 Edit Schedule Page

**Route**: `/dayparting/scheduled/:scheduleId/edit`

Same form as Create, but pre-populated with existing values

---

## Part 4: File Structure

```text
src/
├── components/
│   ├── bi/
│   │   ├── SOVChart.tsx (reusable stacked area chart)
│   │   ├── SOVKPIStrip.tsx (SOV-specific metrics)
│   │   ├── BrandCoverageTable.tsx
│   │   ├── KeywordTrackerTable.tsx
│   │   ├── AddKeywordModal.tsx
│   │   └── TrendViewModal.tsx
│   ├── dayparting/
│   │   ├── HourlyHeatmap.tsx (main grid)
│   │   ├── HeatmapCell.tsx (individual cell)
│   │   ├── TimeSelector.tsx (hour selection grid)
│   │   ├── DaySelector.tsx (day of week selection)
│   │   ├── ScheduleForm.tsx (create/edit form)
│   │   ├── SchedulePreview.tsx
│   │   ├── HistoryTable.tsx
│   │   ├── ScheduledJobsTable.tsx
│   │   ├── CampaignHourlyChart.tsx
│   │   └── DayPartingBreadcrumb.tsx
│   └── ui/
│       └── breadcrumb.tsx (already exists)
├── pages/
│   ├── bi/
│   │   ├── BrandSOV.tsx
│   │   ├── KeywordTracker.tsx
│   │   ├── KeywordSOV.tsx
│   │   └── ProductSOV.tsx
│   └── dayparting/
│       ├── HourlyData.tsx
│       ├── Campaigns.tsx
│       ├── CampaignDetail.tsx
│       ├── History.tsx
│       ├── ScheduledJobs.tsx
│       └── ScheduleEditor.tsx
├── data/
│   ├── mockBrandSOV.ts
│   ├── mockKeywordTracker.ts
│   └── mockDayParting.ts
└── types/
    ├── bi.ts
    └── dayparting.ts
```

---

## Part 5: Type Definitions

### Business Intelligence Types (`src/types/bi.ts`)

```typescript
interface Brand {
  id: string;
  name: string;
  productCount: number;
  appearance: number;
  organicSOV: number;
  sponsoredSOV: number;
  totalSOV: number;
}

interface TrackedKeyword {
  id: string;
  keyword: string;
  addedAt: string;
  updatedAt: string;
  region: string;
  channels: ("organic" | "sponsored")[];
  status: "active" | "inactive";
}

interface SOVDataPoint {
  timestamp: string;
  brands: Record<string, number>;
}
```

### Day Parting Types (`src/types/dayparting.ts`)

```typescript
interface HourlyData {
  hour: number; // 0-23
  dayOfWeek: number; // 0-6
  date: string;
  spend: number;
  revenue: number;
  orders: number;
  roas: number;
  acos: number;
}

interface DayPartingSchedule {
  id: string;
  name: string;
  campaignIds: string[];
  actionType: "pause" | "reduce_budget" | "increase_budget";
  budgetModifier?: number;
  hours: number[];
  daysOfWeek: number[];
  startDate: string;
  endDate?: string;
  repeatType: "daily" | "weekly" | "custom";
  status: "active" | "paused" | "completed";
  createdAt: string;
  nextRun?: string;
}

interface ExecutionHistory {
  id: string;
  scheduleId: string;
  scheduleName: string;
  campaignName: string;
  executedAt: string;
  action: string;
  status: "success" | "failed" | "partial";
  details?: string;
  duration: number;
}
```

---

## Part 6: Route Updates

```tsx
// Add to App.tsx Routes
// Business Intelligence
<Route path="/bi/brand-sov" element={<BrandSOV />} />
<Route path="/bi/keyword-tracker" element={<KeywordTracker />} />
<Route path="/bi/keyword-sov" element={<KeywordSOV />} />
<Route path="/bi/product-sov" element={<ProductSOV />} />

// Day Parting
<Route path="/dayparting/hourly" element={<HourlyData />} />
<Route path="/dayparting/campaigns" element={<DayPartingCampaigns />} />
<Route path="/dayparting/campaigns/:campaignId" element={<CampaignDetail />} />
<Route path="/dayparting/history" element={<DayPartingHistory />} />
<Route path="/dayparting/scheduled" element={<ScheduledJobs />} />
<Route path="/dayparting/scheduled/new" element={<ScheduleEditor />} />
<Route path="/dayparting/scheduled/:scheduleId/edit" element={<ScheduleEditor />} />
```

---

## Part 7: Implementation Sequence

### Phase 1: Bug Fixes (Priority)
1. Fix custom scrollbars in index.css
2. Fix PeriodSummaryCard overflow
3. Fix table sticky column z-index issues
4. Fix GeographyMap rendering and buttons
5. Fix sidebar hover flyout behavior

### Phase 2: Business Intelligence
1. Create BI type definitions
2. Create mock data files
3. Build shared components (SOVChart, SOVKPIStrip)
4. Implement Brand SOV page with all features
5. Implement Keyword Tracker page with add/delete functionality
6. Implement Keyword SOV page
7. Implement Product SOV page

### Phase 3: Day Parting Core
1. Create dayparting type definitions
2. Create mock data for hourly metrics
3. Build HourlyHeatmap component (the core visualization)
4. Build TimeSelector and DaySelector components
5. Implement Hourly Data page

### Phase 4: Day Parting Scheduling
1. Build ScheduleForm component
2. Build SchedulePreview component
3. Implement ScheduleEditor page (create/edit)
4. Implement Scheduled Jobs page with table

### Phase 5: Day Parting History & Details
1. Build HistoryTable component
2. Implement History page
3. Implement Campaign Detail page
4. Add breadcrumb navigation throughout

### Phase 6: Final Polish
1. Verify all navigation works
2. Test all interactive elements
3. Ensure consistent styling
4. Verify dark mode works correctly

---

## Technical Notes

### Heatmap Implementation
- Use CSS Grid for the hour/day matrix
- Cell colors based on performance quintiles
- Use Tailwind color opacity for intensity (bg-primary/20 to bg-primary/100)
- Tooltip on hover shows exact values

### Schedule Time Selector
- Grid of 24 cells (one per hour)
- Click/drag to select multiple hours
- Visual feedback for selected hours
- Days of week as toggleable chips

### Flyout Fix Details
The current flyout disappears because there's no connection between the trigger and the flyout. Solution:
1. Wrap trigger and flyout in a single container with pointer-events
2. Add a small invisible bridge element between trigger and flyout
3. Use a delay before hiding (150ms debounce)
4. Keep flyout open while any related element is hovered

### Table Sticky Column Fix
The overlapping occurs because:
1. Background colors use transparent fallbacks
2. z-index isn't properly stacked

Solution:
- Sticky header: z-20
- Sticky column header: z-30
- Sticky body cells: z-10
- Use explicit background colors, not inherit

## reply in chat what font are you using across the software 