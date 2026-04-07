

## Remove Per-Cell Labels, Add Header-Level "Base → Impact" Indicator

### Problem
Every data cell repeats "Base:" and "Impact:" micro-labels, creating visual clutter. The user wants this context shown once in the table column headers instead, using an arrow pattern: `base → impact`.

### Changes

**File: `src/components/tables/ImpactTable.tsx`**

1. **Add a secondary header row** below the main `TableRow` — spanning all metric columns (Impressions through ACOS). Each metric column header gets a centered sub-label:
   ```
   base → impact
   ```
   Styled with `text-[10px] text-muted-foreground` for "base", a small `→` arrow in `text-muted-foreground/50`, and `text-[10px] text-foreground` for "impact" — matching the same color difference used in data cells.

2. **Simplify `DeltaCell`** — Remove the `Base:` and `Impact:` micro-labels and the `vs` separator. Show only:
   ```
   {baselineValue}  →  {impactValue}  [delta pill]
   ```
   - Baseline value in `text-muted-foreground`
   - Arrow `→` in `text-muted-foreground/50`
   - Impact value in `font-medium text-foreground`
   - Delta pill unchanged (rounded-full with contextual bg)

### Result
The column header row explains the pattern once ("base → impact"), and every data row follows it silently with just the two values + arrow + delta badge. Cleaner, less repetitive, immediately scannable.

### Files Summary

| File | Change |
|---|---|
| `ImpactTable.tsx` | Add "base → impact" sub-label in column headers; remove per-cell "Base:"/"Impact:" labels; replace "vs" with "→" arrow |

