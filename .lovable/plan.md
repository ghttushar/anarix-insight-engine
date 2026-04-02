## Profitability Hero Card: Date Pickers on All Cards + 4-Card Layout (3 Metrics + 1 Graph)

### 2 Changes

---

### 1. Old Design (Classic) — Add Date Change to Each Card

**Current:** 4 `PeriodSummaryCard` components rendered from `profitabilitySummaries` array. No date picker — cards are static (Today, Yesterday, This Month, Last Month).

**Fix:** Add a small calendar icon button to each `PeriodSummaryCard`. Clicking it opens a `Popover` with:

- For Today/Yesterday cards: a `Calendar` date picker
- For This Month/Last Month cards: a month selector grid

Each card gets its own independent date selection. The card label updates to reflect the chosen date.

**Files:** `PeriodSummaryCard.tsx` — add optional `onDateChange` prop, `frequency` prop (`"daily" | "monthly"`), and internal popover with calendar/month picker.

---

### 2. New Design — 4-Card Grid (3 Metric Cards + 1 Comparison Graph)

**Current:** `grid-cols-3` with 2 `PeriodCard` components + 1 `ComparisonChart`.

**New:** `grid-cols-4` with 3 `PeriodCard` components + 1 `ComparisonChart`.

Layout in **Daily** mode:

- Card 1: Today (with calendar picker)
- Card 2: Yesterday (with calendar picker)
- Card 3: Day Before Yesterday (auto-computed from selected dates)
- Card 4: Comparison chart (all 3 periods overlaid)

Layout in **Monthly** mode:

- Card 1: This Month (with month picker)
- Card 2: Last Month (with month picker)
- Card 3: 2 Months Ago (auto-computed)
- Card 4: Comparison chart (all 3 periods overlaid)

Each of the 3 metric cards gets its own date/month picker button in the card header (small calendar icon next to the label). The top-level header picker is removed since each card controls its own date.

The 3rd period summary uses a 3rd mock data entry. Since we only have 4 summaries (today, yesterday, this_month, last_month), the 3rd card in daily mode reuses `this_month` data and in monthly mode reuses `last_month` data — relabeled to the computed date.

The `ComparisonChart` is updated to overlay 3 series instead of 2.

when the action isalnd is turned off in the prefrences the options (ask aan, notification, insights) only should be available in page level metric bar on the right side 

&nbsp;

**Files:**

- `ProfitabilityHeroCard.tsx` — change `grid-cols-3` → `grid-cols-4`, add 3rd PeriodCard, add per-card date pickers, update ComparisonChart to accept 3 data series
- `PeriodSummaryCard.tsx` — add date picker popover props

---

### Summary


| File                        | Change                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `PeriodSummaryCard.tsx`     | Add optional date picker popover (calendar for daily, month grid for monthly)                                     |
| `ProfitabilityHeroCard.tsx` | 4-card grid (3 metrics + 1 graph), per-card date pickers, 3-series comparison chart, remove top-level date picker |
