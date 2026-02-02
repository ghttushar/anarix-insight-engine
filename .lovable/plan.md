

# Complete Aan Fixes & UI Enhancement Plan

## Summary of Issues to Fix

Based on code exploration and your feedback:

| Issue | Current State | Required Fix |
|-------|---------------|--------------|
| Shadow on right panels | Panels have no shadow classes | Fix floating island shadow-xl, verify all slide-in panels |
| Breadcrumbs showing tabs | Shows "Aan" only, but "Back to Anarix" still visible in header | Remove Back button entirely, keep only "Aan" + X close |
| Toast position | Sonner set to bottom-left but may conflict with floating island | Verify positioning, fix any conflicts |
| Allura font unreadable | 24px (1.5rem) | Increase to 32px (2rem) |
| No mock reports to test | Report generation on 30s delay exists | Preload demo conversations with artifacts |
| Nav Aan opens copilot | `openWorkspace()` called but user reports copilot | Debug and harden the mode switching logic |
| Marketplace/Account in wrong place | Right side of header | Move to left side near Aan button |

---

## Phase 1: Fix Panel Shadows (All Right-Side Panels)

### Files to Modify

1. **Floating Action Island** - Remove shadow-xl
   - File: `src/features/creative/FloatingActionIsland.tsx`
   - Line 125: Change `shadow-xl` to `shadow-md` (or `shadow-none`)
   - Line 114 (collapsed orb): Change `shadow-lg` to `shadow-sm`

2. **Sonner Toasts** - Remove heavy shadow
   - File: `src/components/ui/sonner.tsx`
   - Line 16: Change `shadow-lg` to `shadow-sm`

3. **Artifact Card hover shadow**
   - File: `src/components/aan/ArtifactCard.tsx`
   - Line 31: Change `hover:shadow-md` to `hover:shadow-sm`

4. **Chart Tooltip**
   - File: `src/components/ui/chart.tsx`
   - Line 157: Change `shadow-xl` to `shadow-md`

---

## Phase 2: Simplify Aan Workspace Header

### Current State
- `AanWorkspace.tsx` has header with breadcrumb + X button
- Breadcrumb shows only "Aan"

### Required Changes

**File: `src/components/aan/AanWorkspace.tsx`**

Update header structure:
```text
BEFORE:
┌────────────────────────────────────────────────┐
│  [Aan gradient text]                      [X]  │
└────────────────────────────────────────────────┘

AFTER: (exactly as reference image-44)
┌────────────────────────────────────────────────┐
│  [Aan gradient text]          (no back btn) [X]│
└────────────────────────────────────────────────┘
```

- Remove any "Back to Anarix" text or button (already removed based on current code)
- Keep only:
  - "Aan" in Allura font with gradient (left)
  - X close button (right)

---

## Phase 3: Increase Allura Font Size

**File: `src/index.css`**

Change from:
```css
.text-aan {
  font-size: 1.5rem; /* 24px */
  line-height: 1.2;
}

.text-aan-lg {
  font-size: 1.75rem; /* 28px */
  line-height: 1.2;
}
```

To:
```css
.text-aan {
  font-size: 2rem; /* 32px - readable */
  line-height: 1.2;
}

.text-aan-lg {
  font-size: 2.5rem; /* 40px - for larger contexts */
  line-height: 1.2;
}
```

---

## Phase 4: Move Marketplace/Account to Left Side of Header

### Current Layout (Right Side)
```text
[☰] [Aan] ─────────────────────── [★ Walmart ▼] [● Demo Store ▼]
```

### New Layout (Left Side, per user request)
```text
[☰] [★ Walmart ▼] [● Demo Store ▼] ─── [Aan gradient button]
```

**File: `src/components/layout/AppHeader.tsx`**

Restructure the header:
1. Move marketplace + account dropdowns to left div (after sidebar toggle)
2. Move Aan button to right side OR keep in left but after dropdowns
3. Add proper spacing between elements

Based on your image-47 reference showing `[★ Walmart ▼] [● tushar ▼]` as pills, I'll style them accordingly.

---

## Phase 5: Preload Mock Conversations with Artifacts

### Current State
- `AanContext.tsx` has 3 mock conversations but NO artifacts
- User must type "generate report" to get artifact (30s delay)

### Required Changes

**File: `src/components/aan/AanContext.tsx`**

Add preloaded artifacts to initial conversations:

