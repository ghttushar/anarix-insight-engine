# Anarix UI — Migration Manifest

**Repository B (this repo) = visual source of truth.**
**Repository A (`anarix-ui-old`) = engineering source of truth** (auth, API contracts, state, security, conventions).

This document exists so another AI/engineer can map this redesigned UI onto Repository A **without changing how anything looks or behaves**.

> Rule for the migrating agent: port *markup, styles, tokens, interactions* from here. Port *data access, auth, routing guards, error handling, security* from Repository A. Where the two disagree on naming, Repository A wins for engineering identifiers; Repository B wins for anything the user can see.

---

## 1. What this repo is

- Stack: React 18 + Vite 5 + TypeScript 5 + Tailwind CSS 3 + shadcn/ui + Recharts + React Router 6 + TanStack Query (provider only).
- Root is a workspace wrapper; the actual app lives in **`frontend/`**.
- **No backend.** Every screen is driven by fixtures in `frontend/src/data/mock*.ts`. There are zero network calls to a product API.
- Desktop-only. Tablet/mobile shells, gesture layer, tutorial layer, and "Living OS" concept explorations were removed during migration prep (see §9).

### Directory map

| Path | Purpose |
| --- | --- |
| `frontend/src/App.tsx` | Route table + provider tree (single source of routing truth) |
| `frontend/src/pages/**` | Screens, one folder per product module |
| `frontend/src/components/**` | Feature components, grouped by module |
| `frontend/src/components/ui/**` | shadcn primitives (unmodified upstream, safe to drop if A already has them) |
| `frontend/src/contexts/**` | React context providers (client-side only state) |
| `frontend/src/state/**` | Signals decision store + selection store |
| `frontend/src/features/creative/**` | Ambient UI: command palette, keyboard nav, floating action island |
| `frontend/src/data/**` | Mock fixtures — **all of this is replaced by Repository A's API layer** |
| `frontend/src/lib/**` | Pure helpers: decision lifecycle, grouping, validation, constants |
| `frontend/src/pages/website/**` + `components/website/**` | Public marketing site — **out of scope for app migration** |

---

## 2. Feature inventory

| # | Feature | Screens | Key components | Data source today | Repo A dependency needed |
| --- | --- | --- | --- | --- | --- |
| F1 | **Signals** (decision inbox, formerly "Alerts") | `/alerts/:viewMode` | `pages/SignalsPage.tsx`, `components/signals/**` (48 files) | `data/mockDecisions.ts`, `mockMeetings.ts`, `mockQuestions.ts`, `criticalOnlyDecision.ts` | New endpoints — see §6 `NEW_FEATURE` |
| F2 | **Profitability** | `/profitability/{dashboard,trends,pnl,geo,unified-pnl}` | `components/profitability/**` | `mockProfitability.ts`, `mockUnifiedPnL.ts` | Existing P&L / order APIs in A |
| F3 | **Advertising** | `/advertising/**` (campaigns → ad groups → product ads, impact, targeting, budget pacing, search harvesting, anomaly alerts, creative analyzer) | `components/advertising/**`, `components/tables/**` | `mockCampaigns.ts`, `mockAdGroups.ts`, `mockProductAds.ts`, `mockImpactData.ts`, … | Existing campaign APIs in A |
| F4 | **Rules & Agents** | `/advertising/rules/{agents,applied,create,edit}` | `components/advertising/rules*` | `mockRules.ts`, `mockRuleBuilder.ts` | Existing automation APIs in A |
| F5 | **Catalog** | `/catalog/{products,inventory-ads}` | `components/catalog/**` | `mockCatalog.ts`, `mockInventoryAds.ts` | Existing catalog APIs |
| F6 | **Business Intelligence** | `/bi/{brand-sov,keyword-tracker,keyword-sov,product-sov,competitor-pricing}` | `components/bi/**` | `mockBrandSOV.ts`, `mockKeywords.ts`, `mockCompetitorPricing.ts` | Existing SOV APIs |
| F7 | **AMC** | `/amc/**` | inline in pages | `mockAMC.ts` | Existing AMC APIs |
| F8 | **Day Parting** | `/dayparting/**` | `components/dayparting/**` | `mockDayParting.ts` | Existing hourly APIs |
| F9 | **Aan (AI assistant)** | `/aan`, `/aan/feed`, `/aan/policies` + side panel everywhere | `components/aan/**` | `mockAanFeed.ts`, `mockAanScenarios.ts`, `mockAanPolicies.ts`, `mockWorkspaceCorpus.ts` | LLM gateway — `NEW_FEATURE` |
| F10 | **Reports / Client Portal** | `/reports/client-portal` | inline | `mockClientReports.ts` | Existing reporting APIs |
| F11 | **Workspace / Sandbox dashboards** | `/workspace`, `/workspace/:dashboardId`, `/workspace/health-score` | `components/workspace/**` | `mockHealthScore.ts` | `NEW_FEATURE` (drag-and-drop canvas) |
| F12 | **Settings & Onboarding** | `/settings/**`, `/onboarding/connect`, `/login` | `components/settings`, `components/integrations`, `components/billing` | `mockInvoices.ts` | Existing auth/billing/integrations in A |
| F13 | **Panel deep links** | `/panels/**` | `pages/panels/**` | reuses panel components | Presentation-only; optional |
| F14 | **Marketing website** | `/website/**` | `pages/website/**` | static copy | Out of scope |

