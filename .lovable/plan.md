
# Comprehensive Aan Architecture, Insights Panel & UI Enhancement Plan

## Overview

This plan implements the complete Aan AI layer architecture along with multiple UI refinements:
1. Add Insights icon to Floating Island with categorized insights panel (Critical, Attention, Positive)
2. Update "View More" on Profitability Dashboard to open Aan-style right panel
3. Fix Anarix logo positioning (top of sidebar, not header)
4. Show Floating Island only in app (not login/settings)
5. Collapsed sidebar shows Anarix logo icon instead of generic sparkle
6. Implement complete Aan 3-mode architecture (Floating Copilot, Split Task View, Full Workspace)
7. Create unique Aan gradient
8. Add Allura font for "Aan" branding
9. Dynamic logo switching in Aan mode ("Aan by Anarix")

---

## Part 1: Aan Gradient & Typography System

### 1.1 Add Allura Font
**File**: `src/index.css`

Add Google Fonts import for Allura (script/decorative font for Aan branding):
```css
@import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');
```

### 1.2 Aan-Specific Gradient
**CSS Variables** in `src/index.css`:
```css
:root {
  --aan-gradient-start: #6366F1; /* Indigo-500 */
  --aan-gradient-mid: #8B5CF6; /* Violet-500 */
  --aan-gradient-end: #A78BFA; /* Violet-400 */
}
```

Utility class for Aan gradient:
```css
.aan-gradient {
  background: linear-gradient(135deg, var(--aan-gradient-start), var(--aan-gradient-mid), var(--aan-gradient-end));
}
```

### 1.3 Typography Variables
```css
:root {
  --font-aan: 'Allura', cursive;
}
```

---

## Part 2: Insights Panel System

### 2.1 New Component: InsightsPanel
**File**: `src/components/insights/InsightsPanel.tsx`

A right-side panel (same pattern as AanPanel) showing categorized insights:

**Three Categories**:
1. **Critical Alerts** (Red) - Immediate action required
   - Icon: AlertTriangle
   - Examples: "High-spend zero-conversion keywords", "Budget depleted campaigns"

2. **Worth a Look** (Yellow/Amber) - Review when possible
   - Icon: AlertCircle
   - Examples: "Missing backend search terms", "Price competitiveness opportunity"

3. **Wins & Highlights** (Green) - Positive insights
   - Icon: CheckCircle2
   - Examples: "Strong inventory health", "ROAS improvement detected"

**Mock Insights Data**:
```typescript
const mockInsights = [
  {
    id: "1",
    category: "critical",
    title: "High-spend, zero-conversion keywords detected",
    description: "15 keywords have spent over $500 with 0 conversions in the last 30 days.",
    action: "Pause or negatively target these keywords immediately.",
  },
  {
    id: "2",
    category: "attention",
    title: "Missing backend search terms",
    description: "23 products are missing optimized backend search terms.",
    action: "Add relevant backend keywords to improve discoverability.",
  },
  {
    id: "3",
    category: "positive",
    title: "Strong inventory health",
    description: "All products have sufficient stock levels for the next 45 days.",
    action: null,
  },
  // ... more insights
];
```

### 2.2 InsightsContext
**File**: `src/components/insights/InsightsContext.tsx`

Manages insights panel state:
```typescript
interface InsightsContextType {
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  insights: Insight[];
  criticalCount: number;
  attentionCount: number;
  positiveCount: number;
}
```

### 2.3 Add to Floating Island
**Update**: `src/features/creative/FloatingActionIsland.tsx`

Add Lightbulb icon for insights:
```typescript
import { Lightbulb } from "lucide-react";

// In actions array:
{ icon: Lightbulb, label: "Insights", onClick: openInsights }
```

---

## Part 3: Floating Island Visibility Logic

### 3.1 Route-Based Visibility
**Update**: `src/features/creative/FloatingActionIsland.tsx`

Hide on login, onboarding, and settings routes:
```typescript
const hiddenRoutes = ["/login", "/onboarding", "/settings"];
const shouldHide = hiddenRoutes.some(route => pathname.startsWith(route));

if (shouldHide) return null;
```

