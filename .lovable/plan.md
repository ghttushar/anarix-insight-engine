

## 3-Bar Architecture Redesign + Table Backgrounds + Column Pinning

### Architecture: 3 Control Bars

The current system uses 2 bars: `AppTaskbar` (page-level filters + marketplace selector) and `DataTableToolbar` (table controls). The user wants 3 distinct bars:

1. **App Level Metric Selector** (NEW) — sits top-right against the page title inside `PageHeader`. Contains global selectors like Marketplace and Ad Type/Catalogue.
2. **Page Level Metric Selector** — replaces current `AppTaskbar`. Contains page-specific controls (date range, frequency, metrics, run button, search). No marketplace selector here anymore.
3. **Table Toolbar** — current `DataTableToolbar`, keeps its role but per-page button sets are redefined.

Plus: all tables/charts get `bg-card` background, and tables get a column pin feature.

---

### Phase 1: Create App Level Metric Selector + Restructure PageHeader + Refactor AppTaskbar

**New Component: `AppLevelSelector.tsx`**
- Renders inside `PageHeader` on the right side (where `actions` currently goes)
- Extracts Marketplace/Store selector FROM `AppTaskbar` INTO this component
- Accepts `children` for page-specific items (Ad Type, Catalogue selector)
- Same visual style as current marketplace dropdown but compact

**Modify `PageHeader.tsx`**
- Replace `actions` prop with `appLevelSelector` prop (ReactNode)
- Layout: Title/subtitle LEFT, app level selector RIGHT

**Modify `AppTaskbar.tsx`**
- Remove marketplace/store selector (moved to app level)
- Remove `showAdType` (moved to app level)
- Keep as page-level bar: date range, frequency, and children
- Rename conceptually to "Page Level Metric Selector"

**Per-page app level content:**

| Page | App Level Items |
|---|---|
| Profitability Dashboard | Marketplace, Catalogue |
| Profitability Trends | Marketplace, Catalogue |
| Profit & Loss | Marketplace, Catalogue |
| Geographical | Marketplace, Catalogue |
| Campaign Manager | Marketplace, Ad Type |
| Impact Analysis | Marketplace, Ad Type |
| Targeting Actions | Marketplace |
| Day Parting | Marketplace, Ad Type |
| History | Marketplace, Ad Type |
| Scheduled Jobs | Marketplace, Ad Type |
| Catalog | Marketplace, Account |
| All BI pages | Marketplace |

**Per-page page-level content (AppTaskbar children):**

| Page | Page Level Items |
|---|---|
| Prof. Dashboard | Date Range, Run |
| Prof. Trends | Search, Date Range, Metrics, Run, Export |
| Profit & Loss | Search, Date Range, Run, Export |
| Campaign Manager | Frequency, Date Range, Run |
| Impact Analysis | Baseline vs Impact periods, Metrics, Run |
| Targeting Actions | Action Type, Date Range, Priority, Fetch |
| Day Parting | Campaign selector, Metrics, Date Range, Run |
| History | Search |
| Scheduled Jobs | (empty — no page-level bar needed) |
| Catalog | Search, Date Range, Run |
| Brand SOV | Keyword search, Date Range, Position, Frequency, Run |
| Keyword/Product SOV, Competitor | (current children stay) |

### Phase 2: Redefine Table Toolbar Per Page

Strip each page's `DataTableToolbar` to ONLY the buttons specified:

| Page | Left | Right |
|---|---|---|
| Prof. Dashboard | Product/Orders, Search | Upload COGS, Delta, Filter, Column, Export |
| Prof. Trends | (none — no table toolbar, data viz has its own) | — |
| Profit & Loss | Product/Order, Search | Delta, Filter, Column, Export |
| Campaign Manager | Search | Create, Delta, Filter, Column, Export, Edit |
| Impact Analysis | Search | Filter, Column, Export |
| Targeting Actions | Search | Custom Bid, Create, Archive, Filter, Column, Export, Edit |
| Day Parting | Search (in campaigns table) | Create Rule (leftContent stays) |
| Scheduled Jobs | Search | Create Schedule |
| Catalog | — | Upload COGS, Delta, Filter, Column, Export |
| Brand SOV | Search | Delta, Export |
| Keyword SOV | Search | Delta, Export |
| Product SOV | Search | Delta, Export |
| Competitor | Search | Delta, Export |
| Keyword Tracker | Search | Create (Add Keyword), Delta, Export |

### Phase 3: Table/Chart Backgrounds + Column Pinning

**Backgrounds:**
- All `<div className="rounded-lg border border-border">` table wrappers → add `bg-card`
- All chart containers → add `bg-card` if not already

**Column Pinning:**
- Add pin icon to table column headers (small `Pin` icon on hover)
- Pinned columns get `sticky left-[offset]` with `z-10 bg-background`
- Track pinned columns in state per table
- Add to `DataTableToolbar` columns dropdown: pin toggle per column

### Phase 4: Data Visualization Toolbar for Trends

For Profitability Trends scatter chart, add a mini toolbar:
- Drag selector zoom, +, -, Reset, Full view
- Similar to ChartContainer expand pattern

Also for Profit & Loss top PnL table: add Frequency toggle (Daily/Weekly/Monthly)

---

### Files Summary

| File | Phase | Change |
|---|---|---|
| `AppLevelSelector.tsx` | 1 | **NEW** — Marketplace + page-specific selectors |
| `PageHeader.tsx` | 1 | Add `appLevelSelector` prop, layout change |
| `AppTaskbar.tsx` | 1 | Remove marketplace selector, remove showAdType |
| `Dashboard.tsx` (profitability) | 1,2 | Wire app level + page level + table toolbar |
| `Trends.tsx` | 1,2 | Wire app level + page level, add data viz toolbar |
| `ProfitLoss.tsx` | 1,2 | Wire app level + page level + frequency toggle + table toolbar |
| `Geographical.tsx` | 1,2 | Wire app level + page level + table toolbar |
| `CampaignManager.tsx` | 1,2 | Wire app level (marketplace+ad type) + page level (freq+date+run) + table toolbar |
| `ImpactAnalysis.tsx` | 1,2 | Wire app level + page level + table toolbar |
| `TargetingActions.tsx` | 1,2 | Wire app level + page level + table toolbar |
| `HourlyData.tsx` | 1,2 | Wire app level + page level + table toolbar |
| `History.tsx` | 1,2 | Wire app level + page level |
| `ScheduledJobs.tsx` | 1,2 | Wire app level + table toolbar |
| `Products.tsx` (catalog) | 1,2 | Wire app level + page level + table toolbar |
| `BrandSOV.tsx` | 1,2 | Wire app level + page level + table toolbar |
| `KeywordSOV.tsx` | 1,2 | Wire app level + table toolbar |
| `ProductSOV.tsx` | 1,2 | Wire app level + table toolbar |
| `CompetitorPricing.tsx` | 1,2 | Wire app level + table toolbar |
| `KeywordTracker.tsx` | 1,2 | Wire app level + table toolbar |
| `UnifiedPnL.tsx` | 1 | Wire app level |
| `DataTableToolbar.tsx` | 2 | No structural change, just per-page prop cleanup |
| All table wrappers | 3 | Add `bg-card` |
| Table column headers | 3 | Add pin feature (hover icon + sticky positioning) |

**Delivery:** Phase 1 + 2 together (app level + page level + table toolbar rewiring for all pages), then Phase 3 (backgrounds + column pinning).

