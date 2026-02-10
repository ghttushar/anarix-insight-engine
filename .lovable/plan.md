

# Comprehensive UI Overhaul Plan

This is a large, multi-phase implementation covering a new Workspace screen, universal top taskbar, floating island fixes, copilot panel redesign, sidebar collapse, table fixes, map fix, and alignment cleanup.

---

## What Changes

| # | Feature | Summary |
|---|---------|---------|
| 1 | **Universal Top Taskbar** | New fixed top bar with marketplace/store selector (searchable), dark/light toggle, profile switcher -- visible everywhere except Aan workspace |
| 2 | **Master Dashboard (Workspace)** | New canvas-based analytics sandbox with draggable/resizable widgets (Metric, Chart, Table, Annotation, Task) |
| 3 | **Floating Island Cleanup** | Universal with fixed actions: Ask Aan, Insights, Refresh, Export, Screenshot. Hidden on login/onboarding/settings. Prominent reopen button |
| 4 | **Copilot Panel Redesign** | Opens sideways on the same layer (not overlay/blur), pushes content left |
| 5 | **Left Sidebar Collapsible** | Add collapse/expand button; auto-collapse when copilot opens |
| 6 | **Aan Button Redesign** | Replace current gradient sticker look with a sleek, highlighted but creative design |
| 7 | **Marketplace Selector** | Use real Amazon/Walmart logos; dropdown doubles as searchbar for store names |
| 8 | **Table Fixes** | Fix hover overlap, alignment, and consistency across all tables |
| 9 | **Geography Map Fix** | Proper world map SVG with US/Canada/Mexico active, hand cursor, click/scroll support |
| 10 | **Density (Compact/Comfortable)** | Ensure CSS classes actually affect table rows and card padding |
| 11 | **Move selectors to top taskbar** | Remove marketplace/account from sidebar, put in universal taskbar |

---

## Phase 1: Universal Top Taskbar

### New Component: `src/components/layout/AppTaskbar.tsx`

A fixed 48px top bar present on all app pages (not login, not Aan workspace).

```text
[Amazon Logo v] [Demo Store (searchable) v] ──────── [Sun/Moon toggle] [Profile Avatar v]
```

**Structure:**
- **Left**: Marketplace dropdown (with real Amazon/Walmart logos as images), Account/Store dropdown with built-in search input
- **Right**: Light/Dark mode toggle button, Profile avatar dropdown (Profile, Settings, Logout)
- Height: 48px, sticky top, border-bottom, bg-card
- The marketplace dropdown items show the real Amazon/Walmart logo images
- The store dropdown has an input field at top for filtering store names

### Integration
- Added to `AppLayout.tsx` above the sidebar+content flex
- Marketplace and account selectors REMOVED from `AppSidebar.tsx`
- Dark/Light toggle also remains in Preferences page

### Assets needed
- Amazon logo SVG/PNG saved to `src/assets/amazon-logo.png`
- Walmart logo SVG/PNG saved to `src/assets/walmart-logo.png`

---

## Phase 2: Sidebar Updates

### File: `src/components/layout/AppSidebar.tsx`

**Remove:**
- Marketplace selector section
- Account selector section

**Add:**
- Collapse/expand toggle button at bottom of sidebar
- When copilot panel opens, sidebar auto-collapses

**Aan Button Redesign:**
Replace the current gradient block with a sleek design:
- Outlined button with subtle gradient border
- Sparkles icon with gradient text
- "Aan" in Allura font
- On hover: gradient fills in softly
- Not a solid gradient block (current "sticker" look)

---

## Phase 3: Copilot Panel Redesign

### File: `src/components/aan/AanCopilotPanel.tsx`

**Current:** Fixed right panel with backdrop blur overlay
**New:** Inline side panel on the same layer

Changes:
- Remove the backdrop overlay (`bg-black/4 backdrop-blur`)
- Panel renders as part of the layout flow, not fixed overlay
- Content area shrinks to accommodate the panel
- Sidebar auto-collapses when panel opens

### File: `src/components/layout/AppLayout.tsx`

Update layout to accommodate inline copilot:

```text
[Taskbar]
[Sidebar | Main Content | Copilot Panel (when open)]
```

The copilot panel width (420px) is subtracted from main content area rather than overlaying.

---

## Phase 4: Floating Island Cleanup

### File: `src/features/creative/FloatingActionIsland.tsx`

**Fixed actions (same on all pages):**
- Ask Aan (opens copilot)
- Insights
- Refresh
- Export
- Screenshot

Remove all contextual/page-specific actions (New Campaign, Filter, Schedule).

**Hidden routes:** `/login`, `/onboarding`, all `/settings` paths

**Prominent reopen button:**
- When closed, show a larger, more visible button (not tiny logo orb)
- Use a pill shape with gradient border: `[Sparkles icon] Anarix` or just a larger rounded button with clear icon

---

## Phase 5: Master Dashboard / Workspace Screen

### New Files:
- `src/pages/workspace/Dashboard.tsx` -- Main workspace canvas
- `src/components/workspace/WidgetCanvas.tsx` -- Grid-based canvas
- `src/components/workspace/MetricWidget.tsx` -- Single KPI display
- `src/components/workspace/ChartWidget.tsx` -- Chart with type switching
- `src/components/workspace/TableWidget.tsx` -- Lightweight data table
- `src/components/workspace/AnnotationWidget.tsx` -- Post-it note
- `src/components/workspace/TaskWidget.tsx` -- Checkbox to-do list
- `src/components/workspace/WidgetHeader.tsx` -- Shared widget header
- `src/components/workspace/AddWidgetModal.tsx` -- Widget picker dialog

### Navigation
- Add "Workspace" as a new top-level nav item in sidebar (above Profitability)
- Route: `/workspace`

