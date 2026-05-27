## Wire up Campaign Tagging entry points

The tagging primitives exist (`TagsContext`, `TagPopover`, `CampaignTagBar`, `CampaignBulkActionsBar`, `mockTags`) but are not mounted — `CampaignTagBar` is imported into `CampaignTable.tsx` and never rendered, and `CampaignManager.tsx` never wraps with `TagsProvider` or renders the bulk bar. This plan finishes the wiring per the two uploaded flows (individual + bulk).

### 1. `src/pages/advertising/CampaignManager.tsx`
- Import `TagsProvider` and `CampaignBulkActionsBar`.
- Add `selectedIds` state: `useState<Set<string>>(new Set())`.
- Wrap the page return body in `<TagsProvider>`.
- Pass `selectedIds` + `onSelectionChange={setSelectedIds}` into `<CampaignTable>` (existing props already supported).
- Render `<CampaignBulkActionsBar selectedIds={selectedIds} onClear={() => setSelectedIds(new Set())} />` directly above `{renderTable()}` — visible only when `viewMode === "edit"` AND `selectedIds.size > 0` AND `activeTab === "campaigns"` (component already handles internal visibility but gate by tab here).

### 2. `src/components/tables/CampaignTable.tsx`
In the Campaign Name cell (lines ~225–229), under the existing name/Input render a `<CampaignTagBar campaignId={campaign.id} isEdit={isEdit} />` so:
- **View mode** → renders read-only tag chips beneath the name (individual-level visibility from the flow).
- **Edit mode** → renders chips + "+ Tag" trigger opening `TagPopover` (individual-level tagging entry point from the flow).

Wrap the name + tag bar in a `<div className="space-y-1">` so layout stays clean.

### 3. Entry-point summary (after wiring)
- **Individual tagging**: every campaign row shows existing tags as chips; in Edit mode, click "+ Tag" under the name to add/create/remove via `TagPopover`.
- **Bulk tagging**: in Edit mode, select multiple rows via the row checkboxes → floating `CampaignBulkActionsBar` appears above the table with a "Tag" action that opens `TagPopover` and applies/removes tags to all selected campaigns at once.

### Out of scope
- No changes to `TagsContext`, `TagPopover`, `CampaignTagBar`, `CampaignBulkActionsBar`, or `mockTags` — they already implement the logic from the PDFs.
- No tagging on Ad Groups / Keywords / etc. — only Campaigns level for now, matching the existing component scope.
- No persistence beyond the in-memory `TagsContext` (matches current mock data approach).
