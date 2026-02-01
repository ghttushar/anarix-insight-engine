
# Complete UI Enhancement, Bug Fixes & Feature Activation Plan

## Overview

This plan addresses all the issues you've identified:
1. Replace back buttons with proper breadcrumb navigation
2. Fix the geography map (world view with US/Canada/Mexico active)
3. Add and properly integrate Anarix logos for light/dark mode
4. Integrate the custom Lottie loader animation
5. Fix profitability tables (sticky column overlapping)
6. Improve sidebar navigation hierarchy (clearer visual distinction)
7. Activate all creative features (Ambient Background, Morphing Numbers, etc.)
8. Complete onboarding flow (login → signup → account linking → walkthrough → preferences → app)
9. Rename Appearance to Preferences and add all settings
10. Add screenshot option to Floating Action Island
11. Make Compact/Comfortable density actually functional
12. Add complete keyboard shortcuts list to Preferences
13. Add sample toast alerts and dynamic data feel
14. Implement personalized demo data based on account name

---

## Part 1: Breadcrumb Navigation (Replace Back Buttons)

**Current Issue**: Using back buttons instead of breadcrumb trail like "Home Site > Site #2 > Site #3 > Document Center"

**New Component**: `src/components/layout/PageBreadcrumb.tsx`

```
A reusable breadcrumb component that:
- Takes an array of path segments
- Each segment is clickable and navigates
- Shows current page as non-clickable
- Format: Section > Subsection > Current Page
```

**Usage Pattern**:
```
Day Parting > Campaigns > SP - NapQueen Memory Foam - Exact
Profitability > Dashboard
Settings > Preferences
```

**Files to Create/Modify**:
- Create `src/components/layout/PageBreadcrumb.tsx`
- Update all pages that currently use back buttons:
  - `src/pages/dayparting/CampaignDetail.tsx`
  - `src/pages/settings/ConnectAmazon.tsx`
  - `src/pages/settings/ConnectWalmart.tsx`

---

## Part 2: Fix Geography Map - World View

**Current Issue**: Map is crooked/distorted, showing only US with poor geometry

**Solution**: Replace with proper SVG world map with accurate paths

**Changes to `src/components/profitability/GeographyMap.tsx`**:
- Use accurate SVG paths for world countries
- Show entire world map in muted/grey
- Only colorize US, Canada, and Mexico with performance data
- Fix viewBox for proper aspect ratio
- Proper zoom/pan implementation
- Add color legend showing Low → High Sales gradient

**Data Structure**:
```typescript
const activeRegions = {
  USA: { sales: 156789, color: 0.85 },
  CAN: { sales: 45678, color: 0.55 },
  MEX: { sales: 23456, color: 0.35 },
};
// All other countries: grey/muted
```

---

## Part 3: Logo Integration for Light/Dark Mode

**Current Issue**: Not using the provided logo assets properly for theme modes

**Solution in `src/components/layout/AppHeader.tsx`**:
```tsx
import logoFull from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-white.png";
import { useTheme } from "@/contexts/ThemeContext";

// In component:
const { resolvedTheme } = useTheme();
const logoSrc = resolvedTheme === "dark" ? logoWhite : logoFull;

return (
  <img src={logoSrc} alt="Anarix" className="h-8 w-auto" />
);
```

**Apply to**:
- `AppHeader.tsx` (main header logo)
- `Login.tsx` (login page)
- `ConnectAccounts.tsx` (onboarding)

---

## Part 4: Custom Lottie Loader Integration

**Current Issue**: Loader uses inline fallback animation, not the custom loader.json

**Update `src/components/ui/loader.tsx`**:
```tsx
import loaderAnimation from "/animations/loader.json";

// Use the actual loader.json from public/animations
<Lottie animationData={loaderAnimation} loop />
```

**Add Full-Screen Loader for Onboarding**:
- Show custom loader with slight delay during account connection
- Use during initial app load
- Use during page transitions for premium feel

---

## Part 5: Fix Profitability Tables (Sticky Column Issue)

**Current Issue**: Sticky product details column overlaps with other content, backgrounds not solid

**Fix in `src/components/profitability/ProductsPnLTable.tsx`**:

```tsx
// Ensure explicit backgrounds for sticky cells in light/dark modes
<TableCell className="sticky left-0 z-10 bg-card dark:bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">

// For header row - highest z-index
<TableHead className="sticky left-0 z-20 bg-muted dark:bg-muted">

// For total row
<TableCell className="sticky left-0 z-10 bg-muted dark:bg-muted">
```

**Also fix**:
- `src/components/tables/RegionalTable.tsx`
- `src/components/catalog/CatalogProductsTable.tsx`

---

## Part 6: Sidebar Navigation Hierarchy Improvement

**Current Issue**: Hard to distinguish menu sections from sub-menu items, text too small

**Changes to `src/components/layout/AppSidebar.tsx`**:

