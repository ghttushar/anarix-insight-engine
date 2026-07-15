
## Goal
Rebrand the /alerts experience as **Signals**, put the multi-strategy picker front-and-center in the right-side expanded view, and reduce visual noise in the left column with clearer, smarter categorization.

(Note: this turn's request is a UI/UX pass on the current Alerts page. GitHub resync is handled by Lovable's built-in sync — no code action needed on our side. I will fix any residual broken imports found while implementing.)

## 1. Rename Alerts → Signals (labels only, routes unchanged)
- `AppTaskbar` breadcrumb: "Alerts" → "Signals".
- `GreetingHeader` / page title copy → "Signals".
- Toolbar search placeholder → "Search signals, meetings, decisions…".
- Empty-state copy updated ("No signals need you right now.").
- Sidebar/nav label wherever "Alerts" appears (search & update in `AppSidebar` / nav registry).
- Route path `/alerts` stays (avoid breaking deep links). Add copy-only redirect note; no router changes.

## 2. Right column — highlight multi-strategy picker
Rework `ReviewWorkspace` + `DetailsPage` so strategies are the visual anchor:
- Promote **StrategyPicker** to the top of the right pane (above narrative), inside a subtle bordered "Choose your strategy" section with:
  - Section eyebrow "Strategy" + count ("3 options · 1 recommended").
  - Recommended card gets a soft primary gradient ring, `Sparkles` badge, and a persistent "Recommended" tag.
  - Selected card: primary border + `ring-2 ring-primary/40` + inner check.
  - Each card shows: title, one-line detail, value chip, confidence, risk, reversibility, execution time (already present — restyled for scan-ability, larger tap target, 12px inner padding).
  - Alternatives collapse into a "Show 2 alternatives" toggle when >2 to reduce noise.
- Footer CTA relabeled to reflect selection: **"Execute: {strategy title}"** with keyboard hint `⏎`.
- Add a compact strategy-summary chip in the sticky header (name + value delta) so the choice stays visible while scrolling.
- Remove the 3-page carousel indicator's dominance: keep pages, but make Summary/Metrics collapsible sub-sections under Details so Strategy is always visible first. (Carousel arrows kept for keyboard users.)

## 3. Left column — reduce cognitive load & better categorization
`AlertsToolbar`, `CategorySection`, `Alerts.tsx`:
- **Tabs slimmed** to 4 with clearer intent labels:
  - `Needs you` (was All active + judgment)
  - `From meetings`
  - `FYI`
  - `Done`
  Counts styled as muted pills; active tab uses underline instead of pill background for calmer look.
- **Category headers redesigned**: bigger tap target, icon per category (Advertising = Megaphone, Inventory = Package, Profitability = TrendingUp, CS = MessageCircle, Buyer = Users, Retail = Tag, Meetings buckets = Calendar, FYI = Sparkles). Aggregate value shown right-aligned ("+ $12.4k impact · 6 items").
- **Sticky category rail**: a thin left-side vertical index (Amazon · Walmart · Internal · …) that lets users jump between sections; auto-highlights current section on scroll.
- **Density defaults to compact**; card visual weight reduced:
  - Remove severity dots and duplicate meta rows (already partially done — enforce).
  - Use single-line title + one-line context; chips wrap to a second row only on hover/expand.
  - Row hover reveals quick actions (Approve · Snooze · Open) instead of always-visible.
- **Progressive disclosure**: each category collapses to top 5 by importance; "Show N more" reveals the rest. Automated + This-Week-Pending sections start collapsed.
- Ambient background dimmed (opacity 40 → 25) and dotted grid removed to cut visual chatter.
- Search input moved to be full-width across the top of the left column so it's obviously scoped to the queue.

## 4. Cleanup / broken code
- Sweep for any lingering `LivingOS` / `viewMode` refs and stale imports flagged in the earlier QA note.
- Verify `AlertDetailPanel` is only mounted once (it currently renders alongside `ReviewWorkspace` — remove the redundant panel from `Alerts.tsx`).
- Type-check with `tsgo` and load `/alerts` via Playwright to confirm no runtime errors.

## Files touched (approx.)
- `frontend/src/pages/Alerts.tsx`
- `frontend/src/components/actions/AlertsToolbar.tsx`
- `frontend/src/components/actions/CategorySection.tsx`
- `frontend/src/components/actions/GreetingHeader.tsx`
- `frontend/src/components/actions/ReviewWorkspace.tsx`
- `frontend/src/components/actions/review/DetailsPage.tsx`
- `frontend/src/components/actions/review/StrategyPicker.tsx`
- `frontend/src/components/actions/tabs.ts` (label copy)
- `frontend/src/lib/decisions/categories.ts` (icon map)
- `frontend/src/components/actions/DecisionValueCard.tsx` (calmer default state)
- Nav/sidebar label file (found via search on "Alerts")
- New: `frontend/src/components/actions/CategoryRail.tsx`

## Out of scope
- No data-model or lifecycle changes.
- No route path renames (labels only).
- No mobile shell redesign beyond copy.
