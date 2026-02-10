
# Comprehensive Sandbox, Map, Tables, and UI Fix Plan

## Summary of All Changes

| # | Issue | Solution |
|---|-------|----------|
| 1 | Geo map is broken/ugly | Delete current SVG map, replace with a proper world map using accurate Natural Earth simplified map image |
| 2 | Aan button looks bad | Redesign to a minimal, sleek outlined pill with subtle sparkle animation on hover |
| 3 | Sandbox: Duplicate should be "Create New" and add to nav | Multi-dashboard system with localStorage persistence, dynamic nav items under "Sandbox" |
| 4 | Rename "Workspace" to "Sandbox" | Update all references in sidebar nav, breadcrumbs, routes |
| 5 | Widgets not freely movable | Implement drag-and-drop reordering of widgets on the canvas |
| 6 | Collapse button badly placed | Replace bottom toggle with a small arrow nook on the right edge, vertically centered |
| 7 | All tables need redesign | Rebuild table styling: black text for all values, green/red micro-delta badges for up/down metrics (per reference image) |
| 8 | Left nav on wrong layer | Fix z-index so sidebar is same layer as app content, not elevated above |
| 9 | Annotation widget boring | Redesign as FigJam-style post-it notes with colored backgrounds, slight rotation, pin icon |
| 10 | Sandbox needs more features | Add widget resize controls, drag handle, better empty states |

---

## Phase 1: Rename Workspace to Sandbox

### Files affected:
- `src/components/layout/AppSidebar.tsx` - Change "Workspace" label to "Sandbox", "Dashboard Builder" to "My Sandbox"
- `src/pages/workspace/Dashboard.tsx` - Update breadcrumb text
- Route stays `/workspace` (no URL change needed)

---

## Phase 2: Multi-Dashboard System

### File: `src/pages/workspace/Dashboard.tsx`

Replace single dashboard with multi-dashboard system:

- State: `dashboards` array stored in localStorage (each has id, name, widgets)
- "Create New" button creates a fresh empty dashboard, adds it to the list
- Each dashboard name is editable inline
- Current dashboard selectable

### File: `src/components/layout/AppSidebar.tsx`

Under "Sandbox" nav group, dynamically render dashboard names from localStorage:
- Default: "My Sandbox"
- Each new dashboard appears as a sub-item under Sandbox
- Route: `/workspace/:dashboardId` or use query params

---

## Phase 3: Geography Map - Complete Replacement

### File: `src/components/profitability/GeographyMap.tsx`

Delete ALL current SVG paths. Replace with proper simplified world map SVG paths sourced from Natural Earth / world-atlas data. The key differences:

- Accurate continent and country outlines (not blobs)
- All countries rendered with muted fill
- USA, Canada, Mexico: filled with data-intensity colors, `cursor: pointer`
- All other countries: muted, `cursor: default`
- Hover tooltip with country name + sales
- Zoom controls preserved
- Pan support via mouse drag (translateX/Y state)

The SVG paths will be hardcoded (not fetched) using simplified world map coordinates for approximately 180 countries. Active countries (US/CA/MX) get interactive behavior, rest are decorative.

---

## Phase 4: Aan Button Redesign

### File: `src/components/layout/AppSidebar.tsx`

Replace current bordered box with a sleek pill-shaped button:
- Transparent background with a thin gradient border (1px)
- Sparkles icon with gradient text
- "Aan" in Allura font with gradient text
- On hover: background fills with 8% opacity gradient, border brightens
- Compact: just the sparkle icon with same thin gradient border
- No solid gradient fill ever (that was the "sticker" look)

---

## Phase 5: Sidebar Collapse - Edge Nook

### File: `src/components/layout/AppSidebar.tsx`

Remove the bottom "Collapse" button entirely. Replace with:
- A small 24x48px notch/arrow on the right edge of the sidebar, vertically centered
- When expanded: shows a left-pointing chevron
- When collapsed: shows a right-pointing chevron
- Positioned with `position: absolute; right: -12px; top: 50%; transform: translateY(-50%)`
- Styled as a small rounded pill with border, bg-card
- Z-index above content but not overlay

### File: `src/components/layout/AppLayout.tsx`

Ensure sidebar has `position: relative` and correct z-index (same layer as main content, not elevated).

