

# Restore Collapse Notch to Sidebar Right Edge

The user wants the collapse toggle back as a "nook" arrow on the **inner right edge of the sidebar, vertically centered** — the style that was working before. The current footer placement is not what was requested.

## Changes

### `src/components/layout/AppSidebar.tsx`
1. **Remove** the collapse button from the footer utility bar (lines ~295-308)
2. **Add** a vertically centered notch inside the `<Sidebar>` component, positioned with `absolute top-1/2 -translate-y-1/2 right-0` — sitting on the inner right edge
3. Style: small pill/circle (h-6 w-6), `bg-sidebar` with `border border-border/60`, chevron icon, `z-10`
4. The `<Sidebar>` wrapper needs `relative` class so the absolute positioning works within it
5. **Keep** theme toggle alone in footer (where collapse was, now just theme icon)

### `src/components/layout/AppLayout.tsx`
- Ensure sidebar wrapper allows `overflow-visible` so the notch isn't clipped

### Visual
```text
┌─────────────────┐ ◀── notch sits here on inner right edge
│  Logo           │     vertically centered
│─────────────────│
│  Aan AI         │        ┌──┐
│─────────────────│     ───│◀ │───  (the notch)
│  Nav groups     │        └──┘
│  ...            │
│─────────────────│
│  ☀/🌙           │  ← theme toggle alone
│─────────────────│
│  👤 Profile     │
└─────────────────┘
```

**2 files: `AppSidebar.tsx`, `AppLayout.tsx`**

