

# Fix: Sidebar Auto-Restore on Panel Close + Independent Panel Scrolling

## Problem

1. **Sidebar collapses when a right panel opens but never re-expands when the panel closes.** The current `useEffect` in `LayoutInner` calls `setOpen(false)` when a panel opens, but nothing restores it on close.
2. **No distinction between manual collapse and auto-collapse.** If the user manually collapsed the sidebar before opening a panel, closing the panel should NOT re-expand it.
3. **Panel scroll isolation** — some panels already use `ScrollArea`, but the outer layout needs `overflow-hidden` on the flex container so main content and panel scrolls remain independent.

## Changes

### 1. `src/contexts/ActivePanelContext.tsx`
Add a `sidebarWasOpenBeforePanel` ref to track whether the sidebar was expanded before a panel auto-collapsed it. Expose this via context so `AppLayout` can read/write it.

Alternatively (simpler, keeps logic co-located): handle everything in `AppLayout.tsx`.

### 2. `src/components/layout/AppLayout.tsx` — `LayoutInner`

Replace the current `useEffect` with smarter logic:

```tsx
function LayoutInner({ children }: { children: ReactNode }) {
  const { activePanel } = useActivePanel();
  const { open, setOpen } = useSidebar();
  const { density } = useDensity();
  
  // Track whether WE auto-collapsed the sidebar
  const autoCollapsedRef = useRef(false);
  // Track previous panel state
  const prevPanelRef = useRef(activePanel);

  const hasPanel = activePanel !== "none";

  useEffect(() => {
    const panelJustOpened = hasPanel && prevPanelRef.current === "none";
    const panelJustClosed = !hasPanel && prevPanelRef.current !== "none";

    if (panelJustOpened && open) {
      // Sidebar is open and panel is opening → auto-collapse
      autoCollapsedRef.current = true;
      setOpen(false);
    } else if (panelJustClosed && autoCollapsedRef.current) {
      // Panel closed and we were the ones who collapsed → restore
      autoCollapsedRef.current = false;
      setOpen(true);
    }

    prevPanelRef.current = activePanel;
  }, [activePanel, hasPanel, open, setOpen]);
```

Key behavior:
- If user manually collapsed sidebar before panel opened → `open` is already `false` → `autoCollapsedRef` stays `false` → no restore on close.
- If sidebar was expanded → auto-collapse sets flag → restore on panel close.
- If user manually toggles sidebar while panel is open → that's fine, flag remains but `setOpen(true)` is harmless if already open, or re-opens if they collapsed again.

### 3. Scroll Isolation

The panels (InsightsPanel, AanCopilotPanel, ProductDetailPanel, PeriodBreakdownPanel) already use `ScrollArea` internally. The main content area already has `overflow-auto`. The outer container already has `overflow-hidden`. This should already isolate scrolls.

Verify and ensure:
- The outer `div` wrapping main + panels has `overflow-hidden` (line 54 — already present).
- Each panel root has `h-full` and uses `ScrollArea` with `flex-1` for content (already present in all 4 panels).
- Add `overflow-hidden` to panel root containers that don't have it, to prevent any scroll bleed.

### Files Modified
- `src/components/layout/AppLayout.tsx` — update `LayoutInner` effect logic with ref-based tracking

No other files need changes. Single file, ~15 lines modified.

