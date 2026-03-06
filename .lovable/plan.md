

# Phase 2.5: Unified Toolbars, Table Styling, Campaign Columns, Panel Fix, Settings Toggle, Sidebar Collapse, Taskbar Size

This plan addresses 7 distinct requests in one pass.

---

## 1. Unified Table Styling (Remove Card Wrappers)

The Campaign Manager table renders without a card wrapper — just `rounded-lg border border-border` directly on the table. Many other pages wrap tables in `rounded-lg border border-border bg-card` with separate toolbar sections inside.

**Action:** For every page that has a table, ensure the toolbar (`DataTableToolbar`) sits **outside** the table container (not inside a card header). The table itself uses only `rounded-lg border border-border` without `bg-card`. This matches the Campaign Manager pattern from image-80.

**Files to update** (approx 15-20 pages):
- All pages in `src/pages/profitability/`, `src/pages/bi/`, `src/pages/amc/`, `src/pages/dayparting/`, `src/pages/catalog/`, `src/pages/reports/`, `src/pages/advertising/BudgetPacing.tsx`, `RuleBuilder.tsx`, `CompetitorPricing.tsx`, `InventoryAds.tsx`, `ClientPortal.tsx`
- Pattern: Extract `DataTableToolbar` above the table div. Remove `bg-card` from table wrapper. Remove inner `border-b border-border p-4` toolbar container.

---

## 2. Ensure All Pages Use DataTableToolbar

Some newer pages (BudgetPacing, RuleBuilder, CompetitorPricing, InventoryAds, ClientPortal) have raw tables without `DataTableToolbar`. Add it with search, columns, filter, download for each.

---

## 3. Campaign Manager — New Columns + Edit Mode

### 3a. Add fields to Campaign type
**File: `src/types/campaign.ts`**
- Add: `biddingStrategy: string` (values: "Dynamic Down", "Dynamic Up/Down", "Fixed")
- `startDate` and `endDate` already exist.
- `dailyBudget` already exists (serves as "Budget").

### 3b. Add fields to mock data
**File: `src/data/mockCampaigns.ts`**
- Add `biddingStrategy` to each campaign.

### 3c. Update CampaignTable columns
**File: `src/components/tables/CampaignTable.tsx`**
- After "Campaign Name" column, add: Start Date, End Date, Bidding Strategy, Budget (use dailyBudget).
- Accept `viewMode` prop. When `viewMode === "edit"`, render inline editable cells for: Status (dropdown), Campaign Name (text input), Start Date (date input), End Date (date input), Bidding Strategy (dropdown), Daily Budget (number input).
- Pass `onCampaignUpdate` callback for saving edits.

### 3d. Update CampaignManager page
**File: `src/pages/advertising/CampaignManager.tsx`**
- Pass `viewMode` to `CampaignTable`.
- Update `COLUMN_DEFS.campaigns` to include new columns.

### 3e. Update CampaignTableTotalRow
- Adjust `colSpan` to account for new columns.

---

## 4. Right Panels — Same Layer as Aan Copilot

The Aan Copilot panel is rendered inside `AppLayout` as an inline flex sibling. But InsightsPanel, PeriodBreakdownPanel, and ProductDetailPanel still use `fixed right-0 top-0 z-50`.

**Action:** Convert all three panels to the same inline pattern. However, since these panels are context-specific (only used on certain pages), the simplest fix is to change them from `fixed` to `absolute` within a `relative` parent, or better: render them as flex siblings in the pages that use them, matching how AanCopilotPanel works in AppLayout.

**Practical approach:** Since InsightsPanel is rendered globally in `App.tsx`, and the profitability panels are page-specific, the cleanest fix is:
- Change `fixed right-0 top-0 z-50` to `fixed right-0 top-0 z-30` and remove any overlay/backdrop. This keeps them as side panels that don't block interaction with the rest of the app.
- Actually, the real issue is they need to push content. Convert to flex inline approach:
  - For InsightsPanel: move from `App.tsx` global render into `AppLayout` as a flex sibling (like AanCopilotPanel).
  - For PeriodBreakdownPanel and ProductDetailPanel: wrap page content + panel in a flex container at the page level.

**Files:**
- `src/App.tsx` — Remove `<InsightsPanel />` from global render
- `src/components/layout/AppLayout.tsx` — Add InsightsPanel as flex sibling
- `src/components/insights/InsightsPanel.tsx` — Change from `fixed` to inline flex panel
- `src/components/profitability/PeriodBreakdownPanel.tsx` — Change from `fixed` to inline flex
- `src/components/profitability/ProductDetailPanel.tsx` — Same
- `src/pages/profitability/Dashboard.tsx` and `ProfitLoss.tsx` — Wrap content + panel in flex container

---

## 5. Settings Toggle — Hide/Show New Feature Pages

**File: `src/pages/settings/Preferences.tsx`**
- Add new section: "New Feature Pages" with a single Switch toggle.
- Store state in localStorage key `anarix-new-features-visible` (default: true).

**File: `src/contexts/FeatureToggleContext.tsx`** (new)
- Create context that reads/writes `anarix-new-features-visible` from localStorage.
- Provides `newFeaturesVisible` boolean and `toggleNewFeatures` function.

**File: `src/components/layout/AppSidebar.tsx`**
- Consume `useFeatureToggle()`. When `newFeaturesVisible === false`, filter out these nav items:
  - Health Score, Unified P&L, Budget Pacing, Search Harvesting, Anomaly Alerts, Creative Analyzer, Rule Builder, Inventory & Ads, Competitor Pricing, Client Portal, Dashboard Builder

**File: `src/App.tsx`**
- Wrap with `FeatureToggleProvider`.

---

## 6. Sidebar Collapse Button

The collapse button was removed from the footer. User wants it back somewhere.

**Action:** Add a small collapse/expand chevron button at the very bottom of the sidebar, below the profile section. Use `PanelLeftClose` / `PanelLeftOpen` icons. When collapsed, show expand icon centered.

**File: `src/components/layout/AppSidebar.tsx`**
- Add collapse toggle button at bottom of footer using `useSidebar().toggleSidebar`.

---

## 7. Universal Taskbar — Match Table Toolbar Height

Currently `h-12` (48px). The DataTableToolbar buttons are `h-9`. The taskbar feels small relative to toolbar.

**File: `src/components/layout/AppTaskbar.tsx`**
- Change from `h-12` to `h-14` (56px).
- Increase inner control heights from `h-7` to `h-8`.
- Increase font sizes from `text-xs` to `text-sm` for labels and values.

---

## Execution Order

1. Create FeatureToggleContext
2. Update types + mock data (campaign fields)
3. Update CampaignTable (new columns + edit mode)
4. Update CampaignManager + TotalRow
5. Fix all right panels to inline flex
6. Unify table styling across all pages
7. Add DataTableToolbar to pages missing it
8. Add sidebar collapse button
9. Resize taskbar
10. Add settings toggle

