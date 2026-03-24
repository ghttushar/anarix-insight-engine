

## Phase 1: Panel System Redesign — Dual-Panel Logic, Right-Side Create Forms, Independent Scroll

### Problem
Currently `ActivePanelContext` enforces mutual exclusivity — only ONE panel can be open at a time. User wants: one **data panel** (Product Detail, Period Breakdown, Create Schedule, etc.) AND one **Aan panel** (Copilot) can be open simultaneously. Also, all "Create" forms (Day Parting Rule, Create Campaign, etc.) should open in the right viewing panel instead of inline/modal. Panel widths need reducing, and every scrollable area needs independent scroll.

---

### 1. Restructure ActivePanelContext — Two Independent Slots

**File: `src/contexts/ActivePanelContext.tsx`**

Replace single `activePanel` with two independent states:
- `dataPanel`: `"none" | "productDetail" | "periodBreakdown" | "insights" | "createSchedule" | "createCampaign"` 
- `aiPanel`: `"none" | "copilot"`

New API:
```
setDataPanel(panel) / closeDataPanel()
setAiPanel(panel) / closeAiPanel()
```

Both can be open at the same time. Opening a new data panel replaces the current data panel. Opening copilot is independent.

### 2. Update AppLayout for Dual-Panel Rendering

**File: `src/components/layout/AppLayout.tsx`**

Current: renders either InsightsPanel OR AanCopilotPanel.
New: renders data panel (left) + AI panel (right), both as flex siblings of main content.

```
[Sidebar] [Main Content] [Data Panel (320px)] [Copilot Panel (360px)]
```

- Reduce panel widths: Data panels from 400px → 320px, Copilot from 420px → 360px
- Both can render simultaneously
- Sidebar auto-collapse triggers if ANY panel is open

### 3. Move Create Forms to Right Panel

**New files:**
- `src/components/panels/CreateSchedulePanel.tsx` — Extract day parting rule form from `HourlyData.tsx` into a right-side panel component (320px wide, with independent ScrollArea)
- `src/components/panels/CreateCampaignPanel.tsx` — Convert `CreateCampaignModal` content into a right-side panel variant

**Updated files:**
- `HourlyData.tsx` — Replace inline schedule form with button that calls `setDataPanel("createSchedule")`
- `CampaignManager.tsx` — "Create Campaign" button opens right panel instead of modal (keep modal as fallback)

### 4. Reduce All Panel Widths

| Panel | Old Width | New Width |
|---|---|---|
| ProductDetailPanel | 400px | 320px |
| PeriodBreakdownPanel | 400px | 320px |
| InsightsPanel | 420px | 320px |
| AanCopilotPanel | 420px | 360px |
| CreateSchedulePanel | inline | 320px |
| CreateCampaignPanel | modal | 320px |

### 5. Independent Scroll on Every Container

Audit and fix scroll containers:
- `AppLayout` main content: already `overflow-auto` ✓
- All right panels: wrap content in `<ScrollArea className="flex-1 min-h-0">` 
- All table wrappers: ensure `<div className="relative w-full overflow-auto">` (already in ui/table.tsx ✓)
- `HourlyData.tsx` heatmap: wrap in `overflow-auto` container
- PnL tables: ensure horizontal scroll works with `overflow-x-auto`
- Day parting campaigns table: independent scroll

### 6. Update All Panel Consumers

Pages that use `useActivePanel()` need to switch to the new API:
- `ProfitLoss.tsx` — `setDataPanel("productDetail")` instead of `setActivePanel("productDetail")`
- `Dashboard.tsx` (profitability) — same
- `HourlyData.tsx` — new `setDataPanel("createSchedule")`
- `CampaignManager.tsx` — new `setDataPanel("createCampaign")`
- `FloatingActionIsland.tsx` — Aan button calls `setAiPanel("copilot")`
- `AppSidebar.tsx` — Aan button calls `setAiPanel("copilot")`

---

### Files Summary

| File | Change |
|---|---|
| `ActivePanelContext.tsx` | Split into `dataPanel` + `aiPanel` with independent getters/setters |
| `AppLayout.tsx` | Render data panel + AI panel as independent siblings, reduce widths |
| `CreateSchedulePanel.tsx` | **NEW** — Day parting rule form as right panel |
| `CreateCampaignPanel.tsx` | **NEW** — Campaign creation as right panel |
| `ProductDetailPanel.tsx` | Reduce width to 320px |
| `PeriodBreakdownPanel.tsx` | Reduce width to 320px |
| `InsightsPanel.tsx` | Reduce width to 320px |
| `AanCopilotPanel.tsx` | Reduce width to 360px |
| `HourlyData.tsx` | Remove inline form, button opens right panel |
| `CampaignManager.tsx` | Create Campaign opens right panel |
| `ProfitLoss.tsx` | Update to new `setDataPanel` API |
| `Dashboard.tsx` (profitability) | Update to new API |
| `FloatingActionIsland.tsx` | Update to `setAiPanel` |
| `AppSidebar.tsx` | Update to `setAiPanel` |
| `AanContext.tsx` | Update mode derivation for new panel API |

