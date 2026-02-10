

# Fix: Sidebar Position, Merged Marketplace Selector, and Aan Button

## Problem Analysis

1. **Sidebar pushed below content**: The sidebar uses `fixed top-12` positioning, which works with the taskbar. But the issue is the sidebar's `z-0` class in `AppSidebar.tsx` -- it sits behind the content. The real fix is to revert the sidebar to its original non-fixed flow positioning (remove the `top-12` and `h-[calc(100svh-48px)]` hacks in `sidebar.tsx`) and let it be a normal flex child in the layout.

2. **Marketplace + Store selectors are separate buttons on the left**: Need to merge them into one unified dropdown on the right side of the taskbar, near the theme toggle.

3. **Aan button still looks bad**: The current pill button with `aan-pill-button` CSS pseudo-element mask trick renders inconsistently. Replace with a simpler, cleaner design.

---

## Phase 1: Revert Sidebar to Original Flex Flow

### File: `src/components/ui/sidebar.tsx` (lines 183-205)

Revert the spacer div and fixed container back to their original values:
- Spacer: `h-svh` instead of `h-[calc(100svh-48px)]`
- Fixed container: `inset-y-0` instead of `top-12 bottom-0`, `h-svh` instead of `h-[calc(100svh-48px)]`

This restores the sidebar to its original shadcn position.

### File: `src/components/layout/AppLayout.tsx`

Change the layout so the taskbar is NOT above the sidebar. Instead, the sidebar and the main column (which contains the taskbar + content) sit side by side:

```text
[Sidebar | [Taskbar          ] ]
[        | [Content           ] ]
```

Structure:
```
<div className="flex min-h-screen w-full">
  <AppSidebar />
  <div className="flex flex-1 flex-col min-h-screen">
    <AppTaskbar />
    <main>...</main>
  </div>
  <AanCopilotPanel />
</div>
```

This way the sidebar spans the full viewport height and the taskbar only spans the content area.

---

## Phase 2: Merge Marketplace + Store into One Dropdown, Move to Right

### File: `src/components/layout/AppTaskbar.tsx`

**Remove** the two separate left-side dropdowns (marketplace + store).

**Add** a single merged dropdown on the right side (before the theme toggle):
- Trigger button shows: `[Amazon logo] Demo Store v`
- Dropdown content has two sections:
  - **Marketplace switch**: Two clickable rows with logos (Amazon, Walmart)
  - **Divider**
  - **Store list**: Searchable list of stores for the selected marketplace

**Left side** of taskbar: Show Anarix logo only (or leave empty for a clean look).

---

## Phase 3: Aan Button Redesign

### File: `src/components/layout/AppSidebar.tsx`

Replace the current `aan-pill-button` design with a cleaner approach:
- Simple border using Tailwind classes (`border border-primary/30`) instead of CSS pseudo-element mask trick
- Subtle gradient background on hover using a div with `opacity-0 group-hover:opacity-[0.06]`
- Remove dependency on the `aan-pill-button` CSS class entirely

### File: `src/index.css`

Delete the `.aan-pill-button` CSS rules (lines 274-303). They are no longer needed.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ui/sidebar.tsx` | Revert to original `inset-y-0` and `h-svh` positioning |
| `src/components/layout/AppLayout.tsx` | Restructure: sidebar as flex sibling, taskbar inside content column |
| `src/components/layout/AppTaskbar.tsx` | Merge marketplace+store into single right-side dropdown, left side shows logo |
| `src/components/layout/AppSidebar.tsx` | Redesign Aan button with simple Tailwind border instead of CSS mask |
| `src/index.css` | Remove `.aan-pill-button` CSS rules |

## Implementation Order

1. Revert sidebar.tsx to original positioning
2. Restructure AppLayout (sidebar + content column with taskbar)
3. Merge and move marketplace/store selector to right side of taskbar
4. Redesign Aan button with clean Tailwind styles
5. Remove unused CSS
