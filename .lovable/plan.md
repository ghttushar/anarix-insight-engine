# Gap Analysis: Spec vs. Current Build

## Comparison Summary


| Spec Requirement                    | Current Build                                | Status  |
| ----------------------------------- | -------------------------------------------- | ------- |
| **Profitability — Dashboard**       | `src/pages/profitability/Dashboard.tsx`      | Present |
| **Profitability — Trends**          | `src/pages/profitability/Trends.tsx`         | Present |
| **Profitability — Profit and Loss** | `src/pages/profitability/ProfitLoss.tsx`     | Present |
| **Advertising — Campaign Manager**  | `src/pages/advertising/CampaignManager.tsx`  | Present |
| **Advertising — Impact Analysis**   | `src/pages/advertising/ImpactAnalysis.tsx`   | Present |
| **Advertising — Targeting Actions** | `src/pages/advertising/TargetingActions.tsx` | Present |


## Missing Items

### 1. Campaign Manager — "Product Targeting" Tab

The spec lists these tabs: **Campaigns, Ad Groups, Product Ads, Keywords Targeting, Product Targeting, Search Terms**.

The current build has: Campaigns, Ad Groups, Product Ads, Keyword Targeting, Search Terms, **Page Type, Platform**.

**Missing:** "Product Targeting" tab (distinct from "Product Ads").
**Extra (not in spec):** "Page Type" and "Platform" tabs exist in the build but are not mentioned in the spec.

### 2. No Other Missing Pages or Features

All three Profitability pages, all three Advertising pages, and the three Targeting Actions sub-tabs (Keyword Actions, History, Archive) are present and functional.

## Behavioral Gaps (Minor)

These are interaction-level gaps where the build has the feature but may not fully match the spec's described behavior:

- **Frequency resets to Daily on tab switch** — not verified as enforced in Campaign Manager or Impact Analysis tab-change handlers.
- **Filters do not persist on tab switch** — Campaign Manager resets filters on tab change (appears correct), but worth verifying.
- **KPI "View More" on Profitability Dashboard** — the spec says each KPI card has a "View More" that opens a detailed breakdown. The current build uses `PeriodSummaryCard` with `onViewMore` which opens a `PeriodBreakdownPanel`. This is present.

## Recommendation

The only structural gap is the missing **Product Targeting** tab in Campaign Manager. Implementation would require:

1. Creating a `ProductTargetingTable` component (similar to `KeywordTargetingTable` but for product/ASIN targets)
2. Adding mock data for product targeting entries
3. Adding the tab to the Campaign Manager tab list
4. Deciding whether to keep or remove the extra "Page Type" and "Platform" tabs (not in spec)  
  
refer the git repo and build the feature 