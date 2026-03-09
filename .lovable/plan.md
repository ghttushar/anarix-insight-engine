
## What the user wants
The Component Library page must show EVERY element statically — no clicks, no hovers, no animations — so it can be screenshotted and imported into Figma as editable components. Currently:

1. **Overlays section** shows only trigger buttons (Dialog, Sheet, Drawer, DropdownMenu, HoverCard, Popover, Command, ContextMenu) — the actual content is hidden behind interaction
2. **Accordion** collapses content — it should show expanded
3. **Collapsible** hides content — it should show expanded
4. **Missing custom app components**: KPICard, InlineKPIStrip, UnderlineTabs, TableSkeleton, CardSkeleton, ChartSkeleton, MetricSkeleton, ToggleGroup
5. **No animations** — need to remove any `transition-*`, `animate-*` classes from the static showcase
6. **Forms** section needs to show all input states (default, error, disabled) statically visible, not just one input

## Plan

### Single file change: `src/pages/settings/ComponentLibrary.tsx`

**Remove all trigger-based components. Replace with static inline representations:**

**Overlays section — show static anatomy (not triggers):**
- **Dialog**: Render the dialog box structure inline (header + body + footer + close icon) as a styled `div` with border/shadow — no `<Dialog>` trigger
- **AlertDialog**: Render inline as styled `div` with header + destructive action buttons
- **Sheet**: Render as a static panel with border-l showing slide-in layout
- **Drawer**: Render as a static bottom-panel structure
- **Popover**: Render inline as a floating card with shadow/border
- **HoverCard**: Same — render inline static card
- **Tooltip**: Render as a static bubble over a button
- **DropdownMenu**: Render as a static open menu list
- **ContextMenu**: Render as a static open menu list
- **Command palette**: Render as static open search + results list

**Collapsed components — force open:**
- **Accordion**: Use `defaultValue="item-1 item-2"` with `type="multiple"` so both items show content
- **Collapsible**: Render `CollapsibleContent` outside the collapsible wrapper so it's always visible
- **Tabs**: Show all tab panels simultaneously stacked with labels instead of just one

**Add missing app-specific components:**
- **KPICard** — show 4 examples (currency up, currency down, percentage neutral, number up)
- **KPICardsRow** — show a full 4-card row
- **InlineKPIStrip** — show static strip with 3 KPI items
- **UnderlineTabs** — show static with active and inactive tab states (no click handler needed since it's static)
- **TableSkeleton** — show with 3 rows, 4 cols
- **CardSkeleton** — show
- **ChartSkeleton** — show

**Remove all animations from showcase:**
- Remove `transition-*` classes from components where possible (pass className overrides)
- The `CircularProgress` SVG has `transition-all duration-300` on the circle — this is fine for screenshot (it's already rendered)
- `Skeleton` uses `animate-pulse` — for Figma accuracy, override with `animate-none` where used

**Form Controls — show all states:**
- Input: Default, Disabled, Error (red border), with value filled in
- Textarea: Default, Disabled
- Select: Show one in closed state (default appearance)
- Checkbox: Unchecked, Checked (defaultChecked), Disabled unchecked, Disabled checked
- Switch: Off, On (defaultChecked), Disabled
- Radio: Show all 3 options with one checked

**Cards section — expand:**
- Show 3 card variants: minimal (no footer), with description, with footer actions
- Show the KPICard component (from app's own card components)

**Table — expand:**
- Add more columns: Name, Status, Budget, Impressions, Clicks, ROAS, Delta
- Show row states: normal, selected (bg-muted), disabled (opacity-50)

**Structure (sections in order):**
1. Typography
2. Buttons (all variants, sizes, disabled — static)
3. Toggle & ToggleGroup (show pressed/unpressed states statically)
4. Form Controls — Inputs (all states), Textarea, Select, Checkbox (all states), Switch (all states), RadioGroup, Slider (static position shown), Calendar
5. Badges & Chips
6. KPICard (app component)
7. InlineKPIStrip (app component)
8. UnderlineTabs (app component)
9. Data Display — Separator, Avatar, Progress, CircularProgress, Skeleton variants, TableSkeleton, CardSkeleton
10. Alerts
11. Cards (3 variants)
12. Table (expanded, with row states)
13. Navigation — Breadcrumb, Tabs (all panels visible), Accordion (all open), Pagination, Menubar (static)
14. Overlays (all rendered as static inline anatomy)
15. Layout — ScrollArea, Resizable, Collapsible (content shown)

**No interactions** — remove `onClick` handlers that update state for progress/slider (still show static values). Keep `useState` only where needed to show a pre-set state visually.

### Files Modified
| File | Change |
|------|--------|
| `src/pages/settings/ComponentLibrary.tsx` | Complete rewrite — static-only, no trigger-based overlays, all states visible, all app components included, no animations |
