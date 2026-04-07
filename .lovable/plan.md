

## Merge Profitability Hero Card: Classic Cleanliness + New Design Richness + Forecast Card

### Problem

Two separate designs exist — "New Design" (4-col grid, cramped, rich info) and "Classic" (stacked rows, clean, minimalistic). User wants one unified view combining the best of both, plus a 5th Prediction/Forecast card.

### Merged Design

Remove the design toggle entirely. Replace with a single unified layout:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ [Daily / Monthly toggle]                    [Full Details →]        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Today    │ │Yesterday │ │Day Before│ │ Forecast │ │Comparison│ │
│  │  📅      │ │  📅      │ │  📅      │ │ 🔮       │ │  Chart   │ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │ Net Prof │ │ Net Prof │ │ Net Prof │ │ Est Prof │ │ 4-series │ │
│  │ Margin%  │ │ Margin%  │ │ Margin%  │ │ Est GMV  │ │ overlay  │ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │ GMV  Ord │ │ GMV  Ord │ │ GMV  Ord │ │ Est Ord  │ │          │ │
│  │ Sales Ad │ │ Sales Ad │ │ Sales Ad │ │ Conf %   │ │          │ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │[View More│ │[View More│ │[View More│ │          │ │          │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                                     │
│  [Overview]  [Sales Mix]  [Efficiency]   ← sub-view tabs below     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Sub-view content (breakdown / efficiency)                       ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Design Principles (Merging Classic + New)

**From Classic (keep):**
- Clean horizontal card layout — each card is a compact row-style card with accent color left border
- Metrics displayed inline as label + MorphingNumber pairs (not cramped 2×3 grids)
- Each card has a "View More" link opening the breakdown panel
- Per-card date picker (calendar icon)
- Light, airy spacing

**From New Design (keep):**
- Frequency toggle (Daily/Monthly) in the header
- Sub-view tabs (Overview / Sales Mix / Efficiency) — but moved below the cards row
- Comparison chart as the last card
- Delta indicators on key metrics

**New: Forecast Card (5th card)**
- Label: "Forecast" with a `TrendingUp` or `Sparkles` icon
- Shows projected values based on current period trajectory
- Metrics: Est. Net Profit, Est. GMV, Est. Orders, Confidence %
- Computed: `(currentPeriodValue / daysElapsed) * totalDaysInPeriod`
- Styled with a subtle dashed border or `border-dashed` to distinguish from actuals
- No date picker (auto-computed)

### Layout

- 5 cards in a single row: `grid grid-cols-5 gap-3`
- Each metric card is compact: accent left border, header with label + date picker, 2–3 key metrics inline, "View More" link
- Forecast card: dashed border, forecast icon, projected metrics
- Comparison chart: last column, overlays all 4 series (3 actuals + forecast)
- Below the cards row: sub-view tabs (Overview/Sales Mix/Efficiency) expand into a detail section

### Changes

**File: `ProfitabilityHeroCard.tsx`** — Full rewrite
- Remove the existing `PeriodCard` (cramped 2×3 grid style)
- Create new `SummaryCard` — classic-inspired compact card with accent border, inline metrics, date picker, "View More"
- Create `ForecastCard` — dashed border, projected values from mock computation
- Keep `ComparisonChart` but add 4th forecast series
- Move sub-view tabs (Sales Mix, Efficiency) below the card row as expandable sections
- 5-column grid layout

**File: `Dashboard.tsx`**
- Remove the design toggle (New/Classic) entirely
- Remove the classic `PeriodSummaryCard` rendering block
- Render only the unified `ProfitabilityHeroCard`
- Remove `useNewDesign` state

**File: `mockProfitability.ts`**
- No changes needed — forecast is computed from existing data

**File: `PeriodSummaryCard.tsx`**
- Keep file (may be used elsewhere) but it's no longer rendered in Dashboard

### Files Summary

| File | Change |
|---|---|
| `ProfitabilityHeroCard.tsx` | Full rewrite — unified 5-card layout (3 actuals + forecast + chart), classic-clean card style, sub-view tabs below |
| `Dashboard.tsx` | Remove design toggle, render only unified hero card |

