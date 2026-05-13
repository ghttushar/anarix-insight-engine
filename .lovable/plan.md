
# Refined TACoS section — "30% less, every time"

Replace the current cartoonish circular pie-slice taco with an editorial-grade SVG illustration of a taco shown in side profile, with a clean **bite arc** removed from the upper-right. A bite-shaped wedge animates out (the 30% bite) on scroll-in. Mature linework, restrained palette, no kid-poster vibes.

## Visual concept

- **Side-profile taco**, 360×260 viewBox, drawn in monoline + flat fills.
- **Single muted palette** (no rainbow): warm shell ochre `hsl(36 45% 62%)`, soft tomato `hsl(8 55% 55%)`, sage lettuce `hsl(140 22% 48%)`, muted cheese `hsl(40 55% 65%)`, ink line `hsl(var(--foreground))`. Everything reads as one composed object, not a sticker.
- **Bite removal**: a SVG `mask` that subtracts a smooth bite arc (cubic curve, not jagged teeth — too playful) from the upper-right ~30% of the silhouette. Animates from full to bitten over 1.4s, eased.
- **Subtle crumbs**: 3 small dots fall from the bite area on scroll-in, soft fade-out at end. No confetti, no steam.
- **Type as visual anchor** (treated as poster, not caption):
  - Eyebrow: "TACOS · TOTAL ADVERTISING COST OF SALES" (small caps, tracked, muted).
  - Headline: "We take a **30%** bite out of yours." — the `30%` morphs/counts up alongside the bite.
  - Sub: "One bite for us. The rest stays on your plate." (the pun, mature).
  - Footnote: existing TACoS explainer paragraph kept, slightly tightened.
- **Motion timing**: bite eats in 1.4s `cubic-bezier(0.2,0,0,1)`. Number counts 0→30. Crumbs fade 0.4→0 over 1s with delay 0.6s. Single pass, no looping.

## Layout

```
[ small-caps eyebrow                              ]
[                                                 ]
[              ILLUSTRATION (side taco)           ]
[                                                 ]
[          We take a 30% bite out of yours.       ]
[       One bite for us. The rest stays …         ]
```

Two-column on lg+ optional, but center-stack reads cleaner and matches existing rhythm. Stick with center-stack.

## Implementation

Single file edit: `src/website/components/TacosSection.tsx`.

- Replace `AnimatedTaco` with new `BittenTaco` SVG component:
  - viewBox `0 0 360 260`.
  - Layers (back→front): shadow ellipse, shell back-curve, fillings group (lettuce ribbon, tomato dice, cheese strands, sour-cream highlight), shell front-curve, ink outline.
  - `<mask id="bite">` containing a white rect plus a black bite path (smooth crescent on upper-right). Bite path `pathLength` animated via `framer-motion` from 0 (no bite) to 1 (full 30% bite).
  - Crumbs: 3 small `<circle>` with staggered `motion.circle` opacity + translate.
- Replace headline + sub copy as above.
- Remove "Our Take on TACoS" eyebrow → replace with the small-caps full-name eyebrow.
- Number counter reused via existing `progress` state (already counts 0→1 over 2s; reduce to 1.4s and tie to bite).
- Keep `useScrollReveal` and the section wrapper untouched.

No new dependencies. No other files touched.

## QA

- Verify on light + dark themes: ink line uses `currentColor`/foreground token so contrast is correct.
- Verify bite mask renders cleanly (no leaking edges) at 64px and 320px sizes.
- Verify text never overlaps illustration on narrow viewports — illustration scales `max-w-sm`.
