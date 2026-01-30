
# Revised Anarix Implementation Plan

## Critical Issues Resolution

### Issue 1: Navigation Hierarchy (RESOLVED)

**Decision: Sidebar is PRIMARY navigation, Header is CONTEXTUAL controls only**

```text
+--------------------------------------------------+
|  [☰] Anarix Logo    | Marketplace | Account     |  <-- Header (contextual)
+--------------------------------------------------+
| PROFITABILITY       |                            |
|   Dashboard         |    MAIN CONTENT AREA       |
|   Trends            |                            |
|   Profit & Loss     |                            |
|   Geographical      |                            |
+---------------------+                            |
| ADVERTISING         |                            |
|   Campaign Manager  |                            |
|   Impact Analysis   |                            |
|   Targeting Actions |                            |
+---------------------+                            |
| CATALOG             |                            |
|   Products          |                            |
+---------------------+                            |
| BUSINESS INTEL      |                            |
|   Brand SOV         |                            |
|   Keyword Tracker   |                            |
|   Keyword SOV       |                            |
|   Product SOV       |                            |
+---------------------+                            |
| DAY PARTING         |                            |
|   Hourly Data       |                            |
|   Campaigns         |                            |
|   History           |                            |
|   Scheduled Jobs    |                            |
+---------------------+                            |
| SETTINGS            |                            |
|   Accounts          |                            |
|   Users             |                            |
|   History Logs      |                            |
+--------------------------------------------------+
```

**Header contains only:**
- Sidebar toggle (hamburger/close)
- Anarix logo
- Marketplace selector (Walmart/Amazon) - affects data context
- Account selector - affects data scope

**NO top navigation tabs in header. All section navigation is via sidebar.**

---

### Issue 2: Run Button Safety Definition (RESOLVED)

The "Run" button mentioned in the requirements doc is for the **Logs page filters**, not a global action.

**Logs Page Run Button Specification:**
- **Purpose**: Apply all selected filters at once
- **Behavior**: Triggers data fetch with current filter state
- **NOT destructive**: Does not modify any data
- **States**:
  - Default: Enabled
  - Loading: Disabled + spinner + "Running..."
  - Cooldown: 2-second debounce after execution
- **Feedback**: Shows loading state, then success/error toast

**For Campaign Manager (table inline edits):**
- Individual Save buttons per row/field
- Save disabled until validation passes
- Confirmation modal for bulk actions only

---

### Issue 3: Marketplace Selector Implications (RESOLVED)

**Marketplace switching affects:**

| Feature | Walmart | Amazon |
|---------|---------|--------|
| **Date Range Options** | No "Today"/"Yesterday" (defaults to 7 days) | All options available |
| **Budget Fields** | Daily Budget + Total Budget | Daily Budget only |
| **Budget Validation (3P)** | Daily >= $10, Total >= $50 | Budget >= $1 |
| **Budget Validation (1P)** | Daily >= $50, Total >= $100 | Budget >= $1 |
| **Min Bid (Auto)** | $0.20 | $0.02 |
| **Min Bid (Manual)** | $0.30 | $0.02 |
| **Min Bid (SB)** | $0.50 | $0.02 |
| **Min Bid (SV)** | $0.80 | N/A |
| **Bid Multiplier Max** | 1000% | 900% |
| **Platform Bid Multiplier** | Yes (Desktop/Mobile/App) | No |
| **Placement Bid Options** | Search Ingrid, Buy-Box, Home Page, Stock up | Top of Search, Rest of Search, Product Pages |
| **Day Parting Graph** | Not available (show guidance message) | Hourly trends available |
| **Total Budget Column** | Visible | Hidden |

**Implementation:**
- Create `MarketplaceContext` with current marketplace state
- All tables, forms, and validation rules consume this context
- Column visibility, validation rules, and available features adapt automatically

---

### Issue 4: Bulk Actions Guardrails (RESOLVED)

