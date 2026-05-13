## Testimonials Section Restructure

**File:** `src/website/components/TestimonialsSection.tsx`

### Changes

1. **Remove all metric chips/badges**
   - Delete the `chips` arrays from both `TESTIMONIALS[0]` and `TESTIMONIALS[1]` objects.
   - Remove the `.map()` rendering chips inside both quote articles ("+62% New-to-Brand", "3.4x ROAS", "Walmart", "+38% Sales", "-22% TACoS", "Amazon").

2. **Top-right card (currently Quote 2 — James Ellington) → becomes the video card**
   - Replace text-only layout with the video player (poster, play button, "Customer Story · 02:14" badge).
   - Keep author block (James Ellington, Sr. Director of Sales, Drive Medical) below the video inside the same card.
   - Keep the existing `lg:col-span-5` width and dark gradient background.
   - Remove the standalone `VIDEO_TESTIMONIAL` quote text from the card body — video + author only.

3. **Bottom full-width card → redesign as text-only pull-quote**
   - Remove the entire video block (video element, play button, poster, duration badge, two-column grid).
   - Replace with a single centered/left-aligned text quote layout: large Quote icon, italic quote text, then a small circular avatar (40px, gradient bg with initial like the other cards) + name + role inline.
   - Use a different testimonial for variety — pull a third quote (or reuse the video testimonial copy as a written quote) so the section reads as 3 distinct voices.
   - Keep `lg:col-span-12`, keep gradient background but tone for readability.

4. **Top-left card (Firat Ozkan)** — unchanged structurally, just remove the chips block.

### Result
Three testimonial cards: large written quote (left), video testimonial (top-right), full-width written quote with avatar (bottom). No metric badges anywhere.
