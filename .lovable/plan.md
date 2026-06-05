# Mobile Final Hotfix — Plan

Goal: a deliberately-designed mobile experience that mirrors desktop functionality, with a consistent header on every page, real (not block-stripped) tables, a working Aan screen, and a profile drawer that expands inline. No hover states anywhere on mobile; on/off only.

## 1. Shell & sticky header (every page)

**MobileTopBar** (56px, sticky top:0)
- Left: hamburger. Right: logo only. Remove profile avatar and theme toggle from the top bar — they belong in the drawer footer.

**Page title row** (scrolls with content)
- New `MobilePageHeader` primitive, used by every page: `<h1>` (Satoshi 22px/600) + optional one-line subtitle. Renders inside the page body, scrolls away.

**MobileTaskbar** (sticky top:56px, app-level action bar — the "card" the user wants back)
- Single row, grid `[parent? | date | actions]`, height 48px, `bg-card`, 1px bottom border, NEVER scrolls away (page content scrolls beneath it).
- **Back/parent pill**: only rendered when `breadcrumbItems.length >= 2` AND the route is a drill-down (`/campaign/:id`, `/adgroup/:id`, `/productad/:id`, `/targeting-actions`, `/impact/*`, `/rule-creation`). On top-level pages (Dashboard, Campaign Manager list, Profitability, BI, etc.) — hide it entirely. Left zone collapses; date centers.
- **Date chip**: same popover as today.
- **Actions** (right): Aan (dynamic `AanGlyph`, not the static square), Insight, Alert. Labels stay visible at ≥360px. Active state = `bg-primary/10 text-primary` (this is the "on" state for Delta too).
- Run button stays in row 2 only when a page passes `showRunButton`.

## 2. Drawer (hamburger) — single source of profile + theme

`MobileDrawerNav` rewrite:
- Top: close (single X — fix duplicate close icons).
- **Marketplace + Account**: nested submenu like desktop (`MarketplaceSelector`), single entry "Amazon · Demo Store ›" that pushes a sub-sheet with marketplace list and accounts per marketplace.
- **Nav tree**: Analyze (Profitability / Trends / P&L / Geo / Unified), Operate (Advertising / AMC / Day Parting), Catalog, BI, Reports — matches desktop sidebar.
- **Footer (fixed at bottom of drawer)**:
  - Profile row: avatar + name + chevron. Tap = inline expand showing Profile, Billing, Settings, Preferences, Team, Sign out. Collapsed by default.
  - Single theme button (sun/moon toggle, no dropdown, no currency).
- Remove the duplicate top profile band, the currency selector, and the second close button.

## 3. Mobile tables — full rebuild

Delete the CSS-driven mobile table overrides in `index.css` (`display:block` block, the sticky-first hacks). Build one primitive everything uses:

**`MobileTableCard`** (new)
- Wraps a real `<table>` inside `<div class="overflow-x-auto overscroll-x-contain">`. The card itself has `bg-card border rounded-lg`, never transparent. The page never scrolls horizontally.
- Header: sticky top, opaque `bg-muted` (no transparency over scrolled rows).
- First column: sticky left, `bg-card` in body rows / `bg-muted` in header, 180px, contains the row identity (Status+Name, Product, Order, etc).
- All other cells: `whitespace-nowrap`, numeric uses `tabular-nums text-right`.
- Row height 44px, divide-y. No row hover; selection only.

**`MobileTableToolbar`** rewrite
- One row, never wraps, never scrolls: `[🔍 Search] [Δ Delta] [⌕ Filter] [⋮ More]`. "More" opens a sheet containing Group / Columns / Sort / Export.
- Delta chip's active state is unambiguous: filled `bg-primary text-primary-foreground` when on, outline when off. Same pattern for any toggle chip.

