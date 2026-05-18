## Goal

1. Make the **syncing** and **expired** trial states appear on every page reachable from the left sidebar (Workspace, Profitability, Advertising, Rules, Catalog, AMC, Business Intelligence, Day Parting, Reports), not just the Profitability Dashboard.
2. Give each (state × page) combination its own stable URL that stays in the browser address bar, so Figma's "Link to design" plugin can target each one individually.
3. Exclude profile-area pages: `/settings/*`, `/login`, `/onboarding/*`, `/aan`, `/website/*`, `/brand/*`.

## Why current setup fails the URL requirement

- `/_state/:state` pins the trial state but only ever renders `ProfitabilityDashboard`. Every other page (Campaign Manager, Trends, etc.) has no dedicated URL for syncing/expired.
- There is no mechanism that keeps the URL stable while showing the syncing/expired overlay on, say, `/advertising/campaigns`.

## Approach

### 1. Centralize the overlay in `AppLayout`

Add a `<TrialStateGate>` inside `src/components/layout/AppLayout.tsx` that wraps `{children}`. It reads `useTrial()` and `useBillingFlow()`. When `billingFlowEnabled && trial === "syncing"` it renders `<DataSyncingState />` in place of children. When `trial === "expired"` it renders `<TrialExpiredState />`. Otherwise it renders `{children}` untouched.

Since every nav-bar page already wraps its content in `<AppLayout>`, this single change makes both states appear on every page automatically. No per-page edits.

Exclusion is automatic: `/settings/*`, `/aan`, `/website/*`, `/login`, `/onboarding/*`, and `/brand/*` either do not use `AppLayout` or are excluded by the existing `billingFlowEnabled` flag scope. (Verify by reading the excluded pages; the Aan workspace and website have their own layouts.)

### 2. Per-page stable URLs via a wildcard state route

Replace the current `/_state/:state` route with `/_state/:state/*`. The new `TrialStateRoute`:

- Pins `trial` to `:state` on every render (defeating the auto-progress timer in `TrialContext`, same trick as today).
- Renders a nested `<Routes>` block that mirrors the real app routes but **without changing the URL**. The inner Routes match against the wildcard portion (e.g. `advertising/campaigns`) and render the same page component the real route would.

Result: URLs like
- `/_state/syncing/profitability/dashboard`
- `/_state/expired/advertising/campaigns`
- `/_state/syncing/bi/keyword-tracker`
- `/_state/expired/reports/client-portal`

…all stay in the address bar, render the correct page inside `AppLayout`, and `AppLayout`'s `TrialStateGate` shows the syncing or expired overlay on top.

### 3. Keep the existing short routes working

Continue to support `/_state/:state` (no page) → redirect to `/_state/:state/profitability/dashboard` so existing Figma links keep working.

### 4. Build URL list

Generate a small helper in `src/pages/_dev/trialStatePages.ts` listing every nav-bar page (read from `navigationGroups` in `AppSidebar.tsx`) so the dev route can also expose a printable index (optional, for convenience). Not required for the URLs to work — they work purely via the wildcard.

## Files

**Edit**
- `src/components/layout/AppLayout.tsx` — add `TrialStateGate` wrapping `{children}` inside `<main>`. Imports: `useTrial`, `useBillingFlow`, `DataSyncingState`, `TrialExpiredState`.
- `src/pages/_dev/TrialStateRoute.tsx` — switch to wildcard rendering; nested `<Routes>` mirroring every left-nav route (Workspace, Profitability, Advertising incl. Rules, Catalog, AMC, BI, Day Parting, Reports). Pin trial state on every render.
- `src/App.tsx` — change `/_state/:state` route to `/_state/:state/*`. Add a redirect from `/_state/:state` (exact) → `/_state/:state/profitability/dashboard`.
- `src/pages/profitability/Dashboard.tsx` — remove the now-redundant inline `isSyncing ? <DataSyncingState /> : isExpired ? <TrialExpiredState /> : (...)` branch since `AppLayout` handles it globally. Keep `TrialBanner` for the `active` (non-expired trial) state if it lives there today.

**Create**
- (optional) `src/pages/_dev/trialStatePages.ts` — array of `{ label, path }` for every left-nav page, derived from `navigationGroups`.

## Technical notes

- `TrialStateGate` must render the overlay inside the same `<main>` container so the sidebar stays visible — this matches existing behavior on the Dashboard.
- The overlay components (`DataSyncingState`, `TrialExpiredState`) currently return `null` unless `billingFlowEnabled && trial === <their state>`. Keep that guard; the gate just decides whether to pass `children` or the overlay.
- The wildcard `/_state/:state/*` route renders `<AppLayout>` once via each nested page component (every page already wraps itself in `AppLayout`), so no double layout.
- React Router v6 nested `<Routes>` under a `*` parent works as long as paths inside are relative (no leading `/`).

## URL examples after the change

| Page | Syncing | Expired |
|---|---|---|
| Profitability Dashboard | `/_state/syncing/profitability/dashboard` | `/_state/expired/profitability/dashboard` |
| Campaign Manager | `/_state/syncing/advertising/campaigns` | `/_state/expired/advertising/campaigns` |
| Keyword Tracker | `/_state/syncing/bi/keyword-tracker` | `/_state/expired/bi/keyword-tracker` |
| Automated Reports | `/_state/syncing/reports/client-portal` | `/_state/expired/reports/client-portal` |
| Health Score | `/_state/syncing/workspace/health-score` | `/_state/expired/workspace/health-score` |
| Day Parting | `/_state/syncing/dayparting` | `/_state/expired/dayparting` |

All 9 left-nav groups × 2 states covered.

## Out of scope

- Settings pages (Preferences, Accounts, Integrations, Team, System, Design System, Component Library, Billing) — explicitly excluded per request.
- Aan workspace, marketing website, login, onboarding, brand showcase — not in the left nav.
