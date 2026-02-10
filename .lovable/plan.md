

# Comprehensive UI Overhaul: Layout, Map, Tables, and Orion-Inspired Design

## Issues Identified

| # | Problem | Root Cause |
|---|---------|------------|
| 1 | Sidebar pushed below taskbar | Sidebar uses `fixed inset-y-0` which starts from viewport top, but taskbar takes 48px. Sidebar needs `top: 48px` offset |
| 2 | Geography map still crude blobs | SVG paths are hand-drawn approximations, not real geography |
| 3 | Tables missing delta badges | DeltaBadge component exists but is not imported/used in any table |
| 4 | Table hover overlapping | `relative` + `z-index` on hover causes stacking issues with sticky columns |
| 5 | Design lacks Orion-level polish | Tables, cards, and charts need cleaner spacing, subtle shadows, and refined typography |

---

## Phase 1: Fix Sidebar Alignment with Taskbar

### File: `src/components/ui/sidebar.tsx` (line 195)

The sidebar inner container uses `fixed inset-y-0` which means it starts from the very top of the viewport. Since the taskbar is 48px tall, the sidebar renders behind it.

**Fix**: Change the fixed sidebar to account for the taskbar height:
- Replace `inset-y-0` with `top-12 bottom-0` (48px = 3rem = Tailwind `top-12`)
- Change `h-svh` to `h-[calc(100svh-48px)]` on both the spacer div and the fixed container

### File: `src/components/layout/AppLayout.tsx`

No changes needed here -- the flex layout is correct.

---

## Phase 2: Replace Geography Map with Orion-Inspired Hexagonal Map

Inspired by Orion's hexagonal world map design (light purple hexagons forming continent shapes with data-intensity coloring), the new map will use:

### File: `src/components/profitability/GeographyMap.tsx` -- Complete Rewrite

