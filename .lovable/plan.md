

# Anarix Implementation Plan

## Phase Overview
Building an enterprise-grade analytical software platform for Amazon & Walmart performance marketers, agency operators, and executives. This is a data-heavy, table-first, rule-driven, safety-first system.

---

## 🎨 Step 1: Design System Foundation
**Periwinkle Theme (Locked)**

### Colors & Variables
- Implement the exact color tokens for both light and dark modes
- Light: Background #F5F6FA, Cards #FFFFFF, Brand Primary #4A62D9
- Dark: Background #0E1020, Cards #171A2E, Brand Primary #6E82F5
- Ensure data visualization colors (red/green/yellow) are reserved for data only - NOT branding

### Typography
- Configure Satoshi Variable for headings
- Configure Noto Sans for body text
- Establish minimum 14px body size
- Document all type scales

### Spacing & Layout System
- Define consistent spacing tokens matching existing layouts
- Establish grid and container patterns

---

## 🏗️ Step 2: App Shell & Navigation

### Sidebar Component
- Collapsible left sidebar with icon + text labels
- Grouped sections:
  - **Profitability** (Dashboard, Trends, Profit & Loss, Geographical data )
  - **Advertising** (Campaign Manager, Impact Analysis, Targeting Actions)
  - **Catalog**
  - **Business Intelligence** (Brand SOV, Keyword Tracker, Keyword SOV, Product SOV)
  - **Day Parting** (hourly data, day parting campaigns, history, scheduled jobs)
  - **Settings** (accounts, users, history logs)
- Active state highlighting
- Mini-collapse mode maintaining icon visibility

### Header Component
- Anarix logo with close/menu trigger
- Marketplace selector (Walmart/Amazon) with marketplace icon
- Account selector dropdown

---

## 📊 Step 3: Advertising / Campaign Manager

### Performance Overview Section
- 4 KPI cards: Ad Spend, Ad Sales, Ad Units, ROAS
- Delta comparisons with previous period
- Trend indicators (up/down arrows with percentages)

### Performance Graph
- Multi-metric line chart
- Selectable metrics (up to 4)
- X-axis: Date/time
- Dual Y-axes for different metric scales
- Interactive legend toggle
- "Show Impact" / "View Changes" buttons
- Tooltip on hover with exact values

### Tab Navigation
- Campaigns | Ad Groups | Product Ads | Keyword Targeting | Search Terms | Page Type | Platform

### Campaigns Table
- Checkbox selection column
- Fixed columns: Active toggle, Status, Campaign name
- Editable fields with inline editing
- Performance metrics columns
- Total row at bottom with aggregated values
- Pagination (rows per page selector)
- Column visibility dropdown
- Filter button with advanced filter modal
- Download button (with/without filters)
- Search by campaigns

### Bulk Actions
- Active/Pause status changes
- Bid adjustments (Increase %, Decrease %, Set to %)

---

## 💰 Step 4: Profitability Dashboard

### Summary Cards Section
- Today / Yesterday / This Month / Last Month expandable sections
- Each section shows: GMV, Auth Sales, Orders, Units, Returns, Cancelled, Ad Cost, Est. Payout, Net Profit
- "View More" expansion link
- Chart on the right side showing trends

### Products Orders Table
- Product image thumbnail
- Product Details (name, SKU, price, COGS link)
- Units / Refund Units / Cancelled Units
- GMV / Auth Sales / Refund Sales / Cancelled Sales
- Ad Spend / Commission / Fulfillment Fees / Shipping
- COGS / Net Profit / Additional Fee / Info
- Total row aggregation
- Filter / Columns / Upload COGS buttons
- Products/Orders toggle

---

## 📈 Step 5: Profit & Loss Catalog Screen

### Weekly Breakdown Table
- Parameter rows with weekly columns
- Profit & Loss Sales, Order Sales, Advertising Refund Sales, etc.
- Expandable detail rows

### Units Summary
- Order Units / Refund Units / Cancelled Units cards

### Products Performance Table
- Detailed product-level P&L breakdown
- All fee columns visible

---

## 📋 Step 6: Data Tables Component Library

### Reusable Table Features
- Sortable columns (click header)
- Resizable columns
- Column visibility toggle
- Row selection with checkboxes
- Inline editing for specific fields
- Total row functionality
- Dynamic calculations based on visible data
- Pagination controls
- Export functionality

### Filter System
- "Where [Column] [Operator] [Value]" structure
- Operators: Is, Is Not, Contains, Does Not Contain, Starts With, Ends With
- Multi-condition support ("+ Add Filter")
- Apply / Cancel / Clear All buttons

---

## 🔧 Step 7: Form Controls & Validation

### Input Validation (Save Disable Logic)
- Real-time validation based on requirements document
- Amazon SP/SB/SD bid constraints
- Walmart 1P/3P budget constraints
- Error highlighting with guidance messages
- Save button disabled until errors resolved

### Editable Fields
- Bid inputs with increment/decrement
- Budget fields with min/max validation
- Date pickers for campaign scheduling
- Toggle switches for status changes

---

## 📊 Step 8: Additional Screens (Following Same Patterns)

### Business Intelligence
- Keyword Tracker table with Active/Inactive tabs
- Status toggles, channels, region columns
- Add Keyword functionality

### Catalog
- Product listing with inventory/performance data
- Date range filtering
- Grouped metrics (Product Details, Inventory, Revenue & Cost)

### Day Parting
- Hourly trends visualization
- Rule management interface
- Campaign dropdown with dayparting indicators

---

## 🔄 Step 9: Global States Implementation

### Loading States
- Skeleton loaders matching table structure
- Chart placeholder loaders

### Empty States
- No data messaging for each context
- Action prompts where applicable

### Error States
- Validation error display
- API error handling with fallbacks

### Status Badges
- Live (green), Paused (gray), Archived (muted), Scheduled (blue), Out of Budget (yellow), Completed (gray)

---

## 📁 File Organization

All components will be modular and file-separated for Figma recreation:
```
src/
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx
│   │   ├── AppHeader.tsx
│   │   └── AppLayout.tsx
│   ├── tables/
│   │   ├── DataTable.tsx
│   │   ├── TableFilters.tsx
│   │   ├── TablePagination.tsx
│   │   └── TotalRow.tsx
│   ├── charts/
│   │   ├── PerformanceChart.tsx
│   │   └── TrendChart.tsx
│   ├── cards/
│   │   ├── KPICard.tsx
│   │   └── SummaryCard.tsx
│   └── forms/
│       ├── DateRangePicker.tsx
│       └── FilterModal.tsx
├── pages/
│   ├── advertising/
│   ├── profitability/
│   ├── catalog/
│   └── business-intelligence/
└── styles/
    └── theme.css (Periwinkle tokens)
```

---

## ⚠️ Explicit Out of Scope
- Real API integrations (using static mock data only)

