
# New flows: Bulk COGs Upload + Campaign Tagging

Three uploaded flows analyzed. Each maps to an existing page; no new routes.

## 1. Bulk COGs Upload — Profitability Dashboard

**Entry point:** existing "Upload Cogs" / cloud-upload button on the Products table toolbar in `Dashboard.tsx` (Profitability). It currently is a no-op / placeholder; wire it to open this flow.

**Component:** new `src/components/profitability/BulkCogsUploadModal.tsx`. Single Dialog that internally cycles through 4 states (driven by local state machine, no routing):

1. **Upload state** — Title `Add/Update Bulk COGs` with info tooltip (`You can only upload COGs in Bulk. To upload product level COGs, click on "COGs" in product table.`). Dashed-border drop zone, upload icon, `Download Template` link + `for bulk COGs upload`. Subtitle: `XLSX format | 5 MB max`. Footer: `Clear and Upload again` (disabled), `Close`, `Upload Bulk COGs` (disabled). Drag-and-drop + click-to-pick. Accept `.xlsx,.csv`.
2. **File-selected state** — Shows `File Name:` and `File Size:` columns, file row with icon, truncated filename + native title tooltip. `Clear and Upload again` enabled. `Upload Bulk COGs` primary enabled.
3. **Auditing state** — Center icon (gear+search), copy: `COGs Uploaded data is being auditing for conflicts. Please wait for few seconds.` Note line: `Do not switch page or close tab or the data will get lost.` Simulated 2.5s delay via `setTimeout`.
4. **Summary state** — `Bulk COGs Upload Summary` with warning icon. Stats line: `100 COGs rows has been processed. 72 COGs are successfully processed and 18 conflicts has been found which are shown below.` Then a table (Product Name / ASIN / COGs / Reason of Conflict). Footer: `Close`, `Download CSV Report`. If conflicts = 0 → instead show success state: large check icon, `N COGs have been audited and updated successfully` + `Continue` button.

Mock data only: deterministic `mockBulkCogsResult` (total=100, success=72, 18 mock conflict rows). Download buttons call `toast.success(...)`. No real file parsing.

## 2. Bulk-level tagging — Campaign Manager (Edit mode)

**Where:** `src/pages/advertising/CampaignManager.tsx` + `src/components/tables/CampaignTable.tsx` + `src/components/advertising/DataTableToolbar.tsx`.

**Bulk Actions row in Edit mode** already exists (Edit toggle at first position from prior work). Extend it: when ≥1 rows are selected, the `Bulk Actions` row shows `Active | Pause | Tag | End Date | Daily Budget | Total Budget | Cancel | Save`. `Tag` is a new `Popover`.

**Tag popover content:**
- Search input: `Search the tags to create a tag`
- List of existing tags from project-wide store (Boxer Shorts, Briefs, Red Shorts, Linens, Drapes, Curtains, Hijabs, Hijabi, Recycle — seeded mock list)
- Typing a non-existing value shows `Create "<value>"` action + small `+` icon
- Hover row exposes edit (pencil) and delete (trash) icons
- Selecting tags toggles them on/off for all selected rows
- Confirm via `Save` in Bulk Actions row (already wired). Until Save, applied tags render inline under each selected row's Campaign Name in red copy: `Campaign name doesn't match the tag` only when validation fails — for now we render the chip as draft (muted border) and on Save commit to permanent state.

**Row rendering:** Under each campaign name in Edit mode, render existing tag chips followed by `+ Tag` placeholder chip (disabled in View mode → tags still visible read-only).

## 3. Individual-level tagging — Campaign Manager (Edit mode)

Same campaign table. In Edit mode, clicking the `+ Tag` chip on a single row opens the same `TagPopover` anchored to that row only. Applies tags only to that row. Multiple tag chips appear inline; in Edit mode each chip has hover edit/delete affordances; on Save commits.

## Implementation files

New:
- `src/components/profitability/BulkCogsUploadModal.tsx` — state machine + 4 sub-views.
- `src/components/advertising/TagPopover.tsx` — shared by bulk + per-row. Props: `selectedTags`, `onToggle`, `availableTags`, `onCreate`, `onEdit`, `onDelete`.
- `src/contexts/TagsContext.tsx` — in-memory tag store: `tags: string[]`, `campaignTags: Record<campaignId, string[]>`, `pendingTags: Record<campaignId, string[]>` for Edit-mode drafts; `commit()`, `discard()`.
- `src/data/mockTags.ts` — seed tags list.

Modified:
- `src/pages/profitability/Dashboard.tsx` — wire existing Upload Cogs button to open the new modal.
- `src/pages/advertising/CampaignManager.tsx` — wrap with `TagsProvider`; pass through Edit-mode props.
- `src/components/tables/CampaignTable.tsx` — render tag chips under Campaign Name; in Edit mode include `+ Tag` trigger; integrate `TagPopover`.
- `src/components/advertising/DataTableToolbar.tsx` — add `Tag` bulk-action button + popover when in Edit mode AND selection count > 0. Wire Save/Cancel to context commit/discard.
- `src/App.tsx` — mount `TagsProvider` at advertising route level (or globally) so tag store persists across navigation within session.

## Out of scope

- Backend persistence (in-memory only).
- Tag system on Ad Groups / Product Ads / Keyword Targeting / Product Targeting tables — only Campaign table per uploaded flows. (Earlier work already propagated Auto/Manual badges; this is a different concept.)
- Real CSV/XLSX parsing.
- Pricing for tags, AI-suggested tags.
- Any change to Profitability hero cards, charts, or non-COGs Dashboard surfaces.

## Visual / token notes

- Tag chips: `border border-border bg-muted text-foreground rounded-md px-2 py-0.5 text-xs`, draft state uses `border-dashed border-primary/40 text-primary`.
- Validation copy in red: `text-destructive text-[11px]`.
- All modals use existing `Dialog` shadcn component; auditing/success states use existing icon set (`Loader2`, `FileCheck2`, `AlertTriangle`).
- No new color tokens; all colors come from existing semantic tokens per design system.

## Technical notes

- State machine in `BulkCogsUploadModal` is a single `step: "upload" | "selected" | "auditing" | "summary" | "success"` state.
- `TagsContext` exposes `isEditMode` toggle setter so toolbar Edit button (already implemented) flips both selection mode AND tag draft mode together.
- Per-row popover uses Radix `Popover` with `align="start"`.
