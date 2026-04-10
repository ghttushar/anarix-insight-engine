

## Delete and Recreate Component Library + Design System from Scratch + Remove Footer Breadcrumbs + Add Independent Routes

### Scope: 3 Major Workstreams

---

### Workstream 1: Remove PageFooterBar from ALL 43 pages

Every page currently renders `<PageFooterBar breadcrumbItems={...} />`. Remove this line and the corresponding import from all 43 files:

**Advertising (13):** CampaignManager, CampaignDetail, AdGroupDetail, ProductAdDetail, ImpactAnalysis, TargetingActions, BudgetPacing, SearchHarvesting, AnomalyAlerts, CreativeAnalyzer, RuleAgents, RuleCreation, AppliedRules

**Profitability (5):** Dashboard, Trends, ProfitLoss, Geographical, UnifiedPnL

**AMC (6):** Queries, ExecutedQueries, Schedules, Audiences, CreatedAudiences, Instances

**BI (5):** BrandSOV, KeywordTracker, KeywordSOV, ProductSOV, CompetitorPricing

**Catalog (2):** Products, InventoryAds

**Workspace (2):** Dashboard, HealthScore

**Day Parting (1):** HourlyData

**Reports (1):** ClientPortal

**Settings (7):** Preferences, Accounts, ConnectAmazon, ConnectWalmart, Team, System, ComponentLibrary, DesignSystem

Also delete `src/components/layout/PageFooterBar.tsx` entirely.

---

### Workstream 2: Delete and Recreate Design System (`src/pages/settings/DesignSystem.tsx`)

Delete entire file (~1997 lines) and rewrite from scratch with these tabs:

**Tab 1 — Colors**
- Periwinkle System 01 light + dark palettes with correct hex values
- Muted data viz colors: Success `#1E9E4F`, Destructive `#C93535`, Warning `#C98A14`
- Aan AI gradient spec
- Reserved color rules

**Tab 2 — Typography**
- Satoshi Variable (headings), Noto Sans (body)
- Type scale (H1 32px → Meta 12px)
- Weight and usage rules

**Tab 3 — Spacing**
- 4px base unit scale
- Component padding rules
- Layout gap standards

**Tab 4 — Icons**
- Full Lucide icon grid organized by category: Navigation, Actions, Data, System, Status, Marketplace
- All icons currently used in the app including: Bell, Play, Sparkles, Lightbulb, Layers, Target, Percent, Package, ShoppingCart, DollarSign, RefreshCw, Activity, Gauge, Wheat, FlaskConical, ShieldCheck, PackageCheck, PanelLeft, LayoutDashboard
- Sizing rules (16/20/24px) and color inheritance

**Tab 5 — Components**
- Buttons (Primary, Secondary, Destructive, Ghost — all states)
- Inputs (Text, Select, Checkbox, Switch, Radio — all states)
- Badges (StatusBadge, DeltaBadge, Chip)
- Cards (KPICard, standard Card)
- Tables (header, rows, pagination)
- Alerts and Toasts

**Tab 6 — States**
- Interactive state examples: Default, Hover, Active, Disabled, Loading, Error, Focus
- Applied to buttons, inputs, selects, switches, table rows

**Tab 7 — Layout**
- AppTaskbar 2-row anatomy
- Sidebar expanded/collapsed patterns
- Right-side panel structure
- Floating Action Island anatomy
- Page structure hierarchy

---

### Workstream 3: Delete and Recreate Component Library (`src/pages/settings/ComponentLibrary.tsx`)

Delete entire file (~3297 lines) and rewrite from scratch with systematic sections, each with an independent route anchor. Organized by application area:

**Section 1 — Foundation Primitives**
- Typography specimens
- Button matrix (all variants × all states)
- Form controls (Input, Select, Textarea, Checkbox, Switch, Radio, Slider)
- Badge/Chip/StatusBadge/DeltaBadge
- Alert variants
- Loading skeletons (Table, Card, Chart, Metric)

**Section 2 — Navigation**
- AppSidebar (expanded state with all groups)
- MiniSidebar (collapsed icon-only state)
- SidebarHoverPopup anatomy
- MarketplaceSelector (expanded + collapsed)
- PageBreadcrumb
- Floating Action Island (collapsed + expanded)

**Section 3 — AppTaskbar**
- Full 2-row layout anatomy
- Row 1: Breadcrumb + Marketplace/Account info
- Row 2: Filters + Island-off actions
- Panel-collapsed variant (icon-only actions)

**Section 4 — Data Tables**
- DataTableToolbar anatomy (search, columns, filters, sort, upload, download)
- SortableTableHead with Pin states (hidden, hover, active, highlight)
- TablePagination
- UnderlineTabs
- Sample table with all column types

**Section 5 — Cards & KPIs**
- KPICard single
- KPICardsRow (multi-card strip)
- InlineKPIStrip
- ProfitabilityHeroCard (5-card selectable grid, 6 metrics, 220px chart)

**Section 6 — Charts**
- ChartContainer anatomy
- PerformanceChart
- MetricSelector

**Section 7 — Right-Side Panels (ALL)**
- CreateCampaignPanel anatomy
- CreateReportPanel anatomy
- CreateSchedulePanel anatomy
- ProductDetailPanel anatomy
- PeriodBreakdownPanel anatomy
- CampaignSettingsPanel anatomy
- AdGroupSettingsPanel anatomy

**Section 8 — Aan AI Components**
- AanLogo variants
- ArtifactCard
- AanInput
- AanConversation anatomy
- AanWorkspaceSidebar anatomy
- AI gradient usage examples

**Section 9 — Modals & Dialogs**
- COGSEditModal anatomy
- ProductTrendsModal anatomy
- CreateCampaignModal anatomy
- AddKeywordTargetModal anatomy
- AddProductAdsModal anatomy

**Section 10 — Page-Level Patterns**
- Complete page anatomy (Header → Taskbar → Content → Table)
- Tab group patterns (Campaign Manager tabs, Impact Analysis tabs, Day Parting tabs)

---

### Workstream 4: Independent Routes

Add routes in `App.tsx` for direct-linking to specific UI states:

| Route | Purpose |
|---|---|
| `/settings/design-system` | Already exists |
| `/settings/component-library` | Already exists |
| `/settings/component-library/navigation` | Section anchor |
| `/settings/component-library/taskbar` | Section anchor |
| `/settings/component-library/tables` | Section anchor |
| `/settings/component-library/cards` | Section anchor |
| `/settings/component-library/panels` | Section anchor |
| `/settings/component-library/aan` | Section anchor |
| `/settings/component-library/modals` | Section anchor |
| `/settings/component-library/charts` | Section anchor |

Implementation: Use URL hash anchors (`#navigation`, `#taskbar`, etc.) with `useSearchParams` or `useLocation().hash` to auto-scroll to the correct section. This avoids creating 10+ separate route entries — a single route with hash navigation.

---

### Files Summary

| Action | Files | Count |
|---|---|---|
| Delete | `PageFooterBar.tsx` | 1 |
| Edit (remove footer) | All 43 page files | 43 |
| Delete + Recreate | `DesignSystem.tsx` | 1 |
| Delete + Recreate | `ComponentLibrary.tsx` | 1 |
| **Total** | | **46 files** |

### Implementation Order
1. Remove PageFooterBar from all 43 pages + delete the component
2. Recreate DesignSystem.tsx (~800 lines)
3. Recreate ComponentLibrary.tsx (~2500 lines)
4. Add hash-based section navigation to ComponentLibrary

