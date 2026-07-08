# Alerts v4 — Alignment, Actions, Dates, Meetings, Seed

Scope is UI + mock data only. No changes to `actionsStore` shape or panel routes.

## 1. Action buttons — aligned + split dropdown

Rebuild `ActionChoiceRow.tsx` as a **fixed-slot action bar** used identically by StackRow, GridCard, and the AlertDetailPanel footer:

```
[ Primary verb ▾ ]   [ Reject ]   [ View more ]
```

- Fixed heights (h-9), fixed order, right-aligned in Stack, left-aligned in Grid, but same component so widths align across every row/card.
- **Primary is a split button**: click = run `actionVerb`; caret opens a `DropdownMenu` with:
  - 2–3 alternate verbs synthesized per decision (e.g. Reallocate → "Reallocate 20%", "Reallocate 50%", "Reallocate full"). A small `deriveAlternateActions(d)` helper produces them from `actionVerb` + `valueKind` (no data-model change; falls back to a single option if nothing sensible).
  - Divider
  - **"Write custom action…"** → opens the right panel in `custom` mode (existing flow).
- **Remove "Aan handles it" everywhere**: `ActionChoiceRow`, `AlertDetailPanel` footer, `BulkBar`, `BulkActionBar`, `DecisionRow`, `DecisionCard`. `delegateToAan` remains in the store and is invoked only when the user submits a "Write custom action…" instruction (that is the delegation path now).
- **"Ask Aan" moves into "View more"**: remove the standalone `AskAanButton` from row/card surfaces. Inside the right panel it stays as the `ask_aan` tab, and "View more" opens the panel on the `detail` tab with an "Ask Aan" affordance in the header.

Bulk bar mirrors the same three slots: `Approve all ▾` (dropdown offers "Approve all as-is" / "Write custom instruction for all"), `Reject`, `Clear`.

## 2. Custom date filter in AppTaskbar

The taskbar already renders a date range picker on analytical routes. Extend it so `/alerts` shows the same picker (presets + custom range, matching the uploaded reference), and wire the selected range into `Alerts.tsx` via `FilterContext` (or a local `alertsDateRange` state if FilterContext is scoped elsewhere). Filter the `pool` by `d.createdAt` before tab filtering.

## 3. Meeting workspace — fix layout & logic

Match the attached reference (`image-215.png`):

- **Header row**: purple `M` avatar + meeting title + subtle timestamp/duration on the same line. Remove the duplicate title currently rendered under the eyebrow.
- **Attendee row** directly under header: colored initial chips (`AttendeePill`) + role labels, e.g. `DC · Dorothy Chen · Staples buyer`.
- **3-stat strip**: Tasks / Open (primary color if > 0) / Committed (value pill). Already close — keep, restyle to match reference borders.
- **Summary** section with inline "Transcript excerpt" disclosure.
- **Action items** list: multiple rows, each with:
  - Left value chip (Protect $12k / Info / +$2.2k /mo / -$480 1×)
  - Task label + assignee
  - Right actions: `Mark completed` (primary) · `Write custom action` (was "You take care of it") · dismiss `×` · expand `▾`
  - Completed rows: strikethrough + green `COMPLETED` state, no action buttons.
- **"Mark all completed"** button top-right (replaces "Record all open").
- Rewording: **"You take care of it" → "Write custom action"** across `MeetingTaskRow` and anywhere else it appears.
- Ensure `tasksForBundle` returns ≥ 3 items for the two visible meetings so "multiple action items" always renders (seed extras in `mockMeetingTasks.ts` if needed).

## 4. Seed data — Morning brief & From meetings ≥ 10 each

In `mockDecisions.ts`:

- **Morning brief** = `status === "open"` created between 22:00 prior day and 08:00 today. Add ~8 new open decisions with `createdAt` set via `Date.now()` anchored to today 02:00–07:30 (staggered), covering realistic overnight events: buybox flips, budget exhaustion overnight, refund spikes, competitor price drops, inventory alerts, Vine triggers, negative review, keyword surge. Reuse existing decision shape.
- **From meetings** = `source === "meeting"` OR `meetingRef` set. Add ~8 new decisions with `source: "meeting"` and `meetingRef` pointing at the two existing bundles in `mockMeetings.ts`. Each with realistic post-meeting commitments (pricing memo, forecast refresh, compliance doc, creative refresh, etc.).
- Ensure resulting tab counts: All ≈ 40+, Needs approval ≈ 25+, Morning brief ≥ 10, From meetings ≥ 10, FYI ≥ 3, Done ≥ 8.

## 5. Files touched

- Rewrite: `ActionChoiceRow.tsx`, `AlertDetailPanel.tsx` (footer), `BulkBar.tsx`, `MeetingWorkspace.tsx`, `MeetingTaskRow.tsx`, `StackRow.tsx`, `GridCard.tsx`.
- Extend: `AppTaskbar.tsx` (enable date picker on `/alerts`), `Alerts.tsx` (consume date range, drop `AskAanButton` from rows), `mockDecisions.ts` (+~16 entries), `mockMeetingTasks.ts` (top-up), tiny `deriveAlternateActions` util under `src/lib/decisions/`.
- Untouched: `actionsStore.tsx`, `selectionStore.tsx`, panel routes, tabs.ts filter logic.

## 6. Verification

- Every row/card: primary/split, reject, view-more align in same x-positions across Stack and Grid.
- No "Aan handles it" string anywhere in `src/components/actions/**` or `src/pages/Alerts.tsx`.
- Taskbar date picker on `/alerts` filters visible alerts.
- Meeting workspace renders attendees, single title, ≥3 action items per meeting, "Write custom action" label.
- Tab counts: Morning brief ≥ 10, From meetings ≥ 10.
