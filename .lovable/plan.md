## Fix: Aan Sidebar Logo, Prompt Notch, App Level Selector, Date Picker, Toolbar Icons, Trends Chart

### Issues to Fix

1. **Aan sidebar collapsed state** shows full AanLogo (Sparkles + "Aan" text) instead of just the symbol icon like main AppSidebar
2. **Prompt suggestion notch** needs more polished design
3. **App Level Metric Selector** too small and not prominent enough
4. **Date range calendar** needs better design with proper spacing
5. **Table column sorting/pinning** not visible in table headers
6. **Delta button** missing label text — only shows icon, while other toolbar buttons show icon + name
7. **Profitability Trends scatter chart** lacks chart controls (expand, chart type, zoom) that other data visualizations have

---

### Aan Sidebar + Prompt Notch + Toolbar Delta Label

**AanWorkspaceSidebar.tsx** — Collapsed state (line 62-114):

- Replace `<AanLogo>` with the same symbol logo pattern used in AppSidebar: `<img src={logoSymbolSrc}>`
- Import the 4 logo SVGs and use theme-aware logic identical to AppSidebar
- Expanded header (line 120): replace `<AanLogo>` with Aan-branded symbol + "Aan" text using same layout as AppSidebar (logo left, PanelLeft right)

**AanInput.tsx** — Redesign the suggestion notch (lines 208-236):

- Add a subtle left-side gradient accent bar (2px wide, primary gradient)
- Use a softer glass-like background with `bg-card/80 backdrop-blur-sm`
- Add a subtle shimmer animation on appearance
- Better typography: "Suggested" label in small caps, prompt in medium weight
- Smooth slide-up + fade-in animation from text box edge
- The notch should visually connect to the textbox border (no gap, shared border radius)

**DataTableToolbar.tsx** — Delta button (lines 188-198):

- Add "Delta" text label next to the TrendingUp icon, matching all other toolbar buttons (icon + text pattern)
- Change from `w-8 p-0` to `gap-1 text-xs` like Filter/Export buttons

**Edit button** (lines 349-359):

- Add "Edit" text label next to Pencil icon, same pattern

###  App Level Selector Redesign + Date Range Calendar

**AppLevelSelector.tsx** — Make it bigger and more visible:

- Increase trigger button size: `h-9` instead of `py-1.5`, larger text `text-sm` instead of `text-xs`
- Add a subtle background: `bg-muted/50` with `rounded-lg` 
- Marketplace logo larger: `h-5` instead of `h-4`
- Store name in `text-sm font-medium` instead of `text-xs`
- Status dot slightly larger
- Dropdown wider: `w-[280px]` instead of `w-[240px]`
- Children items (Catalogue, Ad Type selects) should also be slightly larger

**AppTaskbar.tsx** — Date range calendar redesign (lines 131-181):

- Add preset group section headers with proper uppercase styling and spacing (reference image-148)
- Highlight selected preset with `bg-primary/10 text-primary` 
- Calendar: increase padding, add month labels more prominently
- Selected range: use `bg-primary text-primary-foreground` for selected days with `bg-primary/20` for range between
- Add "Cancel" and "Apply" buttons with proper sizing and primary styling on Apply
- Overall wider preset panel with clearer visual hierarchy

---

###  Table Header Sort/Pin + Trends Chart Controls

**All table components** (CampaignTable, ProductsPnLTable, AdGroupsTable, etc.):

- Add sort indicator icons (ArrowUpDown) on hoverable table headers
- Add small pin icon on header hover (Pin icon appears on right of header cell)
- On click: toggle sort direction (asc/desc/none)
- Pinned columns show filled Pin icon

**ScatterPlotChart.tsx** — Wrap in ChartContainer or add equivalent controls:

- Add chart type selector (Scatter is default, also offer Bar, Line views of same data)
- Add expand/fullscreen button
- Add zoom controls (+/- buttons)
- Add export button for the chart
- Keep quadrant backgrounds and legend

**Trends.tsx** — Wire the enhanced ScatterPlotChart with ChartContainer wrapper providing metrics toggle, chart type, and expand controls

---

### Files Summary


| File                      | Phase | Change                                                                         |
| ------------------------- | ----- | ------------------------------------------------------------------------------ |
| `AanWorkspaceSidebar.tsx` | 1     | Use symbol logo in collapsed state, match AppSidebar pattern                   |
| `AanInput.tsx`            | 1     | Redesign prompt suggestion notch with gradient accent bar and better animation |
| `DataTableToolbar.tsx`    | 1     | Add "Delta" and "Edit" text labels to their buttons                            |
| `AppLevelSelector.tsx`    | 2     | Larger, more prominent trigger with bigger logo and text                       |
| `AppTaskbar.tsx`          | 2     | Redesign date range calendar with better presets and styling                   |
| `ScatterPlotChart.tsx`    | 3     | Add chart controls (expand, zoom, chart type, export)                          |
| `Trends.tsx`              | 3     | Wire enhanced chart controls                                                   |
| Table header components   | 3     | Add visible sort arrows and pin icons on hover                                 |
