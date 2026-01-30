
# Complete Implementation Plan: Profitability, Catalog & Enhanced Navigation

## Overview

This plan covers three major areas:
1. Complete Profitability section (Dashboard, Trends, Profit & Loss, Geographical Data)
2. Complete Catalog section (Products with grouped columns)
3. Enhanced navigation with hover shortcuts and Aan entry point
4. UI enhancements for better visual appeal

---

## Part 1: Enhanced Sidebar Navigation

Based on the Wix reference images, I will redesign the sidebar with a modern interaction pattern that reduces clicks:

### 1.1 New Sidebar Design Features

**Hover Quick-Access Flyout**
- When hovering on a collapsed section header, show a flyout menu with all sub-items
- No click required to see options - just hover and slide
- Flyout appears to the right of the sidebar
- Smooth 150ms transition

**Always-Visible Quick Actions Row**
- At the top of sidebar, add a "Quick Actions" dropdown (like Wix shows)
- Contains frequently used actions across the app
- Optional: keyboard shortcuts displayed

**Section Icons for Visual Hierarchy**
- Each section header gets an icon alongside text
- When collapsed, only icon visible with hover-expand behavior

**Aan Entry Point in Sidebar**
- Dedicated "Aan AI" item at the top of sidebar (after logo area)
- Gradient-styled to match Aan identity
- Sparkles icon with "Aan" label
- Clicking opens the Aan panel

### 1.2 Sidebar Structure

```text
+----------------------------------+
| [Anarix Logo]              [X]   |
+----------------------------------+
| [*] Aan AI (gradient accent)     |  <-- New entry point
+----------------------------------+
| [>] Profitability         [icon] |  <-- Hover shows flyout
|    Dashboard                     |
|    Trends                        |
|    Profit & Loss                 |
|    Geographical                  |
+----------------------------------+
| [>] Advertising           [icon] |
|    Campaign Manager              |
|    Impact Analysis               |
|    Targeting Actions             |
+----------------------------------+
| [>] Catalog               [icon] |
|    Products                      |
+----------------------------------+
| ... (remaining sections)         |
+----------------------------------+
```

---

## Part 2: Profitability Dashboard

Based on the reference images, the dashboard has these key components:

### 2.1 Time Period Summary Cards

**Structure (4 collapsible rows):**
- Today (with current date)
- Yesterday (with date)
- This Month (date range)
- Last Month (date range)

**Each row contains:**
- Left accent bar (colored by period - purple gradient for hierarchy)
- Period label + date/date range
- Metrics inline: GMV | Auth Sales | Orders | Units | Returns | Cancelled | Ad Cost | Est. Payout | Net Profit
- "View More" expandable link on right
- Clicking "View More" opens a right-side panel with full breakdown

**View More Panel (Side Panel):**
- Sales breakdown (Organic, Sponsored Products, Sponsored Brands, Sponsored Video)
- Orders count
- Total Units
- COGS
- Total Expenses (expandable)
- Calculated Metrics (Net Profit, TACOS, ROAS)

### 2.2 Trend Chart (Right Side)

- Weekly line chart showing Orders & Units trends
- Frequency selector (Weekly dropdown)
- Metrics selector (Orders, Units)
- X-axis: Week numbers
- Y-axis: Values

### 2.3 Products Table

**Toolbar:**
- Search input
- Products/Orders toggle switch
- Filters button
- Upload COGS button
- Columns dropdown
- Download button

**Table Columns:**
- Product Details (image, name, ID, SKU, price, COGS link, Trends link)
- Units
- Refund Units
- Cancelled Units
- GMV
- Auth Sales
- Refund Sales
- Cancelled Sales
- Ad Spend
- Commission on Product
- Commission on Shipping
- WFS Fulfillment Fee
- Shipping Fees
- COGS
- Net Profit
- Additional Fee
- Info (More link)

**Total Row at bottom**

---

## Part 3: Profitability Trends Page

Based on reference image 3:

### 3.1 Layout

**Top Controls:**
- Search by Item ID/Product Name/SKU
- Date Range dropdown (A Quarter / 3 months by weeks)
- Metrics dropdown (Total Sales)
- Run button

### 3.2 Scatter Plot Chart

- X-axis: Profit Margin (%)
- Y-axis: Total Sales ($)
- Quadrant zones with color backgrounds:
  - Top-right (green): High margin, high sales - Winners
  - Top-left (yellow): Low margin, high sales - Optimize
  - Bottom-right (light green): High margin, low sales - Grow
  - Bottom-left (red/pink): Low margin, low sales - Review
- Each product is a data point

### 3.3 Products Table (Weekly Breakdown)

**Columns:**
- Product Details (image, name, ID, SKU, price, Trends link)
- Week-05 (dynamic based on date range)
- Week-04
- Week-02
- Week-01
- Total

**Total Row**

---

## Part 4: Profit & Loss Page

Based on reference image 4:

### 4.1 Controls

- Product filter chip (N Product(s) Selected)
- Date Range dropdown
- Run button
- Download button

