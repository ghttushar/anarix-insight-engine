
# Billing Flow + Pricing Redesign + Website Folder Extraction

Gated behind a new **Billing Flow** preference toggle (off by default), mirroring the existing New Branding toggle pattern.

---

## 1. Feature Toggle — `BillingFlowContext`

- New `src/contexts/BillingFlowContext.tsx` (clone of `BrandingContext`), key `anarix-billing-flow`, default `false`.
- Wire provider in `src/App.tsx` next to `BrandingProvider`.
- Add a **Billing Flow** switch row in `src/pages/settings/Preferences.tsx` directly under the New Branding row, same styling.
- All new UI/routes/redirects below are **only active when the toggle is on**. When off: app behaves exactly as today.

---

## 2. New-User Trial Journey (toggle ON)

Trial state stored in `localStorage` (`anarix-trial-state`: `none | active | expired | paid`) on a new `TrialContext`.

Flow:

1. **Website → Sign in** (`/website` "Sign In" CTA) → `/auth/login`.
2. **Login** → existing `clearAccounts()` → `/onboarding/connect` (unchanged).
3. **Connect account** → on completion set trial = `active`, redirect to `/profitability/dashboard`.
4. **Dashboard sync state** — when trial is `active` AND data is "syncing" (first 20s flag in localStorage), `Dashboard.tsx` renders a new `<DataSyncingState />` overlay card:
   - Centered illustration (reuse `src/assets/illustrations/taco.svg`)
   - Headline: "Grab a coffee while we grab your data."
   - Sub: "Don't wait for the biscuit — we're faster than that."
   - Subtle progress shimmer (no infinite loops longer than 240ms — respects motion rules)
5. After sync completes (simulated 20s), trial flips to `expired` via timer (demo only) → triggers a one-time toast + a persistent banner in `AppTaskbar`: **"Your free trial has ended. Upgrade your plan."** with `Upgrade` button.
6. `Upgrade` → `window.location.assign("/website/pricing")`.

---

## 3. Pricing Page Redesign — `src/website/pages/Pricing.tsx`

Full rewrite using new design system tokens (Periwinkle), inspired by Magnific's compact-card-then-detailed-table layout.

### Top controls
- **Monthly / Annually** toggle (existing component reused).
- Two persistent helper strips above plan grid:
  - **"Try all features free for a month"** → CTA `Start Free Trial` → `/auth/login`.
  - **"Need a custom plan for your agency?"** → CTA `Contact Us` → `/website/contact`.

### Major sections (tabs at top: `Advertising` | `Profitability`)

**1. Advertising**
- Sub-tab: **Self-Managed** → cards: `Growth`, `Premium`
- Sub-tab: **Expert-Managed** → cards: `Starter`, `Growth`, `Premium`

**2. Profitability**
- Cards: `Growth`, `Pro`, `Premium`

Each card: name, 1-line desc, price (monthly/annual), 4–6 bullets, primary CTA `Choose Plan`.

**Click any plan CTA** → set trial = `paid` → redirect to `/profitability/dashboard`.

### Below the cards
- **Detailed comparison table** per active section (full feature matrix), styled like Magnific's lower section.

Plan data lives in `src/website/data/pricingPlans.ts` (seeded from anarix.ai/pricing content with new naming).

---

## 4. In-App Billing Page

New route `/settings/billing` added to `AppLayout` and Settings sidebar (only visible when toggle ON).

`src/pages/settings/Billing.tsx` with two tabs:

### Tab 1 — Invoices
- Table: Date · Invoice # · Plan · Amount · Status · Actions (`View`, `Download PDF`)
- Mock data in `src/data/mockInvoices.ts`. View = right-side panel; Download = no-op toast.

### Tab 2 — Manage Plans
- **Current plan** card with `Edit Plan` (→ `/website/pricing` in new tab) and `Cancel Plan`.
- **Payment method** card: card on file, `Edit`, `Add new card` (modal), `Auto-renew` toggle.
- **Cancel Plan** → routes to hidden `/website/cancel-plan` page (see §5).

---

## 5. Hidden Cancel / Downgrade Flow (website)

Two new website pages, **not linked** in nav/footer/sitemap, only reachable via in-app redirect (entry validated by a `?from=app` query param + sessionStorage flag set before redirect):

- `src/website/pages/CancelPlan.tsx`
  - Heading: "Before you go…"
  - Two options: **Downgrade Plan** → `/website/downgrade-plan` · **Cancel Plan** → confirmation modal → returns to app with trial=`expired`.
  - Bottom helper: "Didn't find what you were looking for? Need a custom solution? **Contact us.**"