**Bulk Action Flow:**
1. Select rows via checkboxes
2. Click bulk action button
3. **Preview Modal** appears showing:
   - Count of items affected
   - Summary of change to be applied
   - List of validation errors (if any)
4. User can Review -> Edit -> Approve or Cancel
5. On Approve:
   - Show progress indicator
   - Handle partial failures gracefully
   - Display results summary (success/failed counts)

**Confirmation Requirements:**
- Status changes (Pause/Active): Simple confirmation
- Bid adjustments: Show before/after preview for first 5 items
- Any action affecting >50 items: Extra confirmation step

**Validation Failure Behavior:**
- Items failing validation are excluded from action
- User sees list of excluded items with reasons
- Can proceed with valid items only

**Partial Success Handling:**
- Show success count and failure count
- Failed items listed with error reasons
- Option to retry failed items

---

## Additional Gap Resolutions

### KPI Cards Behavior

**Clickability:** NO - KPI cards are display only
**Filter tables:** NO - KPIs show aggregated data, do not filter tables
**Delta calculations:** Static (calculated from mock data comparison)

### Charts Specification

**Colors per metric (locked):**
- Ad Spend: #4A62D9 (Primary)
- Ad Sales: #22C55E (Success green)
- ROAS: #F59E0B (Warning amber)
- Impressions: #9CA2C8 (Muted)
- Clicks: #6E82F5 (Primary light)
- CTR: #A7AEF2 (Accent)
- CPC: #2A2D4F (Secondary)
- ACOS: #EF4444 (Destructive red)

**Max visible metrics:** 4

**5th metric behavior:** Replace oldest selected metric OR show tooltip "Maximum 4 metrics. Deselect one first."

### Status Badges Specification

| Status | Color | Shape | Tooltip |
|--------|-------|-------|---------|
| Live | Green bg + text | Rounded pill | "Campaign is actively running" |
| Paused | Gray bg + text | Rounded pill | "Campaign paused by user" |
| Archived | Muted bg + text | Rounded pill | "Permanently stopped" |
| Scheduled | Blue/Primary bg + text | Rounded pill | "Starts on [date]" |
| Out of Budget | Yellow/Warning bg + text | Rounded pill | "Daily budget exhausted" |
| Completed | Gray bg + text | Rounded pill | "Campaign ended on [date]" |

**Clickability:** NO - status badges are display only
**Placement:** Inline within table rows, left of campaign name

---

## Aan (AI) UI Integration

### Aan Entry Points

1. **Header**: Small icon button (subtle, not prominent)
2. **Contextual**: "Ask Aan" link near complex tables/charts
3. **Empty states**: "Get help from Aan" suggestion

### Aan Visual Identity

- **Gradient allowed ONLY inside Aan workspace:**
  `linear-gradient(135deg, #4A62D9, #A7AEF2)`
- Core Anarix remains flat and neutral
- Aan workspace has distinct visual boundary

### Aan Workspace Structure

```text
+------------------------------------------+
| Aan - AI Assistant                    [X] |
+------------------------------------------+
| Context: Campaign Manager > Campaigns     |
| Date: Jan 15 - Jan 22, 2026              |
+------------------------------------------+
|                                          |
|  CONVERSATION AREA                       |
|  - User messages                         |
|  - Aan responses                         |
|                                          |
+------------------------------------------+
| DRAFT OUTPUT (when applicable)           |
| [Preview of suggested changes]           |
|                                          |
| [Review] [Edit] [Approve] [Reject]       |
+------------------------------------------+
| Type a message...              [Send]    |
+------------------------------------------+
```

### Aan Approval Flow

1. User asks Aan a question
2. Aan shows explanation (always)
3. If Aan suggests changes:
   - Show as DRAFT/PREVIEW only
   - Never auto-apply
   - Require explicit "Approve" click
   - Show exactly what will change
4. User can Edit, Approve, or Reject

---

## Implementation Sequence

