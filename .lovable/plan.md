

## Fix: Horizontal Scroll Caused by Missing Width Constraints

### Root Cause

The `<main>` element in `AppLayout.tsx` already has `min-w-0`, but page-level flex containers inside it do NOT. The flex width chain breaks at:

1. **`Dashboard.tsx` line 121:** `<div className="flex flex-1 h-full min-h-0">` — missing `min-w-0`
2. **`Dashboard.tsx` line 122:** `<div className="flex-1 space-y-6 p-0">` — missing `min-w-0`
3. **`ProfitabilityHeroCard.tsx` line 322:** `<div className="grid grid-cols-3 gap-4">` — the 3-column grid has no `overflow-hidden`, so wide card content pushes the grid wider than the viewport

The same pattern likely exists in `ProfitLoss.tsx` and other pages that use `flex flex-1` wrappers without `min-w-0`.

### Fix

**File: `src/pages/profitability/Dashboard.tsx`**
- Line 121: Add `min-w-0` → `"flex flex-1 h-full min-h-0 min-w-0"`
- Line 122: Add `min-w-0` → `"flex-1 min-w-0 space-y-6 p-0"`

**File: `src/pages/profitability/ProfitLoss.tsx`**
- Same pattern: add `min-w-0` to the `flex flex-1` wrapper

**File: `src/components/profitability/ProfitabilityHeroCard.tsx`**
- Line 322: Add `overflow-hidden` → `"grid grid-cols-3 gap-4 overflow-hidden"` to prevent the 3-column grid from expanding past its container

**Audit all other pages** that use `flex flex-1` inner wrappers (Campaign Manager, Impact Analysis, etc.) and add `min-w-0` where missing.

### Why This Works

In CSS flexbox, `min-width` defaults to `auto`, meaning a flex child will expand to fit its content. Adding `min-w-0` forces the flex child to respect its parent's constraints, pushing overflow into the child's own scroll container instead of the viewport.

