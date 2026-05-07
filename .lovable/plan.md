## Phase 3 + Phase 4 — Wire the Aan mascot into every Aan surface

The `BrandingContext`, `AnarixLogo`, `AanMascot`, and `/brand/aan` showcase already exist. Toggle is at **Settings → Preferences → New Branding** (default OFF — that is why nothing visible has changed yet).

This phase makes the toggle actually swap the icon everywhere the legacy `Sparkles` icon is used as the Aan mark.

### 1. New shared swap component

**`src/components/aan/AanGlyph.tsx`** — a drop-in replacement for `<Sparkles className="h-4 w-4 ..." />`:
- When `newBranding` is OFF → renders the existing `Sparkles` lucide icon, identical to today.
- When `newBranding` is ON → renders `<AanMascot />` at a pixel size inferred from the `h-3 / h-4 / h-5 / h-6` Tailwind class.
- Props: `className`, optional `state` (default `"idle"`), optional `size`, optional `interactive`.

### 2. Phase 3 — swap inside Aan-owned surfaces

Replace `Sparkles` with `<AanGlyph />` (and drop the `Sparkles` import where unused) in:

| File | State to pass |
|---|---|
| `src/components/aan/AanLogo.tsx` | `idle` |
| `src/components/aan/AanBreadcrumb.tsx` | `idle` |
| `src/components/aan/AanConversation.tsx` (assistant message avatar, both occurrences) | `idle` for past messages, `thinking` for the in-flight one if available; otherwise `idle` |
| `src/components/aan/AanInput.tsx` (line 262 indicator) | `listening` when input has focus / non-empty value, otherwise `idle` |
| `src/components/aan/AanWorkspaceSidebar.tsx` (collapsed + expanded headers) | `idle` |
| `src/components/aan/AskAanTooltip.tsx` | `idle` |

No layout, color, or spacing changes.

### 3. Phase 4 — swap inside app chrome

| File | What changes |
|---|---|
| `src/components/layout/AppSidebar.tsx` (Ask Aan pill — 2 Sparkles usages around lines 234/244) | `<AanGlyph state="idle" className="h-4 w-4" />` |
| `src/components/layout/AppTaskbar.tsx` (lines 354, 379 — Ask Aan fallback button) | `<AanGlyph state="idle" className="h-3 w-3" />` |
| `src/features/creative/FloatingActionIsland.tsx` (the "Ask Aan" action icon) | Pass `AanGlyph` instead of `Sparkles` to the action item — the existing `<Icon />` render call needs no change since it just calls the component. |

### 4. Verification

After build, with New Branding **ON**, the user should see the coral diamond mascot in:
- Sidebar (already from Phase 0)
- Login + 404 + favicon (Phase 1)
- `/brand/aan` showcase (Phase 2)
- Sidebar Ask Aan pill, AppTaskbar Ask Aan, Floating Action Island Ask Aan, all chat avatars, breadcrumbs, tooltip, input indicator (Phase 3 + 4)

With the toggle **OFF** the app must look identical to today — every swap is gated by `useBranding().newBranding` inside `AanGlyph` / `AnarixLogo`.

### Files

- New: `src/components/aan/AanGlyph.tsx`
- Edited: `AanLogo.tsx`, `AanBreadcrumb.tsx`, `AanConversation.tsx`, `AanInput.tsx`, `AanWorkspaceSidebar.tsx`, `AskAanTooltip.tsx`, `AppSidebar.tsx`, `AppTaskbar.tsx`, `FloatingActionIsland.tsx`

No other files touched. No new dependencies.