### 3.2 Collapsed State with Anarix Logo
When user minimizes the island, show a circular button with the Anarix logo icon:
```tsx
if (!isVisible) {
  return (
    <button
      onClick={() => setIsVisible(true)}
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg flex items-center justify-center overflow-hidden border border-border bg-card hover:shadow-xl transition-shadow"
    >
      <img 
        src={resolvedTheme === "dark" ? logoWhite : logoFull} 
        alt="Anarix" 
        className="h-8 w-8 object-contain"
      />
    </button>
  );
}
```

---

## Part 4: Sidebar Logo Placement

### 4.1 Move Logo to Top of Sidebar
**Update**: `src/components/layout/AppSidebar.tsx`

Add logo at the very top of sidebar content (before Aan AI button):
```tsx
<SidebarContent className="py-4">
  {/* Logo at top */}
  <div className="px-3 mb-4 flex items-center justify-center">
    {!collapsed ? (
      <img src={logoSrc} alt="Anarix" className="h-8 w-auto" />
    ) : (
      <img src={logoIcon} alt="Anarix" className="h-8 w-8 object-contain" />
    )}
  </div>
  
  {/* Aan AI Entry Point */}
  ...
</SidebarContent>
```

### 4.2 Remove Logo from Header
**Update**: `src/components/layout/AppHeader.tsx`

Remove the logo from the header (keep only sidebar toggle and other controls).

---

## Part 5: Aan Three-Mode Architecture

### 5.1 Mode Definitions

```typescript
type AanMode = "closed" | "copilot" | "split" | "workspace";
```

**Mode A: Floating Copilot (copilot)**
- Triggered by: Floating Island click, sidebar Aan button, keyboard shortcut
- Right panel ~420px wide
- Background dimmed 4%
- Lightweight chat interface
- No full navigation
- Can start tasks but hands off to split/workspace for completion

**Mode B: Split Task View (split)**
- Triggered by: Clicking artifact card in copilot
- Right panel expands to ~50% width
- Main Anarix UI visible on left
- Shows artifact (report, audit, etc.)
- Version history and edit mode
- Mini chat input at bottom for artifact edits

**Mode C: Full Workspace (workspace)**
- Triggered by: "Aan" in top nav, "Open in full workspace" CTA
- Replaces entire Anarix shell
- Has its own sidebar (Chat, Reports, Audit, Creative, Rules, Agents)
- Separate history
- Back button returns to last Anarix screen

### 5.2 Update AanContext
**File**: `src/components/aan/AanContext.tsx`

Add mode tracking:
```typescript
interface AanContextType {
  mode: AanMode;
  setMode: (mode: AanMode) => void;
  openCopilot: () => void;
  openSplit: (artifact: AanArtifact) => void;
  openWorkspace: () => void;
  closeAan: () => void;
  currentArtifact: AanArtifact | null;
  // ... existing props
}
```

### 5.3 AanCopilotPanel (Mode A)
**File**: `src/components/aan/AanCopilotPanel.tsx`

Slim right panel (420px) with:
- Aan gradient header with "Aan" in Allura font
- Context bar showing current page
- Chat messages
- Input area
- No full navigation
- "Open in workspace" link

### 5.4 AanSplitView (Mode B)
**File**: `src/components/aan/AanSplitView.tsx`

Expanded view (50% width) showing:
- Artifact header (title, date, download, version selector)
- Artifact content (charts, tables)
- Mini edit chat at bottom
- Close button returns to copilot

### 5.5 AanWorkspace (Mode C)
**File**: `src/components/aan/AanWorkspace.tsx`

Full-screen replacement with:
- Own sidebar (Chat, Reports, Audit, Creative, Rules, Agents)
- Logo changes to "Aan by Anarix" (Aan in Allura, Anarix logo)
- Glassmorphism panel styling
- Back to Anarix button

---

## Part 6: Dynamic Logo in Aan Mode

### 6.1 AanLogo Component
**File**: `src/components/aan/AanLogo.tsx`

```tsx
export function AanLogo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span 
        className="text-2xl font-bold"
        style={{ fontFamily: 'Allura, cursive' }}
      >
        Aan
      </span>
      <span className="text-xs text-muted-foreground">by</span>
      <img src={logoSrc} alt="Anarix" className="h-5 w-auto" />
    </div>
  );
}
```

---

## Part 7: View More Panel Enhancement