**Pages migrated to `MobileTableCard`** (drop block-CSS reliance):
- Campaign Manager (Campaigns/AdGroups/ProductAds/Keyword/Product/SearchTerms/PageType/Platform tabs)
- Targeting Actions, Impact tables, Applied Rules, Rule Agents, Anomaly Alerts, Budget Pacing
- Catalog Products + Inventory Ads
- Profitability Products & Orders (`ProductsPnLTable`), Trends, Geographical, P&L (P&L matrix keeps its existing scroll)
- BI Keyword Tracker, Brand Coverage
- Day Parting history, Scheduled Jobs
- AMC tables, Reports history

(`MobileCardList` stays available but is no longer the default — only used where a page explicitly opts in.)

## 4. Aan mobile screen

`MobileAanLayout` rebuild:
- Sticky top nav row: hamburger, "Aan" wordmark, close → back to last page. Remove the second back arrow and the duplicated "Aan" label.
- Conversation: `flex-1 min-h-0 overflow-y-auto` (this is why scrolling is broken today — missing min-h-0). Messages bubble, full width on phone.
- Suggestion strip: horizontal `overflow-x-auto` chips above the input, single line, 8px gap. Remove the floating "SUGGESTED" island that wastes vertical space.
- Input dock: sticky bottom, safe-area padded, textarea + send. Model selector chip below input (Gemini 3 Flash etc.).
- Sidebar (conversation history): becomes a sheet opened from the hamburger inside Aan — not a permanent left column on mobile.

## 5. Data visualization

- `MobileChartFrame` enforces `width:100%; overflow:hidden`. Recharts containers use `ResponsiveContainer` with `width="100%"`. Legend wraps below; no horizontal scroll, no zoom-out.

## 6. Hover / gesture cleanup

- Replace the broad `*:hover{ background-color: revert }` rule (which is killing card backgrounds when the pointer enters) with a scoped block under `html[data-view="mobile"]`:
  - Disable hover background/color/shadow changes on `button, a, [role="button"], .card, [data-card]`.
  - Active/selected state is unaffected (`[data-state="active"]`, `aria-pressed="true"`, `.is-active`).
- Gestures already off on mobile; verify `GestureProvider` early-returns when `view === "mobile"`.

## 7. Page-by-page audit (consistent header everywhere)

Sweep these pages to use `MobilePageHeader` (title + subtitle) followed immediately by their content; remove ad-hoc h1/h2 blocks and inconsistent padding:
- Profitability: Dashboard, Trends, ProfitLoss, Geographical, UnifiedPnL
- Advertising: CampaignManager, CampaignDetail, AdGroupDetail, ProductAdDetail, TargetingActions, ImpactAnalysis, AppliedRules, RuleAgents, RuleCreation, AnomalyAlerts, BudgetPacing, SearchHarvesting, CreativeAnalyzer
- Catalog: Products, InventoryAds
- BI: KeywordTracker, BrandSOV, KeywordSOV, ProductSOV, CompetitorPricing
- AMC: Instances, Queries, ExecutedQueries, Schedules, Audiences, CreatedAudiences
- Day Parting: HourlyData
- Reports: ClientPortal
- Settings: all subpages

## Technical notes

- New primitives: `src/views/mobile/MobilePageHeader.tsx`, `src/views/mobile/MobileTableCard.tsx`. Replace `MobileDataTable` usages.
- Touch: `src/views/mobile/MobileShell.tsx`, `MobileTopBar.tsx`, `MobileTaskbar.tsx`, `MobileDrawerNav.tsx`, `MobileAanLayout.tsx`, `MobileTableToolbar.tsx`, `MobileChartFrame.tsx`, `src/index.css`, every page listed above, and `DataTableToolbar.tsx`.
- AanGlyph: import from `@/components/aan/AanGlyph` (same one used on desktop floating island).
- Drill-down detection: small helper `isDrillDownRoute(pathname)` to drive back-pill visibility, used by both `MobileTaskbar` and the parent label logic.
- Delete: `MobileDataTable.tsx` (after migration), any `display:block` table overrides in `index.css`, the top-bar profile/theme block.

## Out of scope
Desktop/tablet layouts. Backend or data logic. Adding new features beyond what desktop already has.

Approve to build.
