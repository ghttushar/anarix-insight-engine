

## Rename "Client Portal" → "Reports", Merge Views, Move Create to Right Panel, Enhance Page

### 3 Changes

---

### 1. Rename Page & Merge Agency/Brand Owner Views

**Current:** Page titled "Client Portal" with a Tabs toggle between "Agency View" and "Brand Owner View" that conditionally shows different KPIs and template cards.

**Fix:**
- Rename page title from "Client Portal" to "Reports"
- Update breadcrumbs to just `["Reports"]`
- Remove the Agency/Brand Owner toggle entirely
- Show **all features from both views merged**: template quick-action cards always visible above the table, KPI row always shows Total Reports, Clients, Sent, Scheduled (no conditional switching)
- The "Client Name" field in create form becomes optional — if filled, it's a client report; if empty, it's a personal/brand report

### 2. Move Create Report from Modal to Right-Side Panel

**Current:** Create Report opens as a `Dialog` modal.

**Fix:**
- Add `"createReport"` to `DataPanelType` in `ActivePanelContext.tsx`
- Create `src/components/panels/CreateReportPanel.tsx` following the same pattern as `CreateCampaignPanel` (320px wide, fixed right, ScrollArea, header with close button, footer with Cancel/Create)
- Move all form fields (template selector, report name, client name, period, section checkboxes, schedule builder) into the panel
- Remove the `Dialog` from `ClientPortal.tsx`
- Wire the "Create Report" button and template quick-action cards to `setDataPanel("createReport")`
- Render `<CreateReportPanel />` in `ClientPortal.tsx` as a sibling to the main content div

### 3. Enhance the Page

- Add report template quick-action cards always visible (not just in brand mode) — 4 cards in a row: Performance, P&L, Advertising, Custom
- Each template card click opens the create panel pre-filled with that template
- Table: keep existing sort/pin setup, no changes needed
- Ensure the page follows all standard patterns (sticky taskbar, footer breadcrumb, DataTableToolbar)

### Files Summary

| File | Change |
|---|---|
| `ActivePanelContext.tsx` | Add `"createReport"` to `DataPanelType` |
| `CreateReportPanel.tsx` (new) | Right-side panel with all create report form fields + schedule builder |
| `ClientPortal.tsx` | Rename title, remove view toggle, remove Dialog, show templates always, wire to panel |

