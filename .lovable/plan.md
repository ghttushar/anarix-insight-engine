

# Sidebar Complete Redesign

## Current Issues Identified
- Aan button looks like part of the logo (outlined, no background)
- Collapse button is awkwardly placed in the footer
- Theme toggle is a full button with text, takes too much space
- Settings is a full nav group taking sidebar real estate
- Group icons are inconsistent sizes (h-4 vs h-5)
- Footer is cluttered with 3 stacked elements
- Overall feel is dated — needs tighter spacing, better visual hierarchy

## Redesigned Layout (Top → Bottom)

```text
┌──────────────────────┐
│  Logo                │
├──────────────────────┤
│  🔮 Aan AI  (gradient│  ← gradient bg button, after divider
│     background)      │
├──────────────────────┤
│  ▸ WORKSPACE         │
│  ▸ PROFITABILITY     │  ← nav groups (NO Settings group)
│  ▸ ADVERTISING       │
│  ▸ CATALOG           │
│  ▸ AMC               │
│  ▸ BI                │
│  ▸ DAY PARTING       │
│  ▸ REPORTS           │
├──────────────────────┤
│  ◀ Collapse  │ ☀/🌙  │  ← bottom bar: collapse + theme icon
├──────────────────────┤
│  👤 John Doe    ▾    │  ← profile dropdown now includes
│                      │     Settings sub-items
└──────────────────────┘
```

## Specific Changes

### 1. Remove Settings from Navigation Groups
Move Preferences, Accounts, Team, System into the profile dropdown as menu items with sub-labels.

### 2. Aan Button — Gradient Background
- Full gradient background (`aan-gradient`) with white text/icon
- Placed after the logo divider, before nav groups
- Rounded-lg, py-2.5, prominent but not loud
- In collapsed mode: gradient icon-only button

### 3. Collapse + Theme Toggle — Bottom Utility Bar
- Single horizontal row above profile
- Left: collapse icon button (PanelLeftClose/Open)
- Right: theme toggle icon button (Sun/Moon)
- Both are 32px icon-only buttons, no text
- Clean, minimal, same visual weight

### 4. Profile Dropdown — Expanded
Add to dropdown:
- Preferences (links to /settings/appearance)
- Accounts (links to /settings/accounts)
- Team (links to /settings/team)
- System (links to /settings/system)
- Separator
- Logout

### 5. Icon Consistency & Refresh
All group icons: `h-4 w-4` uniformly. Replace some icons for better visual identity:
- Workspace → `LayoutGrid`
- Profitability → `TrendingUp` (more analytical than $)
- Advertising → `Megaphone` (keep)
- Catalog → `Package` (more specific than ShoppingBag)
- AMC → `Database` (keep)
- BI → `BarChart3` (more recognizable than Brain)
- Day Parting → `Clock` (keep)
- Reports → `FileText` (simpler than FileBarChart)

All sub-item icons: `h-3.5 w-3.5` for visual subordination.

### 6. Visual Polish
- Group labels: 11px uppercase, letter-spacing 0.05em, text-muted-foreground (not text-foreground)
- Active item: left border accent + primary/10 bg (keep current pattern but tighten)
- Hover states: sidebar-accent bg, 150ms transition
- Dividers: border-border/50 for subtlety
- Scrollbar: thin, matches theme

## Files to Change

| Action | File |
|--------|------|
| Rewrite | `src/components/layout/AppSidebar.tsx` — full redesign |
| Edit | `src/components/layout/SidebarHoverPopup.tsx` — update collapsed icon sizes if needed |

**2 files total.**

