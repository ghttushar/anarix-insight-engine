# Living OS — Six Directions, Side-by-Side Static Prototypes

Deliverable: **one route** — `/livingos/directions` — that renders **six static morning surfaces**, one per direction, each at full fidelity, viewable independently and comparable side-by-side.

This is the first visual artifact of Living OS. Not the app. Not integrated with Anarix. Isolated, standalone, evaluable.

---

## What the user sees

**`/livingos/directions`** — an index. Six full-bleed tiles, one per direction. Minimal editorial chrome: direction name, one-line philosophy, checksum score. Click a tile → full-screen prototype at `/livingos/directions/:slug`. Press `Esc` → back to index. Arrow keys → cycle directions in place (so you can *feel* the differences by flipping between them without losing the mental image).

No app nav. No sidebar. No Anarix branding. This surface exists outside the product.

**The six routes:**
1. `/livingos/directions/quiet-architecture`
2. `/livingos/directions/gravity-field`
3. `/livingos/directions/living-canvas`
4. `/livingos/directions/command-surface`
5. `/livingos/directions/ambient-room`
6. `/livingos/directions/editorial-intelligence`

Every prototype shows **the same morning scenario** so differences are attributable to the direction, not the content:

> It's Tuesday morning. Advertising is holding, but the Q4 spend authority runs out Thursday. Aan has drafted one Proposal (shift 12% of Sponsored Products budget into Sponsored Brands for the last three days of the window). One agent is running (bid-cap rebalance on US-Sponsored, ~6 min remaining). Cash and Inventory are firm.

Same Standing sentence, same figures, same Proposal, same Delegation across all six. Only the *rendering* changes.

---

## The six prototypes — what each renders

Each prototype is a single full-viewport composition. No scrolling on desktop unless the direction demands it (Editorial does; the others do not). No interactivity beyond what the direction requires to be legible.

### 1. Quiet Architecture — *the morning sheet*
Raw oak desktop background. One laid-paper sheet, centered, offset slightly left. Set type: a serif kicker ("Tuesday · Week 41"), then the Standing sentence in a large humanist serif, then three right-aligned figures with hairline rules. A loose Proposal sheet, different paper edge, laid across the lower-right corner at a 3° angle. Aan's margin hand: one handwritten-style annotation in the right margin, in a distinct hand ("worth doing before Thursday — A"). No color other than paper, ink, and the oak. Shadow of laid paper on wood.

### 2. Gravity Field — *the field at rest*
Deep graphite background. Four Domain objects (Advertising, Inventory, Cash, Aan) arranged as a field with real mass. Advertising is centered and closest — visibly heavier, with subtle motion (it *breathes* toward the viewer). Three satellites orbit it (Spend, Efficiency, Opportunity), one weighted heavier than the others. The Proposal is an object with visible velocity that has just arrived into the field, caught mid-drift. The running agent is a small orbiting body around Advertising, moving. Type is small, confident, sans, placed near each object. One warm directional light. Real cast shadows.

### 3. Living Canvas — *the morning breath*
Rice-paper texture across the entire viewport. Four regions, differentiated by weave and rhythm, not by borders. Advertising region is *tensed* (still, slightly darker); the others ripple gently at fractions of a Hz (slow CSS animation, ~0.2Hz, opacity + minute translate). No text visible until you lean in (hover a region >1s → authored text fades in like ink bleeding). One warm blush at the edge (dawn light). The Proposal is a fold in the canvas at the lower right. The running agent is a slow current — a barely visible directional drift in one region.

### 4. Command Surface — *the console at 08:14*
Near-black background, dense monospaced spine across the top: `AD:HOLD  INV:FIRM  CASH:FIRM  AUTH:Q4-03D  AGENTS:1`. The whole Standing in one line. Body is a dense working region: three columns of figures, tight leading, no chrome. One amber indicator (running agent) in the top-right. The Proposal is a bordered command block with a preview and a `⌘↵ commit` affordance. Hazard yellow used exactly once (the "3D" in `AUTH:Q4-03D`). Instant, mechanical. No animation. Keyboard hints visible.

### 5. Ambient Room — *the study at first light*
Dark walnut-panelled room, low viewpoint. Four pieces of furniture (Domains). One — Advertising — is warmly lit by a single tungsten lamp. The others are dim, present, unread. On the lit surface: one folded letter (the Proposal), visible from across the room. On a shelf: one lit lamp (the running agent). Ambient light of the whole room is *warm* (Aan confident). No scoreboard, no numbers on the ambient view — walking up to a piece of furniture (hover) lights the surface and reveals the authored text and figures on it. Motion is slow lighting change only (~800ms).

### 6. Editorial Intelligence — *today's edition*
Cream newsprint background, real editorial typography. Masthead: `LIVING OS · TUESDAY EDITION · 14 OCTOBER 2026 · No. 428`. Then the lede — a real, full paragraph written by Aan, drop cap, generous leading — that opens with the Standing sentence and continues into two more sentences of context. Below: a full-width call-out box (the Proposal), visibly different treatment. To the right: a briefs column ("At Work Now") with the running agent. Reading time visible: "6 minutes." One spot accent color, used the way *Monocle* uses spot color. This is the only direction that scrolls (one page down reveals the "features section" — expanded Understanding — for those who want it).

