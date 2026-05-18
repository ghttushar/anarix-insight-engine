## Goal

Make the **trial-expired** state prominent (no underlying data visible) with a warm, human message — and give every trial state its own URL so each can be opened directly for Figma capture.

---

## 1. New component: `TrialExpiredState.tsx`

Full-card replacement (mirrors `DataSyncingState` structure, same min-height, same shimmer position) so the dashboard reads as a deliberate "paused" state, not a paywall.

**Visual**

- Same outer card: `rounded-lg border border-border bg-card p-12 min-h-[420px]`
- Reuses the taco illustration (continuity with sync state) — slight tilt, soft drop-shadow
- Headline (Satoshi 24px/600): *"Your taco's gone cold."*
- Sub (Noto 14px, muted, max-w-md): *"Your free trial wrapped up — your data is safe, just paused. Warm it back up whenever you're ready."*
- Two buttons centered, 12px gap:
  - Primary: **Reheat my plan** → `/website/pricing`
  - Secondary (ghost): **Talk to us first** → `/website/contact`
- Tiny meta line below buttons: *"Nothing's been deleted. Pick up exactly where you left off."*
- Top shimmer bar **removed** (sync uses motion to signal "working"; expired is intentionally still)
- Soft gradient halo behind the illustration using `brand.accent` at low opacity — calm, not loud

**Behavior**

- Renders inside Dashboard *instead of* `<TrialBanner /> + hero + table` block when `trial === "expired"` and billing flow is on
- Banner is no longer needed for the expired case (the whole screen becomes the message) — `TrialBanner` stays only as the lighter in-flow nudge for future states if needed; for now we'll remove its `expired` branch since the full-screen state replaces it

**Tone check (per §10.5)**: sanctioned quirky copy is allowed because this is part of the marketing/trial onboarding moment, same exception that covers the sync state.

---

## 2. Dashboard wiring (`src/pages/profitability/Dashboard.tsx`)

Replace the current `isSyncing ? <DataSyncingState/> : (...)` ternary with a single switch on `trial`:

```text
syncing  → <DataSyncingState />
expired  → <TrialExpiredState />
default  → existing hero + toolbar + table
```

`TrialBanner` is removed from this page (the full-screen expired state replaces it). No other dashboard logic changes.

---

## 3. Dedicated URLs for every trial state (for Figma capture)

Add a tiny dev-only route that forces a given trial state, so each screen is reachable by URL without waiting on timers.

**Route:** `/_state/:state` → sets `trial` via `useTrial().setTrial(state)` on mount, then redirects to `/profitability/dashboard`.

Resulting copy-paste URLs:

| State | URL |
|---|---|
| Fresh / no trial | `/_state/none` |
| Syncing overlay | `/_state/syncing` |
| Active trial | `/_state/active` |
| **Expired (new)** | `/_state/expired` |
| Paid | `/_state/paid` |

Gated behind `billingFlowEnabled` — if the toggle is off, the route just bounces to the dashboard untouched. Also excluded from sidebar/nav so it stays a hidden utility URL.

---

## 4. Files

**Create**
- `src/components/billing/TrialExpiredState.tsx`
- `src/pages/_dev/TrialStateRoute.tsx` (the `/_state/:state` setter)

**Modify**
- `src/pages/profitability/Dashboard.tsx` — switch render based on `trial`
- `src/App.tsx` — register `/_state/:state` route

**Untouched**
- `TrialContext.tsx`, `BillingFlowContext.tsx`, `DataSyncingState.tsx`, `TrialBanner.tsx` (kept for other surfaces), pricing/billing pages

---

## Open question

The auto-progress in `TrialContext` flips `active → expired` after 20s. Want me to keep that for the demo, or pause it so you can dwell on the expired screen in Figma without it bouncing? (URL route still forces state either way.)
