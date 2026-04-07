

## Fix: Clarify Baseline vs Impact in ImpactTable

### Problem
The DeltaCell shows `baseline → impact` with only a color difference (muted vs default). The arrow separator doesn't clearly communicate "comparison." Users may not understand which number is which.

### Changes

**File: `src/components/tables/ImpactTable.tsx`**

1. **Add column sub-headers** — In the table header row, add a secondary row or inline label showing "Baseline vs Impact" so the pattern is immediately clear.

2. **Replace `→` with `vs`** — Change the separator in `DeltaCell` (line 61) from `→` to `vs` styled in `text-muted-foreground text-[10px] uppercase tracking-wide`. This mirrors the comparison language used in the top metric selector and makes the two-value pattern self-explanatory.

3. **Label the values** — Add tiny `B:` and `I:` prefixes (or "Base" / "Impact" as subtle labels) before each number so even without the header context, each cell is unambiguous:
   ```
   Base: 218,456  vs  Impact: 245,678  ▲12.5%
   ```
   Use `text-[10px] text-muted-foreground uppercase` for the labels to keep them subtle.

4. **Improve visual hierarchy** — Keep baseline in `text-muted-foreground` and impact in `font-medium text-foreground` (already done), but also give the delta badge a subtle pill background (`bg-success/10` or `bg-destructive/10` with rounded-full padding) so the change percentage stands out more clearly.

### Files Summary

| File | Change |
|---|---|
| `ImpactTable.tsx` | Replace `→` with `vs`, add `Base:`/`Impact:` micro-labels, pill-style delta badge |