**Design approach** (inspired by Orion's hexagonal world map):
- Use a dot-grid or hexagonal-point based world map representation
- Each "dot" or hexagon represents a geographic area
- Active regions (US, Canada, Mexico) shown with filled purple/periwinkle hexagons at varying intensity
- Inactive regions shown with light gray/muted dots
- City/region callout cards floating on the map (like Orion's "Chicago 98,320,300" cards)
- Clean, modern aesthetic with soft purple color palette
- Summary KPI cards on the left side (Total Sales, Orders, Units)
- Circular progress indicators for key percentages

**Implementation**:
- Replace SVG path-based map with a grid of small circles/hexagons positioned to form continent shapes
- Each point has coordinates mapped to approximate geographic positions
- Active country points get `cursor: pointer`, data-intensity fill colors
- Hover reveals tooltip card with region name + key metrics
- Selected region highlighted with primary color border

**Key visual elements from Orion**:
- Floating metric cards with icon + label + value
- Subtle gradient background on the map container
- Clean sans-serif typography for labels
- Purple-to-blue color scale for data intensity

---

## Phase 3: Table Redesign with Delta Badges

### Approach

Every numeric cell that represents a metric (Spend, Sales, ROAS, Impressions, etc.) will show the value in black text (`text-foreground`) with a micro delta badge underneath when there is a change to display.

The `DeltaBadge` component already exists at `src/components/ui/delta-badge.tsx`. It needs to be imported and used in every table.

### Mock Data Enhancement

Since current mock data does not include `previousValue` or `delta` fields, we will add random delta percentages to each table row for demonstration. This will be done via a helper function that generates consistent deltas based on the row ID (seeded).

### Files to modify (all tables):

**`src/components/tables/CampaignTable.tsx`**:
- Import `DeltaBadge`
- Wrap each numeric cell in a vertical flex container:
  ```
  <div className="flex flex-col items-end">
    <span className="text-foreground">{formatCurrency(campaign.spend)}</span>
    <DeltaBadge value={getDelta(campaign.id, 'spend')} />
  </div>
  ```

**Apply same pattern to**:
- `CampaignTableTotalRow.tsx`
- `AdGroupsTable.tsx`
- `KeywordTargetingTable.tsx`
- `SearchTermsTable.tsx`
- `ProductAdsTable.tsx`
- `RegionalTable.tsx`
- `ImpactTable.tsx` (already has its own delta system, clean it up)
- `PageTypeTable.tsx`
- `PlatformTable.tsx`

### Table Hover Fix

**File: `src/index.css`** -- Remove the z-index hover hack:
```css
/* REMOVE these rules */
table tbody tr { position: relative; }
table tbody tr:hover { z-index: 1; }
```

**File: `src/components/ui/table.tsx`**:
- Remove `relative` from TableRow className
- Use simple `hover:bg-muted/50` without z-index manipulation
- Ensure sticky columns use proper `bg-inherit` to prevent hover bleed

### Table Design Polish (Orion-inspired):

- Header row: subtle `bg-muted/40` with `text-xs uppercase tracking-wider text-muted-foreground`
- Body rows: `h-11` (44px) fixed height, clean borders
- Cell text: all `text-foreground` (black in light mode)
- Hover: simple `bg-muted/30` background change, no position/z-index tricks
- Total row: `bg-muted/20` with `font-semibold`
- Numbers right-aligned with consistent padding
- Delta badges: 11px font, green/red with tiny arrow icon, directly under the value

---

## Phase 4: Orion-Inspired Design Polish

### KPI Cards (`src/components/cards/KPICard.tsx`)
- Clean card with subtle border
- Large number in bold
- Delta percentage in green/red next to the value (like Orion's "$12,875 +10%")
- Small label text above
- Optional mini sparkline chart

### Color System Refinements in `src/index.css`:
- Add subtle card shadow: `shadow-[0_1px_3px_rgba(0,0,0,0.04)]`
- Refine border colors for softer appearance
- Add smooth transitions for all interactive elements

### Typography Improvements:
- Ensure Satoshi font loads correctly (current CORS error with fontshare API)
- Fallback to system fonts gracefully
- Consistent heading sizes across pages

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/utils/deltaGenerator.ts` | Helper to generate consistent delta percentages for mock data |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ui/sidebar.tsx` | Fix sidebar top offset for taskbar (top-12 instead of inset-y-0) |
| `src/components/profitability/GeographyMap.tsx` | Complete rewrite with Orion-inspired hexagonal dot map |
| `src/components/ui/table.tsx` | Remove `relative` from TableRow, clean hover styles |
| `src/index.css` | Remove z-index table hack, add Orion-inspired polish, fix font loading |
| `src/components/tables/CampaignTable.tsx` | Add DeltaBadge to all numeric cells |
| `src/components/tables/CampaignTableTotalRow.tsx` | Add DeltaBadge |
| `src/components/tables/AdGroupsTable.tsx` | Add DeltaBadge |
| `src/components/tables/KeywordTargetingTable.tsx` | Add DeltaBadge |
| `src/components/tables/SearchTermsTable.tsx` | Add DeltaBadge |
| `src/components/tables/ProductAdsTable.tsx` | Add DeltaBadge |
| `src/components/tables/RegionalTable.tsx` | Add DeltaBadge |
| `src/components/tables/ImpactTable.tsx` | Clean up existing delta display |
| `src/components/tables/PageTypeTable.tsx` | Add DeltaBadge |
| `src/components/tables/PlatformTable.tsx` | Add DeltaBadge |

## Implementation Order

1. Fix sidebar alignment (sidebar.tsx -- top offset)
2. Fix table hover (remove z-index hack from index.css and table.tsx)
3. Create delta generator utility
4. Add DeltaBadge to all tables
5. Replace geography map with hexagonal dot map
6. Apply Orion-inspired design polish (shadows, typography, spacing)
7. Fix font loading (Satoshi CORS issue)