---

## Phase 6: Table Redesign

### Approach:
All table text should be black (`text-foreground`). No colored text for values. Instead, under numeric cells that have changed, show a micro-delta badge:

```text
$10,973.60
  ^^ +12.4%     (green, small, with up arrow icon)
```

or

```text
$5,234.87
  vv -3.2%      (red, small, with down arrow icon)
```

### Files to modify:
- `src/components/ui/table.tsx` - Ensure clean base styling, remove hover overlap issues
- `src/components/tables/CampaignTable.tsx` - Apply black text, add delta badges
- `src/components/tables/CampaignTableTotalRow.tsx` - Same treatment
- All other table components (KeywordTargetingTable, SearchTermsTable, ProductAdsTable, AdGroupsTable, etc.) - Apply same pattern

### New utility component: `src/components/ui/delta-badge.tsx`

```typescript
interface DeltaBadgeProps {
  value: number; // percentage change
}
// Renders a small inline badge: green up arrow + percentage or red down arrow
```

---

## Phase 7: Annotation Widget - FigJam Style

### File: `src/components/workspace/AnnotationWidget.tsx`

Replace plain textarea with a post-it note style:
- Background colors: rotate through soft yellow (#FEF9C3), soft pink (#FCE7F3), soft blue (#DBEAFE), soft green (#DCFCE7)
- Slight random rotation (-2deg to +2deg) per note
- Pin/thumbtack icon in top-right corner
- Handwriting-like font hint (slightly rounded, casual)
- Shadow to give lifted appearance
- Textarea still functional inside

---

## Phase 8: Widget Drag and Drop

### File: `src/components/workspace/WidgetCanvas.tsx`

Implement drag-and-drop reordering using native HTML5 drag API:
- Each widget gets `draggable="true"`
- `onDragStart`, `onDragOver`, `onDrop` handlers
- Visual feedback: dragged widget gets opacity reduction, drop target gets highlighted border
- On drop: reorder the widgets array and persist

---

## Phase 9: Sidebar Z-Index Fix

### File: `src/components/layout/AppLayout.tsx` and `src/index.css`

Ensure the sidebar does not have an elevated z-index. It should sit on the same layer as the main content. Remove any `z-50` or similar from the sidebar component. The sidebar is part of the flex layout, not overlaid.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/delta-badge.tsx` | Micro delta indicator for table cells |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/profitability/GeographyMap.tsx` | Complete rewrite with proper world map SVG |
| `src/components/layout/AppSidebar.tsx` | Rename to Sandbox, multi-dashboard nav, Aan button redesign, edge nook collapse |
| `src/components/layout/AppLayout.tsx` | Z-index fix, sidebar relative positioning |
| `src/pages/workspace/Dashboard.tsx` | Multi-dashboard system, "Create New" instead of "Duplicate" |
| `src/components/workspace/AnnotationWidget.tsx` | FigJam-style post-it notes |
| `src/components/workspace/WidgetCanvas.tsx` | Drag-and-drop reordering |
| `src/components/ui/table.tsx` | Clean base styling |
| `src/components/tables/CampaignTable.tsx` | Black text, delta badges |
| `src/components/tables/CampaignTableTotalRow.tsx` | Same |
| `src/components/tables/KeywordTargetingTable.tsx` | Same |
| `src/components/tables/SearchTermsTable.tsx` | Same |
| `src/components/tables/ProductAdsTable.tsx` | Same |
| `src/components/tables/AdGroupsTable.tsx` | Same |
| `src/components/tables/ImpactTable.tsx` | Same |
| `src/components/tables/RegionalTable.tsx` | Same |
| `src/components/tables/PageTypeTable.tsx` | Same |
| `src/components/tables/PlatformTable.tsx` | Same |
| `src/components/workspace/TableWidget.tsx` | Same pattern |
| `src/index.css` | Remove table hover overlap hacks, clean density styles |

## Implementation Order

1. Rename Workspace to Sandbox + multi-dashboard system
2. Sidebar edge nook collapse button + z-index fix
3. Aan button redesign (sleek pill)
4. Geography map complete replacement
5. Delta badge component
6. Table redesign across all tables
7. Annotation widget FigJam style
8. Widget drag-and-drop
9. End-to-end testing