```typescript
const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Campaign Performance Analysis",
    type: "report",
    messages: [
      // User request
      { role: "user", content: "Generate a report..." },
      // AI response with summary
      { role: "assistant", content: "I've analyzed your campaign..." },
      // AI message with artifact
      { 
        role: "assistant", 
        content: "Report ready! Click below to view.",
        draft: {
          id: "report-demo-1",
          type: "report",
          title: "Last 7 Day Campaign Performance Dashboard",
          description: "Amazon • Jan 1 - Jan 7, 2026",
          changes: [
            { field: "Total Ad Spend", before: "$10,973.60", after: "$10,973.60" },
            { field: "Total Ad Sales", before: "$36,955.24", after: "$36,955.24" },
            { field: "Overall ROAS", before: "3.37x", after: "3.37x" },
          ],
          status: "pending",
        },
      },
    ],
    artifacts: [],
  },
  {
    id: "conv-2",
    title: "Q4 2025 Audit Review",
    type: "audit",
    messages: [
      { role: "user", content: "Create an account health summary" },
      { 
        role: "assistant", 
        content: "Overall Health Score: 78/100\n\nYour account shows strong fundamentals...",
        draft: {
          id: "audit-demo-1",
          type: "audit",
          title: "Account Health Audit",
          description: "Health Score: 78/100 • Risk Level: Low",
          changes: [
            { field: "Health Score", before: "N/A", after: "78/100" },
            { field: "Wasted Spend", before: "N/A", after: "$2,341 (-15%)" },
            { field: "Optimization Score", before: "N/A", after: "B+" },
          ],
          status: "pending",
        },
      },
    ],
    artifacts: [],
  },
];
```

This matches your reference images (image-50, image-49) showing the report summaries and audit cards.

---

## Phase 6: Fix Nav Aan Opening Workspace (Not Copilot)

### Debugging

Current code in `AppHeader.tsx`:
```typescript
const { openWorkspace } = useAan();
// ...
<Button onClick={openWorkspace} ...>
```

Current code in `AanContext.tsx`:
```typescript
const openWorkspace = () => setMode("workspace");
```

This SHOULD work. Possible issues:
1. Event propagation conflict
2. Another handler intercepting the click
3. Legacy `isOpen` state interfering

### Fix

**File: `src/components/aan/AanContext.tsx`**

Harden `openWorkspace`:
```typescript
const openWorkspace = () => {
  console.log("[Aan] Opening workspace mode");
  setCurrentArtifact(null);
  setMode("workspace");
};
```

**File: `src/components/layout/AppHeader.tsx`**

Add explicit event handling:
```typescript
<Button
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    openWorkspace();
  }}
  ...
>
```

---

## Phase 7: Toast Position Verification

### Current State
- `App.tsx` line 152: `<Sonner position="bottom-left" />`
- This should work, but floating island may visually conflict

### Verify
- Floating island is at `bottom-6 left-1/2 -translate-x-1/2` (center bottom)
- Toast viewport in `toast.tsx` line 17: `sm:bottom-0 sm:left-0 sm:right-auto`

Both are correctly configured. If toasts still appear elsewhere, check browser dev tools.

---

## Phase 8: Rebuild Split View for Reports (Match Reference)

Based on image-51, the report split view should show:

```text
┌─────────────────────────────────────────────────┐
│ Last 7 Day Campaign Performance Dashboard      │
│ Amazon • Jan 1 - Jan 7, 2026                    │
│                                        [↓ Download] [v1/3 ▼]
├─────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │Total Spend│ │Total Sales│ │Overall    │      │
│ │$10,973.60 │ │$36,955.24 │ │ROAS 3.37x │      │
│ └───────────┘ └───────────┘ └───────────┘      │
├─────────────────────────────────────────────────┤
│ Campaign      │Impr│Clicks│Spend│Sales│ROAS   │
│───────────────│────│──────│─────│─────│───────│
│SP | Catch All │433k│3,595 │$3k  │$10k │3.33   │
│SP | New Vic...│53k │1,087 │$1.9k│$8k  │4.20   │
│...            │    │      │     │     │       │
└─────────────────────────────────────────────────┘
│ Generated: Jan 8, 2026 at 10:39 AM              │
├─────────────────────────────────────────────────┤
│ [Editing: Last 7 Day... (v1)]              [X] │
│ [Message Aan...]                          [→] │
└─────────────────────────────────────────────────┘
```

**File: `src/components/aan/AanSplitView.tsx`**

Update to include:
1. Full KPI cards (3 columns: Spend, Sales, ROAS)
2. Campaign table with columns: Campaign, Impressions, Clicks, Spend, Sales, ROAS
3. Generated timestamp at bottom
4. Mini edit chat bar with artifact title

---

## Implementation Order

1. Phase 1: Shadow fixes (quick wins)
2. Phase 3: Font size increase (quick win)
3. Phase 4: Header restructure (marketplace/account to left)
4. Phase 5: Preload mock data (enables testing)
5. Phase 6: Debug nav Aan click
6. Phase 2: Workspace header cleanup
7. Phase 8: Report split view enhancement

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Increase Allura font to 2rem |
| `src/features/creative/FloatingActionIsland.tsx` | Reduce/remove shadow |
| `src/components/ui/sonner.tsx` | Reduce shadow |
| `src/components/layout/AppHeader.tsx` | Move dropdowns to left, harden Aan click |
| `src/components/aan/AanContext.tsx` | Preload artifacts, harden openWorkspace |
| `src/components/aan/AanSplitView.tsx` | Add campaign table for reports |
| `src/components/aan/ArtifactCard.tsx` | Reduce hover shadow |

