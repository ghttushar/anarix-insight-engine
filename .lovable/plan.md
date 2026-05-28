# Phase 2 — Shared Tablet Shell & Touch Primitives

Goal: stand up the tablet variant's visual shell (sidebar, taskbar, right-side panel chrome, Aan presence) and the shared touch primitives every later phase will consume. No module screens yet — those start Phase 3+.

Same routes, same data, same containers from `src/app/*`. Only the shell and interaction primitives fork under `src/views/tablet/`.

## Scope (in)

### 1. Touch primitives (`src/views/tablet/primitives/`)
- `TouchTarget.tsx` — wrapper enforcing min 44×44 (48×48 for `primary`), used by tablet buttons/icon buttons.
- `LongPressTooltip.tsx` — 500ms long-press → tooltip; also forwards `title` for stylus; cancels on move/scroll.
- `SwipeableRow.tsx` — swipe-left reveals row actions (snap-open/snap-closed thresholds, rubber-band).
- `SwipeToCloseEdge.tsx` — swipe-right from left edge of right-side panels = close.
- `useVisualViewportInset.ts` — hook returning keyboard inset via `visualViewport` API; powers input-into-view scrolling.
- `useStylusHover.ts` — detects `pointerType === 'pen'` to selectively allow hover affordances.

### 2. Tablet shell (`src/views/tablet/shell/`)
- `TabletAppShell.tsx` — root layout, uses `h-dvh`, applies `data-view="tablet"`, mounts sidebar + taskbar + outlet + floating elements. Locks layout so on-screen keyboard overlays (no shrink).
- `TabletSidebar.tsx` — icon-rail in portrait, expanded in landscape; orientation detected via `matchMedia('(orientation: portrait)')`. All items are persistent (no hover-reveal); active state always visible; labels via `LongPressTooltip` in rail mode.
- `TabletTaskbar.tsx` — taller (56px) for touch; `ViewBadge` present; breadcrumbs collapse to a tap-to-expand chip in portrait.
- `TabletRightPanel.tsx` — fixed right-edge panel chrome wired to `SwipeToCloseEdge`; close button is 48×48; respects keyboard inset; independent scroll container (`flex-1 min-h-0`) per project rules.
- `TabletFloatingIsland.tsx` — port of the floating action island sized for touch (no hover-only affordances).

### 3. Aan presence on tablet (`src/views/tablet/aan/`)
- `TabletAanController.tsx` — combines the three behaviors approved:
  - Tap-driven mascot: reacts on tap of its anchors and during generation; idle = ambient breathing only (no pointer-follow).
  - Stylus hover allowed: when `pointerType === 'pen'`, hover-react is enabled.
  - `FloatingAanFab.tsx` anchored bottom-right (48×48, safe-area aware) opens the Aan panel.
- Reuses existing Aan panel container from `src/app` (no duplication of chat/insights logic).

### 4. Wiring
- `src/views/tablet/TabletPlaceholder.tsx` is replaced by a real `TabletAppShell` that renders an empty content area with a "Phase 3 will mount module screens here" notice. Routes under `/tablet/*` go through the shell.
- `ViewportContext` already toggles `data-view`; shell reads it to short-circuit any desktop-only globals (e.g., pointer-follow mascot on the desktop shell stays disabled when `data-view="tablet"`).

## Scope (out)
- Any module screens (Advertising, Profitability, Reports, BI, Catalog, AMC, Settings) — those are Phase 4–7.
- Tables/filters/date picker tablet ports — Phase 3.
- Mobile shell — later.
- Any change to desktop behavior, data, business logic, or feature set.

## Technical notes
- Layout uses `h-dvh` + `overflow-hidden` on the shell root so the on-screen keyboard overlays rather than shrinks the app; focused inputs call `scrollIntoView({ block: 'center' })` on `visualViewport` resize.
- Orientation handled by a single responsive shell via CSS + `matchMedia`; no duplicate portrait/landscape files.
- All primitives are tablet-only — no impact on desktop bundle for `/desktop/*` routes.
- New files only; no edits to existing desktop components or `src/app/*` containers.
- No new dependencies.

## Files to create
```
src/views/tablet/primitives/TouchTarget.tsx
src/views/tablet/primitives/LongPressTooltip.tsx
src/views/tablet/primitives/SwipeableRow.tsx
src/views/tablet/primitives/SwipeToCloseEdge.tsx
src/views/tablet/primitives/useVisualViewportInset.ts
src/views/tablet/primitives/useStylusHover.ts
src/views/tablet/shell/TabletAppShell.tsx
src/views/tablet/shell/TabletSidebar.tsx
src/views/tablet/shell/TabletTaskbar.tsx
src/views/tablet/shell/TabletRightPanel.tsx
src/views/tablet/shell/TabletFloatingIsland.tsx
src/views/tablet/aan/TabletAanController.tsx
src/views/tablet/aan/FloatingAanFab.tsx
```

## Files to edit
- `src/App.tsx` — mount `TabletAppShell` for `/tablet/*` (replace placeholder).
- `src/views/tablet/TabletPlaceholder.tsx` — becomes the shell's empty-state content (or deleted if no longer needed).

## Verification
- Switch to Tab in Preferences → `/tablet` renders the new shell with sidebar (rail in portrait, expanded in landscape), taller taskbar, ViewBadge, FloatingAanFab bottom-right.
- Resize between portrait and landscape — sidebar swaps without layout jump.
- Focus an input and trigger on-screen keyboard (DevTools device emulation) — layout does not shrink; input scrolls into view.
- Desktop view (`/desktop/*` and existing routes) unchanged.

Awaiting approval to execute Phase 2.