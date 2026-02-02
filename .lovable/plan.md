

# Complete Aan Workspace & UI Fixes Implementation Plan

## Summary of Requirements

| # | Issue | Solution |
|---|-------|----------|
| 1 | Report viewer opens outside Aan | Create embedded split view INSIDE Aan workspace |
| 2 | Sidebar/Panel toggle behavior | Creative expand/collapse button; mutual exclusivity |
| 3 | 30s circular progress during generation | Add animated circular progress indicator |
| 4 | Report = data visualization in chat | Rich markdown summary with inline data |
| 5 | Audit = paragraph summary in chat | Simple paragraph format |
| 6 | Report viewer stays in Aan | Modify openSplit to NOT exit workspace |
| 7 | Geography map broken | Replace with static world map SVG, cursor pointer for active regions |
| 8 | Floating island on login/settings | Add more routes to hidden list |
| 9 | Compact/Comfortable not working | Add CSS density classes to table rows and cards |
| 10 | App starts in light mode | Change default theme from "system" to "light" |

---

## Phase 1: Theme & Density Fixes

### 1.1 Default to Light Mode

**File: `src/contexts/ThemeContext.tsx`**

Change default theme from "system" to "light":

```typescript
// Line 14-17: Change from
const [theme, setThemeState] = useState<Theme>(() => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("anarix-theme") as Theme) || "system";
  }
  return "system";
});

// To:
const [theme, setThemeState] = useState<Theme>(() => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("anarix-theme") as Theme) || "light";
  }
  return "light";
});
```

### 1.2 Fix Density Styles

**File: `src/index.css`**

Add density-aware CSS classes that tables and cards can use:

```css
/* Density Modes */
.density-comfortable {
  --spacing-base: 4px;
  --row-height: 44px;
  --card-padding: 16px;
}

.density-compact {
  --spacing-base: 2px;
  --row-height: 32px;
  --card-padding: 12px;
}

/* Apply to table rows */
.density-compact table tbody tr td {
  padding-top: 4px;
  padding-bottom: 4px;
}

.density-compact .card {
  padding: 12px;
}
```

---

## Phase 2: Floating Island Route Hiding

**File: `src/features/creative/FloatingActionIsland.tsx`**

Update hidden routes array to include all settings pages:

```typescript
// Line 64: Change from
const hiddenRoutes = ["/login", "/onboarding", "/settings"];

// To:
const hiddenRoutes = [
  "/login",
  "/onboarding",
  "/settings/appearance",
  "/settings/accounts",
  "/settings/accounts/connect",
];
```

Use startsWith matching which is already in place (line 76).

---

## Phase 3: Aan Workspace Internal Split View

### Current Flow (BROKEN)
```text
Aan Workspace -> Click Report -> Exits workspace -> Opens standalone split panel
```

### New Flow (CORRECT)
```text
Aan Workspace -> Click Report -> Sidebar hides -> Right panel shows INSIDE workspace
```

### 3.1 Add State to Aan Context

**File: `src/components/aan/AanContext.tsx`**

Add state for internal artifact viewing:

```typescript
// Add new state
const [viewingArtifact, setViewingArtifact] = useState<AanDraft | null>(null);

// Add new method
const viewArtifact = (artifact: AanDraft) => {
  setViewingArtifact(artifact);
};

const closeArtifactView = () => {
  setViewingArtifact(null);
};

// Update openSplit to work within workspace
const openSplit = (artifact: AanDraft) => {
  // If in workspace mode, view internally
  if (mode === "workspace") {
    setViewingArtifact(artifact);
  } else {
    // Otherwise use standalone split view
    setCurrentArtifact(artifact);
    setMode("split");
  }
};
```

### 3.2 Update Aan Workspace Layout

**File: `src/components/aan/AanWorkspace.tsx`**

Add internal split view panel with sidebar toggle:

