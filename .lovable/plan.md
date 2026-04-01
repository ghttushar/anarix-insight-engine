

## Fix: Permanent Horizontal Scroll on Viewport

### Root Cause

The `<main>` element in `AppLayout.tsx` (line 53-58) is missing `min-w-0`. In a flex layout, flex children can grow beyond their container if any content inside is wider than the available space (e.g., wide tables, hero cards with `grid-cols-3`). Without `min-w-0` on `<main>`, it expands to fit content width, pushing the entire viewport wider.

Additionally, some pages have inner wrappers like `<div className="flex flex-1 min-h-0">` that also lack `min-w-0`, allowing the width chain to propagate upward.

### Fix (2 lines)

**File: `src/components/layout/AppLayout.tsx`**

1. Add `min-w-0` to the `<main>` element (line 55) — this is the single missing constraint that causes the entire viewport to scroll horizontally. The main content area must not be allowed to grow wider than its flex parent.

Change:
```
"flex-1 overflow-auto bg-background min-h-0"
```
To:
```
"flex-1 overflow-auto bg-background min-h-0 min-w-0"
```

This ensures tables and wide content scroll horizontally within their own `overflow-x-auto` wrappers (which already exist on most tables), rather than pushing the entire page wider.

No other files need changes — the root layout constraint is the single fix.

