

## Fix Layout Hierarchy, Products/Orders Toggle, Show Impact Position, Remove Hide Chart, Button Audit

### Issues Identified

1. **CampaignDetail & AdGroupDetail**: The code order is correct (Taskbar above InfoCard), but user reports seeing InfoCard above Taskbar — likely a rendering/spacing issue. Will enforce the order explicitly and verify.

2. **Profitability Products/Orders Toggle**: Currently the toggle switches `tableTab` state but the table always shows products. The "Orders" tab needs a functional orders table view with expandable order rows (per image-126/127).

3. **Show Impact toggle**: Currently lives outside the chart (in page-level controls). User wants it INSIDE the chart toolbar, left of the Metrics button. Move it into `ChartContainer` via `extraControls` prop.

4. **Hide Chart**: Must be removed from ALL pages (CampaignManager, CampaignDetail, AdGroupDetail). Charts should always be visible.

5. **Non-functional buttons**: Several `onDownload={() => {}}` handlers need toast feedback. Audit all empty handlers.

---

### 1. Remove All Hide Chart Controls

**Files**: `CampaignManager.tsx`, `CampaignDetail.tsx`, `AdGroupDetail.tsx`

- Remove `showChart`/`chartVisible` state variables
- Remove the Hide/Show Chart button/link
- Always render `PerformanceChart`
- Remove `ChevronUp`/`ChevronDown`/`Minimize2` imports where no longer needed

### 2. Move Show Impact into Chart Toolbar

**Files**: `PerformanceChart.tsx`, `ChartContainer.tsx`, `CampaignManager.tsx`, `CampaignDetail.tsx`, `AdGroupDetail.tsx`

- Add `showImpact` and `onShowImpactChange` props to `PerformanceChart`
- Pass a Switch+Label as `extraControls` to `ChartContainer` (rendered left of Metrics button)
- Remove Show Impact from `AppTaskbar` children in `CampaignManager.tsx`
- Remove Show Impact from the "Performance Overview" header row in `CampaignDetail.tsx` and `AdGroupDetail.tsx`

### 3. Enforce Layout Hierarchy on Detail Pages

**Files**: `CampaignDetail.tsx`, `AdGroupDetail.tsx`

- Ensure render order is strictly: Breadcrumb → PageHeader → AppTaskbar → InfoCard → Performance Overview
- Remove the separate "Performance Overview" header row with Show Impact controls (now in chart)
- Keep "Performance Overview" as just a section label above KPIs

### 4. Functional Products/Orders Toggle in Profitability Dashboard

**Files**: `ProductsPnLTable.tsx`, `Dashboard.tsx`, `mockProfitability.ts`, `types/profitability.ts`

- Add `ProfitabilityOrder` type with fields: orderId, date, time, status, price, country, flag, netProfit, gmv, units, cogs, wfsFulfillmentFee, shippingFees, commissionProduct, commissionShipping, additionalFee, refundUnits, products (child array)
- Add `mockProfitabilityOrders` data with expandable product children (matching image-126)
- Update `ProductsPnLTable` to accept a `mode: "products" | "orders"` prop
  - Products mode: current behavior (product image + name + ID/SKU/price/COGS/Trends)
  - Orders mode: expandable rows showing order ID, date, time, status, price with child product rows. Header shows "Order Details" instead of "Product Details". Total row shows "Total for X Orders"
- Wire the `tableTab` state to pass `mode` to `ProductsPnLTable`
- Redesign the `ProductsOrdersToggle` to match image-129: pill-style toggle with filled active state

### 5. Fix Non-Functional Buttons

**Files**: `CampaignManager.tsx`, `CampaignDetail.tsx`, `AdGroupDetail.tsx`

- Replace `onDownload={() => {}}` with `onDownload={() => toast.success("Exporting data as CSV...")}`
- Audit all other empty handlers and add appropriate toast feedback

---

### Summary of Files

| File | Change |
|---|---|
| `CampaignManager.tsx` | Remove Hide Chart, move Show Impact to PerformanceChart prop, fix onDownload |
| `CampaignDetail.tsx` | Remove Hide Chart + Show Impact row, enforce layout order, fix onDownload |
| `AdGroupDetail.tsx` | Remove Hide Chart + Show Impact row, enforce layout order, fix onDownload |
| `PerformanceChart.tsx` | Accept `showImpact`/`onShowImpactChange` props, pass Switch as `extraControls` to ChartContainer |
| `ChartContainer.tsx` | No changes needed (already has `extraControls` prop) |
| `ProductsPnLTable.tsx` | Add `mode` prop supporting "products" and "orders" views with expandable order rows |
| `ProductsOrdersToggle.tsx` | Restyle to match image-129 pill toggle |
| `Dashboard.tsx` (profitability) | Pass `tableTab` as mode to table, pass orders data when in orders mode |
| `mockProfitability.ts` | Add `mockProfitabilityOrders` data |
| `types/profitability.ts` | Add `ProfitabilityOrder` interface |

