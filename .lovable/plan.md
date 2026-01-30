

# Complete Advertising Section Implementation Plan

## Overview

This plan covers the complete implementation of the Advertising section with a redesigned UI layout that moves away from the heavy card-based design toward a cleaner, more professional analytical interface that matches the reference screenshots provided.

---

## UI Design Philosophy Changes

### Current Issues
- Heavy reliance on Card components with borders creates visual clutter
- KPI cards feel isolated and disconnected from data
- Chart container is overly stylized
- Too much visual weight from borders and shadows

### New Design Direction (Based on Reference Images)
- **Minimal container styling**: Use subtle backgrounds instead of heavy borders
- **Inline KPI metrics**: Horizontal strip with colored left borders for quick scanning
- **Table-first layout**: Tables are the primary workspace, not cards
- **Underlined tab navigation**: Simple horizontal tabs without pill styling
- **Cleaner density**: More data visible, less decorative padding

---

## Technical Implementation

### Part 1: New UI Components

**1.1 InlineKPIStrip Component**
- Horizontal row of 4 KPIs
- Each KPI has: colored left border accent, label, value, delta with arrow
- Background: subtle card background without heavy border
- Delta shown as pill with up/down arrow and percentage

**1.2 PerformanceChartSection Component**
- Full-width chart area with minimal styling
- "Show Impact" and "View Changes" toggle buttons (top-left)
- "Hide Chart" toggle with expand/download actions (top-right)
- Metric legend below chart (clickable to toggle)
- Collapsible via "Hide Chart" button

**1.3 DataTableToolbar Component**
- View/Edit mode toggle (left side)
- Search input (right side)
- Filter button with active filter count badge
- Columns visibility dropdown
- Download button
- Active filters displayed as removable chips below toolbar

**1.4 UnderlineTabs Component**
- Simple text tabs with underline active state
- No pill/box background styling
- Matches reference screenshots exactly

---

### Part 2: Campaign Manager Tabs Implementation

Each tab will have its own table component with specific columns:

**2.1 Campaigns Tab (Existing - Enhance)**
Columns: Checkbox, Active, Status, Campaign (with type badges), Start Date, End Date, Budget Type, Total Budget, Daily Budget, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend, Ad Sales, ROAS, ACOS, Omnichannel Sales

**2.2 Ad Groups Tab (New)**
Columns: Checkbox, Status, Ad Group, Campaign (with type badges), Bid Automation, Min Bid, Max Bid, Target ROAS, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend, Ad Sales, ROAS, ACOS

**2.3 Product Ads Tab (New)**
Columns: Checkbox, Status, Product Ad (image + title + item ID + SKU), Ad Group, Campaign, Bid Automation, Min Bid, Max Bid, Target ROAS, Product Bid, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend

**2.4 Keyword Targeting Tab (New)**
Columns: Checkbox, Status, Keyword, Match Type, Ad Group, Campaign, Bid Automation, Min Bid, Max Bid, Target ROAS, Bid, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend

**2.5 Search Terms Tab (New)**
Columns: Checkbox, Search Term, Product Ad (image + title + details), Keyword, Match Type, Ad Group, Campaign, Impressions, Clicks, CTR, Ad Units, CVR, CPC, Ad Spend

**2.6 Page Type Tab (New)**
Columns: Checkbox, Page Type, Bid Modifier, Impressions, Clicks, CTR, CPC, Ad Spend, Ad Sales, ROAS, ACOS

**2.7 Platform Tab (New)**
Columns: Checkbox, Platform, Bid Modifier, Impressions, Clicks, CTR, CPC, Ad Spend, Ad Sales, ROAS, ACOS

---

### Part 3: Impact Analysis Page (New)

**3.1 Page Header**
- Time Period selector (baseline range)
- "vs" label
- Impact Period selector (comparison range)
- Metrics multi-select dropdown (right side)
- Analyze button

**3.2 Impact Chart**
- Multi-metric line chart with period comparison
- Hide Chart toggle
- Download and fullscreen buttons

**3.3 Impact Tabs**
- Campaigns | Ad Groups | Products | Keywords | Search Terms

**3.4 Impact Table Structure**
- Comparison table with period columns side-by-side
- Each row shows: Entity name + Impact percentage badge
- Grouped column headers: "Impressions" with sub-columns for each period
- Color-coded delta values (green for positive, red for negative)

---

### Part 4: Targeting Actions Page (New)

**4.1 Page Tabs**
- Keyword Action | History | Archive

**4.2 Action Configuration Bar**
- Action Type dropdown (Auto to Manual, Manual to Manual, etc.)
- Date Range dropdown
- Priority dropdown
- Fetch Keywords button (right side)

