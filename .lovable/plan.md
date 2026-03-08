

# Remove Hardcoded Colors from Tables + Redesign Delta Badges

## Problem
1. Table cells use hardcoded colors (red, orange, green) for values like refund sales, cancelled sales, net profit. Per spec, only deltas should have color — all table values must be neutral `text-foreground`.
2. `DeltaBadge` is cramped: 11px text, tight gap, no padding — hard to read at scale.

## Changes

### 1. Redesign `DeltaBadge` — `src/components/ui/delta-badge.tsx`
- Increase font from `text-[11px]` to `text-xs` (12px)
- Increase icon from `h-3 w-3` to `h-3.5 w-3.5`
- Add `gap-1` instead of `gap-0.5`
- Add slight horizontal padding and vertical breathing room
- Keep colors: `text-success` / `text-destructive` (these are reserved data viz colors per spec)

### 2. Remove colors from `ProductsPnLTable.tsx`
- Lines 29-30: Remove `className: "text-red-500"` from refundUnits, `"text-orange-500"` from cancelledUnits
- Lines 33-34: Remove `className: "text-red-500"` from refundSales, `"text-orange-500"` from cancelledSales
- Line 41: Remove `getClassName` from netProfit column — render as plain `text-foreground`
- Line 149: Remove conditional green/red on total row netProfit

### 3. Remove colors from `CatalogProductsTable.tsx`
- Remove `text-red-500` from refund sales cells (~lines 313, 388)
- Remove `text-orange-500` from cancelled sales cells (~lines 316, 391)

### 4. Remove colors from `RegionalProductTable.tsx`
- Line 77: Remove `text-success`/`text-destructive` conditional on netProfit cell
- Line 78: Remove `text-success`/`text-destructive` conditional on margin cell

### 5. Remove colors from `ImpactTable.tsx`
- Lines 78-81: Remove `text-success`/`text-destructive` from delta cell values — only the DeltaBadge arrow+% should be colored, not the raw numbers

### 6. Update `PeriodSummaryCard.tsx`, `PeriodBreakdownPanel.tsx`, `ProductDetailPanel.tsx`
- Remove `text-success` highlight from net profit values — use `text-foreground` for all

### 7. Verify KPI strips and MetricWidget delta styling
- `InlineKPIStrip.tsx`, `KPICard.tsx`, `SOVKPIStrip.tsx`, `MetricWidget.tsx` — these show deltas (not table values), so colors are correct per spec. But apply the same spacing improvements to delta indicators for consistency.

**~8 files to edit.**

