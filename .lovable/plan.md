

# Rules Module — Complete Rebuild

## Current State
The existing `RuleBuilder.tsx` is a simple backtesting dashboard with 4 hardcoded mock rules. The reference images reveal a **significantly more complex** system with 3 distinct views and a dedicated sidebar section.

## What the Reference Images Show

### Image 1 — Rule Agents (Landing Page)
- Header: "Create Rules with AI" with AI prompt input + "Create Rule" button
- Scrollable suggestion chips carousel (e.g. "Find underperforming products to optimize")
- **Campaign Rules** grid (3×3): Inventory Rule, Platform Rule, Placement Rule, Share of Voice Rule, State Change Rule, Budget Rule, Bidding Strategy Rule, Bidder Rule, Keyword Harvesting Rule
- **Targeting Rules** grid (1×2): Keyword Rule, Target Rule
- Each template card shows name + subtitle description

### Image 2 — Rule Creation Form
- **Basic Information**: Rule Name input, Status toggle, Lookback Window dropdown, Date Range picker, Frequency dropdown
- **Advanced Settings**: Collapsible section
- **Criteria Information**: Info banner explaining criteria usage
  - Priority numbered criteria blocks (1, 2, ...) with name input
  - Each criteria has N conditions: Metric dropdown, Operator dropdown, Value type (Absolute) + number input
  - Action section per criteria: Action dropdown (Set bid to) + value input
  - Buttons: Duplicate Criteria, Delete Criteria, + Add Condition
- Footer: + Add Criteria, Save & Draft, Home, Select Campaigns →

### Image 3 — Applied Rules Table
- Columns: Rule Name, Rule Type, Entities Count (# of campaigns/targets attached), Frequency, Last Run, Status, Actions (Edit button)
- Sortable columns, pagination (Rows per page selector)

### Image 4 — Sidebar Navigation
- "Rules" group with sub-items: "Agents" and "Applied Rules"

## Plan

### 1. Update Sidebar Navigation
**File: `src/components/layout/AppSidebar.tsx`**
- Replace single "Rule Builder" item with a "Rules" group containing:
  - "Agents" → `/advertising/rules/agents`
  - "Applied Rules" → `/advertising/rules/applied`

### 2. Create Mock Data
**File: `src/data/mockRules.ts`** (replace `mockRuleBuilder.ts`)
- `RuleTemplate` interface: id, name, description, category ("campaign" | "targeting")
- `ruleTemplates[]`: 11 templates matching the grid (Inventory, Platform, Placement, SOV, State Change, Budget, Bidding Strategy, Bidder, Keyword Harvesting, Keyword, Target)
- `AppliedRule` interface: id, name, ruleType, entitiesCount, entityLabel, frequency, lastRun, status
- `appliedRules[]`: mock data for the Applied Rules table
- `RuleCriteria` interface: priority, name, conditions[] (metric, operator, valueType, value), action (type, value)
- Metric/operator/action option lists

### 3. Rule Agents Page
**File: `src/pages/advertising/RuleAgents.tsx`**
- AI prompt section: text input + "Create Rule" button
- Suggestion chips carousel with left/right arrows and dot indicators
- Campaign Rules section: 3-column grid of template cards
- Targeting Rules section: 2-column grid of template cards
- Clicking a template → navigates to Rule Creation with template pre-selected

### 4. Rule Creation Page
**File: `src/pages/advertising/RuleCreation.tsx`**
- **Basic Information** card: Rule Name input, Status toggle, Lookback Window select, Date Range picker, Frequency select
- **Advanced Settings**: Collapsible section (empty placeholder)
- **Criteria Information** card: Info banner + dynamic criteria blocks
  - Each criteria: priority number select, name input, Duplicate/Delete/Add Condition buttons
  - Each condition: Metric select, Operator select, Value Type select + number input, delete button
  - Action row: action type select + value input
- **+ Add Criteria** button at bottom left
- **Footer bar**: Save & Draft, Home, Select Campaigns buttons
- All state managed locally with `useState` — add/remove criteria, add/remove conditions

### 5. Applied Rules Page
**File: `src/pages/advertising/AppliedRules.tsx`**
- Table with columns: Rule Name, Rule Type, Entities Count, Frequency, Last Run, Status, Actions
- Rule Name as clickable link (brand.primary color)
- Entities Count as clickable link
- Edit button per row → navigates to Rule Creation with data pre-filled
- Pagination with rows-per-page selector
- Sortable column headers

### 6. Update Routes
**File: `src/App.tsx`**
- Replace `/advertising/rules` route with:
  - `/advertising/rules/agents` → `RuleAgents`
  - `/advertising/rules/applied` → `AppliedRules`
  - `/advertising/rules/create` → `RuleCreation`
  - `/advertising/rules/create/:templateId` → `RuleCreation` (with template)
  - `/advertising/rules/edit/:ruleId` → `RuleCreation` (edit mode)

### 7. Clean Up
- Delete or repurpose `src/pages/advertising/RuleBuilder.tsx` (replace with redirect or remove)
- Keep `src/data/mockRuleBuilder.ts` for backtest data if needed, or merge into new mock file

### Files Modified/Created
- **Modify**: `src/components/layout/AppSidebar.tsx` — sidebar nav update
- **Modify**: `src/App.tsx` — route updates
- **Create**: `src/data/mockRules.ts` — new comprehensive mock data
- **Create**: `src/pages/advertising/RuleAgents.tsx` — agents/templates landing
- **Create**: `src/pages/advertising/RuleCreation.tsx` — full rule builder form
- **Create**: `src/pages/advertising/AppliedRules.tsx` — applied rules table
- **Delete**: `src/pages/advertising/RuleBuilder.tsx` — replaced by new pages

