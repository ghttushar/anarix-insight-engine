

# Fix: Sticky Column Transparency on Hover and Horizontal Scroll

## Problem

Sticky (first) columns in tables use `bg-card`, `bg-inherit`, or semi-transparent backgrounds. When hovering, the `TableRow` applies `hover:bg-muted/50` (semi-transparent) but sticky cells retain their own background — creating a mismatch. When horizontally scrolling, the sticky cell's background doesn't fully occlude the text scrolling underneath because `bg-card` resolves to a CSS variable that may not be fully opaque in all contexts, and `bg-inherit` inherits the semi-transparent hover.

## Root Cause

`TableRow` in `src/components/ui/table.tsx` uses `hover:bg-muted/50` — a semi-transparent hover. Sticky cells need **solid opaque backgrounds** that also change on hover to match.

## Fix

### 1. Update `TableRow` hover to use a solid color

**File: `src/components/ui/table.tsx`** (line 37)

Change `hover:bg-muted/50` to `hover:bg-muted/50` but ensure all sticky cells use `group` pattern with solid backgrounds.

Actually, the cleaner fix: add `group` class to `TableRow` so all sticky cells can use `group-hover:`.

Current: `"relative border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50"`

No change needed here — `group` is already usable via className overrides on individual rows.

### 2. Fix each table with sticky columns

**Files to update (5 files):**

- `src/components/profitability/ProductsPnLTable.tsx`
  - Line 76: `bg-card group-hover:bg-muted/30` → `bg-background group-hover:bg-muted`
  - Line 66: Header already has solid `bg-muted` — OK
  - Line 139: Total row `bg-muted` — OK

- `src/components/profitability/PnLParameterTable.tsx`
  - Line 65: `bg-inherit` → `bg-background` for default rows, parent rows use `bg-muted/20` so change to `bg-muted` when parent
  - Add `group` class to the TableRow (line 59)
  - Sticky cell: `bg-inherit` → conditional `bg-background` / `bg-muted` based on `isParent`, with `group-hover:bg-muted`

- `src/pages/profitability/Trends.tsx`
  - Line 132: `bg-card group-hover:bg-muted/30` → `bg-background group-hover:bg-muted`

- `src/components/catalog/CatalogProductsTable.tsx`
  - Line 224: `bg-card` → `bg-background group-hover:bg-muted`
  - Add `group` to the TableRow on line 222
  - Line 351: Total sticky `bg-muted/50` → `bg-muted`

- `src/components/tables/RegionalTable.tsx`
  - Line 48: Already uses `group-hover:bg-muted/30` — change `bg-card` to `bg-background`, `bg-muted/10` to `bg-muted`, hover to `group-hover:bg-muted`

### Key principle
Every sticky cell must have:
1. A **solid opaque** background (`bg-background` or `bg-muted`, never `/50` or `/30` or `inherit`)
2. A `group-hover:bg-muted` to match hover state
3. Its parent `TableRow` must have the `group` class

This ensures scrolling content is fully hidden behind the sticky column, and hover states look correct.