```css
/* Section headers (PROFITABILITY, ADVERTISING, etc.) */
font-size: 13px → 14px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.05em
color: foreground (not muted)
padding: 12px vertical

/* Sub-menu items (Dashboard, Trends, etc.) */
font-size: 13px → 14px
font-weight: 500
padding-left: 32px (clear indentation)
border-left: 2px solid transparent → primary when active
```

**Visual Hierarchy**:
```
▼ PROFITABILITY            ← Bold, uppercase, larger
   ├─ Dashboard            ← Indented, regular weight
   ├─ Trends
   ├─ Profit & Loss
   └─ Geographical Data

▶ ADVERTISING              ← Collapsed, shows count badge
```

---

## Part 7: Activate All Creative Features

**Current Issue**: Features exist but aren't visible/functional

### 7.1 Ambient Background
- Already in `CreativeFeatures.tsx` but may be too subtle
- Increase intensity from "low" to "medium"
- Ensure proper z-index (-10) so it's visible behind content

### 7.2 Morphing Numbers
- Update `PeriodSummaryCard.tsx` to use `MorphingNumber` component
- Apply to all KPI values in cards
- Add trend arrows with color coding

### 7.3 Progress Rings
- Add to goal completion sections
- Use in BI section for SOV metrics
- Add to Day Parting schedule progress

### 7.4 Keyboard Navigation
- Already active (press ? to show)
- Add info in Preferences page about this feature
- Add visual indicator in header "Press ? for shortcuts"

### 7.5 Data Story Mode
- Add "Generate Story" button to Dashboard
- Create sample walkthrough for profitability data
- Add animated highlights

### 7.6 Split-Screen Comparison
- Add "Compare Periods" button to Dashboard
- Enable side-by-side period selection
- Sync scrolling in comparison view

---

## Part 8: Complete Onboarding Flow

**Required Flow**:
```
[Login/Signup] → [Link Account] → [App Walkthrough] → [Preferences] → [App Access]
```

### 8.1 Login Page Updates
- Clear localStorage on login to start fresh (for demo)
- After login success, navigate to `/onboarding/connect`
- Add "Create Account" tab for signup

### 8.2 Connect Accounts Updates
- Use account name from user input for demo data
- Show custom loader with 2-second delay after connecting
- Store merchant name for use throughout app

### 8.3 App Walkthrough (New)
**New Component**: `src/components/onboarding/AppWalkthrough.tsx`

```
Step 1: "Welcome to Anarix" - Overview
Step 2: "Your Dashboard" - Highlight profitability section
Step 3: "Aan AI Assistant" - Show AI features
Step 4: "Customize Your Experience" - Navigate to preferences
Step 5: "You're All Set!" - Complete onboarding
```

- Uses Data Story Mode under the hood
- Animated highlights on each section
- Skip option for experienced users

### 8.4 Route Updates in `App.tsx`
```tsx
<Route path="/" element={<Navigate to="/login" />} />
<Route path="/login" element={<Login />} />
<Route path="/onboarding/connect" element={<ConnectAccounts />} />
<Route path="/onboarding/walkthrough" element={<AppWalkthrough />} />
<Route path="/onboarding/preferences" element={<OnboardingPreferences />} />
```

### 8.5 Dynamic Account Name
- In `AccountContext`, store user-entered merchant name
- Use in header dropdown: "Nadia's Organics" → user's actual input
- Reflect in all sample data where merchant name appears

---

## Part 9: Rename Appearance to Preferences

**File Rename**: `src/pages/settings/Appearance.tsx` → `src/pages/settings/Preferences.tsx`

**Update Route** in `App.tsx`:
```tsx
<Route path="/settings/preferences" element={<Preferences />} />
```

**Update Sidebar** navigation item label

**Content Sections for Preferences**:

### 9.1 Theme Section (existing)
- Light / Dark / System toggle

### 9.2 Display Density (make functional)
```tsx
const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

// Apply via CSS custom properties or context
// Comfortable: default spacing
// Compact: reduced padding, smaller row heights
```

### 9.3 Keyboard Shortcuts Section (new)
- Full list of all shortcuts organized by category
- Same content as the ? overlay but in-page

### 9.4 Creative Features Toggle (new)
```
☑ Ambient Background Animation
☑ Morphing Number Transitions  
☑ Progress Ring Indicators
☑ Floating Action Island
☑ Command Palette (⌘K)
```

### 9.5 Notifications Section (new)
- Enable/disable toast notifications
- Notification sound toggle

---

## Part 10: Floating Action Island - Add Screenshot

**Update `src/features/creative/FloatingActionIsland.tsx`**:

```tsx
import { Camera } from "lucide-react";
import html2canvas from "html2canvas"; // Need to add this dependency

const takeScreenshot = async () => {
  const canvas = await html2canvas(document.body);
  const link = document.createElement("a");
  link.download = `anarix-screenshot-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
  toast.success("Screenshot saved!");
};