### Phase 1: Foundation & Shell
1. Update CSS with complete Periwinkle tokens
2. Implement marketplace context provider
3. Finalize AppHeader (contextual controls only)
4. Finalize AppSidebar (primary navigation)
5. Add theme toggle (light/dark)

### Phase 2: Campaign Manager
1. KPI Cards component (4 cards, static display)
2. Performance Chart component (recharts, multi-metric)
3. DataTable component with:
   - Sortable columns
   - Total row
   - Inline editing
   - Validation per marketplace
   - Column visibility
4. Filter modal component
5. Bulk actions with confirmation flow
6. Tab navigation (Campaigns, Ad Groups, etc.)

### Phase 3: Profitability Dashboard
1. Summary cards (Today/Yesterday/This Month/Last Month)
2. Products/Orders table
3. P&L catalog view

### Phase 4: Shared Components
1. DateRangePicker (with marketplace restrictions)
2. Filter system (Where/Operator/Value pattern)
3. Export functionality
4. Pagination controls
5. Status badges

### Phase 5: Aan UI Shell (UI ONLY)
1. Aan icon in header
2. Aan slide-out panel
3. Conversation interface
4. Draft/Preview display area
5. Approval controls

---

## File Structure

```text
src/
├── contexts/
│   └── MarketplaceContext.tsx
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx
│   │   ├── AppHeader.tsx
│   │   └── AppLayout.tsx
│   ├── tables/
│   │   ├── DataTable.tsx
│   │   ├── TableFilters.tsx
│   │   ├── TablePagination.tsx
│   │   ├── TotalRow.tsx
│   │   └── BulkActions.tsx
│   ├── charts/
│   │   ├── PerformanceChart.tsx
│   │   └── MetricSelector.tsx
│   ├── cards/
│   │   ├── KPICard.tsx
│   │   └── SummaryCard.tsx
│   ├── forms/
│   │   ├── DateRangePicker.tsx
│   │   ├── FilterModal.tsx
│   │   └── InlineEdit.tsx
│   ├── status/
│   │   └── StatusBadge.tsx
│   └── aan/
│       ├── AanPanel.tsx
│       ├── AanTrigger.tsx
│       ├── AanConversation.tsx
│       └── AanDraftPreview.tsx
├── pages/
│   ├── advertising/
│   │   └── CampaignManager.tsx
│   ├── profitability/
│   │   ├── Dashboard.tsx
│   │   └── ProfitLoss.tsx
│   └── settings/
│       └── Logs.tsx
├── hooks/
│   └── useMarketplace.ts
├── types/
│   ├── campaign.ts
│   └── validation.ts
└── lib/
    ├── validation/
    │   ├── amazon.ts
    │   └── walmart.ts
    └── constants/
        └── chartColors.ts
```

---

## Validation Rules Reference

### Amazon Sponsored Products
- Campaign Budget: $1 <= budget < $100,000
- Ad Group Default Bid: >= $0.02
- Keyword/Target Bid: $0.02 - $49
- Placement Bid Multiplier: 0% - 900%

### Walmart Sponsored Products (3P)
- Daily Budget: >= $10
- Total Budget: >= $50
- Daily Budget < Total Budget
- Auto Campaign Bid: $0.20 - $49
- Manual Campaign Bid: $0.30 - $49
- Page Type/Platform Bid Multiplier: <= 1000%

### Walmart Sponsored Products (1P)
- Daily Budget: >= $50
- Total Budget: >= $100
- Daily Budget < Total Budget

---

## Explicit Exclusions

- Real API integrations (mock data only)
- Aan AI logic/reasoning (UI shell only)
- Auto-applying any changes
- Marketing pages
- Mobile native apps

---

## Ready to Proceed

Please confirm or correct:
1. Navigation hierarchy (Sidebar primary, Header contextual)
2. Marketplace-aware validation rules
3. Bulk action confirmation flow
4. Aan UI scope (UI only, no logic)
5. First screen to build (Campaign Manager or Profitability Dashboard)
