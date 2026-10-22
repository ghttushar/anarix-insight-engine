# Under Maintenance — button, page, and global takeover

## What we're building

Two ways to reach a brand-new, full-screen **Under Maintenance** page, added to the existing
Billing Flow section in Preferences (Settings → Appearance):

1. **Demo button** — "Preview maintenance page": opens `/maintenance` as a standalone full-screen page.
2. **Maintenance mode toggle** — when on, the entire app (every route) is replaced by the
   maintenance screen until you turn it off.

The Start sync / Force expired buttons stay exactly as they are. The maintenance screen does
**not** reuse the taco illustrations or the sync/expired overlay designs — it gets its own
flat-vector, quirky-but-professional identity.

## Files

| File | Change |
|---|---|
| `frontend/src/contexts/MaintenanceContext.tsx` | NEW — `maintenanceMode` boolean, persisted to localStorage (`anarix-maintenance-mode`), same pattern as `BillingFlowContext`. |
| `frontend/src/pages/system/UnderMaintenance.tsx` | NEW — the full-screen maintenance page. |
| `frontend/src/App.tsx` | Add `/maintenance` standalone route + wrap the router in a `MaintenanceGate` that renders the maintenance screen over all routes when `maintenanceMode` is on. |
| `frontend/src/pages/settings/Preferences.tsx` | In the Billing Flow card, add a "Maintenance mode" row with the toggle and a "Preview maintenance page" outline button. |

## Under Maintenance page design

- **Full screen, standalone** (no sidebar, no taskbar, no Floating Action Island). Route lives
  outside `AppLayout`, like `/login`.
- **Flat vector illustration, hand-built inline SVG** — no images, no gradients outside the
  token system. Scene: a flat workbench scene with the Anarix palette — a large gear set
  slowly rotating, a wrench mid-turn, a floating "work in progress" blueprint card, and a
  small Aan mascot silhouette holding a clipboard. Colors come from existing semantic tokens
  (`--primary`, `--muted`, `--border`, `--foreground`) so it adapts to light/dark automatically.
- **Quirky, funny, professional copy** (sentence rule: ≤16 words, active voice):
  - Headline: "We're under the hood."
  - Sub: "Anarix is getting a tune-up. Everything is safe, and we'll be back before your coffee cools."
  - Rotating status ticker (dry humor): "Oiling the data pipelines…", "Telling Aan to stretch its legs…", "Recounting your pennies — twice…", "Aligning the profit stars…", "Dusting off the servers (they sneeze)…"
  - ETA chip: "Usually back in ~30 minutes" (static demo value, no fake live countdown logic beyond the ticker).
- **Dynamic behavior** (restrained, no loop spam outside the illustration):
  - Gears rotate slowly; the wrench turns with a gentle ease loop; ticker cross-fades every ~2.4s (reuses the `fadeInOut`-style pattern, `prefers-reduced-motion` respected).
  - Small live clock chip ("We started at 14:25 UTC") rendered from `Date` — feels dynamic without pretending to be real progress.
- **Exit affordance**: a quiet ghost button, "Turn off maintenance mode", bottom of the page —
  calls `setMaintenanceMode(false)` and navigates back. On the demo route it reads "Back to Anarix".
  This is the only control, so you can never get stuck behind the takeover.

## Behavior details

- **Demo route** `/maintenance` is always reachable from the preview button regardless of the toggle state.
- **Global takeover**: `MaintenanceGate` sits above the router in `App.tsx` — when
  `maintenanceMode` is on, every route (including settings) renders the maintenance screen.
  The page's "Turn off maintenance mode" button is the exit.
- Toggle and button sit in the Billing Flow card below the existing Trial state row, labeled:
  - Row: "Maintenance mode — Replace the entire app with the under-maintenance screen."
  - Button: "Preview maintenance page — Opens the /maintenance screen as a standalone page."

## Verification

- Playwright: open `/settings/appearance`, click preview button → `/maintenance` renders full-screen, exit returns to app.
- Toggle maintenance mode on → any route (`/profitability/dashboard`) shows the maintenance screen; turn off from the page → app returns.
- Light and dark mode both render correctly (token-driven, no hardcoded colors).
- Build passes (`build-errors.log` clean).
