

# Navigation Redesign Plan

## Summary

Delete the top header bar entirely and consolidate all navigation into the left sidebar. The sidebar will contain:
- Anarix logo (top)
- Marketplace selector (Amazon/Walmart)
- Account/Store selector
- Aan button (opens full workspace)
- Navigation groups (existing)

The floating island remains for copilot access.

---

## Current Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│ [☰] [Walmart ▼] [Demo Store ▼] ─────────────────── [Aan]     │  ← AppHeader (TO DELETE)
├────────┬─────────────────────────────────────────────────────┤
│ Logo   │                                                     │
│ [Aan]  │                                                     │
│ ─────  │                  Main Content                       │  ← Current layout
│ Profit │                                                     │
│ Advert │                                                     │
│ ...    │                                                     │
└────────┴─────────────────────────────────────────────────────┘
         ↑ AppSidebar

                    [ ✕ | Ask Aan | Insights | ... ]           ← FloatingActionIsland (center bottom)
```

---

## New Architecture

```text
┌────────────────┬─────────────────────────────────────────────┐
│  [Anarix Logo] │                                             │
│  ─────────────-│                                             │
│  [★ Walmart ▼] │                                             │
│  [● Demo St ▼] │                                             │
│  ─────────────-│                                             │
│  [✨ Aan]      │              Main Content                   │
│  ─────────────-│                                             │
│  Profitability │                                             │
│  Advertising   │                                             │
│  ...           │                                             │
└────────────────┴─────────────────────────────────────────────┘

                    [ ✕ | Ask Aan | Insights | ... ]           ← FloatingActionIsland (unchanged)
```

---

## Aan Entry Points (Clarified)

| Entry Point | Location | Action | Opens |
|-------------|----------|--------|-------|
| **Floating Island "Ask Aan"** | Center-bottom floating bar | `openPanel()` | Copilot panel (420px right side) |
| **Sidebar Aan Button** | Left sidebar, below account selectors | `openWorkspace()` | Full workspace (dedicated screen) |

---

## Phase 1: Delete AppHeader

### File: `src/components/layout/AppLayout.tsx`

Remove the `<AppHeader />` component entirely:

```typescript
// BEFORE
<div className="flex min-h-screen w-full flex-col">
  <AppHeader />
  <div className="flex flex-1">
    <AppSidebar />
    ...

// AFTER
<div className="flex min-h-screen w-full">
  <AppSidebar />
  ...
```

### File: `src/components/layout/AppHeader.tsx`

Delete this file entirely (or keep for reference but unused).

---

## Phase 2: Redesign AppSidebar

### File: `src/components/layout/AppSidebar.tsx`

New structure (top to bottom):

1. **Anarix Logo** (existing, keep at top)

2. **Marketplace Selector** (moved from header)
   - Dropdown with Amazon/Walmart options
   - Shows current marketplace icon + name
   - When collapsed: show icon only with tooltip

3. **Account/Store Selector** (moved from header)
   - Dropdown with connected accounts
   - Shows status dot + account name
   - Scrollable for many accounts
   - When collapsed: show status dot only with tooltip

4. **Divider**

5. **Aan Button** (redesigned)
   - Full-width gradient button
   - Calls `openWorkspace()` (NOT `openPanel`)
   - When collapsed: gradient icon only

6. **Divider**

7. **Navigation Groups** (existing, unchanged)

### Collapsed State Handling

When sidebar is collapsed (`w-14`):
- Logo: icon only
- Marketplace: icon only (star for Walmart, circle for Amazon)
- Account: status dot only
- Aan: sparkle icon only with gradient background
- Nav groups: existing hover popup behavior

---

## Phase 3: Update Floating Island

### File: `src/features/creative/FloatingActionIsland.tsx`

Verify behavior:
- "Ask Aan" action already calls `openPanel()` ✓
- This opens the **copilot panel** (420px right side) ✓

No changes needed, but confirm `openPanel` → copilot mode is correct.

---

## Phase 4: Update Aan Workspace Header

### File: `src/components/aan/AanWorkspace.tsx`

Currently shows:
- `AanBreadcrumb` (just "Aan" text)
- X close button

Update to show:
- "Aan by Anarix" branding (top left)
- X close button (top right)

```text
┌────────────────────────────────────────────────────────────┐
│ [✨ Aan by Anarix]                                    [X]  │
├────────────────────────────────────────────────────────────┤
│ Sidebar │ Conversation area                                │
```

---

## Files to Modify

| File | Action |
|------|--------|
| `src/components/layout/AppLayout.tsx` | Remove AppHeader import and usage |
| `src/components/layout/AppHeader.tsx` | Delete file |
| `src/components/layout/AppSidebar.tsx` | Add marketplace + account selectors, update Aan button |
| `src/components/aan/AanWorkspace.tsx` | Update header to "Aan by Anarix" |
| `src/components/aan/AanBreadcrumb.tsx` | Update to "Aan by Anarix" text |

---

## Technical Details

### AppSidebar New Imports

```typescript
import { ChevronDown, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMarketplace, Marketplace } from "@/contexts/MarketplaceContext";
import { useAccounts } from "@/contexts/AccountContext";
```

### Sidebar Structure (Expanded)

```tsx
<SidebarContent>
  {/* Logo */}
  <div className="px-4 mb-4">
    <img src={logoSrc} alt="Anarix" className="h-8" />
  </div>

  {/* Marketplace Selector */}
  <div className="px-3 mb-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <MarketplaceIcon className="h-4 w-4" />
            {!collapsed && currentMarketplace.name}
          </span>
          {!collapsed && <ChevronDown className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      ...
    </DropdownMenu>
  </div>

  {/* Account Selector */}
  <div className="px-3 mb-4">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            {!collapsed && accountDisplayName}
          </span>
          {!collapsed && <ChevronDown className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ScrollArea className="max-h-[300px]">
          ...
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* Divider */}
  <div className="mx-3 mb-4 border-t border-border" />

  {/* Aan Button - Opens Full Workspace */}
  <div className="px-3 mb-4">
    <button
      onClick={openWorkspace}  // ← Changed from openPanel
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium aan-gradient text-white"
    >
      <Sparkles className="h-4 w-4" />
      {!collapsed && <span className="font-aan text-aan">Aan</span>}
    </button>
  </div>

  {/* Divider */}
  <div className="mx-3 mb-4 border-t border-border" />

  {/* Navigation Groups (existing) */}
  ...
</SidebarContent>
```

### Sidebar Structure (Collapsed)

When `collapsed === true`:
- Marketplace: icon button only, dropdown on click
- Account: status dot button only, dropdown on click
- Aan: gradient icon button, full workspace on click

---

## Aan by Anarix Branding

### File: `src/components/aan/AanBreadcrumb.tsx`

Update to show "Aan by Anarix":

```tsx
export function AanBreadcrumb({ className }: AanBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2", className)}>
      <Sparkles className="h-5 w-5 aan-gradient-text" />
      <span className="font-aan text-aan aan-gradient-text">Aan</span>
      <span className="text-sm text-muted-foreground">by Anarix</span>
    </nav>
  );
}
```

---

## Implementation Order

1. Delete AppHeader from AppLayout
2. Add marketplace/account selectors to AppSidebar
3. Update sidebar Aan button to call `openWorkspace`
4. Update AanBreadcrumb to "Aan by Anarix"
5. Delete AppHeader.tsx file
6. Test collapsed sidebar behavior
7. Verify floating island still opens copilot

