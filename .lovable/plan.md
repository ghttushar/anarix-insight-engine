

## Ad Group Detail Page — Match Reference Screenshots

Based on images 115-119, the Ad Group Detail page needs significant restructuring to match the reference design. Here's what needs to change:

---

### 1. Page Structure (image-116, image-117)

**Current**: PageHeader with title + subtitle, then KPIs, chart, tabs, toolbar, table.

**Reference shows**:
- Title: "Advertising" (generic module title, not the ad group name)
- Breadcrumb: `Advertising > SP > Rainbow Mattress | New | Manual | SP > Rainbow Mattress | New | Manual | Adgroup | SP`
- **Ad Group Info Card**: A horizontal info strip showing Ad Group Name, Status badge, Keyword Targeting type, Min Bid, Max Bid, TRoAS — with an "Edit" button
- Universal bar with: Marketplace (far right), Frequency, Date Range, Run button
- "Performance Overview" section label
- KPI strip (Ad Spend, Ad Sales, Ad Units, ROAS) with dropdowns and deltas
- Show Impact / View Changes toggles + Hide Chart control
- Performance chart
- Tabs: Product Ads, Keyword Targeting, Search Terms

**Files**: `src/pages/advertising/AdGroupDetail.tsx`

**Changes**:
- Replace `PageHeader` title with generic "Advertising" title
- Rebuild breadcrumb to show: `Advertising > SP > [Campaign Name] > [Ad Group Name]`
- Add new **AdGroupInfoCard** component below breadcrumb showing: Name, Status, Keyword Targeting, Min Bid, Max Bid, TRoAS, Edit button
- Add `AppTaskbar` with `showFrequency`, `showDateRange` + Run button
- Add "Performance Overview" section heading
- Add Show Impact toggle and Hide Chart control row
- Add chart visibility toggle

### 2. Ad Group Info Card (image-117)

A new reusable component rendering a bordered card with:

| Ad Group Name | Status | Keyword Targeting | Min. Bid | Max. Bid | TRoAS |
|---|---|---|---|---|---|
| Rainbow Mattress \| New \| Manual \| Adgroup \| SP | Enabled (badge) | Bidded Value | $0.45 | $2.30 | $8.00 |

Min Bid, Max Bid, TRoAS values are clickable/editable (shown in teal/link color).

**New file**: `src/components/advertising/AdGroupInfoCard.tsx`

### 3. Product Ads Tab (image-118)

The table matches current `ProductAdsTable` closely but adds:
- "Add Product Ads" primary button in toolbar (purple, filled)
- View/Edit toggle
- Filter row showing active filters (e.g., "Product Ad Status is ENABLED x")
- "Clear" button for filters
- Columns: checkbox, Status (toggle), Product Ad, Ad Group, Campaign, Impressions, Clicks, CTR, Ad Units, CVR (Units Based), CPC, Ad Spend, Ad Sales, ROAS, ACOS
- Total row at bottom
- Pagination: "Rows per page" selector + "1-2 of 2" + nav arrows

### 4. Search Terms Tab (image-119)

The table adds:
- No "Add" button (search terms are read-only)
- Columns: checkbox, Search Term, Keyword, Match Type, Ad Group, Campaign, Impressions, Clicks, CTR, Ad Units, CVR (Units Based), CPC, Ad Spend, Ad Sales, ROAS, ACOS
- Total row
- Pagination

### 5. Add Product Ads Modal (image-115)

A new modal triggered by "Add Product Ads" button with:
- Left panel: searchable product list from catalog (checkbox + image + name + item ID)
- Right panel: "Added Product" staging area with Status, Product, Suggested Bid, Bid, Clear columns
- Header: "Add Product" with count (15/2,000)
- Cancel / Add buttons

**New file**: `src/components/advertising/AddProductAdsModal.tsx`

### 6. Campaign Detail Page (not shown but same pattern)

Update `CampaignDetail.tsx` to follow the same pattern:
- Generic "Advertising" title
- Breadcrumb: `Advertising > SP > [Campaign Name]`
- Campaign Info Card (Name, Status, Type, Budget, etc.)
- AppTaskbar with Frequency + Date Range
- Chart + tabs + tables

---

### Summary of Files

| File | Change |
|---|---|
| `src/pages/advertising/AdGroupDetail.tsx` | Full restructure: generic title, info card, taskbar, chart controls, updated tabs/toolbar |
| `src/pages/advertising/CampaignDetail.tsx` | Same pattern: generic title, campaign info card, taskbar, chart controls |
| `src/components/advertising/AdGroupInfoCard.tsx` | **NEW** — horizontal info strip for ad group metadata |
| `src/components/advertising/CampaignInfoCard.tsx` | **NEW** — horizontal info strip for campaign metadata |
| `src/components/advertising/AddProductAdsModal.tsx` | **NEW** — product selection modal with staging area |
| `src/components/tables/ProductAdsTable.tsx` | Add "Add Product Ads" button to toolbar, pagination, filter row |
| `src/components/tables/SearchTermsTable.tsx` | Add pagination, ROAS/ACOS columns |

