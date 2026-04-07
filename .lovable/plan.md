

## Restructure App-Level Selector and Page-Level Taskbar

### Problem
The `AppLevelSelector` in the top-right of `PageHeader` contains marketplace switching + store selection. Since marketplace selection now lives in the sidebar, this component is redundant for marketplace switching. The user wants:
1. Remove marketplace from `AppLevelSelector` (it's now in sidebar)
2. Move remaining controls (catalogue, store selectors passed as children) into the `AppTaskbar`
3. Add to taskbar right side: current marketplace + account indicator, data last refreshed timestamp, and full floating island actions (with icons + labels) when island is off

### Layout

```text
┌─ AppTaskbar ──────────────────────────────────────────────────────────────────────┐
│ [Ad Type ▾] [Frequency ▾] [Date Range 📅] [children...]                          │
│                                                                                   │
│                    ── right side ──                                                │
│  🟠 Amazon · Acme Corp  │  Last synced: Apr 7, 3:42 PM  │  ✨ Ask Aan  🔔 Alerts │
│                                                          │  💡 Insights  ↻ Refresh │
│                                                          │  ⬇ Export  📷 Screenshot│
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Changes

**File: `src/components/layout/AppTaskbar.tsx`**
1. Import `useMarketplace`, `useAccounts`, marketplace logos
2. Add right-side section (always visible, pushed right with `ml-auto`):
   - **Marketplace + Account indicator**: Small marketplace logo (16px) + status dot + account name as a read-only pill (no dropdown — selection happens in sidebar)
   - **Last synced**: `Clock` icon + `lastSync` from `currentAccount` or mock timestamp like "Apr 7, 3:42 PM" — muted text, small font
3. **Island-off fallback**: Expand current 3-button fallback to include all 6 island actions (Ask Aan, Alerts, Insights, Refresh, Export, Screenshot) — each as a labeled button with icon + text label (not just icon-only tooltips). Use `gap-2` layout, `text-xs` labels beside icons.

**File: `src/components/layout/AppLevelSelector.tsx`**
- Remove the entire marketplace dropdown section (Amazon/Walmart selector)
- Remove the store search/selection dropdown
- Keep only the `children` pass-through (for catalogue, ad-type selectors that some pages pass in)
- Simplify to just render `{children}` wrapped in a flex container
- OR delete entirely if children can be passed directly into AppTaskbar

**File: `src/components/layout/PageHeader.tsx`**
- Remove `appLevelSelector` prop entirely
- PageHeader becomes: title + subtitle on left, actions on right (no marketplace)

**File: ~15 page files** (CampaignManager, Products, ProfitLoss, etc.)
- Remove `appLevelSelector={<AppLevelSelector>...</AppLevelSelector>}` from `PageHeader`
- Move any children that were inside `<AppLevelSelector>` (like catalogue Select, ad-type Select) into `<AppTaskbar>` as children instead

### Right-Side Taskbar Detail

The right side shows 3 zones separated by subtle `border-l border-border` dividers:

1. **Zone 1 — Context**: Marketplace logo + status dot + account name (read-only display)
2. **Zone 2 — Freshness**: Clock icon + "Last synced: {time}" in muted text
3. **Zone 3 — Actions** (only when floating island is off): 6 labeled buttons in a compact row — `Ask Aan`, `Alerts`, `Insights`, `Refresh`, `Export`, `Screenshot` — each with icon + label text

### Files Summary

| File | Change |
|---|---|
| `AppTaskbar.tsx` | Add marketplace/account indicator, last synced timestamp, expand island-off fallback to all 6 actions with labels |
| `AppLevelSelector.tsx` | Strip down to children-only passthrough or delete |
| `PageHeader.tsx` | Remove `appLevelSelector` prop |
| ~15 page files | Remove `appLevelSelector` from PageHeader, move child selectors into AppTaskbar children |

