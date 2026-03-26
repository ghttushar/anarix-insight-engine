

## Comprehensive Fix: Toolbar Consistency, Aan Redesign, Table Styling, Upload Dialog

This plan addresses all outstanding issues across the entire application in 3 phases.

---

### Issues Identified (Audit)

1. **Profitability Dashboard toolbar**: Upload COGS and Export are custom `rightContent` buttons (different style), not using the built-in toolbar props. No upload dialog popup.
2. **Campaign Manager**: Upload button is on left side (inside toolbar `leftContent` slot via `showUpload`). Should be on right side. Only Create + Products/Orders toggle + Search should be left.
3. **CampaignTable**: No `type` column (Auto/Manual badge) — completely missing. Image-143 shows it should exist.
4. **Auto/Manual badge**: In light mode, if using `bg-muted text-muted-foreground`, the "Manual" tag is invisible.
5. **Delta toggle in CampaignTable**: DeltaBadges are hardcoded (always shown), not controlled by `showDeltas` prop from parent.
6. **Add Product Ad button**: Not functional — no modal wired.
7. **Aan workspace**: Has a top header bar with Hide/X buttons — user wants this removed.
8. **Aan sidebar (MiniSidebar)**: Should match main AppSidebar style (logo placement, collapse button).
9. **Aan prompt suggestion**: After AI response, show a gradient notch below the input with a bulb icon + suggested prompt + X to close.
10. **Aan stop button**: No way to cancel generation.
11. **Aan copilot**: Same prompt suggestion notch needed.

---

### Phase 1: Toolbar Standardization + Upload Dialog + Type Column + Delta Control

**DataTableToolbar.tsx** — Move Upload to right side (after rightContent, before Delta). Remove it from left section.

**Dashboard.tsx (profitability)** — Remove custom `rightContent` with Upload COGS / Export buttons. Instead use built-in toolbar props:
- `leftContent`: ProductsOrdersToggle only
- `showUpload`: true, `onUpload`: handler, `uploadTitle`: "Upload COGS"
- `onDownload`: handler
- Remove the old `handleUploadCOGS` function

**CampaignManager.tsx** — Move `showUpload`/`onUpload` to right side (already in toolbar props, just need toolbar to render it on right). `leftContent` should only have Create Campaign button.

**CampaignTable.tsx** — Add `type` column after Status showing Auto/Manual badge. Add `showDeltas` prop — wrap DeltaBadge renders in `{showDeltas && ...}` conditionals. Pass from CampaignManager.

**Auto/Manual Badge styling** — Use `border` variant with explicit colors: Auto = `border-primary text-primary bg-primary/5`, Manual = `border-border text-foreground bg-muted`.

**All other pages** — Audit and ensure toolbar uses built-in props consistently (Trends, ProfitLoss, Geographical, all BI pages, DayParting, Catalog). Remove any custom rightContent buttons that duplicate built-in Upload/Export.

**ProductAdDetail.tsx** — Wire Add Product Ad button to open `AddProductAdsModal`.

**Files:**
| File | Change |
|---|---|
| `DataTableToolbar.tsx` | Move Upload button from left to right section |
| `Dashboard.tsx` (profitability) | Use built-in toolbar props, remove custom buttons |
| `CampaignManager.tsx` | Clean leftContent (Create only) |
| `CampaignTable.tsx` | Add type column, add showDeltas prop |
| `ProductAdDetail.tsx` | Wire AddProductAdsModal |
| `Trends.tsx` | Standardize toolbar |
| `ProfitLoss.tsx` | Standardize toolbar |
| `Geographical.tsx` | Standardize toolbar |
| All BI pages | Verify toolbar consistency |

---

### Phase 2: Aan Workspace Redesign + Prompt Suggestions + Stop Button

**AanWorkspace.tsx** — Remove the top header bar entirely (the one with Sparkles/Aan/Hide/X). The MiniSidebar handles navigation. Workspace should be just: MiniSidebar | [Sidebar] | [Chat + Input] | [ArtifactViewer].

**MiniSidebar.tsx** — Redesign to match main AppSidebar:
- Add logo at top (same as AppSidebar collapsed state)
- Add collapse/expand toggle
- When expanded: show full nav groups like AppSidebar (w-56)
- When collapsed: icon-only (w-14) as current
- Add "close Aan" button in footer area
- Remove the separate header bar from AanWorkspace

**AanInput.tsx** — Add:
1. **Stop button**: When `isLoading`, show a red "Stop" button that clears timers and stops generation.
2. **Prompt suggestion notch**: After assistant response, show a small bar below input with `Lightbulb` icon, suggested prompt text, gradient background (same as Ask Aan button: `border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5`), and X to dismiss.

**AanCopilotPanel.tsx** — Same prompt suggestion notch below the AanInput.

**Files:**
| File | Change |
|---|---|
| `AanWorkspace.tsx` | Remove header bar, let MiniSidebar handle all nav |
| `MiniSidebar.tsx` | Add expand/collapse, match AppSidebar style, add close Aan |
| `AanInput.tsx` | Add stop button + prompt suggestion notch |
| `AanCopilotPanel.tsx` | Ensure prompt suggestion visible |

---

### Phase 3: Color/Font Audit + Full Verification Report

Systematic review of every screen:
- Verify toolbar button order: `[Create/Toggle] | [Search]` LEFT — `[Upload] | [Delta] | [Filter] | [Columns] | [Export] | [Edit]` RIGHT
- Verify delta toggle controls only the table below
- Verify Auto/Manual badges visible in both light and dark mode
- Verify upload popup opens with drag-and-drop
- Verify all fonts use Satoshi (headings) / Noto Sans (body)
- Verify color consistency (text-foreground for data, text-muted-foreground for labels)
- Post-build changes report

**Screens to verify:**
Profitability (Dashboard, Trends, P&L, Geographical), Advertising (Campaign Manager, Campaign Detail, AdGroup Detail, ProductAd Detail, Impact Analysis, Targeting Actions), Catalog, Day Parting (all), Business Intelligence (all), AMC (all)

---

### Technical Details

**Toolbar layout change** — In `DataTableToolbar.tsx`, the Upload button currently sits in the left `div` (line 162-174). Move it to right `div` (line 187), before the Delta toggle.

**CampaignTable type column** — Insert after `show("status")` column. Render:
```tsx
{show("type") && (
  <TableCell>
    <span className={cn(
      "rounded-full px-2.5 py-0.5 text-xs font-medium border",
      campaign.type === "auto" 
        ? "border-primary/30 text-primary bg-primary/5" 
        : "border-border text-foreground bg-muted"
    )}>
      {campaign.type === "auto" ? "Auto" : "Manual"}
    </span>
  </TableCell>
)}
```

**Prompt suggestion mock data** — Array of suggestions rotated after each response:
```
["Optimize my top spending campaigns", "Show me wasted spend analysis", "Compare this week vs last week"]
```