- `src/website/pages/DowngradePlan.tsx`
  - Lists lower tiers of the user's current section (Advertising or Profitability).
  - `Confirm Downgrade` → returns to app.

Routes registered in `App.tsx` but **excluded from `Navbar`, `Footer`, sitemap, and `robots.txt`**. Direct URL access without the session flag shows a "Page not found" state.

---

## 6. Website Folder Extraction (for handoff)

Goal: `src/website/` becomes a **self-contained** folder a developer can lift out.

Approach — keep the path `src/website/` (already isolated), but make it asset-independent:

- Create `src/website/assets/` and copy any shared resources currently imported from outside `src/website/`:
  - Logos (`anarix-full-dark.svg`, `anarix-full-light.svg`, `anarix-symbol.svg`, legacy logos)
  - Illustrations used on the site (e.g. `taco.svg`)
  - Any shared images
- Update **only website-side imports** to point at `src/website/assets/...`. App imports stay untouched (so nothing breaks).
- Create `src/website/components/ui/` with **copies** of the shadcn primitives the website uses (`button`, `input`, `label`, `switch`, etc.) and re-point website imports to the local copies. App keeps using `src/components/ui/`.
- Add `src/website/README.md` documenting: structure, how to extract, dependencies (React, react-router, framer-motion, tailwind, lucide-react), and the Tailwind tokens it relies on (copy of `tailwind.config.ts` + `index.css` website-scoped section provided as `src/website/tailwind.reference.ts` and `src/website/website.css` already exists).
- Verification: grep for any remaining `@/` imports inside `src/website/` that resolve outside the website folder; replace each with a local copy.

Result: the website folder can be copied out as a near-standalone module without any app file changing behavior.

---

## Technical Notes

- **Routing**: All new routes added to `src/App.tsx`. Hidden website routes guarded by a small `<HiddenRouteGuard from="app">` wrapper.
- **State**: `BillingFlowContext`, `TrialContext` — both localStorage-backed, follow `BrandingContext` pattern exactly.
- **Design tokens**: Pricing + Billing strictly use Periwinkle tokens; no new colors. Cancel/Downgrade pages use neutral palette (no destructive red except on final confirm).
- **Motion**: Sync overlay shimmer ≤ 240ms, fade-only. Page transitions follow §9 rules.
- **Tone**: Sync illustration copy is the only sanctioned playful line (per §10.5 — marketing/Aan only; this lives on Dashboard but is part of the marketing-style trial onboarding so will be wrapped in a comment noting the exception).
- **Toggle off** = current behavior preserved bit-for-bit. No new routes mounted, no new UI rendered, no context overhead.

---

## Files Created

```
src/contexts/BillingFlowContext.tsx
src/contexts/TrialContext.tsx
src/pages/settings/Billing.tsx
src/components/billing/DataSyncingState.tsx
src/components/billing/TrialBanner.tsx
src/components/billing/AddCardModal.tsx
src/components/billing/InvoiceViewPanel.tsx
src/data/mockInvoices.ts
src/website/data/pricingPlans.ts
src/website/pages/CancelPlan.tsx
src/website/pages/DowngradePlan.tsx
src/website/components/HiddenRouteGuard.tsx
src/website/assets/...           (copied shared assets)
src/website/components/ui/...    (copied shadcn primitives used by website)
src/website/README.md
```

## Files Modified

```
src/App.tsx                      (providers + routes, gated by toggle)
src/pages/settings/Preferences.tsx  (Billing Flow switch row)
src/website/pages/Pricing.tsx    (full redesign)
src/pages/profitability/Dashboard.tsx  (sync overlay when trial=active+syncing)
src/components/layout/AppTaskbar.tsx   (trial-expired banner slot)
src/components/layout/AppSidebar.tsx   (Billing entry under Settings, gated)
src/website/components/Navbar.tsx + Footer.tsx  (no link to hidden pages)
public/robots.txt                (disallow /website/cancel-plan, /website/downgrade-plan)
```

---

## Open Questions

1. **Trial duration in demo** — 20 seconds simulated, or a button in Preferences to "Force trial expired" for demoing? (I'd recommend both.)
2. **Pricing numbers** — should I scrape the live anarix.ai/pricing prices, or use placeholder pricing you'll fill in later?
3. **GitHub folder request** — confirm "create a folder in my github repo" means restructuring `src/website/` into a self-contained module *inside the same repo* (what this plan does), and **not** creating a separate repository.
