

## Fix Universal Bar Order + BI Pages + Component Library Update + Clickable Affordances

### Problem
The universal bar (AppTaskbar) is NOT the first thing after the page title on detail pages. The Info Card sits above it. Per image-120: Title → Universal Bar → Info Card. Also, BI pages (Brand SOV, Keyword Tracker) need their controls moved INTO the universal bar. The Component Library needs new components added. Clickable items need visual affordance.

---

### 1. Fix Layout Order on Detail Pages

**CampaignDetail.tsx** — Current order: Breadcrumb → Title → InfoCard → AppTaskbar. Change to: Breadcrumb → Title → AppTaskbar → InfoCard.

**AdGroupDetail.tsx** — Same fix: move AppTaskbar above AdGroupInfoCard.

**CampaignManager.tsx** — Move "Show Impact" toggle into the AppTaskbar bar (as a child), not as a separate row below. Remove the separate chart controls border row. Keep "Hide Chart" as a small link next to the chart.

---

### 2. BI Pages — Move Controls into Universal Bar

**BrandSOV.tsx** (image-121): Currently has a custom filter bar. Replace with `<AppTaskbar>` containing:
- Keyword select, Range select, Position select, Frequency select, Brand select as `children`
- Region + Marketplace on far right (Region is a new select added to AppTaskbar for BI pages)

**KeywordTracker.tsx** (image-122): Add `<AppTaskbar>` with Region + Marketplace only. Move "Add Keyword" button below the bar.

**KeywordSOV.tsx, ProductSOV.tsx**: Add `<AppTaskbar>` with Marketplace only. Move Export button below bar.

---

### 3. Show Impact Toggle Position (Campaign Manager)

Move the Show Impact switch INTO the AppTaskbar as a child element, so it sits inline with Ad Type, Frequency, Date Range. Remove the separate bordered chart controls row. The "Hide Chart" link stays near the chart itself.

---

### 4. Clickable Affordance — Blue Underline or Tooltip

All navigable/clickable text elements (table row names that link to detail pages, breadcrumb links, editable values) get:
- `text-primary hover:underline cursor-pointer` for navigational links (campaign names, ad group names in tables)
- Or a `title` attribute tooltip explaining where clicking will go

**Files to update**:
- `CampaignTable.tsx` — campaign name cells: add `text-primary hover:underline`
- `AdGroupsTable.tsx` — ad group name cells: same
- `CampaignInfoCard.tsx` — already has `text-primary cursor-pointer hover:underline` on budget values (correct)
- `AdGroupInfoCard.tsx` — same pattern for bid values
- Breadcrumb links in detail pages — already have `hover:underline` (verify)

---

### 5. Component Library Updates

Add new sections to `ComponentLibrary.tsx` for recently created components:
- **AdGroupInfoCard** — static mockup of the horizontal metadata strip
- **CampaignInfoCard** — static mockup
- **AddProductAdsModal** — static anatomy (left panel + right staging area)
- **AddKeywordModal** — static anatomy
- **Create Schedule** (Day Parting) — static anatomy of the schedule creation panel
- **Item Breadcrumb** — example of `Advertising > SP > Campaign > Ad Group`

---

### Summary of Files

| File | Change |
|---|---|
| `AdGroupDetail.tsx` | Swap order: AppTaskbar above InfoCard |
| `CampaignDetail.tsx` | Swap order: AppTaskbar above InfoCard |
| `CampaignManager.tsx` | Move Show Impact into AppTaskbar children, remove chart controls row |
| `BrandSOV.tsx` | Replace custom filter bar with AppTaskbar + children controls |
| `KeywordTracker.tsx` | Add AppTaskbar with Marketplace, move Add Keyword below |
| `KeywordSOV.tsx` | Add AppTaskbar with Marketplace |
| `ProductSOV.tsx` | Add AppTaskbar with Marketplace |
| `CampaignTable.tsx` | Add `text-primary hover:underline` on campaign name links |
| `AdGroupsTable.tsx` | Add `text-primary hover:underline` on ad group name links |
| `ComponentLibrary.tsx` | Add 6 new component sections at end |

