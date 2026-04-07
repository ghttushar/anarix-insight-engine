

## Restructure AppTaskbar Into 2-Row Layout

### Problem
Currently everything is on a single row: breadcrumb, filters, account info, actions. The user wants breadcrumbs **above** the metric selectors, with account/sync info on the opposite side of that top row, and island-off actions below on the second row.

### New Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Row 1: Breadcrumb trail                    🟠 Amazon · Acme · Synced│
├─────────────────────────────────────────────────────────────────────┤
│ Row 2: [Ad Type] [Freq] [Date] [children]   Ask Aan  Insights  ↻ 🔔│
└─────────────────────────────────────────────────────────────────────┘
```

- **Row 1 (top)**: Breadcrumb left, marketplace logo + account name + status dot + "Last synced: time" right
- **Row 2 (bottom)**: All filters/selectors/children left, island-off actions (Ask Aan, Insights, Refresh) + bell icon far right
- If no breadcrumb, row 1 still shows account/sync on the right (single visible row behavior)
- Bell icon always far right on row 2 when island is off

### Changes

**File: `src/components/layout/AppTaskbar.tsx`**

1. Change outer container from single `flex` row to `flex flex-col` with two inner rows
2. **Row 1**: `flex items-center justify-between` — breadcrumb left, account+sync right
3. **Row 2**: `flex items-center` — filters/children left, island-off actions + bell right
4. Conditionally hide row 1 if no breadcrumb AND no account info (always show account, so row 1 always visible)
5. Add a subtle `border-b border-border/30` between rows if both are visible
6. Adjust outer height from fixed `h-14` to `py-2` auto-height to accommodate 2 rows

### Files Summary

| File | Change |
|---|---|
| `AppTaskbar.tsx` | Split into 2-row layout: breadcrumb+account top, filters+actions bottom |

