

# Rules Pages — Breadcrumbs, Save Draft Toolbar, and Drafts Section

## Changes

### 1. Add Breadcrumbs to All Rule Sub-Pages

Use the existing `PageBreadcrumb` component consistently:

- **RuleAgents**: `Advertising > Rules > Agents`
- **AppliedRules**: `Advertising > Rules > Applied Rules`
- **RuleCreation**: `Advertising > Rules > Agents > {Template Name}` (or `Create Rule` / `Edit Rule`)

Breadcrumb renders above the `PageHeader`, matching the pattern used in Sandbox Dashboard and Settings pages.

### 2. Move "Save & Draft" to Top-Right Toolbar

Remove "Save & Draft" from the bottom footer bar. Place it as a `PageHeader` action button (top-right), consistent with how other pages handle primary actions in the header area. The footer keeps only "Add Criteria", "Home", and "Select Campaigns".

### 3. Add Drafts Section to Applied Rules Page

The Applied Rules page already has `status: "draft"` in mock data. Add:
- A tab strip at the top: **All Rules** | **Active** | **Paused** | **Drafts**
- Filtering the `appliedRules` list by status when a tab is selected
- "Drafts" tab shows only rules with `status === "draft"`

When "Save & Draft" is clicked on RuleCreation, navigate to Applied Rules with the Drafts tab pre-selected (via URL search param `?tab=drafts`).

### Files Modified
- **`src/pages/advertising/RuleAgents.tsx`** — add breadcrumb
- **`src/pages/advertising/AppliedRules.tsx`** — add breadcrumb + status filter tabs
- **`src/pages/advertising/RuleCreation.tsx`** — add breadcrumb, move Save & Draft to PageHeader actions

