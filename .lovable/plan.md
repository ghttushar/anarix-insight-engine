

## Update Component Library and Design System Documentation

### Problem
The Component Library and Design System pages are outdated. They don't reflect the recent 50+ changes including:
- **AppTaskbar**: Now a 2-row layout (breadcrumb + account/sync on Row 1, filters + island-off actions on Row 2) with panel-aware icon-only collapse
- **Profitability Hero Card**: Now a 5-card selectable grid with 6 metrics per card, bordered metric boxes, and 220px comparison chart
- **Right-side panels**: CreateCampaignPanel, CreateReportPanel, CreateSchedulePanel, ProductDetailPanel, PeriodBreakdownPanel, CampaignSettingsPanel, AdGroupSettingsPanel -- none are in the Component Library
- **Marketplace selector**: Sidebar-integrated with hover popup for account switching
- **Floating Action Island**: Updated (removed Export/Screenshot, Alerts icon-only far right)
- **Design System colors**: Muted data viz colors (success 142 55% 38%, destructive 0 65% 48%, warning 38 75% 45%) not reflected
- **Icons section**: Missing newer icons used in the app (Bell, Play, Clock, Sparkles, Lightbulb, RefreshCw, etc.)
- **Navigation**: MiniSidebar, SidebarHoverPopup patterns not documented

### Plan

This requires updates to **2 files** totaling ~4800 lines. Changes organized by file:

---

### File 1: `src/pages/settings/ComponentLibrary.tsx`

#### A. Update AppTaskbar section (replace "App Level Metric Selector")
Replace the outdated "App Level Metric Selector" section (~lines 2341-2396) with a new "AppTaskbar (2-Row Layout)" section showing:
- **Row 1 anatomy**: Breadcrumb (left) + Marketplace logo + status dot + account name + divider + clock icon + "Last synced" (right)
- **Row 2 anatomy**: Filters/selectors (left: Ad Type, Catalogue, Date Range) + island-off actions (right: Ask Aan, Insights, Refresh + separated bell)
- **Panel-collapsed variant**: Showing icon-only actions when `hasAnyPanel` is true
- Static mockup with the `border-primary` top accent

#### B. Update Floating Action Island section
- Remove Export and Screenshot buttons from both collapsed and expanded states (~lines 1155-1227)
- Remove their labels from the expanded state array
- Keep only: Ask Aan, Insights, Refresh
- Update Alerts to icon-only (bell) positioned far right with a separator

#### C. Update Profitability Hero Card section (~lines 2574-2627)
Replace with a 5-card grid anatomy showing:
- **Card grid**: 5 cards in a row (Today, Yesterday, This Month, Last Month, Forecast)
- **Selected card state**: One card with `ring-2 ring-primary border-primary shadow-md`
- **6 metrics per card**: GMV, Orders, Auth Sales, Ad Cost, Units, Est. Payout in `grid-cols-3` bordered boxes
- **Net Profit hero section**: With `bg-muted/30` background box
- **Comparison chart**: 220px height note

#### D. Add Right-Side Panels section (NEW)
Add static anatomy mockups for all right-side panels:
1. **CreateCampaignPanel**: Form fields (name, type, bidding strategy, budget, dates)
2. **CreateReportPanel**: Template selection, section checkboxes, schedule options
3. **CreateSchedulePanel**: Campaign selector, action type, day/time selectors
4. **ProductDetailPanel**: Product image/name, sparkline, expandable P&L sections
5. **PeriodBreakdownPanel**: Summary period, sales/expenses/units breakdown rows
6. **CampaignSettingsPanel**: Campaign metadata, budget/bid edits (reference to CampaignInfoCard)
7. **AdGroupSettingsPanel**: Ad group metadata, bid/TRoAS edits

Each shown as a ~380px-wide bordered container with header + content + footer anatomy.

#### E. Add Sidebar Navigation section (NEW)
Static anatomy showing:
- **Expanded sidebar**: Logo + toggle, "Ask Aan" pill, grouped nav items with active styling, footer (theme + avatar)
- **Collapsed sidebar**: Icon-only with tooltip, SidebarHoverPopup mockup
- **MarketplaceSelector**: Expanded and collapsed states with hover popup for account list

---

### File 2: `src/pages/settings/DesignSystem.tsx`

#### A. Update Color System section
- Update muted-foreground light mode from `228 15% 46%` / `#646A86` to `228 18% 40%` / `#555D78`
- Update data viz colors to muted variants:
  - Success: `142 55% 38%` / `#1E9E4F` (was `142 71% 45%` / `#22C55E`)
  - Destructive: `0 65% 48%` / `#C93535` (was `0 84% 60%` / `#EF4444`)
  - Warning: `38 75% 45%` / `#C98A14` (was `38 92% 50%` / `#F59E0B`)

#### B. Update Icons section
Add missing icons to the categories:
- **Navigation**: Bell, Play, ChevronRight
- **Actions**: RefreshCw (already there), Sparkles, Lightbulb, Camera → remove Camera
- **Data**: Layers, Target, Percent, Package, ShoppingCart, DollarSign
- **System**: Clock (already there), Store → remove Store if not imported

#### C. Update Layout Components description
Update the AppTaskbar description to reflect 2-row layout with breadcrumb + account info on Row 1 and filters + island-off actions on Row 2.

#### D. Add new icons import
Import any missing Lucide icons needed for the updated icon grid (Bell, Play, Sparkles, Lightbulb, Layers, Target, Percent, Package, ShoppingCart, DollarSign, Store).

---

### Implementation Complexity
- ComponentLibrary.tsx: ~300 lines added/replaced
- DesignSystem.tsx: ~80 lines modified
- Both files are static mockups (no functional changes)
- No new dependencies needed

