
# Design System Documentation - Multi-Phase Implementation Plan

## Overview
Creating a comprehensive, no-corner-cutting design system documentation page at `/settings/design-system` covering every element used in Anarix.

---

## Phase 1: Foundation & Infrastructure (CURRENT)

### What to Build
1. **New route & page structure**
   - Add `/settings/design-system` route to App.tsx
   - Create `src/pages/settings/DesignSystem.tsx` with section-based navigation
   
2. **Core documentation sections (Phase 1)**
   - **Color System**: Complete Periwinkle palette (light/dark), data viz colors, gradients
   - **Typography**: Satoshi/Noto Sans/Allura scales, all sizes, weights, usage rules
   - **Spacing & Layout**: Grid system, density modes, margin/padding tokens

### Component Structure
- Tabbed interface with sections: Colors, Typography, Components, Icons, Charts, States
- Live interactive examples for every element
- Code snippets showing exact implementation
- "Copy code" buttons for each example

---

## Phase 2: Component Library Documentation

### What to Document
1. **Buttons** (all variants)
   - Primary: default, hover, active, disabled, loading states
   - Secondary: outline variant + states
   - Destructive: red variant + states
   - Ghost, Link variants
   - Size variants: sm, default, lg, icon
   - Code examples for each

2. **Form Elements**
   - Input: default, focus, error, disabled, with icons
   - Textarea: all states
   - Select/Dropdown: closed, open, selected states
   - Checkbox: unchecked, checked, indeterminate, disabled
   - Radio: states
   - Switch/Toggle: on/off states
   - Label component

3. **Data Display**
   - Card: default, with header, with footer
   - Badge: all 4 variants (default, secondary, destructive, outline)
   - StatusBadge: live, paused, archived, scheduled, out_of_budget, completed
   - Table: header styles, row states (default, hover, selected), sticky columns
   - Delta badges: positive/negative/neutral indicators

4. **Layout Components**
   - AppLayout structure
   - Sidebar: expanded/collapsed states, navigation patterns
   - PageHeader with breadcrumbs
   - Taskbar controls

---

## Phase 3: Interactive Components & Patterns

### What to Document
1. **Dialogs & Modals**
   - Dialog: standard content layout
   - AlertDialog: confirmation pattern with examples
   - Sheet: slide-in panels
   - Drawer: bottom sheets

2. **Menus & Dropdowns**
   - DropdownMenu: trigger + content + items
   - ContextMenu
   - Popover
   - Tooltip: all positions

3. **Navigation**
   - Breadcrumb component
   - Tabs: default vs underline style
   - Accordion/Collapsible
   - Pagination

4. **Feedback Components**
   - Toast/Sonner: success, error, info, warning
   - Alert component
   - Progress indicators
   - Loading states (skeleton, spinner, inline)

---

## Phase 4: Charts & Data Visualization

### What to Document
1. **Chart Types**
   - LineChart: single/multi-series, axes, grid
   - BarChart: vertical/horizontal
   - AreaChart: stacked/unstacked
   - PieChart: with legend
   - ScatterPlot: quadrant layout (profitability)
   - HeatMap: day-parting visualization

2. **Chart Components**
   - ChartContainer wrapper
   - Tooltip styling
   - Legend positioning
   - Metric selector UI
   - Chart type switcher
   - Color assignments (MUST NOT use data viz colors for branding)

3. **Data Visualization Colors**
   - Reserved palette: green (success), red (error), yellow (warning)
   - Chart-specific color scales
   - Accessibility notes

---

## Phase 5: Icons & Illustrations

### What to Document
1. **Icon System**
   - Complete Lucide icon inventory (scan all 114 files using icons)
   - Icon sizes: 3.5, 4, 5, 6, 7, 8 (in h-/w- classes)
   - Usage by category:
     - Navigation icons
     - Action icons
     - Status icons
     - Data icons
   - Aan gradient icon styling

2. **Logo Assets**
   - Full logo (light/dark)
   - Icon-only versions
   - Usage guidelines

---

## Phase 6: States & Interactions

### What to Document
1. **All Interactive States**
   - Default
   - Hover (with exact hover styles)
   - Active/Pressed
   - Focus (ring styles)
   - Disabled
   - Loading
   - Selected/Active navigation

2. **Motion & Transitions**
   - Allowed: opacity, position shift ≤8px, scale ≤1.02, height expand
   - Forbidden: parallax, bounce, elastic, infinite loops
   - Timing: 120-150ms (fast), 180-220ms (standard), 240ms max
   - Easing: cubic-bezier(0.2, 0.0, 0.0, 1.0)

3. **Density Modes**
   - Comfortable: 44px rows, 16px card padding, 40px buttons
   - Compact: 32px rows, 12px card padding, 36px buttons, 13px base font

---

## Technical Implementation Details

### Page Structure
```
/settings/design-system
├── Color Palette (expandable sections)
│   ├── Light Theme
│   ├── Dark Theme
│   ├── Data Viz Colors (RESERVED)
│   └── Gradients (Aan only)
├── Typography
│   ├── Font Families
│   ├── Size Scale
│   └── Usage Examples
├── Components
│   ├── Buttons (live examples + code)
│   ├── Forms
│   ├── Cards
│   ├── Badges
│   └── Tables
├── Icons
│   ├── By Category
│   └── Size Reference
├── Charts
│   ├── Chart Types
│   └── Color Rules
└── States & Motion
    ├── Interaction States
    ├── Transitions
    └── Density Modes
```

### Each Section Will Include
1. **Visual Example**: Live rendered component
2. **Code Snippet**: Copy-paste ready
3. **Properties Table**: All available props
4. **Usage Guidelines**: When to use
5. **Accessibility Notes**: ARIA, keyboard nav

---

## Inventory Findings (from codebase scan)

### UI Components (41 total)
- accordion, alert-dialog, alert, aspect-ratio, avatar
- badge, bento-grid, breadcrumb, button, calendar
- card, carousel, chart, checkbox, chip
- circular-progress, collapsible, command, context-menu, delta-badge
- dialog, drawer, dropdown-menu, form, hover-card
- input, input-otp, label, loader, loading-skeletons
- menubar, navigation-menu, pagination, popover, progress
- radio-group, resizable, scroll-area, select, separator
- sheet, sidebar, skeleton, slider, sonner
- switch, table, tabs, textarea, toast
- toaster, toggle-group, toggle, tooltip, use-toast

### Icons Used (scan found 114 files)
Will extract full icon list in Phase 5 implementation

### Status Colors (from index.css)
- Live: green
- Paused: muted
- Archived: muted/faded
- Scheduled: primary
- Out of Budget: warning
- Completed: muted

---

## File Changes Summary

**Create:**
- `src/pages/settings/DesignSystem.tsx` (main documentation page)

**Modify:**
- `src/App.tsx` (add route)
- `src/components/layout/AppSidebar.tsx` (add "Design System" link under Settings dropdown)

---

## Phase Delivery Strategy

**Phase 1** (this plan): Colors, Typography, Spacing
**Phase 2**: Buttons, Forms, Data Display components
**Phase 3**: Dialogs, Menus, Navigation
**Phase 4**: All chart types and viz rules
**Phase 5**: Complete icon inventory
**Phase 6**: States, motion, density documentation

Each phase produces a fully functional, shippable section. User can request next phase when ready.
