

## Plan: Build Icons Tab, States Tab, and Standalone Component Library Page

### 1. Enable Icons Tab in DesignSystem.tsx

Add an `IconsSection` component covering:
- **Icon sizing rules**: 16px (inline/table), 20px (buttons), 24px (headers)
- **Color rules**: `currentColor` inheritance, `text-muted-foreground` for secondary
- **Icon grid**: Display all commonly used Lucide icons in the app (grouped by domain — Navigation, Actions, Status, Data, Settings) with name labels
- **Usage guidelines**: Do/Don't rules per spec

### 2. Enable States Tab in DesignSystem.tsx

Add a `StatesSection` component documenting all interaction states with live examples:
- **Button states**: Default, Hover (shown via forced class), Active, Disabled, Loading
- **Input states**: Default, Focus, Error, Disabled
- **Select/Dropdown states**: Closed, Open, Disabled
- **Checkbox/Toggle states**: Unchecked, Checked, Disabled
- **Table row states**: Default, Hover, Selected, Disabled
- **Toast types**: Success, Warning, Error (with trigger buttons)

Each state shown as a labeled row with the live component in that state.

### 3. New Standalone Component Library Page

**File**: `src/pages/settings/ComponentLibrary.tsx`
**Route**: `/settings/component-library` (added to App.tsx routes)
**Sidebar**: Add nav item under Settings group in AppSidebar.tsx

Key behavior:
- Page renders TWO side-by-side columns: **Light** and **Dark**
- Each column is wrapped in a `<div>` with forced `class="light"` or `class="dark"` plus the corresponding CSS variable overrides — this makes the column immune to the global theme toggle
- Both columns display identical component sets: Buttons (all variants/sizes), Inputs, Selects, Checkboxes, Switches, Badges, Status Badges, Delta Badges, Cards, Tables, Alerts, Toasts (visual only), Dialogs (trigger buttons), Tooltips, Tabs, Accordions

**Theme isolation approach**: Each column wrapper gets `className="light"` or `className="dark"` on a container div. Since the CSS variables are defined on `.dark` and `:root` (light), this forces each column into its own theme regardless of the global `<html>` class.

### 4. Files Modified

| File | Change |
|------|--------|
| `src/pages/settings/DesignSystem.tsx` | Remove `disabled` from Icons/States tabs, add `IconsSection` and `StatesSection` components |
| `src/pages/settings/ComponentLibrary.tsx` | **New file** — dual-theme component showcase |
| `src/App.tsx` | Add import + route for ComponentLibrary |
| `src/components/layout/AppSidebar.tsx` | Add "Component Library" nav item under Settings |

### 5. Component Library Page Structure

```text
┌─────────────────────────────────────────────────┐
│  Component Library          (PageHeader)         │
├────────────────────┬────────────────────────────┤
│   LIGHT MODE       │      DARK MODE             │
│   class="light"    │      class="dark"          │
│                    │                            │
│   [Buttons]        │      [Buttons]             │
│   [Inputs]         │      [Inputs]              │
│   [Selects]        │      [Selects]             │
│   [Checkboxes]     │      [Checkboxes]          │
│   [Badges]         │      [Badges]              │
│   [Cards]          │      [Cards]               │
│   [Tables]         │      [Tables]              │
│   [Alerts]         │      [Alerts]              │
│   ...              │      ...                   │
└────────────────────┴────────────────────────────┘
```

Each column has `bg-background text-foreground` applied so it picks up the forced theme's variables. A shared `ComponentShowcase` sub-component renders all elements — called once per column to avoid duplication.

