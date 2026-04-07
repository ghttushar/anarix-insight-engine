

## Profitability Hero Card: 5 Fixed Cards + Chart — Full Redesign

### What Changes

Remove the Daily/Monthly frequency toggle entirely. Show **all 5 cards always**: Today, Yesterday, This Month, Last Month, and Forecast. The comparison chart moves below the cards row as a full-width section for better readability.

### Layout

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  [Overview]  [Sales Mix]  [Efficiency]              [Full Details →]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─ ─ ─ ─ ─ ┐   │
│  │  Today    │ │Yesterday │ │This Month│ │Last Month│ │ Forecast  │   │
│  │  📅      │ │  📅      │ │  📅      │ │  📅      │ │ ✨        │   │
│  │          │ │          │ │          │ │          │ │           │   │
│  │ $1,245   │ │ $1,567   │ │ $23,456  │ │ $28,901  │ │ $39,173  │   │
│  │ Margin%  │ │ Margin%  │ │ Margin%  │ │ Margin%  │ │ Est Prof  │   │
│  │          │ │          │ │          │ │          │ │           │   │
│  │ GMV  Ord │ │ GMV  Ord │ │ GMV  Ord │ │ GMV  Ord │ │ GMV  Ord  │   │
│  │ Auth  Ad │ │ Auth  Ad │ │ Auth  Ad │ │ Auth  Ad │ │ Conf %    │   │
│  │          │ │          │ │          │ │          │ │           │   │
│  │[View More│ │[View More│ │[View More│ │[View More│ └─ ─ ─ ─ ─ ┘   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Comparison Chart — 5-series area overlay (full width)          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design Details

**5 Metric Cards** — `grid grid-cols-5 gap-3`
- Cards 1-2 (Today, Yesterday): calendar date picker for daily dates
- Cards 3-4 (This Month, Last Month): month picker
- Card 5 (Forecast): dashed border, Sparkles icon, no date picker, projected values
- Each card: left accent border, Net Profit as primary metric with delta, margin %, 2x2 grid of secondary metrics (GMV, Orders, Auth Sales, Ad Cost), "View More" link
- Accent colors: primary, chart-2, chart-3, chart-4, chart-5

**Comparison Chart** — full-width below cards
- Area chart with 5 overlaid series (4 actuals + forecast dashed)
- Much more readable at full width vs crammed into 1/5 column
- Height ~160px

**Sub-view tabs** (Overview/Sales Mix/Efficiency) stay in header, same logic as now but Overview shows the 5-card grid + chart below.

### Changes

**File: `ProfitabilityHeroCard.tsx`** — Rewrite
- Remove `frequency` state and Daily/Monthly toggle
- Always show 5 cards: map summaries by period keys `["today", "yesterday", "this_month", "last_month"]` + forecast
- Cards 1-2 get `CardDatePicker` with `frequency="daily"`, cards 3-4 get `frequency="monthly"`
- Move `ComparisonChart` to full-width row below the 5-card grid
- Add 5th accent color
- ComparisonChart gets 5 datasets (4 actuals + forecast)

**File: `Dashboard.tsx`** — No changes needed (already clean from last rewrite)

### Files Summary

| File | Change |
|---|---|
| `ProfitabilityHeroCard.tsx` | Remove frequency toggle, show 5 fixed cards (Today/Yesterday/This Month/Last Month/Forecast) + full-width chart below |