```typescript
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAan } from "./AanContext";
import { AanWorkspaceSidebar } from "./AanWorkspaceSidebar";
import { AanConversation } from "./AanConversation";
import { AanInput } from "./AanInput";
import { AanArtifactViewer } from "./AanArtifactViewer"; // NEW

export function AanWorkspace() {
  const { mode, closeAan, viewingArtifact, closeArtifactView } = useAan();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const isOpen = mode === "workspace";
  if (!isOpen) return null;

  // When artifact is being viewed, hide sidebar
  const showSidebar = sidebarExpanded && !viewingArtifact;
  const showArtifactPanel = !!viewingArtifact;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 aan-gradient-text" />
          <span className="font-aan text-aan aan-gradient-text font-bold">Aan</span>
          <span className="text-sm text-muted-foreground">by Anarix</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Creative Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="relative h-8 w-8 rounded-full border border-border bg-card hover:bg-muted transition-all overflow-hidden group"
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <div className="absolute inset-0 aan-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
            {sidebarExpanded ? (
              <ChevronLeft className="h-4 w-4 mx-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 mx-auto" />
            )}
          </button>
          
          <Button variant="ghost" size="icon" onClick={closeAan} className="h-8 w-8 hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content with conditional layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden when viewing artifact */}
        {showSidebar && <AanWorkspaceSidebar />}

        {/* Conversation Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <AanConversation />
          <AanInput />
        </main>

        {/* Artifact Viewer Panel - shown when artifact selected */}
        {showArtifactPanel && (
          <AanArtifactViewer
            artifact={viewingArtifact}
            onClose={closeArtifactView}
          />
        )}
      </div>
    </div>
  );
}
```

### 3.3 Create Aan Artifact Viewer Component

**New File: `src/components/aan/AanArtifactViewer.tsx`**

This is the RIGHT PANEL that shows report/audit content INSIDE the Aan workspace:

```typescript
// Contains the same content as AanSplitView but styled for embedded use
// - No fixed positioning
// - Uses flex layout within workspace
// - Width: 50% of workspace
// - Has own close button that calls closeArtifactView
```

---

## Phase 4: Circular Progress During Generation

### 4.1 Create Circular Progress Component

**New File: `src/components/ui/circular-progress.tsx`**

```typescript
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CircularProgress({ 
  progress, 
  size = 64, 
  strokeWidth = 4,
  label 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--aan-gradient-start))" />
            <stop offset="50%" stopColor="hsl(var(--aan-gradient-mid))" />
            <stop offset="100%" stopColor="hsl(var(--aan-gradient-end))" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
```

### 4.2 Update Aan Input with Progress

**File: `src/components/aan/AanInput.tsx`**

Add progress state and timer:

```typescript
const [generationProgress, setGenerationProgress] = useState(0);

// During 30 second generation
if (isReportRequest(userMessage)) {
  setIsGenerating(true);
  setGenerationType("report");
  
  // Progress animation over 30 seconds
  const progressInterval = setInterval(() => {
    setGenerationProgress((p) => {
      if (p >= 100) {
        clearInterval(progressInterval);
        return 100;
      }
      return p + (100 / 30); // Increment every second
    });
  }, 1000);

  timerRef.current = setTimeout(() => {
    clearInterval(progressInterval);
    setGenerationProgress(0);
    // ... add artifact message
  }, 30000);
}
```

### 4.3 Show Progress in Chat

**File: `src/components/aan/AanConversation.tsx`**

Add progress indicator that appears during generation:

```typescript
// At the end of messages list, show generation progress if active
{isGenerating && (
  <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50">
    <CircularProgress progress={generationProgress} size={56} />
    <div>
      <p className="font-medium text-foreground">
        {generationType === "report" ? "Generating Report" : "Running Audit"}
      </p>
      <p className="text-sm text-muted-foreground">
        {Math.ceil((100 - generationProgress) * 0.3)}s remaining
      </p>
    </div>
  </div>
)}
```

---

## Phase 5: Report & Audit Chat Summaries

### 5.1 Enhanced Report Summary (Data Visualization Style)

**File: `src/components/aan/AanInput.tsx`**

Update `getReportSummary()` to return rich formatted content:

```typescript
const getReportSummary = () => `I've analyzed your Amazon advertising data for the last 7 days. Here's what I found:

**Performance Summary:**
• Total Ad Spend: $10,973.60
• Total Ad Sales: $36,955.24
• Overall ROAS: 3.37x

**Top Performers:**
Your best performing campaign is "SP | Bamboo | 8 inch | Queen" with a 6.01x ROAS, followed by "SB | Bed in a Box Mattress" at 6.19x ROAS. These campaigns are efficiently converting ad spend into sales.

**Opportunities:**
Consider optimizing "SP | Bamboo | Queen" (1.88x ROAS) and "SP | Bamboo | 8 inch | Twin" (2.04x ROAS) which are underperforming relative to your account average.

