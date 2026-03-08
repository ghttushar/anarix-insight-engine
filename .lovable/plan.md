

# Sidebar Controls Repositioning

## Changes

### 1. Collapse Toggle — Edge Notch (Vertically Centered)
Remove the collapse button from the footer. Instead, render a small notch/pill on the **right edge** of the sidebar, vertically centered. This sits outside the sidebar content flow, positioned absolutely.

- Expanded: small chevron-left pill on the right edge of the sidebar
- Collapsed: chevron-right pill on the right edge of the collapsed sidebar
- Style: 24px tall, 12px wide rounded pill, bg-sidebar-accent, subtle border, vertically centered (top-1/2 -translate-y-1/2), positioned at right: -12px (half outside the sidebar)
- This is a common pattern in enterprise tools (Figma, Linear, Notion)

### 2. Theme Toggle — Footer (Where Collapse Was)
The theme toggle (Sun/Moon icon) stays in the footer area, alone, as a single icon button above the profile section. Clean and minimal — just the icon, no label.

- Expanded: icon button aligned left, 32x32px
- Collapsed: icon button centered, 32x32px

### 3. Updated Footer Layout
```text
┌──────────────────────┐
│  ☀/🌙  (theme only)  │  ← single icon, no collapse button
├──────────────────────┤
│  👤 John Doe    ▾    │  ← profile dropdown (unchanged)
└──────────────────────┘
```

## Files to Change

| Action | File |
|--------|------|
| Edit | `src/components/layout/AppSidebar.tsx` — remove collapse from footer utility bar, add edge notch, keep theme toggle alone |
| Edit | `src/components/layout/AppLayout.tsx` — ensure the notch is visible (may need relative positioning on the sidebar wrapper) |

**2 files.**