### 4.2 P&L Parameter Table (Expandable Rows)

**Structure:**
```text
Parameter / Date          | Week-05 | Week-04 | Week-02 | Week-01 | Total
---------------------------------------------------------------------------
> Sales                   | $421.97 | $20.99  | $829.96 | $864.95 | $2,137.87
    Order Sales           | $421.97 | $468.98 | $829.96 | $864.95 | $2,585.86
    Refund Sales          | $0.00   | -$447.99| $0.00   | $0.00   | -$447.99
    Cancelled Sales       | $0.00   | $0.00   | $0.00   | $0.00   | $0.00
  COGS                    | $1.00   | $90.00  | $10.00  | $1.00   | $102.00
> Total Expenses          | -$63.30 | $37.35  | -$124.50| -$129.75| -$280.20
    Total Ad Spend        | -       | -       | -       | -       | -
    Total Walmart Adj Fee | -$63.30 | $37.35  | -$124.50| -$129.75| -$280.20
    Total Shipping Cost   | $0.00   | $0.00   | $0.00   | $0.00   | $0.00
> Total Ad Orders         | -       | -       | -       | -       | -
    Sponsored Products    | -       | -       | -       | -       | -
    Sponsored Brands      | -       | -       | -       | -       | -
    Sponsored Video       | -       | -       | -       | -       | -
> Units                   | 3       | 1       | 4       | 5       | 13
    Order Units           | 3       | 3       | 4       | 5       | 15
    Refund Units          | 0       | -2      | 0       | 0       | -2
    Cancelled Units       | 0       | 0       | 0       | 0       | 0
```

### 4.3 Products Table (Same as Dashboard)

---

## Part 5: Geographical Data Page

Based on reference images 5-6:

### 5.1 Layout

**Left: Map Visualization**
- Interactive map (US focus by default)
- States/countries colored by data density
- Hover reveals quick stats
- Zoom controls (+/-)
- Search/filter control

**Right: Region Stats Panel**
- Country flag + name + date
- Key metrics: Sales, Units, Promo, Total Expenses
- Calculated Metrics section: % Refunds, Sellable returns, Margin, ROI

### 5.2 Region Table

**Toolbar:**
- State Level / Product Level toggle
- Filter button
- Upload COGS button
- Columns dropdown
- Download button

**Table Columns:**
- Region/State (with flag + expandable arrow)
- Stocks
- Orders
- Units Sold
- Refunds
- Sales
- Amazon Fees
- Sellable Returns
- Info (More link)

**Expandable Rows:** Each country expands to show states/regions

---

## Part 6: Catalog / Products Page

Based on reference image 7:

### 6.1 Controls

- Search by Product Name/ID/SKU
- Filters row with active chips (e.g., "Status is PUBLISHED")
- Clear button
- Upload COGS button
- Filter button
- Columns dropdown
- Download button

### 6.2 Products Table with Grouped Columns

**Column Groups (with expand/collapse icons):**

**Product Details Group:**
- Image + Name + ID + SKU + Tags (3P, WFS Eligible, etc.)

**Product Performance Group:**
- Status (PUBLISHED badge)
- Reviews & Ratings (count | star rating)

**Inventory Group:**
- Inventory Count
- Inventory Value (COGS)
- Inventory Value (Retail)

**Revenue & Cost Group:**
- Price
- COGS
- Total Sales
- GMV
- Total Units
- Refund Sales
- Cancelled Sales

**Ads Group:**
- Advertised (Yes/No)
- Ad Spend

**Total Row with aggregations**

---

## Part 7: Mock Data Files

### New Data Files Required:

**src/data/mockProfitability.ts:**
- Summary data for Today/Yesterday/This Month/Last Month
- Products with full P&L columns
- Weekly breakdown data
- Regional/geographical data

**src/data/mockCatalog.ts:**
- Products with all Catalog columns
- Status, ratings, inventory data

---

## Part 8: Type Definitions

### New Types in src/types/profitability.ts:

```typescript
interface ProfitabilitySummary {
  period: "today" | "yesterday" | "this_month" | "last_month";
  dateLabel: string;
  dateRange?: string;
  gmv: number;
  authSales: number;
  orders: number;
  units: number;
  returns: number;
  cancelled: number;
  adCost: number;
  estPayout: number;
  netProfit: number;
  // Breakdown for View More panel
  breakdown: {
    organic: number;
    sponsoredProducts: number;
    sponsoredBrands: number;
    sponsoredVideo: number;
    cogs: number;
    totalExpenses: number;
    tacos: number;
    roas: number;
  };
}

interface ProfitabilityProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
  sku: string;
  price: number;
  cogs: number;
  units: number;
  refundUnits: number;
  cancelledUnits: number;
  gmv: number;
  authSales: number;
  refundSales: number;
  cancelledSales: number;
  adSpend: number;
  commissionProduct: number;
  commissionShipping: number;
  wfsFulfillmentFee: number;
  shippingFees: number;
  netProfit: number;
  additionalFee: number;
}

interface GeographicalData {
  id: string;
  region: string;
  countryCode: string;
  flag: string;
  stocks: number;
  orders: number;
  unitsSold: number;
  refunds: number;
  sales: number;
  amazonFees: number;
  sellableReturns: number;
  children?: GeographicalData[];
}
```