Click the report below to view the full dashboard with detailed metrics.`;
```

### 5.2 Audit Summary (Paragraph Format)

```typescript
const getAuditSummary = () => `I've completed a comprehensive audit of your Amazon account. Here's what I found:

**Overall Health Score: 78/100**

Your account shows strong fundamentals with a few areas requiring attention. The most critical issue is your advertising efficiency, where I've identified significant wasted spend on non-converting keywords.

Key findings include 15 high-spend, zero-conversion keywords that should be paused immediately, 23 products missing optimized backend search terms, and 8 products priced 5-10% higher than top competitors.

On the positive side, all products have sufficient inventory health for the next 45 days.

Click below to view the full audit report with actionable recommendations.`;
```

---

## Phase 6: Geography Map Fix

**File: `src/components/profitability/GeographyMap.tsx`**

Replace the current broken SVG with a proper world map:

1. Add cursor: pointer to active countries
2. Improve SVG paths for accurate country shapes
3. Add hand cursor on hover for active regions

```typescript
// Update the path elements for active countries:
<path
  key={code}
  d={country.path}
  fill={getIntensityColor(country.sales)}
  stroke={selectedRegion === code ? "hsl(var(--primary))" : "hsl(var(--border))"}
  strokeWidth={selectedRegion === code ? 2.5 : 1}
  className={cn(
    "cursor-pointer transition-all duration-200",  // <- cursor-pointer added
    hoveredCountry === code && "brightness-110"
  )}
  style={{ cursor: "pointer" }}  // <- explicit cursor style
  onMouseEnter={() => setHoveredCountry(code)}
  onMouseLeave={() => setHoveredCountry(null)}
  onClick={() => onRegionSelect?.(code)}
/>

// For inactive world regions, keep cursor default:
<path
  key={code}
  d={region.path}
  fill="hsl(var(--muted))"
  stroke="hsl(var(--border))"
  strokeWidth={0.5}
  className="opacity-40 cursor-default"  // <- cursor-default for inactive
/>
```

Also improve the SVG viewport and paths for better visual representation.

---

## Phase 7: Creative Sidebar Toggle Button Design

The toggle button in the Aan workspace header should be sleek and unique:

```typescript
{/* Creative Sidebar Toggle - Sleek pill design */}
<button
  onClick={() => setSidebarExpanded(!sidebarExpanded)}
  className="group relative flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 hover:border-primary/50 transition-all overflow-hidden"
  title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
>
  {/* Gradient hover effect */}
  <div className="absolute inset-0 aan-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
  
  {/* Animated chevrons */}
  <div className="relative flex items-center">
    {sidebarExpanded ? (
      <>
        <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <ChevronLeft className="h-3.5 w-3.5 -ml-2 opacity-50 transition-transform group-hover:-translate-x-0.5" />
      </>
    ) : (
      <>
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        <ChevronRight className="h-3.5 w-3.5 -ml-2 opacity-50 transition-transform group-hover:translate-x-0.5" />
      </>
    )}
  </div>
  
  {/* Label - only when expanded */}
  {sidebarExpanded && (
    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
      Hide
    </span>
  )}
</button>
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/circular-progress.tsx` | Animated circular progress indicator |
| `src/components/aan/AanArtifactViewer.tsx` | Embedded artifact viewer for workspace |

## Files to Modify

| File | Changes |
|------|---------|
| `src/contexts/ThemeContext.tsx` | Default to "light" instead of "system" |
| `src/index.css` | Add density CSS classes |
| `src/features/creative/FloatingActionIsland.tsx` | Expand hidden routes list |
| `src/components/aan/AanContext.tsx` | Add viewingArtifact state and methods |
| `src/components/aan/AanWorkspace.tsx` | Add sidebar toggle and embedded viewer |
| `src/components/aan/AanInput.tsx` | Add circular progress during generation |
| `src/components/aan/AanConversation.tsx` | Show progress indicator and pass generation state |
| `src/components/profitability/GeographyMap.tsx` | Add cursor pointer styles |

---

## Implementation Order

1. Theme default to light + density CSS
2. Floating island route hiding
3. Circular progress component
4. Aan context updates for internal viewing
5. Aan workspace layout with sidebar toggle
6. Artifact viewer component
7. Update report/audit summaries
8. Geography map cursor fix
9. Test end-to-end report generation flow

