

## Redesign Targeting Actions Table, Standardize Toolbar, Floating Filter, Wire Add Keywords

### 1. Redesign Match Type Cells (image-124)

The reference shows each Broad/Exact/Phrase cell as a clean rounded card with:
- Checkbox top-left corner
- Bid value in a small input below, centered
- Card has a subtle rounded border, light background when selected (blue tint), plain white when unselected
- Clean spacing between cards across the row

**Current issue**: The cells use `flex-col items-center` with cramped styling. The checkbox and input are stacked but look messy.

**Fix in `TargetingActions.tsx`**: Redesign the match type cells to match image-124 exactly:
- Each cell renders a rounded-lg card (~80px wide)
- Checkbox in top-left with `absolute` positioning or top-aligned flex
- Bid input below, centered, with clear border
- Selected state: light blue/primary background tint, checked checkbox filled blue
- Unselected: white/background, unchecked checkbox

### 2. Standardize DataTableToolbar Button Layout

**Problem**: Toolbar buttons (Custom Bid, Columns, Filter, Download, Add Keywords) appear in inconsistent positions across pages. Some pages put extra buttons outside the toolbar row.

**Fix**: The `DataTableToolbar` already has `rightContent` prop. Standardize all pages:
- **Left**: Search input (always first)
- **Right**: page-specific buttons (Custom Bid, Add Keywords) → Columns → Filter → Download → Edit toggle
- Move Custom Bid and Add Keywords buttons into `rightContent` of `DataTableToolbar` in `TargetingActions.tsx` instead of a separate row
- Remove the separate `<div className="flex items-center justify-between">` wrapper

### 3. Floating Filter Panel (image-123)

**Current**: Filter builder is inline `bg-muted/30` block below the toolbar. 
**Reference**: Shows a floating popover/card with shadow, anchored to the Filter button.

**Fix in `DataTableToolbar.tsx`**:
- Replace the inline `div` filter builder with a `Popover` anchored to the Filter button
- The popover content renders the same Where/And filter rows
- Filter fields include: "Match Type To Add", "ACOS", "Ad Units", etc.
- Operators include "is", "is less than", "is greater than or equal to"
- Values can be text or multi-select (e.g., "Exact, Broad, Phrase")
- "+ Add Filter" link at bottom-left, Cancel + Apply at bottom-right
- Add a delete (trash) icon per row instead of X

### 4. Wire Add Keywords Button

**Current**: `handleAddKeywords` just shows a toast. No modal opens.

**Fix**: Create a new `AddKeywordTargetModal` component for the Targeting Actions context (different from the BI `AddKeywordModal`). This modal allows:
- Entering a keyword manually
- Selecting match type (Broad, Exact, Phrase checkboxes)
- Setting a bid value
- Selecting target campaign and ad group from dropdowns
- "Add" button creates a new row in the targeting actions table

Wire the "Add Keywords" button in `TargetingActions.tsx` to open this modal with `useState` controlling open/close.

### 5. Targeting Actions Toolbar Cleanup

Remove the separate toolbar/button row. Merge everything into a single `DataTableToolbar` call:
- `rightContent` includes: Custom Bid popover, Add Keywords button
- Remove duplicate filter/download buttons
- The `DataTableToolbar` provides Search, Columns, Filter, Download natively

---

### Files

| File | Change |
|---|---|
| `TargetingActions.tsx` | Redesign match type cells, merge toolbar into single DataTableToolbar with rightContent, wire Add Keywords modal |
| `DataTableToolbar.tsx` | Convert filter builder from inline div to floating Popover, add trash icon, update operator list |
| `AddKeywordTargetModal.tsx` | **NEW** — Modal for adding keyword targets with match type, bid, campaign/ad group selection |