// Add to actions array:
{ icon: Camera, label: "Screenshot", onClick: takeScreenshot }
```

---

## Part 11: Toast Alerts & Dynamic Data

### 11.1 Sample Toast Messages
**In `src/App.tsx`** (or onboarding flow):
```tsx
useEffect(() => {
  // Show welcome toast after 3 seconds
  const timer = setTimeout(() => {
    toast.success("Welcome to Anarix! Your data is syncing...");
  }, 3000);
  
  // Show insight toast after 10 seconds
  const timer2 = setTimeout(() => {
    toast.info("💡 Tip: Press ⌘K to open the command palette");
  }, 10000);
  
  return () => {
    clearTimeout(timer);
    clearTimeout(timer2);
  };
}, []);
```

### 11.2 Dynamic Data Updates
**Create**: `src/hooks/useDynamicData.ts`
```tsx
// Simulate live data by adding small random variations
export function useDynamicData<T extends Record<string, number>>(
  baseData: T,
  interval: number = 30000 // 30 seconds
): T {
  const [data, setData] = useState(baseData);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          // Add ±5% variation
          const variation = 1 + (Math.random() - 0.5) * 0.1;
          updated[key] = Math.round(prev[key] * variation);
        });
        return updated;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [interval]);
  
  return data;
}
```

---

## Part 12: File Structure Summary

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx (MODIFY - theme-aware logo)
│   │   ├── AppSidebar.tsx (MODIFY - better hierarchy)
│   │   └── PageBreadcrumb.tsx (NEW - reusable breadcrumb)
│   ├── onboarding/
│   │   └── AppWalkthrough.tsx (NEW - guided tour)
│   ├── profitability/
│   │   ├── GeographyMap.tsx (MODIFY - world map)
│   │   └── ProductsPnLTable.tsx (MODIFY - sticky fix)
│   └── ui/
│       └── loader.tsx (MODIFY - use custom animation)
├── features/creative/
│   ├── FloatingActionIsland.tsx (MODIFY - add screenshot)
│   └── index.ts (already exists)
├── hooks/
│   └── useDynamicData.ts (NEW - data variation)
├── pages/
│   ├── settings/
│   │   └── Preferences.tsx (RENAME from Appearance)
│   └── onboarding/
│       └── AppWalkthrough.tsx (NEW)
└── contexts/
    └── DensityContext.tsx (NEW - compact/comfortable)
```

---

## Part 13: Dependencies to Add

```json
{
  "html2canvas": "^1.4.1"  // For screenshot feature
}
```

Note: `lottie-react` is already installed.

---

## Part 14: Implementation Sequence

### Phase 1: Critical Bug Fixes
1. Fix sidebar flyout (portal-based rendering)
2. Fix profitability tables (sticky column backgrounds)
3. Fix geography map (proper world SVG)
4. Integrate theme-aware logos

### Phase 2: Navigation & Breadcrumbs
1. Create PageBreadcrumb component
2. Replace all back buttons with breadcrumbs
3. Improve sidebar visual hierarchy

### Phase 3: Creative Features Activation
1. Enable and verify Ambient Background
2. Add MorphingNumber to KPI cards
3. Add Progress Rings where appropriate
4. Add screenshot to Floating Island

### Phase 4: Onboarding Flow
1. Update login to clear state for fresh start
2. Add custom loader delay on account connection
3. Create AppWalkthrough component
4. Wire up complete flow

### Phase 5: Preferences Page
1. Rename to Preferences
2. Make density toggle functional
3. Add keyboard shortcuts list
4. Add feature toggles

### Phase 6: Dynamic Experience
1. Add toast welcome messages
2. Implement dynamic data hook
3. Personalize with account name
4. Add header keyboard shortcut hint

---

## Technical Details

### Breadcrumb Data Structure
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string; // If undefined, it's the current page (non-clickable)
}

// Example usage:
<PageBreadcrumb items={[
  { label: "Day Parting", href: "/dayparting/hourly" },
  { label: "Campaigns", href: "/dayparting/campaigns" },
  { label: "SP - NapQueen Memory Foam - Exact" }
]} />
```

### Density Context
```typescript
type Density = "comfortable" | "compact";

// CSS variables applied:
// --spacing-base: comfortable=4px, compact=2px
// --row-height: comfortable=44px, compact=32px
// --card-padding: comfortable=16px, compact=8px
```

### World Map SVG Structure
Using simplified country paths with ISO 3166-1 alpha-3 codes:
- USA, CAN, MEX: Filled with data-driven intensity colors
- All other countries: Fill with `hsl(var(--muted))`
- Proper viewBox: `viewBox="-180 -90 360 180"` for world projection

### delete the current hower feature you created for nav bar because its not working and recreate it and what i want is if i hower over any menu item in nav bar i should get a mini popup on right side of what its sub items are like how wix does