### 7.1 Update PeriodBreakdownPanel
**File**: `src/components/profitability/PeriodBreakdownPanel.tsx`

Style it like the Aan panel with:
- Same slide-in animation
- Backdrop dimming
- Gradient header accent
- Close button styling

```tsx
<div className="relative overflow-hidden border-b border-border">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5" />
  <div className="relative flex items-center justify-between px-4 py-4">
    ...
  </div>
</div>
```

---

## Part 8: File Structure

```text
src/
├── components/
│   ├── aan/
│   │   ├── AanContext.tsx (MODIFY - add mode management)
│   │   ├── AanCopilotPanel.tsx (NEW - Mode A)
│   │   ├── AanSplitView.tsx (NEW - Mode B)
│   │   ├── AanWorkspace.tsx (NEW - Mode C)
│   │   ├── AanWorkspaceSidebar.tsx (NEW - workspace sidebar)
│   │   ├── AanLogo.tsx (NEW - "Aan by Anarix" logo)
│   │   ├── AanPanel.tsx (MODIFY - becomes router between modes)
│   │   └── index.ts (MODIFY - export new components)
│   ├── insights/
│   │   ├── InsightsContext.tsx (NEW)
│   │   ├── InsightsPanel.tsx (NEW)
│   │   ├── InsightCard.tsx (NEW)
│   │   └── index.ts (NEW)
│   ├── layout/
│   │   ├── AppSidebar.tsx (MODIFY - add logo at top)
│   │   └── AppHeader.tsx (MODIFY - remove logo)
│   └── profitability/
│       └── PeriodBreakdownPanel.tsx (MODIFY - Aan-style styling)
├── features/creative/
│   └── FloatingActionIsland.tsx (MODIFY - add insights, hide on certain routes, collapsed logo)
└── index.css (MODIFY - add Allura font, Aan gradient)
```

---

## Part 9: Implementation Sequence

### Phase 1: Typography & Gradient Foundation
1. Add Allura font import to index.css
2. Add Aan gradient CSS variables
3. Add font-aan CSS variable

### Phase 2: Logo Positioning
1. Move logo from header to sidebar top
2. Create icon-only version for collapsed sidebar
3. Update header to remove logo

### Phase 3: Floating Island Updates
1. Add route-based visibility logic
2. Add collapsed state with Anarix logo
3. Add Insights icon trigger

### Phase 4: Insights System
1. Create InsightsContext
2. Create InsightCard component
3. Create InsightsPanel component
4. Wire to FloatingIsland

### Phase 5: Aan Mode Architecture
1. Update AanContext with mode management
2. Create AanCopilotPanel (refactor from current AanPanel)
3. Create AanSplitView for artifacts
4. Create AanWorkspace for full mode
5. Create AanWorkspaceSidebar
6. Create AanLogo component

### Phase 6: View More Enhancement
1. Update PeriodBreakdownPanel styling to match Aan

### Phase 7: App Integration
1. Add InsightsProvider to App.tsx
2. Update route structure for Aan workspace if needed

---

## Technical Details

### Aan Gradient Specification
```css
.aan-gradient {
  background: linear-gradient(
    135deg,
    #6366F1 0%,    /* Indigo-500 */
    #8B5CF6 50%,   /* Violet-500 */
    #A78BFA 100%   /* Violet-400 */
  );
}
```

### Insight Categories
| Category | Name | Color | Icon |
|----------|------|-------|------|
| critical | Critical Alerts | destructive (red) | AlertTriangle |
| attention | Worth a Look | warning (amber) | AlertCircle |
| positive | Wins & Highlights | success (green) | CheckCircle2 |

### Mode Switching Logic
```typescript
// From Floating Island → Copilot
openCopilot()

// From Copilot → Split (when artifact clicked)
openSplit(artifact)

// From Copilot/Split → Workspace
openWorkspace()

// Any mode → Closed
closeAan()
```

### Panel Width Specifications
- Copilot Panel: 420px (fixed)
- Split View: 50vw (flexible)
- Workspace: 100vw (replaces shell)

### Z-Index Layers
- Background: z-[-10]
- Main content: z-[1]
- Floating Island: z-[50]
- Aan Backdrop: z-[40]
- Aan Panel: z-[50]
- Insights Panel: z-[50]
- Modals/Dialogs: z-[60]
