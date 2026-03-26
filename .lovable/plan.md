

## Multi-Phase Fix: Day Parting, Toolbar, Deltas, Info Cards, KPIs, Floating Island, Pagination

This is broken into 4 phases due to scope. Each phase will be verified before moving to the next.

---

### Phase 1: Fix Create Day Parting + Panel Scroll + Toolbar Redesign

**1a. Fix Create Day Parting Rule** — The `setDataPanel("createSchedule")` call works, but the `CreateSchedulePanel` renders inside pages that may not include it as a sibling. Must ensure `CreateSchedulePanel` is rendered in `HourlyData.tsx` (and `ScheduledJobs.tsx`) as a flex sibling like `CreateCampaignPanel` is in `CampaignManager`.

**1b. Independent scroll on ALL right panels** — Already using `ScrollArea` in `CreateSchedulePanel`. Verify all panels (`ProductDetailPanel`, `PeriodBreakdownPanel`, `CreateCampaignPanel`) use the same pattern: `flex h-full flex-col` with `ScrollArea className="flex-1 min-h-0"`.

**1c. Toolbar button hierarchy redesign** — New universal order (left to right):
1. Create button (if applicable)
2. Upload button (with drag-drop dialog)  
3. Search
4. Delta toggle (redesigned — just icon toggle, no box/switch)
5. Filter (redesigned active chips)
6. Columns
7. Export
8. Edit (with save confirmation dialog on deactivate)

**1d. Delta toggle redesign** — Replace the bordered box+switch with a simple icon toggle button (like the Insights button). When active: highlighted. Controls ONLY the table below it, not page-wide.

**1e. Delta toggle on EVERY table toolbar** — Add `showDeltas`/`onShowDeltasChange` props to every page that uses `DataTableToolbar`.

**1f. Active filter chips redesign** — Replace raw text dump with cleaner pills: `Field: Value` with subtle background, proper spacing, individual remove buttons.

### Phase 2: Campaign Detail Info Cards + Edit Modals + KPI Strip

**2a. CampaignInfoCard redesign** — Match image-136/137: Show Campaign Name with SP/MANUAL badges, Status (ENABLED badge), Daily Budget (clickable), Bidding Strategy (clickable "Up & Down"), Schedule (date range). Edit button opens a Campaign Settings dialog (image-137).

**2b. Campaign Settings Dialog** — Modal with: Campaign Name input, Campaign ID (read-only), Type of Ad (SP badge), Type of Targeting (AUTO badge), Status dropdown, Start/End Date pickers, Budget input, Bidding Strategy radio (Dynamic down only / Dynamic up and down / Fixed bids with descriptions), Placement Bids section (Top of Search %, Product Pages %, Rest of Search %).

**2c. AdGroupInfoCard redesign** — Match image-138: Ad Group Name, Status (ENABLED), Default Bid (clickable), Keyword Targeting (Bidded Value), Min. Bid, Max. Bid, TRoAS. Edit opens Ad Group Settings dialog (image-139): AdGroup Name, AdGroup ID, Status dropdown, Default Bid input.

**2d. InlineKPIStrip to show 5 items** — Expand from 4 to 5 KPI cards. Mock data should include varied digit counts: 1-digit, 5-digit, 6-digit, 7-digit, 7-digit+suffix (K/M/T) to demonstrate formatting at different scales.

**2e. KPI data matching image-135** — Each KPI shows: label, value, delta badge (colored arrow + percentage), "Prev 7 days: $X" subtitle.

### Phase 3: Profitability Table Redesign + Pagination Everywhere + Products/Orders

**3a. ProductsPnLTable redesign** — Match the standard table style used everywhere else: `rounded-lg border`, standardized padding (`px-4 py-2.5`), subtle column dividers, consistent with CampaignTable styling. Orders view matches image-132: card-style rows with Order ID, country flag, date/time, status badge, price, item count, expandable chevron.

