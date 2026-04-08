

## Card Selection State, 6 Metrics Per Card, Taller Chart

### 3 Changes

---

### 1. Selectable cards — clicking a card highlights it and filters the chart

**File: `ProfitabilityHeroCard.tsx`**

- Add `selectedCardIndex` state (default `0` — Today card selected)
- Pass `isSelected` and `onSelect` props to each `SummaryCard` and `ForecastCard`
- When selected: add `ring-2 ring-primary shadow-md` border styling to the card, remove the default `border-border` and replace with `border-primary`
- When not selected: keep existing neutral border
- On click anywhere on the card body, call `onSelect(index)`
- The `ComparisonChart` below continues showing all 5 series (no filtering needed — the selection is purely visual to indicate which card is "active")

### 2. Expand SummaryCard from 4 to 6 metrics

**File: `ProfitabilityHeroCard.tsx` — `SummaryCard` component**

Current 4 metrics: GMV, Orders, Auth Sales, Ad Cost

Add 2 more from available `ProfitabilitySummary` fields:
- **Units** (`summary.units`, format: number)
- **Est. Payout** (`summary.estPayout`, format: currency)

Change grid from `grid-cols-2` (4 items) to `grid-cols-3` (6 items) so all 6 fit in 2 rows of 3.

### 3. Increase ComparisonChart height

**File: `ProfitabilityHeroCard.tsx` — `ComparisonChart` component**

- Change inline render height from `160` → `220` (line 349)
- This gives the chart more vertical breathing room

### Files Summary

| File | Change |
|---|---|
| `ProfitabilityHeroCard.tsx` | Add selected card state + ring styling, expand metrics to 6 with 3-col grid, increase chart height to 220 |

