

## Complete Sidebar Revamp + Aan Workspace with App Nav

### Problems Identified

1. **Collapse notch overlaps submenu chevrons** — The floating circular collapse button at the sidebar edge sits at 50% height and visually merges with group expand/collapse arrows
2. **Aan button is too prominent and poorly designed** — Giant gradient block with "AI Assistant" subtitle looks amateurish, takes too much vertical space
3. **Logo placement awkward** — Logo has inconsistent sizing between collapsed/expanded states
4. **Navigation groups look cluttered** — Uppercase labels, too much vertical spacing, the left-border active indicator fights with the collapsible tree lines
5. **Aan Workspace (fullscreen)** — Currently hides the main app sidebar entirely; user wants both navbars visible so they can navigate the app while using Aan
6. **Footer (profile/theme)** — Bulky, theme toggle is a random circle button

---

### Redesign Concept

**Clean, professional sidebar** with these principles:
- Slim, quiet, functional — no gradients except on Aan icon
- Logo top-left, always visible
- Aan trigger as a small, elegant pill below logo (not a giant block)
- Navigation groups use simple expand/collapse with clean indentation
- Collapse control moves to the sidebar header (hamburger icon), removing the floating notch entirely
- Active state: subtle background highlight + left accent bar (no tree lines)
- Profile: compact avatar row at bottom
- Theme: icon toggle inline with profile

**Aan Workspace** gets a split layout: app sidebar on the left (collapsed to icon mode), Aan workspace content on the right.

---

### 1. Remove CollapseNotch, Add Header Toggle

**File: `src/components/layout/AppLayout.tsx`**

- Remove the `CollapseNotch` component entirely
- The sidebar toggle moves into the sidebar header itself

**File: `src/components/layout/AppSidebar.tsx`**

- Add a small hamburger/menu icon button in the header row (next to logo) that calls `toggleSidebar()`
- In collapsed mode, show just the icon; in expanded, show logo + toggle button

### 2. Redesign Sidebar Structure

**File: `src/components/layout/AppSidebar.tsx`** — Full rewrite of the render:

```text
┌─────────────────────┐
│ [≡] Logo            │  ← Toggle + logo, compact
│─────────────────────│
│ ✦ Ask Aan           │  ← Small pill button, one line
│─────────────────────│
│ Workspace        >  │  ← Clean group headers
│   Dashboard Builder │
│   Health Score      │
│                     │
│ Profitability    >  │
│   Dashboard         │
│   Trends            │
│   Profit & Loss  ◄  │  ← Active: bg-primary/8 + left-2 accent
│   ...               │
│                     │
│ ... more groups ... │
│─────────────────────│
│ ☀ ─── JD John Doe  │  ← Compact footer: theme + avatar + name
└─────────────────────┘
```

Changes:
- **Logo row**: `h-12` header with menu toggle (PanelLeft icon) on the left, logo on the right. In collapsed: just the toggle icon centered
- **Aan button**: Single-line pill — `h-9` with Sparkles icon + "Ask Aan" text, subtle border with aan-gradient on hover only. No "AI Assistant" subtitle. In collapsed: just Sparkles icon with tooltip
- **Group headers**: Remove uppercase, use normal-case `text-[13px] font-semibold text-muted-foreground`. Chevron on right. No group icons in expanded mode (cleaner)
- **Nav items**: Remove the tree-line left border (`border-l`). Use clean `pl-8` indentation. Active: `bg-primary/8 text-primary` + `border-l-2 border-primary` on the item itself
- **Footer**: Single row — theme toggle icon (left), then avatar + name (right), dropdown on click. `h-12` max
- **Dividers**: Use `border-t border-border/30` (very subtle)

### 3. Collapsed State Polish

- Each group shows just the group icon (keep current hover popup behavior)
- Aan shows Sparkles icon with tooltip
- Profile shows avatar only with dropdown
- Toggle button shows PanelLeft icon centered

### 4. Aan Workspace with App Sidebar

**File: `src/components/aan/AanWorkspace.tsx`**

Current: `fixed inset-0 z-[60]` — covers everything including sidebar.

New layout:
```text
┌──────┬──────────────────────────────────────┐
│ Mini │  Aan Workspace Header (Aan branding) │
│ Side │──────────────────────────────────────│
│ bar  │  [Sidebar] │ Conversation │ Artifact │
│ (48) │            │              │          │
│      │  Input bar                           │
└──────┴──────────────────────────────────────┘
```

- Render the main `AppSidebar` in forced-collapsed (icon) mode on the left side of the Aan workspace
- This lets users navigate to any page even while Aan is open — clicking a nav link closes Aan and navigates
- The Aan workspace content fills the remaining space
- Implementation: Instead of `fixed inset-0`, use `fixed inset-0 z-[60] flex` with a mini sidebar (icon-only `w-14`) on the left + Aan content on the right

**New component: `src/components/layout/MiniSidebar.tsx`**
- A stripped-down version of AppSidebar that only shows: logo icon, group icons (with hover popups), theme toggle, profile avatar
- Clicking any nav item: navigates to the page AND closes Aan workspace
- Width: `w-14` fixed

### 5. Width and Spacing

- Sidebar expanded: `w-56` (down from `w-64` — tighter)
- Sidebar collapsed: `w-14` (keep)
- Remove all excess `py-4` padding; use `py-2` between sections

---

### Files Summary

| File | Change |
|---|---|
| `AppSidebar.tsx` | Complete redesign: header toggle, slim Aan pill, clean nav groups, compact footer |
| `AppLayout.tsx` | Remove CollapseNotch component entirely |
| `AanWorkspace.tsx` | Add mini app sidebar on left side for navigation while Aan is open |
| `MiniSidebar.tsx` | **NEW** — Icon-only sidebar for Aan workspace with nav + close-on-click |
| `SidebarHoverPopup.tsx` | Minor: ensure it works with new trigger positioning |
| `index.css` | Minor: adjust sidebar CSS variables if needed for w-56 |

