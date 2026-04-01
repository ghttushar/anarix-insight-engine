

## Changes: Island Border Color, Aan Model Selector, Aan File Attachment

### 1. Floating Action Island — Primary Blue Border

**File:** `FloatingActionIsland.tsx`

Change line 110 from `border-2 border-border` to `border-2 border-primary/60`. This gives the island a visible primary blue border matching the brand color.

---

### 2. Aan AI Model Selector (ChatGPT-style)

**File:** `AanInput.tsx`

Add a model selector dropdown at the bottom-left of the input area, styled like ChatGPT's model picker. A small pill/chip button showing the current model name (e.g., "Gemini Flash") with a chevron. Clicking opens a popover with available model options:

- Gemini 3 Flash (default, fast)
- Gemini 2.5 Pro (complex reasoning)
- GPT-5 (powerful all-rounder)
- GPT-5 Mini (balanced)

Each option shows model name + a one-line description. Selected model gets a checkmark. The selector sits left-aligned below the textarea, before the disclaimer text.

State stored in `AanContext.tsx` as `selectedModel` string so it persists across the session.

**Files:** `AanContext.tsx` (add `selectedModel` + `setSelectedModel` to context), `AanInput.tsx` (render model picker UI)

---

### 3. Aan File Attachment Button (ChatGPT-style)

**File:** `AanInput.tsx`

Add a paperclip/attachment button to the left side of the input container (inside the border, left of the textarea). Clicking opens a hidden file input accepting images, PDFs, CSVs, and common file types. Selected files show as small preview chips between the suggestion notch and the textarea — each chip shows filename + X to remove.

The attachment state is local to `AanInput` (since this is mock/UI-only for now — no actual upload backend). Files display as `{ name, size, type }` chips.

Layout: `[Paperclip Button] [Textarea] [Send/Stop Button]` — the paperclip sits at the bottom-left inside the input container, mirroring ChatGPT's layout.

---

### Files Summary

| File | Change |
|---|---|
| `FloatingActionIsland.tsx` | Change `border-border` → `border-primary/60` |
| `AanContext.tsx` | Add `selectedModel` + `setSelectedModel` to context |
| `AanInput.tsx` | Add model selector popover + attachment button with file chips |

