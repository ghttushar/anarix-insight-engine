# Layout Restructure, Panel Fixes, Geography Unlock, KPI Dropdowns, Full Polish & Competitive Feature Ideas

## What changes and why

### 1. Move Profile + Theme Toggle to Sidebar Footer

The universal taskbar currently holds profile avatar and light/dark toggle, making it feel like a "settings bar" rather than active work controls. Move these to the sidebar bottom (next to the collapse button). The taskbar then becomes purely analytical controls.

**File: `src/components/layout/AppSidebar.tsx**`

- Add theme toggle button and profile avatar dropdown to the sidebar footer area (above or alongside the collapse button)
- Import `useTheme`, `Avatar`, `DropdownMenu` components

**File: `src/components/layout/AppTaskbar.tsx**`

- Remove the light/dark toggle and profile menu from the right zone
- Keep only: Marketplace+Store selector on the right
- Left zone remains: Ad Type | Frequency | Date Range

### 2. Move Taskbar Below Page Heading

Currently the taskbar sits above the page title. It should render below the page heading/subheading on each page.

**File: `src/components/layout/AppLayout.tsx**`

- Remove `<AppTaskbar />` from the layout wrapper entirely
- Instead, each page (or a new `PageHeader` component) will render the taskbar inline after the heading

**New file: `src/components/layout/PageHeader.tsx**`

- Accepts `title`, `subtitle`, optional `actions` slot
- Renders heading + subtitle, then `<AppTaskbar />` below it
- All pages use `<PageHeader>` instead of manually writing `<h1>` + `<p>`

### 3. Unlock Geography Page

Remove the Coming Soon overlay entirely. Make the map and table interactive.

**File: `src/pages/profitability/Geographical.tsx**`

- Remove the overlay div with Lock icon
- Remove `pointer-events-none opacity-40` wrapper
- Re-enable `onRegionSelect` handler

### 4. Add Metric Dropdown to Advertising KPI Cards

Per reference image-66, each KPI card should have a dropdown arrow to let users swap the displayed metric.

**File: `src/components/advertising/InlineKPIStrip.tsx**`

- Add a `ChevronDown` icon next to each KPI label
- On click, show a dropdown with available metrics (Impressions, Clicks, CTR, CPC, Ad Spend, Ad Sales, Ad Orders, ROAS, ACOS, etc.)
- Selecting a metric swaps the KPI card's data
- Accept `availableMetrics` prop and `onMetricChange` callback

**File: `src/pages/advertising/CampaignManager.tsx**`

- Pass available metrics list and handle metric swaps in state

### 5. Remove Blur on All Right Panels

All right-side panels currently use `backdrop-blur` and a dark overlay that blurs the screen. Remove this.

**Files to modify:**

- `src/components/profitability/PeriodBreakdownPanel.tsx` — Remove `bg-black/4 backdrop-blur-[1px]` from backdrop div, replace with transparent click-away div (`bg-transparent`)
- `src/components/profitability/ProductDetailPanel.tsx` — Same fix
- Any other panel with backdrop blur

### 6. Independent Scroll on All Right Panels + Aan Copilot

Ensure all right-side panels have their own scroll container that doesn't affect the main content.

**File: `src/components/aan/AanCopilotPanel.tsx**`

- Ensure the panel has `overflow-hidden` on the outer container and `overflow-y-auto` on the content area
- Fix any box containment issues (the panel should be `h-full` with flex column layout)

### 7. Build All Remaining Non-Functional Buttons

Audit and implement stub functionality for every button that currently does nothing:


| Button          | Location                | Action                                      |
| --------------- | ----------------------- | ------------------------------------------- |
| Upload COGS     | Profitability Dashboard | Open file input dialog, show analysis modal |
| Download/Export | All tables              | Generate CSV from visible data              |
| Run button      | Trends, P&L             | Trigger data refresh with loading skeleton  |
| Analyze button  | Impact Analysis         | Trigger comparison refresh                  |
| Send Invite     | Settings > Invites      | Open invite form dialog                     |
| Add User        | Settings > Users        | Open add user dialog                        |


**Files to modify:** Dashboard.tsx, Trends.tsx, ProfitLoss.tsx, ImpactAnalysis.tsx, Invites.tsx, Users.tsx, and all pages with Download buttons.

### 8. Full Pixel Scan Fixes

- All tables: verify `colSpan` totals match header count
- All buttons: ensure hover/active/disabled states work
- All modals: ensure ESC closes, click-outside closes
- All empty states: show proper messaging
- All loading states: show skeleton instead of blank

---

## 20 UX Improvement Ideas

1. **Sticky table headers with scroll shadow** — Add a subtle top shadow when the table body scrolls, so users know there's more data above
2. **Keyboard navigation for tables** — Arrow keys to move between cells, Enter to select/expand a row
3. **Breadcrumb-driven date range** — Show the active date range in the breadcrumb so users always see context
4. **Bulk row selection with shift-click** — Hold Shift to select a range of table rows for bulk actions
5. **Inline sparkline in KPI cards** — Tiny 7-day trend line inside each KPI card (no click needed)
6. **Column drag-to-reorder** — Let users drag table column headers to rearrange column order, persisted to localStorage
7. **Saved filter presets** — "Save as..." button in the filter builder to save and recall named filter sets
8. **Table row grouping** — Group campaign table rows by status (Live/Paused) with collapsible group headers
9. **Right-click context menu on table rows** — Quick actions: Copy value, Open in new tab, Add to watchlist
10. **Metric comparison mode** — Select two metrics and overlay them on the same chart with dual Y-axes
  &nbsp;