**3b. Pagination on EVERY table** — Add `CampaignTablePagination` (rename to `TablePagination`) to ALL table components across the app: AdGroupsTable, ProductAdsTable, KeywordTargetingTable, SearchTermsTable, PageTypeTable, PlatformTable, ProductTargetingTable, ProductsPnLTable, RegionalTable, ScheduledJobsTable, HistoryTable, BrandCoverageTable, KeywordTrackerTable, ImpactTable.

**3c. Total row with deltas** — Match image-133: Total row at bottom of tables showing summed values with delta badges beneath each total.

### Phase 4: Floating Island Drag + Buttons Audit + Create Buttons in Toolbar

**4a. Floating Island draggable** — Replace X close button with a drag handle icon (GripVertical). Implement drag-and-drop positioning using mouse events, persist position in state. Remove close/reopen logic entirely.

**4b. Move ALL create buttons into table toolbar** — Create Campaign, Create Schedule, Add Keywords, Add Product Ads — all move from standalone buttons above tables into the toolbar's `leftContent` slot as the first button.

**4c. Edit mode save confirmation** — When user clicks Edit toggle to deactivate (going from edit → view), show a confirmation dialog listing changes made with "Save" / "Discard" options.

**4d. Upload button with dialog** — New upload button in toolbar that opens a dialog with drag-and-drop zone, file list showing selected files, and upload/cancel actions.

**4e. Full audit** — Verify every screen has: toolbar with correct buttons, pagination, delta toggle, working create/edit flows, consistent spacing.

---

### Files Summary (across all phases)

| File | Phase | Change |
|---|---|---|
| `DataTableToolbar.tsx` | 1 | Reorder buttons, redesign delta toggle, redesign filter chips, add upload button, add create slot, edit confirmation |
| `HourlyData.tsx` | 1 | Add `CreateSchedulePanel` as flex sibling |
| `ScheduledJobs.tsx` | 1 | Add `CreateSchedulePanel` as flex sibling, move Create into toolbar |
| `CampaignManager.tsx` | 1,4 | Move Create Campaign into toolbar, add delta toggle, 5 KPIs |
| `CampaignDetail.tsx` | 2 | Update KPI count to 5, add Campaign Settings dialog |
| `AdGroupDetail.tsx` | 2 | Update KPI count to 5, add Ad Group Settings dialog |
| `CampaignInfoCard.tsx` | 2 | Redesign to match image-136, add edit dialog trigger |
| `AdGroupInfoCard.tsx` | 2 | Redesign to match image-138, add edit dialog trigger |
| `CampaignSettingsDialog.tsx` | 2 | **NEW** — Campaign edit modal (image-137) |
| `AdGroupSettingsDialog.tsx` | 2 | **NEW** — Ad Group edit modal (image-139) |
| `InlineKPIStrip.tsx` | 2 | Support 5 items, add "Prev" subtitle |
| `ProductsPnLTable.tsx` | 3 | Redesign to match app table style, add pagination |
| `TablePagination.tsx` | 3 | Rename from CampaignTablePagination, make generic |
| `AdGroupsTable.tsx` | 3 | Add pagination, delta toggle support |
| `ProductAdsTable.tsx` | 3 | Add pagination, delta toggle support |
| `KeywordTargetingTable.tsx` | 3 | Add pagination, delta toggle support |
| `SearchTermsTable.tsx` | 3 | Add pagination, delta toggle support |
| `ProductTargetingTable.tsx` | 3 | Add pagination |
| `PageTypeTable.tsx` | 3 | Add pagination |
| `PlatformTable.tsx` | 3 | Add pagination |
| `ScheduledJobsTable.tsx` | 3 | Add pagination |
| `HistoryTable.tsx` | 3 | Add pagination |
| `FloatingActionIsland.tsx` | 4 | Replace X with drag handle, implement draggable |
| `UploadDialog.tsx` | 4 | **NEW** — Drag-drop upload modal |
| All page files | 1-4 | Wire delta toggle, pagination, toolbar buttons consistently |