**4.3 Table Toolbar**
- Search input
- Custom Bid button
- Copy button
- Columns dropdown
- Download button
- Filter button
- Add Keywords button

**4.4 Active Filters Row**
- Removable filter chips
- Clear button

**4.5 Targeting Actions Table**
Columns: Checkbox, Search Term (with type badge - Branded/Competitor/Generic), Normalized Term, Source Campaign, Source AdGroup, Target Campaign dropdown, Target AdGroup dropdown, Match Type to Add (BROAD/EXACT/PHRASE checkboxes with bid inputs), Archive, Impressions, Clicks, CTR, CPC, Ad Spend, Ad Sales, Ad Units, CVR, ROAS

---

### Part 5: Settings - Appearance Page (New)

**5.1 Page Structure**
- Clean settings layout
- Section for Theme Mode
- Section for other appearance preferences

**5.2 Theme Switcher**
- Light/Dark mode toggle
- Visual preview cards showing each mode
- Auto-detect system preference option
- Immediate preview on selection

**5.3 Implementation**
- Use next-themes package (already installed)
- Create ThemeProvider wrapper
- Persist preference to localStorage

---

### Part 6: CSS and Style Enhancements

**6.1 New CSS Classes**
```css
/* Inline KPI styling */
.kpi-strip { ... }
.kpi-item { border-left: 3px solid var(--color); }

/* Underline tabs */
.tab-underline { border-bottom: 2px solid transparent; }
.tab-underline[data-state=active] { border-bottom-color: var(--primary); }

/* Comparison delta styling */
.delta-positive { color: var(--success); }
.delta-negative { color: var(--destructive); }
```

**6.2 Table Enhancements**
- Reduce row padding for density
- Add sticky column support for wide tables
- Horizontal scroll with shadow indicators

---

## File Structure

```
src/
├── components/
│   ├── advertising/
│   │   ├── InlineKPIStrip.tsx
│   │   ├── PerformanceChartSection.tsx
│   │   ├── DataTableToolbar.tsx
│   │   └── UnderlineTabs.tsx
│   ├── tables/
│   │   ├── AdGroupsTable.tsx
│   │   ├── ProductAdsTable.tsx
│   │   ├── KeywordTargetingTable.tsx
│   │   ├── SearchTermsTable.tsx
│   │   ├── PageTypeTable.tsx
│   │   ├── PlatformTable.tsx
│   │   └── ImpactTable.tsx
│   └── settings/
│       └── ThemeSwitcher.tsx
├── pages/
│   ├── advertising/
│   │   ├── CampaignManager.tsx (enhance)
│   │   ├── ImpactAnalysis.tsx (new)
│   │   └── TargetingActions.tsx (new)
│   └── settings/
│       └── Appearance.tsx (new)
├── contexts/
│   └── ThemeContext.tsx (new)
├── data/
│   ├── mockCampaigns.ts (enhance with more data)
│   ├── mockAdGroups.ts (new)
│   ├── mockProductAds.ts (new)
│   ├── mockKeywords.ts (new)
│   ├── mockSearchTerms.ts (new)
│   └── mockImpactData.ts (new)
└── types/
    └── advertising.ts (new - extended types)
```

---

## Route Updates

```tsx
// New routes in App.tsx
<Route path="/advertising/campaigns" element={<CampaignManager />} />
<Route path="/advertising/impact" element={<ImpactAnalysis />} />
<Route path="/advertising/targeting" element={<TargetingActions />} />
<Route path="/settings/appearance" element={<Appearance />} />
```

---

## Mock Data Requirements

**Ad Groups Data**: 15+ records with all columns
**Product Ads Data**: 10+ records with product images, SKUs
**Keywords Data**: 20+ records with match types
**Search Terms Data**: 15+ records with product references
**Impact Data**: Comparison data for two date periods
**Targeting Actions Data**: 5+ records with match type options

---

## Implementation Order

1. Create theme context and appearance settings page
2. Build new UI components (InlineKPIStrip, UnderlineTabs, DataTableToolbar)
3. Refactor Campaign Manager with new design
4. Add all Campaign Manager tab tables with mock data
5. Build Impact Analysis page
6. Build Targeting Actions page
7. Update sidebar with Appearance link
8. Final styling polish

---

## Technical Notes

- All tables will use the existing Table components from shadcn/ui
- Sorting, pagination, and selection patterns remain consistent
- Filter chips use Badge component with close button
- Match type badges (BROAD/EXACT/PHRASE) with distinct colors
- Campaign type badges (Manual/Auto/SP/SB) with distinct styling
- Editable cells use Input component with inline validation
- Total rows remain at bottom of each table

