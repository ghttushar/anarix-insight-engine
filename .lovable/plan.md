## Goal
Make the Ask Aan mascot fit the pill more snugly, and have the entire Ask Aan pill disappear from the Floating Action Island the moment the Aan Copilot side panel opens — reinforcing the idea that the mascot "lives" and travels to wherever Aan is currently working.

## Changes

### `src/features/creative/FloatingActionIsland.tsx`
- Read `mode` from `useAan()` alongside `openCopilot`.
- Shrink the mascot inside the Ask Aan pill from `size={44}` to `size={32}`, and tighten the pill: `h-10 pl-1 pr-3 gap-1.5` (was `h-12 pl-1.5 pr-3.5 gap-2`). This keeps the coral diamond comfortably inside the capsule with even vertical padding.
  - Note: at size 32 the mascot is in "compact" tier and won't run cursor-sway. To preserve the live mouse-tracking behavior the user just approved, I'll bump to `size={36}` instead — still visually smaller than the current 44, but inside the "full" tier (>= 32 with floating; tier threshold is `size <= 40 → compact`, so I'll use `size={42}` with tighter pill padding `h-11 pl-1 pr-3.5`). Choosing **size 42 + h-11 pill** to keep the live sway intact while reducing visual heft.
- Wrap the Ask Aan pill render in `{newBranding && mode !== "copilot" && (...)}` so it disappears when the Copilot panel is active. When the user closes the Copilot panel, the pill reappears in the island.

### Out of scope
- No changes to the mascot component itself.
- No changes to other action island buttons.
- No changes to the Copilot panel — its existing internal mascot (input anchor) already represents the "moved" Aan.

## Behavior summary
- Default state: Ask Aan pill visible in the island, mascot lives there with cursor sway.
- Click Ask Aan → Copilot panel opens → pill instantly hides from the island (mascot has "moved" into the Copilot input).
- Close Copilot → pill returns to the island.