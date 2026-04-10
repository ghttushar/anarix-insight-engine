## Fix Component Library + Add Independent URLs for Figma Export

### Problem

1. Component Library panels section only shows text descriptions — no actual panel mockups rendered
2. Day Parting tabs (`/dayparting/history`) redirect instead of being independent URLs
3. Design System tabs need route-based URLs (not just hash) for HTML-to-Figma plugin compatibility
4. Component Library sections need route-based URLs for HTML-to-Figma plugin compatibility

### Plan

---

### 1. Design System — Add route-based tab URLs

**File: `App.tsx**`

- Add route: `/settings/design-system/:tab` pointing to same `DesignSystem` component

**File: `DesignSystem.tsx**`

- Read `useParams().tab` to set active tab (e.g., `/settings/design-system/colors` → Colors tab)
- Keep hash fallback for backward compat
- Result: 7 independent URLs:
  - `/settings/design-system/colors`
  - `/settings/design-system/typography`
  - `/settings/design-system/spacing`
  - `/settings/design-system/icons`
  - `/settings/design-system/components`
  - `/settings/design-system/states`
  - `/settings/design-system/layout`

---

### 2. Component Library — Add route-based section URLs + flesh out panels

**File: `App.tsx**`

- Add route: `/settings/component-library/:section` pointing to same `ComponentLibrary` component

**File: `ComponentLibrary.tsx**`

- Read `useParams().section` to auto-scroll + highlight active section
- Result: 10 independent URLs (e.g., `/settings/component-library/panels`)

**Flesh out Panels section** — Replace text-only list with actual rendered mockups:

- **CreateCampaignPanel**: Form with name, type, bidding strategy, budget, start/end date fields
- **CreateReportPanel**: Template buttons, section checkboxes, schedule toggle
- **CreateSchedulePanel**: Campaign selector, action type, day/time selectors
- **ProductDetailPanel**: Product image/name, sparkline placeholder, expandable P&L rows
- **PeriodBreakdownPanel**: Date header, sales/expenses/units breakdown rows
- **CampaignSettingsPanel**: Name, status select, budget, bidding strategy radio, placement %
- **AdGroupSettingsPanel**: Name, status, bid fields, target ROAS

Each panel rendered as a ~320px-wide bordered container with header + scrollable content + footer.

---

### 3. Day Parting — Make tabs independent URLs

**File: `App.tsx**`

- Change `/dayparting/history` from `Navigate` redirect to rendering `HourlyData` with a prop/param

**File: `HourlyData.tsx**`

- Read route to determine initial tab: `/dayparting` → "dayparting" tab, `/dayparting/history` → "history" tab
- Update `setActiveTab` to also update URL via `useNavigate`

&nbsp;

### 4. profitablity dashboard — products and orders tabs independent URLs

---

### Files Summary


| File                   | Change                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `App.tsx`              | Add 3 parameterized routes                                                               |
| `DesignSystem.tsx`     | Read `useParams().tab`, use for active tab                                               |
| `ComponentLibrary.tsx` | Read `useParams().section`, replace panels text with rendered mockups (~200 lines added) |
| `HourlyData.tsx`       | Read route for initial tab, sync tab changes to URL                                      |


### Implementation Order

1. Add routes in `App.tsx`
2. Update `DesignSystem.tsx` with param-based tabs
3. Update `ComponentLibrary.tsx` with param-based sections + full panel mockups
4. Update `HourlyData.tsx` with route-based tabs