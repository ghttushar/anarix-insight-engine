# Living OS — Alerts as the Supervisory Surface

## Correction of the previous direction

The previous Living OS build (constellation of domains, proposal sheet, delegation face, timeline replay) is out. The Living OS surface is the **Aan Alerts system**, re-authored end-to-end under the Living OS philosophy. Alerts are not a feature inside Living OS — Alerts *is* Living OS. That is the supervisory loop: things happen, you judge them, they resolve.

## What gets deleted

Everything under `src/livingos/` and `src/pages/livingos/` created previously:

- `src/livingos/{shell,domains,proposals,delegation,memory,awareness,behaviors,agents,state,scenario.ts,tokens.css}`
- `src/pages/livingos/Workspace.tsx`
- Route entries in `src/App.tsx` for the constellation shell
- Sidebar "Switch to Living OS" entry (replaced by a new one pointing at the new route)

## What gets duplicated (Phase 1)

The entire Aan Alerts system is copied — not imported, not aliased — into a Living OS namespace so we can redesign freely without touching the working Anarix Alerts page. Source → destination:

```text
src/pages/Alerts.tsx                       → src/livingos/pages/Alerts.tsx
src/components/actions/*  (39 files)       → src/livingos/actions/*
src/state/actionsStore.tsx                 → src/livingos/state/actionsStore.tsx
src/lib/decisions/*                        → src/livingos/lib/decisions/*
src/data/{mockDecisions,mockMeetings,
  mockMeetingTasks,mockQuestions}.ts       → src/livingos/data/*
```

All internal imports rewritten to the `src/livingos/*` namespace. No behavior change in Phase 1 — the copy renders identically to `/alerts` today, just at `/livingos`. Existing Anarix Alerts stays untouched and continues working.

Sidebar profile menu gets a single entry: **"Switch to Living OS"** → `/livingos`.

Deliverable at end of Phase 1: `/livingos` renders the full Alerts experience (All / Needs approval / Morning brief / From meetings / FYI / Done tabs, Stack + Grid, filter, sort, expanded rows, action dropdowns, bulk bar, undo toast, keyboard shortcuts, meeting bundles, question cards) — pixel-identical to `/alerts` but running off duplicated code.

## What gets redesigned (Phase 2)