---

## The index page

Six tiles, 2×3 grid on desktop, stacked on mobile. Each tile:
- 40% mood image (the six generated in v0.3)
- 60% type: direction name (display), philosophy (one line), Checksum Fidelity score, and one-word verdict from the DNA matrix ("timeless" / "novel" / "trustworthy" / etc.)
- Hover: subtle lift, mood image warms
- Click: full-screen prototype

At the top of the index, one line: *"Six visual answers to one question: what does trustworthy, ambient, continuously thinking intelligence feel like?"* No further chrome.

At the bottom of the index, a small note pointing to `.lovable/visual-directions.md` for the rationale.

---

## Design system for the surface itself (the shell, not the prototypes)

The `/livingos/directions` index is deliberately in the **hybrid "Desk"** language proposed in v0.3, so the shell is itself an implicit seventh option. Cream paper background, one hairline rule, editorial serif for the direction names, mono for the scores. This means the user is *inside a Living OS surface* while evaluating six others.

Each prototype **owns its own visual system inside its route** — its own background, its own type, its own motion. Prototypes do not share a design system with the shell or with each other. That is the point.

---

## Scope discipline

**In scope**
- Six full-viewport static prototypes, one per direction.
- Index at `/livingos/directions` with 2×3 grid and keyboard nav.
- Same scenario across all six (Standing, figures, Proposal, agent).
- Uses the six mood images already generated in `src/assets/livingos/moods/`.
- Isolated routes; no integration with Anarix nav, taskbar, sidebar, or theme.
- Framer-motion where a direction requires felt motion (Gravity, Canvas, Ambient). Instant / no motion where a direction requires it (Command, Quiet, Editorial).

**Out of scope**
- Live data. Everything is hard-coded to the Tuesday scenario.
- Interactivity beyond hover/click/keyboard nav. No commit buttons work. No agents actually stop.
- Multi-user rendering. Deferred to prototype 2.
- Time-of-day changes. Every prototype is fixed at 08:14 morning-mode.
- Mobile-optimized prototypes. Desktop-first; mobile shows a stacked, read-only version.
- Editing Anarix's design tokens, sidebar, taskbar, or any existing route.
- New backend, auth, or data model.

**Files touched**
- `src/pages/livingos/DirectionsIndex.tsx`
- `src/pages/livingos/directions/QuietArchitecture.tsx`
- `src/pages/livingos/directions/GravityField.tsx`
- `src/pages/livingos/directions/LivingCanvas.tsx`
- `src/pages/livingos/directions/CommandSurface.tsx`
- `src/pages/livingos/directions/AmbientRoom.tsx`
- `src/pages/livingos/directions/EditorialIntelligence.tsx`
- `src/livingos/scenario.ts` — the single shared scenario object
- `src/livingos/shell/DirectionShell.tsx` — keyboard nav, back-to-index
- Route registration in the existing router (isolated `/livingos/*` branch, not touching current Anarix routes)
- Google Fonts additions for the direction-specific typefaces (see below)
- Six mood images already exist in `src/assets/livingos/moods/`

No changes to any existing Anarix page, component, or token.

## Typography (loaded only inside `/livingos/*`)

- Quiet Architecture: **GT Sectra** (or Cormorant Garamond fallback) + IBM Plex Sans margins
- Gravity Field: **Söhne Mono** (or JetBrains Mono fallback) + Söhne (or Inter Tight fallback)
- Living Canvas: **Instrument Serif** display + no body face (text is rare)
- Command Surface: **Berkeley Mono** (or JetBrains Mono fallback), single face throughout
- Ambient Room: **Söhne** (or Inter Tight fallback), sparingly
- Editorial Intelligence: **GT Super** display (or Playfair Display fallback) + Söhne Breit text (or IBM Plex Sans)

All web-fontable via Google Fonts / Fontshare with the fallbacks named. No paid foundries required to ship.

## Evaluation loop after build

After the six are live, I'll ask you two questions and nothing else:
1. Which two directions do you want to keep alive for the hybrid?
2. Which single direction should be killed?

The exploration converges from six → three → one over the next two prototype rounds.

---

## Ordering of the build

If I have to build them serially (not in parallel), the order is:
1. Index + shared scenario + keyboard nav (skeleton)
2. Quiet Architecture (lowest production difficulty — proves the shell)
3. Command Surface (also low difficulty, extreme contrast to Quiet)
4. Editorial Intelligence (medium — validates the scrolling exception)
5. Ambient Room (medium-high — validates the "lit surface reveals text" interaction)
6. Gravity Field (high — validates felt-motion)
7. Living Canvas (highest — validates ambient breath)

Numbers 6 and 7 are where the exploration is most likely to teach us something we don't already know. Numbers 2 and 3 are where the exploration is most likely to ship.