### New Types in src/types/catalog.ts:

```typescript
interface CatalogProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
  sku: string;
  tags: string[]; // ["3P", "WFS Eligible", "Walmart Fulfilled"]
  status: "published" | "unpublished" | "draft";
  reviewCount: number;
  rating: number;
  inventoryCount: number;
  inventoryValueCogs: number;
  inventoryValueRetail: number;
  price: number;
  cogs: number;
  totalSales: number;
  gmv: number;
  totalUnits: number;
  refundSales: number;
  cancelledSales: number;
  advertised: boolean;
  adSpend: number;
}
```

---

## Part 9: File Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx (ENHANCED with hover flyouts + Aan)
│   │   └── SidebarFlyout.tsx (NEW)
│   ├── profitability/
│   │   ├── PeriodSummaryCard.tsx (NEW)
│   │   ├── PeriodBreakdownPanel.tsx (NEW)
│   │   ├── ProfitabilityTrendChart.tsx (NEW)
│   │   ├── ProductsPnLTable.tsx (NEW)
│   │   ├── PnLParameterTable.tsx (NEW)
│   │   ├── ScatterPlotChart.tsx (NEW)
│   │   ├── GeographyMap.tsx (NEW - placeholder/simple)
│   │   └── RegionStatsPanel.tsx (NEW)
│   ├── catalog/
│   │   ├── CatalogProductsTable.tsx (NEW)
│   │   └── ColumnGroupHeader.tsx (NEW)
│   └── tables/
│       └── RegionalTable.tsx (NEW)
├── pages/
│   ├── profitability/
│   │   ├── Dashboard.tsx (COMPLETE)
│   │   ├── Trends.tsx (NEW)
│   │   ├── ProfitLoss.tsx (NEW)
│   │   └── Geographical.tsx (NEW)
│   └── catalog/
│       └── Products.tsx (NEW)
├── data/
│   ├── mockProfitability.ts (NEW)
│   └── mockCatalog.ts (NEW)
└── types/
    ├── profitability.ts (NEW)
    └── catalog.ts (NEW)
```

---

## Part 10: Route Updates

```tsx
// Add to App.tsx
// Profitability Routes
<Route path="/profitability/dashboard" element={<ProfitabilityDashboard />} />
<Route path="/profitability/trends" element={<ProfitabilityTrends />} />
<Route path="/profitability/pnl" element={<ProfitLoss />} />
<Route path="/profitability/geo" element={<GeographicalData />} />

// Catalog Routes
<Route path="/catalog/products" element={<CatalogProducts />} />
```

---

## Part 11: Visual Enhancements

### 11.1 Sidebar Improvements
- Add subtle hover background transitions
- Add left accent bar for active section (not just item)
- Slightly increased padding for better readability
- Icon color changes on active state

### 11.2 Table Enhancements
- Grouped column headers with collapse/expand capability
- Subtle alternating row backgrounds
- Sticky product details column on horizontal scroll
- Better cell padding for data density

### 11.3 Color Emphasis
- Use accent color more prominently in active states
- Add subtle gradients to period cards (purple-to-transparent)
- Ensure proper contrast ratios throughout

---

## Implementation Sequence

1. **Phase 1: Enhanced Sidebar + Aan Entry**
   - Redesign AppSidebar with hover flyouts
   - Add Aan entry point
   - Add SidebarFlyout component

2. **Phase 2: Type Definitions & Mock Data**
   - Create profitability types
   - Create catalog types
   - Generate mock data files

3. **Phase 3: Profitability Dashboard**
   - PeriodSummaryCard component
   - PeriodBreakdownPanel (side panel)
   - TrendChart component
   - ProductsPnLTable
   - Complete Dashboard page

4. **Phase 4: Profitability Trends**
   - ScatterPlotChart (quadrant visualization)
   - Weekly breakdown table
   - Complete Trends page

5. **Phase 5: Profit & Loss**
   - PnLParameterTable (expandable rows)
   - Complete P&L page

6. **Phase 6: Geographical**
   - GeographyMap (simple visualization)
   - RegionStatsPanel
   - RegionalTable (expandable)
   - Complete Geographical page

7. **Phase 7: Catalog Products**
   - ColumnGroupHeader component
   - CatalogProductsTable
   - Complete Products page

8. **Phase 8: Final Polish**
   - CSS refinements
   - Transitions and animations
   - Responsiveness checks

---

## Technical Notes

- Recharts will be used for all charts (already installed)
- For the scatter plot quadrant chart, use ComposedChart with custom backgrounds
- Map visualization will use a simplified SVG map component (no external library required)
- Hover flyouts use Radix UI HoverCard or custom implementation with onMouseEnter/Leave
- Expandable table rows use controlled state with chevron toggles
- Column groups use colspan with shared header styling