11. **Persistent column widths** — Let users resize columns by dragging, persist widths to localStorage
12. **Quick date shortcuts** — "Today", "Yesterday", "Last 7d", "Last 30d" as single-click pills above the calendar
13. **Pinned/favorite products** — Star products to pin them to the top of any product table
14. **Tooltip previews on product names** — Hover a product name to see a mini-card with image, price, ASIN, profit margin
15. **Performance heatmap on date columns** — Color-code P&L date columns by intensity (green=profit, red=loss)
16. **Undo last action toast** — After any destructive action (COGS change, filter clear), show a toast with "Undo" for 5 seconds
17. **Split-screen comparison** — Compare two products or two campaigns side-by-side in a modal
18. **Export as shareable link** — Generate a read-only URL of the current view (filters + date range + columns) to share with team
19. **Onboarding checklist widget** — A small progress bar showing setup completion (Connect accounts, Set COGS, Create first rule, etc.)

## 10 New Feature Ideas (Competitive Differentiators)

Based on analysis of Adbrew (rule-based PPC automation), Triple Whale (Moby AI creative analysis, multi-touch attribution), and Teikametrics (AI-powered bidding, benchmark reports):

1. **Budget Pacing Dashboard** — Real-time burn rate visualization showing daily/monthly budget consumption vs. target, with projected overspend/underspend alerts. Adbrew and Teikametrics offer basic pacing; Anarix can show it as a visual timeline with guardrails.
2. **Search Term Harvesting Workflow** — Automated pipeline that surfaces high-performing search terms from campaigns and presents them as "Add as Keyword" cards with suggested match type and bid, similar to Adbrew's keyword harvesting but with Aan AI explanations for why each term is recommended.
3. **Creative Performance Analyzer** — Upload ad creatives (images/videos) and see which visual elements correlate with higher CTR/CVR. Triple Whale's Moby does this for DTC; Anarix would be the first to do it for Amazon/Walmart marketplace ads.
4. **Cross-Marketplace Unified P&L** — Single P&L view combining Amazon + Walmart financials side-by-side with a "Combined" total column. No competitor currently offers true cross-marketplace profitability in one view.
5. **Aan Anomaly Alerts (Push Notifications)** — Proactive AI alerts when metrics deviate significantly: "Your ACOS on Campaign X jumped 40% in the last 6 hours." Sent as in-app notifications and optional email/Slack. Teikametrics has basic alerts; Anarix can make them contextual with Aan.
6. **Competitor Price Tracking** — Track competitor ASINs' pricing over time and correlate price changes with your own sales/conversion changes. Surface insights like "Competitor X dropped price by 15%, your conversion rate dropped 8%."
7. **Rule Builder with Backtesting** — Before activating an automation rule (e.g., "Pause campaigns with ACOS > 40%"), show a simulation of what would have happened over the last 30 days if this rule was active. Adbrew has rules but no backtesting.
8. **Inventory-Aware Ad Optimization** — Automatically reduce ad spend on products approaching stockout and increase spend on overstocked items. Connects inventory data to advertising decisions.
9. **Client Reporting Portal** — For agencies: auto-generate branded PDF/HTML reports with client logo, send on schedule, and provide a read-only client dashboard link. Triple Whale offers this for DTC; Anarix would bring it to marketplace advertising.
10. **Marketplace Health Score** — A single composite score (0-100) that weighs profitability, ad efficiency, inventory health, keyword coverage, and buy box percentage into one "account health" metric displayed prominently on the dashboard.

---

## Files Summary


| File                                                    | Action                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| `src/components/layout/PageHeader.tsx`                  | Create — reusable heading + inline taskbar                     |
| `src/components/layout/AppSidebar.tsx`                  | Modify — add profile + theme toggle to footer                  |
| `src/components/layout/AppTaskbar.tsx`                  | Modify — remove profile/theme, keep only filters + marketplace |
| `src/components/layout/AppLayout.tsx`                   | Modify — remove AppTaskbar from layout                         |
| `src/pages/profitability/Geographical.tsx`              | Modify — remove Coming Soon overlay                            |
| `src/components/advertising/InlineKPIStrip.tsx`         | Modify — add metric dropdown per card                          |
| `src/pages/advertising/CampaignManager.tsx`             | Modify — handle metric swap state                              |
| `src/components/profitability/PeriodBreakdownPanel.tsx` | Modify — remove backdrop blur                                  |
| `src/components/profitability/ProductDetailPanel.tsx`   | Modify — remove backdrop blur                                  |
| `src/components/aan/AanCopilotPanel.tsx`                | Modify — fix scroll containment                                |
| All page files                                          | Modify — replace h1/p heading with `<PageHeader>`              |
| Various table pages                                     | Modify — wire Download buttons to CSV export                   |


## Implementation Order

1. Create PageHeader component
2. Move profile + theme to sidebar
3. Strip taskbar from layout, embed via PageHeader
4. Unlock Geography
5. Add KPI metric dropdowns
6. Remove panel blur + fix scroll
7. Wire all remaining buttons
8. Full pixel audit pass