---

## 3. Screen inventory

Full route table is generated from `frontend/src/App.tsx`; the machine-readable copy lives in `migration-map.json` under `routes`. Notes on non-obvious routes:

- `/signals` and `/signals/*` redirect to `/alerts/*`. The **URL is still `/alerts`; the product name in UI copy is "Signals."** Renaming the path is a Repo A decision.
- `/alerts` redirects to `/alerts/stack`. `:viewMode` currently accepts `stack`.
- `/dayparting/*` sub-paths redirect into the single `HourlyData` screen.
- `/panels/*` render panels standalone (used for design export / deep links). Safe to omit in production.
- `/website/*` is the marketing site; if Repo A serves marketing separately, delete this subtree during merge.

---

## 4. Component inventory

Counts by folder (details in `migration-map.json` → `components`):

| Folder | Files | Migration note |
| --- | --- | --- |
| `components/ui` | 55 | Stock shadcn/ui. If A already has shadcn, keep A's copies and only port token/CSS-variable values. |
| `components/signals` | 48 | Highest-value, fully NEW. Port wholesale. |
| `components/advertising` | 21 | Maps to A's campaign screens. |
| `components/profitability` | 17 | Maps to A's P&L screens. |
| `components/tables` | 15 | Shared data-table system (filters, column visibility, pagination, pinning). Port as a unit — most screens depend on it. |
| `components/aan` | 16 | AI panel, conversation, artifacts, presence. |
| `components/layout` | 10 | `AppLayout`, `AppSidebar`, `AppTaskbar`, `MiniSidebar`, breadcrumbs. **Merge target: A's shell.** |
| `features/creative` | 13 | Command palette, keyboard nav, floating action island, ambient effects. Optional. |
| `components/{bi,billing,branding,cards,catalog,charts,dayparting,insights,integrations,notifications,panels,settings,shortcuts,status,workspace}` | 1–8 each | Module-local. |

### Naming already normalized in this repo

| Old | New | Reason |
| --- | --- | --- |
| `pages/Alerts.tsx` | `pages/SignalsPage.tsx` | Product name is Signals |
| `components/actions/**` | `components/signals/**` | "actions" was ambiguous |
| `state/actionsStore.tsx` | `state/signalsStore.tsx` | ditto |
| `state/selectionStore.tsx` | `state/signalSelectionStore.tsx` | scope clarity |
| `AlertDetailPanel` | `SignalDetailPanel` | consistency |
| `AlertsToolbar` | `SignalsToolbar` | consistency |
| `ExpandedAlertBody` | `ExpandedSignalBody` | consistency |

---

## 5. Navigation map

```text
AppLayout (SidebarProvider)
├── AppSidebar            marketplace switcher + module nav + user/settings menu
├── AppTaskbar            breadcrumbs, date range, marketplace, run button, utility cluster
│                         (returns null on /alerts — Signals owns its own chrome)
├── <page content>
├── FloatingActionIsland  Insights · Signals · Aan · Refresh · Export · Screenshot · Theme
│                         when disabled, these move into AppTaskbar's utility cluster
└── Aan side panel        global right-side panel (or inline "main" mode, see §7)
```

Module order in the sidebar: Profitability → Advertising → Rules → Catalog → AMC → Business Intelligence → Day Parting. Settings and profile live in the sidebar footer menu.

---

## 6. User flows

**Signals decision lifecycle (core new flow)**

```text
Needs You → Review → Choose strategy → Execute → Undo window (5s) → Aan executing → Completed → History
```

1. Left rail lists categories (all collapsed by default, single-open accordion).
2. Middle column lists signals for the active category/tab (`All`, `From Meetings`, `FYI`, `Done`).
3. Right column is the review workspace: Title → Current state → Why it matters → Evidence → **Choose your strategy** → collapsed *Related signals* / *Execution plan*.
4. Execute swaps the primary button for a completion + Undo card with a 5s countdown, then auto-closes.
5. `Modify`, `Notify vendor manager`, `Draft support ticket` open Aan — either as the side panel (`side` mode) or inline in the right column (`main` mode).

