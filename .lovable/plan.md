

## Fix Breadcrumbs: Standardize Top + Bottom, Fix Positioning

### Problem
The `PageFooterBar` breadcrumb appears inside table cards or in awkward positions (overlapping/behind content). Some pages use the radix `Breadcrumb` component at the top while using `PageBreadcrumb` at the bottom — two different components for the same purpose. The user wants one simple pattern: the same breadcrumb at the top of the page, duplicated at the very bottom.

### Solution

**1. Standardize all pages to use `PageBreadcrumb` at both top and bottom**

Replace the radix `Breadcrumb` component usage in drill-down pages (CampaignDetail, AdGroupDetail, ProductAdDetail) with `PageBreadcrumb` — same component used everywhere else.

**2. Fix `PageFooterBar` positioning**

Update `PageFooterBar` to render with a top border separator so it's clearly outside any card. Ensure it's always the last element before `</AppLayout>`, never inside a card or flex container.

**3. Add top `PageBreadcrumb` to all pages that only have bottom breadcrumbs**

Most first-level pages (CampaignManager, Profitability Dashboard, etc.) only show breadcrumbs at the bottom. Add `PageBreadcrumb` at the top of these pages too (right before `PageHeader`), so top and bottom match.

**4. Fix pages where `PageFooterBar` is inside nested flex containers**

In pages like `ProfitabilityDashboard`, `CampaignDetail`, `AdGroupDetail`, `ProductAdDetail` — the footer bar is inside inner `div` containers that sit alongside right panels. Move it outside so it's at the true page bottom.

### Files to Change

| File | Change |
|---|---|
| `PageFooterBar.tsx` | Add `border-t border-border` for visual separation, ensure clean spacing |
| `CampaignDetail.tsx` | Replace radix `Breadcrumb` with `PageBreadcrumb`, move `PageFooterBar` outside flex wrapper |
| `AdGroupDetail.tsx` | Same as above |
| `ProductAdDetail.tsx` | Same as above |
| `Accounts.tsx` (settings) | Replace radix `Breadcrumb` with `PageBreadcrumb` if used |
| ~40 page files | Ensure `PageBreadcrumb` at top + `PageFooterBar` at bottom, both outside cards/flex wrappers, using same `breadcrumbItems` |
| `ProfitabilityDashboard.tsx` | Move `PageFooterBar` outside the inner flex container, add top breadcrumb |
| All pages with missing top breadcrumb | Add `PageBreadcrumb items={breadcrumbItems}` before `PageHeader` |

### Buttons & Calendar Check
- Audit all pages for non-functional buttons — ensure toast feedback on placeholder actions
- Verify calendar/date picker components use the same `Calendar` component from `ui/calendar.tsx` consistently across all pages (AppTaskbar date range, ProfitabilityHeroCard date pickers, Reports schedule builder)

