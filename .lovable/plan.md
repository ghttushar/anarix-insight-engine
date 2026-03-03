# Taskbar Visibility, Functional Settings, and Density Enhancement

## Problem Summary

1. **Taskbar shows on settings pages** — should be hidden on `/settings/*`, `/login`, `/onboarding/*`
2. **Visual Effects toggles are non-functional** — plain HTML checkboxes with `defaultChecked`, no state persistence, no actual effect on features
3. **Keyboard shortcuts are read-only** — not editable
4. **Display density has weak visual impact** — only affects table rows and some card padding; needs to affect more elements (sidebar items, KPI cards, page padding, heading sizes, button sizes, gaps)

## Phase 1: Conditional Taskbar Visibility

### File: `src/components/layout/AppLayout.tsx`

Add `useLocation()` and check if the current route starts with `/settings`, `/login`, or `/onboarding`. If so, skip rendering `<AppTaskbar />`.

```
const isSettingsOrAuth = pathname.startsWith("/settings") || pathname.startsWith("/login") || pathname.startsWith("/onboarding");
```

Then conditionally render: `{!isSettingsOrAuth && <AppTaskbar />}`

## Phase 2: Create Visual Effects Context

### New file: `src/contexts/VisualEffectsContext.tsx`

Create a context that manages boolean toggles persisted to localStorage:

- `ambientBackground: boolean`
- `numberAnimations: boolean`
- `floatingIsland: boolean`

Expose `toggle(key)` and individual getters. Default all to `true`.

### File: `src/features/creative/CreativeFeatures.tsx`

Read from `useVisualEffects()` context instead of hardcoded `features` prop. Pass context values to conditionally render `AmbientBackground`, `FloatingActionIsland`, and provide a `numberAnimations` flag for downstream components.

### File: `src/pages/settings/Preferences.tsx`

Replace raw `<input type="checkbox">` with `<Switch>` from the existing UI library, wired to the `useVisualEffects()` context so toggling actually enables/disables each feature in real-time.

## Phase 3: Editable Keyboard Shortcuts

### File: `src/pages/settings/Preferences.tsx`

Add an "Edit" button per shortcut row. When clicked, the key display becomes an input that captures the next keypress (using a `keydown` listener). Store custom shortcuts in localStorage via a new small context or direct localStorage read in the `KeyboardNavigation` provider.

### File: `src/features/creative/KeyboardNavigation.tsx`

On mount, read any overridden shortcuts from localStorage and merge them with defaults. This allows user-customized bindings.

Add a "Reset to Defaults" button per category.

## Phase 4: Enhanced Density Impact

### File: `src/index.css` (density section)

Expand the `.density-compact` class to affect more elements:

- **Page padding**: `main` padding from `p-6` → `p-4` (via `--page-padding`)
- **Card gaps**: reduce `gap` between KPI cards and sections
- **Font sizes**: body text `13px` in compact, headings scale down 2px each
- **Button height**: `36px` compact vs `40px` comfortable
- **Sidebar menu items**: reduce padding from `py-2` to `py-1`
- **KPI card internal spacing**: tighter vertical gaps
- **Section spacing**: `space-y-6` → `space-y-4` equivalent

Add CSS custom properties for all these, consumed via `var()` in the relevant classes.

### File: `src/components/layout/AppLayout.tsx`

Use `useDensity()` to dynamically set main padding class (`p-6` vs `p-4`).

## Files to Create/Modify


| File                                           | Action                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/contexts/VisualEffectsContext.tsx`        | **Create** — context for ambient bg, number animations, floating island toggles |
| `src/components/layout/AppLayout.tsx`          | **Modify** — conditional taskbar, density-aware main padding                    |
| `src/pages/settings/Preferences.tsx`           | **Modify** — wire Switch to visual effects context, add editable shortcut UI    |
| `src/features/creative/CreativeFeatures.tsx`   | **Modify** — consume visual effects context                                     |
| `src/features/creative/KeyboardNavigation.tsx` | **Modify** — read custom shortcuts from localStorage                            |
| `src/index.css`                                | **Modify** — expand density-compact rules (fonts, gaps, padding, buttons)       |
| `src/App.tsx`                                  | **Modify** — wrap with `VisualEffectsProvider`                                  |


## Implementation Order

1. Create `VisualEffectsContext`
2. Wire it into `App.tsx` and `CreativeFeatures.tsx`
3. Update `AppLayout.tsx` (conditional taskbar + density padding)
4. Rewrite Preferences page (Switch components, editable shortcuts)
5. Update `KeyboardNavigation.tsx` (custom shortcut support)
6. Expand density CSS rules in `index.css`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Scan entire repo and extract:

- All Sidebar module entries
- All Sub-navigation items per module
- All Header dropdown menus
- All Ad Type options
- All Marketplace options
- All Date Presets
- All Frequency dropdown options
- All Table column definitions per module
- All Filter field definitions per module
- All Filter operators per data type
- All Status badge values                                                                                                                                                                                                                                                                                                              Event priority system:

1. Marketplace change → closes panels & modals
2. Date change → closes panels & modals
3. Module change → closes panels
4. Opening new side panel → closes previous
5. Modal open → locks panel switching
6. Density change → recalculates layout but keeps panel open                                                                                                                                                                                                                                                   Visual Effects Scope Rule
  Visual effects must:

- Never affect table rendering
- Never affect numeric precision display
- Never affect accounting formatting
- Be limited to:

- Background ambient
- Floating island
- Creative module only                                                                                                                                                                                                                                                                                                                              **Before making any UI modification:**
  1. **Extract all menus, filters, column schemas from the git repo.**
  2. **Output a structured audit in chat.**
  3. **Confirm missing items with me.**
  4. **Only after approval proceed with refactoring.**
  # **Do not assume.**  
  **Do not hardcode.**  
  **Do not guess.**