Other flows: login → connect accounts → dashboard; campaign drill-down (campaign → ad group → product ad); rule creation wizard; report generation.

**NEW_FEATURE (no equivalent in Repository A — needs new backend):**
`NEW_FEATURE:signals` · `NEW_FEATURE:aan-assistant` · `NEW_FEATURE:meeting-derived-actions` · `NEW_FEATURE:workspace-canvas` · `NEW_FEATURE:health-score` · `NEW_FEATURE:unified-pnl` · `NEW_FEATURE:creative-analyzer`

---

## 7. State & providers

Provider order in `App.tsx` (outermost → innermost):

`QueryClientProvider → ThemeProvider → ColorSchemeProvider → CurrencyProvider → AccountProvider → IntegrationsProvider → MarketplaceProvider → FilterProvider → ActivePanelProvider → AanProvider → AanEventsProvider → AanPanelProvider → InsightsProvider → VisualEffectsProvider → FeatureToggleProvider → BrandingProvider → BillingFlowProvider → TrialProvider → TooltipProvider → BrowserRouter → CreativeFeatures`

| Provider | Owns | Persisted | Migration note |
| --- | --- | --- | --- |
| `ThemeContext` / `ColorSchemeContext` | light/dark + palette | localStorage | Map to A's theme store |
| `MarketplaceContext` | Amazon/Walmart/Shopify/TikTok selection | localStorage | **Must be wired to A's account scoping** |
| `AccountContext`, `IntegrationsContext` | connected accounts (mock) | localStorage | **Replace with A's real account APIs** |
| `FilterContext` | table filter rules | memory | Reuse A's filter model if present |
| `AanContext`, `AanEventsContext`, `AanPanelContext` | assistant mode, live-mode toggle, side/main panel | localStorage | New |
| `state/signalsStore.tsx` | decision list + lifecycle transitions | memory | **Replace with server state (TanStack Query)** |
| `state/signalSelectionStore.tsx` | multi-select in the signals queue | memory | Keep client-side |
| `TrialContext`, `BillingFlowContext`, `BrandingContext`, `FeatureToggleContext`, `VisualEffectsContext` | demo toggles | localStorage | Demo-only; drop or map to A's flags |

`AanPanelContext` exposes the **AI Panel** preference (`side` \| `main`), toggled in Settings → Aan Triggers. In `main` mode, email compose and draft chat render inline inside the signal review card instead of opening the side panel.

---

## 8. Design system (do not alter)

- Theme: **Periwinkle System 01**. All colors are CSS variables in `frontend/src/index.css` + `tailwind.config.ts`; components use semantic tokens only.
- Type: Satoshi Variable (headings), Noto Sans (body, min 14px), Allura (Aan accents only).
- Density: table-first, `whitespace-nowrap`, 44px rows, sticky first column, fixed header.
- No backdrop blur, no right-edge shadows, no gradients outside Aan surfaces.
- Motion: `cubic-bezier(0.2,0,0,1)`, 120–240ms, opacity/≤8px translate only.

When merging into A, port `index.css` variables and `tailwind.config.ts` **before** porting components, otherwise every screen will look wrong.

---

## 9. Removed during migration prep

Deleted because they were demo/exploration scaffolding, not production surfaces: `livingos/**`, `pages/livingos/**`, `views/mobile/**`, `views/tablet/**`, `components/gestures/**`, `features/tutorial/**`, `pages/brand/**`, `pages/_dev/**`, `contexts/{Viewport,Density,Gesture}Context`, `settings/DesignSystem`, `settings/ComponentLibrary`, `layout/ViewBadge`, and their routes, nav entries, preference toggles, and CSS.

`hooks/useIsReadOnly.ts` is retained but now always returns `false` (was mobile-only read-only gating). Call sites are unchanged so A can re-point it at a real permission check.

---

## 10. Recommended merge order

1. Design tokens: `index.css`, `tailwind.config.ts`, fonts.
2. `components/ui` reconciliation (keep A's shadcn, align token values).
3. Shell: `components/layout/**` merged into A's shell + navigation.
4. Shared tables: `components/tables/**`.
5. Module screens that already exist in A: Profitability → Advertising → Catalog → BI → AMC → Day Parting (swap mocks for A's API hooks one screen at a time).
6. New features last: Signals, Aan, Workspace canvas, Health Score.
7. Delete `frontend/src/data/mock*.ts` only after every consumer is on real data.

---

## 11. Machine-readable map

See `migration-map.json` (routes, features, components, providers, mocks, new-feature tags).
