## Aan Idle Pass — Aria-style behavior, Anarix shape

Scope: idle state only. Other states (`thinking`, `working`, `speaking`, etc.) untouched.

---

### 1. `AanMascot.tsx` — bring eyes back + Aria reactions

**Eyes (full tier only, ≥40px, idle/listening/anchor):**
- Two small dots, coral-deep on a faint cream highlight, sized `size * 0.07`, positioned symmetric on a horizontal axis at ~52% Y.
- Eyes track cursor: per-eye pupil offset within a ±`size*0.025` box, eased with `useSpring` (stiffness 120, damping 18). Same `mousemove` handler already wired — drives both body lean and eye gaze.
- Hidden in `thinking` / `working` (concentration) and at compact tier (≤40px) — eyes at small sizes look like specks.

**Blink (idle only):**
- Random interval 4–8 s. Eye height scales from 1 → 0.05 → 1 over 140 ms (Framer keyframes, not opacity).
- Resets on cursor movement (Aan re-locks gaze before next blink).

**Hover "petting" — Aria's vertical→horizontal morph, but as a diamond:**
- On `mouseenter` over the mascot bounding box: diamond softens corners (`borderRadius` 18% → 30%) and tilts on the tilt axis: `rotateZ` shifts to follow cursor X velocity (clamped ±10°), with horizontal stretch `scaleX` 1.0 → 1.08, `scaleY` 1.0 → 0.94.
- On `mouseleave`: spring back to base over 220 ms.
- Drag-direction sensing: on `mousemove` while hovering, lerp tilt toward cursor X position relative to center. Feels like the cursor is brushing across.
- All transitions: spring stiffness 180 / damping 22 (matches existing motion budget).

**Idle micro-life (kept, refined):**
- Existing breathe + float kept.
- Add a very slow horizontal drift of ±1.5 px every 6 s so Aan doesn't feel frozen between blinks.

**Cleanup inside `AanMascot.tsx`:**
- The `bodyLean` cursor-tracking block stays. Add a sibling `eyeGaze` state and a `hovered` boolean.
- No new dependencies. Pure CSS/Framer.

---

### 2. `AanInput.tsx` — give Aan its own slot above the textarea

Today Aan is anchored top-left *inside* the input border (24 px). That doesn't match Aria's placement (centered, sitting *above* the input, slightly to the left of the text label).

**Changes:**
- **Remove** the in-input `data-aan-anchor="input"` overlay div (lines 312–319).
- **Add** a new horizontal slot directly above the input container, inside the existing `relative` wrapper:
  - Height: 48 px reserved (so layout doesn't shift when prompt-suggestion notch appears).
  - Aan sits left-aligned with `pl-3` (aligned to the textarea's text start, not the input border).
  - Aan size at this anchor: **40 px** (was 24 px). Compact tier — breathes, no eyes. We bump to **44 px** to cross into full tier so eyes + cursor tracking are active.
  - `data-aan-anchor="input"` moves onto this new slot. `registerAnchor("input", el, 44)`.
- **Prompt-suggestion notch** (lines 264–291): currently sits `bottom-full` of the input. Move it to render *beside* Aan (right of the mascot, same row), or stack it directly under Aan above the input. Proposing **same row** (Aan on left, suggestion chip flowing right) — matches Aria's "Your prompt is ready." pattern in the screenshots.
  - When no suggestion is active, Aan sits alone in the slot.
  - When suggestion appears, it fades in to Aan's right with the existing 300 ms transition; Aan stays put.
- The Anchor portal already renders the live mascot into whichever `data-aan-anchor` is registered, so no presence-portal changes are needed.

**Spacing impact:**
- Input container moves down by 48 px. The bottom-aligned model selector + disclaimer row is unaffected.

---

### 3. Files touched

**Edit only:**
- `src/components/aan/AanMascot.tsx` — eyes, blink, hover-petting, gaze tracking
- `src/components/aan/AanInput.tsx` — new above-input Aan slot, suggestion notch repositioned, anchor size 44

**No** changes to `AanPresenceContext`, `AanPresencePortal`, `AanConversation`, or any other consumer. Other states untouched.

---

### 4. About the Wix Harmony reference

Direct link sharing won't work because Wix gates it behind login, and I can't bypass auth or create an account. Options that do work:

1. **Paste the rendered HTML/CSS** of the page into a `.txt` upload (View Source → copy → paste).
2. **Save the page as MHTML or single-file HTML** from your browser (Chrome: ⋮ → Save as → "Webpage, single file") and upload it. I can read the saved file.
3. **Screen recording** of specific interactions (you already shared one — that's the most useful for motion).
4. **Paste specific JS/CSS snippets** for any animation you want me to mirror.

For this idle pass I have enough from the screenshots + your description (eye tracking, hover-petting morph, blink). If you want me to mirror any other Aria reaction later, the saved-HTML route is the cleanest.

---

### Open questions

1. **Eye style** — match the original Aan eyes (two small dark dots) or Aria's flatter "..." style? Proposing original Aan dark dots for personality continuity.
2. **Suggestion chip placement** — same row as Aan (Aria-style), or keep it stacked above as today? Proposing same row.
3. **Hover-petting trigger area** — just the mascot itself, or the whole 48 px slot row? Proposing mascot only, so brushing across the input doesn't constantly trigger it.