Now the philosophy lands. Every surface of the duplicated system is re-authored — no dashboards chrome, no SaaS taskbar, no generic KPI cards. The alerts *stay* (that's the functionality), but their material, voice, motion, and interaction model change.

### Shell & environment

- Remove `AppSidebar`, `AppTaskbar`, `MarketplaceSidebar`, breadcrumbs on `/livingos/*`. Living OS runs in its own shell with only three regions: **Ambient Strip** (top), **Workspace** (center — the alerts), **Context Dock** (bottom-right, quiet).
- Ambient Strip carries the daily **Standing sentence** ("You have 41 items asking for judgment. $47.2k in play. Aan is watching 6 more.") and the Aan breathing dot. No logo, no account switcher, no date range picker in view.
- Warm paper (light) / warm graphite (dark) tokens replace the existing white/gray card surfaces. Applied via a scoped `src/livingos/tokens.css` that only bites on `[data-livingos]`.

### Material, type, motion

- **Type:** Fraunces (authored voice — sentence, alert titles), IBM Plex Sans (body), IBM Plex Mono (numbers, metadata, timestamps). Replaces Satoshi/Noto within the Living OS scope only.
- **Color:** warm paper `#F5F1E8` / graphite `#1C1A17`. Ink `#1A1815`. Muted `#6B6558`. Dollar-impact colors become desaturated (`--los-loss`, `--los-gain`, `--los-info`) — no bright brand red/green.
- **Motion:** 260–450ms, cubic-bezier(0.2, 0, 0, 1). No bounces. Resolves to stillness. Expanded rows breathe open; approvals fade the row to a settled state.
- Grain overlay on the workspace surface, subtle.

### Alerts re-authored as judgment objects

Each alert row (currently `StackRow` / `GridCard`) becomes a **Judgment Object** with three affordances:

1. **Approve** (primary) — commits the proposed action.
2. **Modify** (secondary) — opens the existing `ActionChoiceRow` dropdown, re-styled as a quiet inline sheet under the row rather than a floating menu.
3. **Reject** — dismisses with reason capture (light, one-line).

Once approved, the alert enters the **12-second cooling window** (reused from previous Phase 2 work — same `CoolingWindow` primitive, restyled). Undo is a single sentence in the Ambient Strip, not a toast. If it lapses without undo, the row settles into the "Done" tab with a monospace timestamp and an "authored by you" byline.

### Tabs → Registers

The tab bar (All / Needs approval / Morning brief / From meetings / FYI / Done) is re-authored as **Registers** — quiet horizontal text links, no pill background, current register underlined with a hair-line. Counts render in mono, right-aligned.

- "Needs approval" → **Judgment**
- "Morning brief" → **Standing brief**
- "From meetings" → **From the room**
- "FYI" → **For your notice**
- "Done" → **Settled**

### Sort, filter, view mode

- Sort/filter/view controls move off a visible toolbar into a **Command bar** invoked by `⌘K` (Living OS never shows chrome it doesn't need). Filter still uses the existing `FilterSheet` logic, restyled.
- Stack vs Grid stays as the two view modes but re-labeled **Stream** vs **Field**. Stream is default; Field is a spatial layout where alerts cluster by dollar impact.

### Meeting bundles & questions

- `MeetingBundleCard` / `MeetingWorkspace` re-skinned as **Rooms** — a bundle is a room you enter; action items inside are individual judgment objects.
- `QuestionCard` becomes a **Question in the margin** — italic Fraunces, right-aligned, no button chrome. Answer inline.

### Aan presence

- No AI panel, no chat bubble. Aan speaks through:
  - The **Standing sentence** in the Ambient Strip (updates on approval).
  - **Marginalia** on alerts — a short authored line under the dollar impact ("This is the third time Winter Push has drifted this month.").
  - `⌥Space` opens a focused **Aan sheet** (reuses the existing `AanCopilotPanel` logic but restyled to the paper aesthetic and scoped to the current alert).

### What we keep from the existing system, unchanged in logic

- `actionsStore` state model — approve/reject/snooze/undo transitions, counts per tab
- Keyboard shortcuts (`useDecideKeyboard`) — J/K nav, A approve, X reject, U undo
- Undo window + `useUndoFor` hook
- Bulk selection + bulk action logic
- All mock data — same alerts, same meetings, same questions, same numbers

### What we drop

- The "Aan: Assisted" badge, "DESKTOP" badge, "Last synced" chip in the header
- The date-range picker at the top (Living OS doesn't have a date frame — it has *now*)
- The left icon rail (no cross-app navigation from Living OS)
- Grid view's rounded card shadows and colored left borders
- Toast notifications (replaced by Standing sentence updates)

## Technical notes

- All Phase 1 & 2 work is contained in `src/livingos/`. Zero edits to files outside that directory except `src/App.tsx` (route registration) and `src/components/layout/AppSidebar.tsx` (profile menu entry).
- Tokens scoped via `[data-livingos]` attribute on the shell root so paper/graphite/Fraunces never bleed into the rest of Anarix.
- Fraunces + IBM Plex loaded via `@import` in `src/livingos/tokens.css` (Google Fonts), only fetched when a Living OS route is active (the CSS file is imported only from `LivingOSShell`).
- The duplicated `actionsStore` keeps its own provider tree — Living OS Alerts and Anarix Alerts do not share state. Approving in one has no effect in the other. This is intentional: Living OS is its own room.

## Deliverables

**Phase 1 — Import (verbatim duplication)**
- `/livingos` route renders the full existing Alerts UI, identical to `/alerts`
- All alerts sub-components duplicated under `src/livingos/`
- Legacy Living OS constellation code removed
- Sidebar profile menu links to `/livingos`

**Phase 2 — Re-author (philosophy applied)**
- New shell (Ambient Strip + Workspace + Context Dock), no Anarix chrome
- Warm paper / graphite tokens, Fraunces + Plex typography, scoped
- Registers replace tabs; Stream/Field replace Stack/Grid
- Judgment objects with Approve / Modify / Reject + 12s cooling window
- Standing sentence in Ambient Strip; Aan speaks through marginalia
- `⌘K` command bar for sort/filter/view; `⌥Space` for focused Aan sheet
- Keyboard shortcuts and undo behavior preserved
