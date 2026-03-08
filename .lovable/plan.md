

# Adjust Collapse Notch Position and Size

## Current State
The notch is `h-6 w-6` (24px) with `left: calc(var(--sidebar-width) - 12px)` — meaning it straddles the sidebar edge (half inside, half outside).

## Changes — `src/components/layout/AppLayout.tsx`

1. **Move left / more inside the panel**: Change the `left` calc offset from `-12px` to `-20px` so the notch sits further inside the sidebar edge
   - Expanded: `calc(var(--sidebar-width) - 20px)`
   - Collapsed: `calc(var(--sidebar-width-icon) - 20px)`

2. **Make it bigger**: Increase from `h-6 w-6` to `h-8 w-8` (32px), and icon from `h-3 w-3` to `h-4 w-4`

Single file edit, lines 19-28 only.

