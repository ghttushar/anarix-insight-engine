# Targeting Actions — Missing Features + Match Type Enhancement

## What's Missing (Spec vs Current Build)


| Feature                                                                                | Status                                                                     |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Source AdGroup column**                                                              | Missing from table                                                         |
| **Ad Spend, Ad Sales, Ad Units, CVR, ACOS columns**                                    | Missing — only Impressions, Clicks, CTR, CPC, ROAS shown                   |
| **Date Range selector** in Action Configuration panel                                  | Missing — spec lists Last 3/7/14/30/60 days                                |
| **Custom Bid button** in toolbar with popover (Increase By % / Decrease By % / Set To) | Missing — reference image-89 shows this                                    |
| **Term Type as editable dropdown** below search term text                              | Missing — currently a static badge; image-90 shows it as a Select dropdown |
| **Match type layout is cluttered**                                                     | Checkbox + input jammed together in a tight cell                           |


## Plan

### 1. Add Missing Columns to Keyword Action Table

Add these columns after the existing metrics: **Source AdGroup**, **Ad Spend**, **Ad Sales**, **Ad Units**, **CVR**, **ACOS**.

Data already exists in `mockTargetingActions` — `sourceAdGroupName`, `adSpend`, `adSales`, `adUnits`, `cvr` are all present. Add `acos` as a computed field (adSpend / adSales × 100).

### 2. Add Date Range Selector to Action Configuration Panel

Add a date range dropdown between Priority and Fetch Keywords button with options: Last 3 days, Last 7 days, Last 14 days, Last 30 days, Last 60 days.

### 3. Add Custom Bid Button + Popover to Toolbar

Add a "Custom Bid" button next to "Add Keywords". On click, open a Popover with:

- Dropdown: "Increase By %", "Decrease By %", "Set To"
- Number input for the value
- Confirmation text: "Are you sure you want to adjust the budget? This action might affect the spends."
- Apply button

As shown in reference image-89.

### 4. Convert Term Type Badge to Editable Dropdown

Replace the static `<Badge>` for term type with a `<Select>` dropdown showing Generic / Branded / Competitor options, positioned below the search term text. Matches reference image-90.

### 5. Enhance Match Type Columns (Broad / Exact / Phrase)

Redesign the match type cells to be cleaner. Each cell will show:

- Checkbox on the left
- Bid input on the right with consistent width
- Compact rounded container per cell for visual grouping
- Consistent spacing between checkbox and input

Layout per cell: `[☐] [0.85]` — horizontal flex with a subtle border/background grouping to make it feel intentional rather than thrown together. Matches reference image-91.

### Files Modified

- `**src/pages/advertising/TargetingActions.tsx**` — all changes (columns, config panel, toolbar, term type dropdown, match type cells)
- `**src/types/advertising.ts**` — no changes needed (all fields exist)  
  
  
don't add repetative things, and whaterever you are adding do it according to our logic and style