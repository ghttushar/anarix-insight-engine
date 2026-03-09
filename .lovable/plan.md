

## Plan: Convert Component Library to Light-Only Mode & Add All Missing Components

### 1. Change Layout from Dual-Theme to Light-Only

**Current behavior**: The page displays two columns (light + dark) with forced theme classes.

**New behavior**: Single full-width view forced to light mode regardless of global theme toggle.

**Implementation**:
- Remove the two-column grid layout
- Wrap entire showcase in a single container with `className="light"` to force light theme
- Remove dark mode column and header
- Update page subtitle to reflect light-only mode

### 2. Add All Missing UI Components

**Currently missing from ComponentLibrary.tsx**:

**Form Controls**:
- Textarea
- Radio Group
- Slider
- Calendar (date picker)

**Layout/UI**:
- Separator (horizontal/vertical dividers)
- Breadcrumb
- Skeleton (loading placeholders)
- Progress bar
- Avatar
- HoverCard
- Popover
- Dialog (with trigger button)
- AlertDialog (with trigger button)
- Sheet/Drawer
- Dropdown Menu
- Context Menu
- Command Palette
- Collapsible

**Specialized**:
- Toggle & ToggleGroup
- Carousel
- Pagination
- Menubar
- ScrollArea
- Resizable panels
- Chip (custom component)
- Circular Progress (custom component)

### 3. Component Showcase Structure

Organize all components into clear sections:
- **Typography** (existing)
- **Buttons** (existing + add Toggle/ToggleGroup)
- **Form Controls** (expand with Textarea, RadioGroup, Slider, Calendar)
- **Badges** (existing)
- **Data Display** (Tables, Separator, Skeleton, Avatar, Progress)
- **Alerts & Feedback** (existing Alerts + add Dialog, AlertDialog, Toast examples)
- **Cards** (existing)
- **Navigation** (Tabs, Accordion, Breadcrumb, Pagination, Menubar)
- **Overlays** (Sheet, Drawer, HoverCard, Popover, DropdownMenu, ContextMenu, Command)
- **Layout** (Separator, ScrollArea, Resizable, Collapsible, Carousel)
- **Tooltips** (existing)

### 4. Files Modified

| File | Change |
|------|--------|
| `src/pages/settings/ComponentLibrary.tsx` | Remove dual-column layout, force light theme only, add all missing UI components in organized sections |

### 5. Theme Isolation Approach

Use a wrapper div with `className="light bg-background text-foreground"` on the entire showcase to override global theme toggle. This ensures the documentation always displays in light mode for consistency.

