

# Move Collapse Notch Further Inside the Sidebar Edge

## Problem
The current offset of `-20px` with a 32px-wide button still places most of the notch outside the sidebar. To sit visibly inside the panel edge, the offset needs to be increased.

## Change — `src/components/layout/AppLayout.tsx` (lines 23-25)

Increase the offset from `-20px` to `-28px`:

```tsx
left: collapsed
  ? "calc(var(--sidebar-width-icon) - 28px)"
  : "calc(var(--sidebar-width) - 28px)",
```

This shifts the button 8px further left, placing roughly 75% of the notch inside the sidebar panel while the remaining edge still peeks onto the border for discoverability.

Single file, 2-line change.

