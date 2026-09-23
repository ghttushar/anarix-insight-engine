# Morning Brief — three variations

A new **Brief** area that answers one question: *what happened to my business since I last looked?*
Not only Signals — it pulls from advertising, profitability, catalog/inventory, rules, keyword
harvesting, dayparting, MCP agents and teammate activity.

## Routes

| Route | Name | Feel |
|---|---|---|
| `/brief/narrative` | Narrative Brief | Written, editorial, reads like a morning memo |
| `/brief/dashboard` | Brief Dashboard | Charts, tiles, tables — numbers first |
| `/brief/mixed` | Mixed Brief | Narrative spine with charts inline (default) |

`/brief` redirects to `/brief/mixed`. One shared header with a segmented switch between the three,
plus date-window label, marketplace, and "Open Signals" link. Each page scrolls independently.

## Shared data layer (mock, deterministic)

New `src/data/mockBrief.ts` + `src/lib/brief/compose.ts` assembling:

- **Headline numbers** — revenue, ad spend, TACoS, ROAS, orders, net profit, units; each with
  yesterday + 7-day comparison.
- **Yesterday's actions and their result** — rule actions applied, bids changed, budgets moved,
  keywords harvested, dayparting schedule changes, negatives added; each with before/after
  performance so we can show "what your actions earned".
- **Automation activity** — rules fired (by rule), MCP agent runs, Aan autonomous actions,
  pending approvals.
- **People activity** — changes made by team members (who changed what, when).
- **Attention items** — top signals needing a decision, inventory/OOS risk, Buy Box losses,
  budget-capped campaigns, anomalies.
- **Movers** — best/worst campaigns, SKUs, keywords, placements.
- **Today ahead** — scheduled rules, dayparting windows, meetings, budget pacing forecast.

All three screens read from this single source, so the story stays consistent across variants.

## 1. Narrative Brief (`/brief/narrative`)

Editorial column, generous reading width, minimal chrome. Sections in order:

1. Greeting + one-paragraph **executive summary** (auto-composed sentences from the data).
2. **Overnight** — what happened while away, as prose bullets with inline bold numbers.
3. **What your automations did** — sentence per rule/agent with outcome.
4. **What the team changed** — who did what.
5. **What needs you today** — 3–5 items, each a short paragraph with an inline link into the
   relevant module.
6. **Wins and drags** — two short written lists.
7. **Today's outlook** — scheduled work, pacing, meetings.
8. Sparklines only — no full charts. Numbers live inside the sentences.

## 2. Brief Dashboard (`/brief/dashboard`)

Dense, grid-based, no long prose:

- KPI tile row (7 tiles, delta vs yesterday and vs 7-day average).
- Revenue vs ad spend combo chart (bars + line, 14 days).
- TACoS / ROAS dual-line trend.
- "Impact of yesterday's actions" before/after bar comparison.
- Automation activity: stacked bar by source (rules, MCP agents, Aan, humans) + a run-log table.
- Top movers table (campaigns / SKUs / keywords, tabbed).
- Dayparting heatmap strip (hour × day intensity).
- Keyword harvesting funnel counters + harvested-terms table.
- Inventory risk table (days of cover, OOS ETA).
- Budget pacing progress bars.
- Signals-by-category donut with counts.

## 3. Mixed Brief (`/brief/mixed`)

The default. Narrative spine, charts inline where a number needs proof:

- Executive summary paragraph + KPI tile row.
- "Overnight" prose block beside the revenue/spend chart.
- "Your actions paid off" paragraph + before/after chart.
- Automation prose summary + compact run table.
- "Needs you today" cards with sparkline evidence.
- Movers: short written call-out + compact table.
- Outlook paragraph + pacing bars.

## Components

New folder `src/components/brief/`, one responsibility per file:

`BriefShell.tsx` (header, variant switch, scroll container), `BriefKpiRow.tsx`, `BriefKpiTile.tsx`,
`Sparkline.tsx`, `NarrativeBlock.tsx`, `ActionImpactChart.tsx`, `RevenueSpendChart.tsx`,
`EfficiencyTrendChart.tsx`, `AutomationActivity.tsx`, `AutomationRunTable.tsx`,
`TeamActivityList.tsx`, `NeedsYouList.tsx`, `MoversTable.tsx`, `DaypartingStrip.tsx`,
`HarvestingPanel.tsx`, `InventoryRiskTable.tsx`, `BudgetPacingList.tsx`,
`SignalsMixDonut.tsx`, `OutlookPanel.tsx`.

Pages: `src/pages/brief/NarrativeBrief.tsx`, `DashboardBrief.tsx`, `MixedBrief.tsx`.

## Rules followed

- Design tokens only (Periwinkle system), no hardcoded colours; red/green/yellow reserved for
  data meaning; charts use Recharts via the existing chart primitives.
- Neutral, precise copy in numbers sections; light narrative tone allowed in the written brief.
- Motion limited to fades ≤ 200ms.
- Everything read-only: no writes, no destructive actions, deep links only.
- Sidebar gets a "Brief" entry above Signals. Nothing is pushed to the remote repo.
