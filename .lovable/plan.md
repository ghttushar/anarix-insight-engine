

## Comprehensive Update: Hero Card Redesign, Floating Island, Sort Popover, Sticky Taskbar, Data Viz Colors, Panel Close-on-Outside-Click

### 10 Changes

---

### 1. Profitability Hero Card — Daily/Monthly Two-Card Layout

**Current:** 4 period tabs (Today, Yesterday, This Month, Last Month) showing one card at a time.

**New:** Replace with a frequency toggle (Daily / Monthly). Each frequency shows 3 cards side by side:
- **Daily:** Card 1 = Today data, Card 2 = Yesterday data, Card 3 = Comparison chart (Today vs Yesterday)
- **Monthly:** Card 1 = This Month data, Card 2 = Last Month data, Card 3 = Comparison chart

Each frequency mode gets a date/month picker:
- Daily: calendar picker to select which day for Card 1 (Card 2 auto = day before)
- Monthly: month picker for Card 1 (Card 2 auto = month before)

Layout: `grid grid-cols-3 gap-4` inside the hero card. Each sub-card shows KPIs (GMV, Auth Sales, Net Profit, Orders, Units, Est Payout) with deltas. Card 3 is a comparison AreaChart overlaying both periods.

Keep the Old/New design toggle so the classic layout is preserved.

**File:** `ProfitabilityHeroCard.tsx`

---

### 2. Data Visualization Colors — Muted Shades

**Current:** Bright `#22C55E` (green), `#EF4444` (red), `#F59E0B` (amber).

**New muted shades:**
- Success/green: `142 55% 38%` (~`#1E9E4F`) — deeper, less neon
- Destructive/red: `0 65% 48%` (~`#C93535`) — deeper, less harsh
- Warning/amber: `38 75% 45%` (~`#C98A14`) — warmer, less bright

Update in `index.css` for both light and dark mode `:root` and `.dark`.

**Files:** `index.css`

---

### 3. Floating Action Island — Border, Notification, Always-Show "Ask Aan", Larger Target Area

**Changes:**
- Add `border-2 border-border shadow-lg` for more prominence
- Add a Notification (Bell) button that opens Insights panel (same as Insights button but with bell icon and unread count badge)
- When collapsed, still show the "Ask Aan" button with label visible (like when expanded) — only this one action stays visible with text
- When expanded, increase outer wrapper padding by 16px on each side (invisible hitbox) using `::before` pseudo-element or a transparent outer div with `p-4 -m-4` to prevent accidental close
- Use `onMouseLeave` on a larger wrapper div instead of the island itself

**File:** `FloatingActionIsland.tsx`

---

### 4. Sort Button — Bring Back Popover for Field Selection

**Current:** 3-state inline toggle with no field picker.

**New:** Keep the 3-state arrow cycling BUT clicking the Sort button opens a popover listing `sortableFields`. Each field row has a 3-state arrow (inactive → asc → desc → inactive). Only one field can be active at a time. The toolbar button icon still reflects current sort state.

**File:** `DataTableToolbar.tsx` — wrap Sort button in `Popover`, render field list inside with per-field arrow toggle.

---

### 5. Add Sort Icon Back to Column Headers

**Current:** Column headers only have pin radio.

**New:** Add a small sort icon (`ArrowUpDown`, 12px, low opacity) next to column name in `SortableTableHead`. When hovered, opacity increases. Clicking cycles sort for that column (asc → desc → inactive). This works alongside the toolbar sort — both control the same `sortField`/`sortDirection` state.

Requires `SortableTableHead` to accept `sortField`, `sortDirection`, `onSort` props again and render arrows.

**File:** `SortableTableHead.tsx`

---

### 6. Right-Side Data Panels — Close on Outside Click

**Current:** All panels close via X button only.

**New:** Data viewing panels (ProductDetailPanel, PeriodBreakdownPanel) close when user clicks outside them. Aan and Create panels keep X-only close behavior.

Implementation: In `AppLayout.tsx`, add an `onClick` handler on the `<main>` element. If `dataPanel` is `productDetail` or `periodBreakdown`, call `closeDataPanel()`. Check that the click target is within main content (not the panel itself).

**File:** `AppLayout.tsx`

---

### 7. ProductDetailPanel — More Data, Expandable PnL Table

**Current:** Shows 5 sections (Sales, COGS, Expenses, Units, Calculated Metrics) as flat key-value rows.

**New:** Add a "P&L Breakdown" section with expandable/collapsible rows:
- Revenue (expand: Order Sales, Refund Sales, Cancelled Sales)
- Cost of Goods (expand: COGS per unit × units)
- Expenses (expand: Ad Spend, Commission Product, Commission Shipping, WFS Fee, Shipping Fees, Additional Fee)
- Net Profit (calculated, highlighted)

Each parent row shows total and a chevron to expand children. Add weekly trend sparkline for Net Profit at the top.

**File:** `ProductDetailPanel.tsx`

---

### 8. Page Level Taskbar — Sticky on Scroll

**Current:** `AppTaskbar` scrolls with content.

**New:** Make it stick to top when scrolled past. Change from `shrink-0` to `sticky top-0 z-30` so it freezes at the top of the scrollable main area.

Since main content is inside `overflow-auto`, the sticky needs to be relative to that scroll container. The taskbar is already inside the scrollable `<main>`. Using `sticky top-0 z-30` on the taskbar wrapper will make it freeze at the top of the scroll container.

**File:** `AppTaskbar.tsx` — add `sticky top-0 z-30`

---

### 9. Wire Sort + Pin to All Listed Tables

Ensure every table on the specified screens passes `onSort` to `SortableTableHead` and `onPinToggle` with functional `usePinning`. The sort from column headers and toolbar both control the same state in the parent page.

**Tables:** All tables on Profitability (Dashboard, Trends, P&L, Geo), Advertising (Campaign, Impact, Targeting), Catalog (Products), Day Parting (History, Scheduled Jobs).

**Files:** All page files + table components that don't already have sort/pin wired.

---

### 10. Summary of Files

| File | Change |
|---|---|
| `ProfitabilityHeroCard.tsx` | Daily/Monthly 3-card layout with date/month picker |
| `index.css` | Muted data viz colors (success, destructive, warning) |
| `FloatingActionIsland.tsx` | Border, notification bell, always-show Ask Aan, larger target area |
| `DataTableToolbar.tsx` | Sort popover with field list + per-field 3-state arrows |
| `SortableTableHead.tsx` | Re-add sort arrows (low opacity) + keep pin radio |
| `AppLayout.tsx` | Close data panels on outside click |
| `ProductDetailPanel.tsx` | Expandable PnL breakdown, more data, sparkline |
| `AppTaskbar.tsx` | `sticky top-0 z-30` for freeze-on-scroll |
| Multiple page/table files | Wire sort + pin state consistently |