### Canvas Behavior
- CSS Grid-based layout (not drag library initially -- use `react-resizable-panels` or CSS grid with manual sizing)
- Widgets snap to grid cells
- Each widget has: header (title + controls), body (content), resize handle
- Global filters at top: Date range, Marketplace, Account
- Widgets inherit global filters by default, can override locally (shown with indicator)

### Widget Details

**Metric Widget:**
- Dropdown to select metric (ROAS, Spend, Sales, etc.)
- Large number display
- Optional delta percentage
- Optional mini sparkline

**Chart Widget:**
- Platform selector (Amazon/Walmart)
- Entity selector (Account/Campaign/Ad Group/Keyword/Product)
- Primary metric (required) + up to 2 secondary
- Chart type switcher: Line, Bar, Stacked Bar, Area, Pie, Table
- Toggle controls: Legend, Axis labels, Grid
- Uses existing Recharts library

**Table Widget:**
- Max 10-15 visible rows
- Sort, filter, column visibility
- "Open Full View" button routes to relevant Anarix screen

**Annotation Widget:**
- Textarea, max 10 lines, plain text
- Optional link chip to a widget or dashboard

**Task Widget:**
- Checkbox list, max 10 items
- Optional due date per item

### State Persistence
- Dashboard state saved to localStorage
- Support: Duplicate, Rename, Reset

---

## Phase 6: Table Fixes

### Issue: Hover rows overlap/misalign

**Root cause:** Table rows may have content that overflows or inconsistent padding.

### File: `src/components/ui/table.tsx`

Fix TableRow hover:
- Add `relative` to prevent z-index overlap issues
- Ensure consistent row height

### Global table CSS in `src/index.css`:

```css
/* Fix table hover overlap */
table tbody tr {
  position: relative;
}

table tbody tr:hover {
  z-index: 1;
}

/* Ensure consistent cell alignment */
table th, table td {
  vertical-align: middle;
  white-space: nowrap;
}
```

### Per-table fixes:
- `CatalogProductsTable.tsx`: Fix column alignment, ensure consistent widths
- `CampaignTable.tsx`: Already looks correct, verify hover
- All other tables: Audit for consistent header/cell alignment

---

## Phase 7: Geography Map Fix

### File: `src/components/profitability/GeographyMap.tsx`

Replace current simplified SVG paths with a proper world map vector. Use Natural Earth simplified world GeoJSON converted to SVG paths for accurate country boundaries.

Key changes:
- Accurate SVG paths for all continents
- US, Canada, Mexico: colored by data intensity, `cursor: pointer` on hover
- All other countries: muted fill, `cursor: default`
- Hand cursor (pointer) on active regions
- Map is scrollable/pannable within its container
- Tooltip on hover showing country name + sales data

---

## Phase 8: Density Fix Verification

### Current state:
- `DensityContext.tsx` applies CSS classes correctly
- `index.css` has `.density-compact` and `.density-comfortable` rules
- Rules target `table tbody tr td` padding

### Issue:
Tables may use custom padding that overrides density. Need to ensure density CSS has higher specificity or uses `!important` for table cells.

### Fix in `src/index.css`:
```css
.density-compact table tbody tr td {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

.density-compact table tbody tr {
  height: 32px !important;
}
```

---

## Files Summary

### New Files (10)
| File | Purpose |
|------|---------|
| `src/components/layout/AppTaskbar.tsx` | Universal top taskbar |
| `src/pages/workspace/Dashboard.tsx` | Workspace canvas page |
| `src/components/workspace/WidgetCanvas.tsx` | Grid-based widget canvas |
| `src/components/workspace/MetricWidget.tsx` | Single KPI widget |
| `src/components/workspace/ChartWidget.tsx` | Chart exploration widget |
| `src/components/workspace/TableWidget.tsx` | Lightweight table widget |
| `src/components/workspace/AnnotationWidget.tsx` | Post-it note widget |
| `src/components/workspace/TaskWidget.tsx` | To-do list widget |
| `src/components/workspace/WidgetHeader.tsx` | Shared widget header |
| `src/components/workspace/AddWidgetModal.tsx` | Widget type picker |

### Modified Files (10)
| File | Changes |
|------|---------|
| `src/components/layout/AppLayout.tsx` | Add taskbar, inline copilot support, sidebar collapse |
| `src/components/layout/AppSidebar.tsx` | Remove selectors, add collapse button, redesign Aan button, add Workspace nav |
| `src/components/aan/AanCopilotPanel.tsx` | Remove overlay/blur, make inline side panel |
| `src/features/creative/FloatingActionIsland.tsx` | Universal fixed actions, prominent reopen, hide on login/settings |
| `src/components/profitability/GeographyMap.tsx` | Proper world map SVG, cursor pointer |
| `src/components/ui/table.tsx` | Fix hover overlap with relative positioning |
| `src/index.css` | Density fixes, table alignment CSS |
| `src/App.tsx` | Add workspace route |
| `src/contexts/ThemeContext.tsx` | Verify light default |
| `src/components/aan/AanContext.tsx` | Add sidebar collapse communication |

### Asset Files (2)
| File | Purpose |
|------|---------|
| `src/assets/amazon-logo.png` | Amazon marketplace logo |
| `src/assets/walmart-logo.png` | Walmart marketplace logo |

---

## Implementation Order

1. Universal top taskbar + remove selectors from sidebar
2. Sidebar collapse button + Aan button redesign
3. Copilot panel inline (remove overlay/blur)
4. Floating island cleanup + prominent reopen
5. Table hover/alignment fixes
6. Geography map SVG replacement
7. Density CSS specificity fix
8. Workspace page + widget system (largest piece)
9. Route registration + navigation update
10. End-to-end testing

