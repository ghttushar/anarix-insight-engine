
# Aan Autonomous Operations — Mockup Plan

Transform Aan from a reactive chat assistant into a visible autonomous coworker that watches the business, proposes actions with quantified impact, and executes on approval. Scripted deterministic story by default with a "Live mode" toggle; merged Aan Inbox replaces Insights + Notifications panels; every action supports inline quick-approve plus a "View details" artifact panel with the full Input → Value → Action → Execution → Fulfillment lifecycle.

---

## Phase 1 — Aan Inbox + Autonomous Presence Foundation

Goal: give Aan a visible pulse across the app, replace the two existing right panels with a single Aan-branded inbox, and ship the trigger console so every scenario is demoable on demand.

**Scope**
- **Aan Inbox panel** (`src/components/aan/inbox/AanInboxPanel.tsx`) — replaces `InsightsPanel` and `NotificationsPanel`. Sections: *Needs your approval*, *Aan is watching*, *Executed today*, *Briefing*. Filter chips: Critical / Opportunity / FYI / Executed. Each card = a lifecycle event with severity dot, marketplace chip, impact estimate, and inline Approve / Reject / Modify buttons + "View details" link.
- **Floating Action Island** — collapse bell + lightbulb into a single Aan glyph with unread badge. Keep existing shortcut behavior; wire to `openDataPanel("aan-inbox")`.
- **Autonomous presence strip** — thin status row inside the Inbox header: "Aan is in Staples Review • listening to #ops-mount-it • scanning 4,231 SKUs". Rotates every 6s in live mode, static in scripted mode.
- **Morning Briefing card** — persistent top card in the Inbox rendering the "Good Morning" narrative (Mount-It $4,500 loss, MI-212 OOS, Office Essentials promo failure, Desk Accessories opportunity, 10 AM Staples review, 6 unread emails). Expandable to full artifact.
- **Trigger Console** (`/settings/aan-triggers` + Cmd+K entries) — dev-mode panel listing every scenario with a "Fire event" button + copyable keyword phrase. Also exposes the **Live mode** toggle (stored in `AanContext`).
- **Aan event store** (`src/components/aan/AanEventContext.tsx`) — client-only state holding the timeline of events, their lifecycle stage (`detected | analyzing | awaiting_approval | executing | fulfilled | rejected`), and mock execution logs. Powers Inbox, artifact viewer, and briefing.
- **Delete** `NotificationsPanel.tsx` and `InsightsPanel.tsx` usage from Floating Island; keep files only if referenced elsewhere (delete if not).

**Deliverable state**: user opens app → sees single Aan glyph with "7" badge → clicks → Inbox opens with morning briefing + 5 pending approvals + 3 executed items. Trigger console can replay any scenario.

---

## Phase 2 — 10 Automation Scenarios with Full Lifecycle

Goal: every scenario from the PRD is fully mocked with Input → Value → Action → Execution → Fulfillment, inline quick-approve, and a rich artifact panel showing simulated API calls, before/after diffs, and audit trail.

**Scenarios shipped** (each = an event template in `src/data/mockAanScenarios.ts` + optional custom artifact renderer):

Campaign Management
1. **Budget Optimization** — SP | Bamboo Queen 90% spent by 2 PM → +$45 budget, projected +$180 sales
2. **Keyword Promotion** — 3 auto-campaign search terms graduate to manual with suggested bids
3. **Event Campaign Creation** — Prime Day eligible SKUs → scheduled campaign draft
4. **Launch Coverage** — 2 new SKUs unadvertised → create SP campaign, projected $840/wk
5. **Loss-Making Product** — SKU MI-088 sustained −12% margin → pause vs optimize choice
6. **Placement Optimization** — Top-of-search +32% ROAS → +18% bid modifier
7. **Daypart Optimization** — 2–5 AM window wasting $120/day → schedule update

Retail Management
8. **Listing Suppression** — SKU X suppressed for image compliance → auto-fix or open case
9. **Buy Box Recovery** — Lost on 2 SKUs, competitor $0.42 lower → pricing update
10. **Review & Rating** — 3.8★ trend on hero SKU → summarize feedback + create Slack escalation

**Artifact Viewer** (`AanArtifactViewer` extension: `ExecutionArtifact` renderer)
- **Input** section — the signal (metric, threshold breach, evidence rows)
- **Value** section — impact chart, confidence bar, reasoning bullets, sources chips (Amazon Ads API, PowerBI, Slack)
- **Action** section — recommendation form, editable fields (budget slider, bid delta, price), Approve / Reject / Modify / Set as automation policy
- **Execution** section — animated step list (Validate permissions → Call Amazon Ads API → Verify → Record) with simulated latency + success/fail states
- **Fulfillment** section — before/after diff card, audit log entry, "Undo" (scripted mode only), share to Slack/Teams/Email chips

**Inline quick approve** — Approve button on the Inbox card runs the same execution timeline collapsed into the card (skeleton → checkmark → "Applied • View details").

**Trigger keywords** (typed into Aan input OR clicked in Trigger Console — see chat reply for full list):
`trigger budget-optimization`, `trigger keyword-promotion`, `trigger event-campaign`, `trigger launch-coverage`, `trigger loss-making`, `trigger placement-opt`, `trigger daypart`, `trigger suppression`, `trigger buybox`, `trigger reviews`, `trigger morning-brief`, `trigger meeting-summary`, `trigger workspace-search`

---

## Phase 3 — Workspace Intelligence Surfaces (7thGear / Viktor parity)

Goal: sell the "autonomous employee" story. Aan visibly attends meetings, watches Slack/email, correlates workspace context with business events, and offers automation policies so approved patterns run hands-free.

**Scope**
- **Aan Feed** (`/aan/feed`) — timeline view of Aan's day: "9:02 joined Staples Review", "9:14 captured decision: relist SKU X by Fri", "9:31 detected MI-212 OOS", "9:33 paused 4 campaigns pending approval". Each entry links to its artifact.
- **Meeting Intelligence card type** — post-meeting summary with decisions, action items (owner/due), risks. Renders in Inbox + Feed. Scripted: Staples Review 10 AM produces summary at 10:45.
- **Workspace context chips** on every scenario card — "Discussed in #ops-mount-it 2h ago", "Mentioned in Dorothy's email Tue", "Related to Monday's decision". Click opens quoted context in artifact viewer.
- **Universal Workspace Search** — new Aan input mode: typing `find:` or hitting `/` in Aan surfaces cross-source results (Slack, Email, Meetings, Amazon, Walmart) with source badges. Fully mocked corpus in `src/data/mockWorkspaceCorpus.ts`.
- **Automation Policies** (`/aan/policies`) — list of user-approved rules Aan runs without asking again ("Auto-approve budget increases <$50 on campaigns >2× ROAS"). Create-from-approval flow: after approving a scenario, offer "Always do this when …". Toggle on/off per policy.
- **Connected Systems panel** — visual "brain" showing all connectors (Amazon Ads, Walmart, SP-API, Slack, Teams, Gmail, Calendar, 7thGear, PowerBI, Anarix internal) with green pulse when Aan is actively pulling context. Purely visual mockup.
- **Autonomy indicator** — small pill in AppTaskbar next to ViewBadge: "Aan: Advisory" / "Aan: Assisted" / "Aan: Autonomous (3 policies)".

---

## Technical Section

**New files (grouped)**
- `src/components/aan/inbox/` — `AanInboxPanel.tsx`, `AanInboxCard.tsx`, `AanInboxFilters.tsx`, `AanPresenceStrip.tsx`, `MorningBriefingCard.tsx`
- `src/components/aan/execution/` — `ExecutionArtifact.tsx`, `LifecycleStages.tsx`, `ExecutionStepList.tsx`, `BeforeAfterDiff.tsx`, `AuditLogEntry.tsx`, `InlineApprovalControls.tsx`
- `src/components/aan/feed/` — `AanFeedTimeline.tsx`, `MeetingSummaryCard.tsx`, `WorkspaceContextChip.tsx`
- `src/components/aan/policies/` — `PoliciesList.tsx`, `PolicyEditor.tsx`, `CreatePolicyFromApprovalDialog.tsx`
- `src/components/aan/systems/ConnectedSystemsPanel.tsx`
- `src/components/aan/AanEventContext.tsx` — event store, lifecycle transitions, live-mode timer
- `src/components/aan/AanAutonomyBadge.tsx`
- `src/data/mockAanScenarios.ts` — 10 scenario templates with all lifecycle payloads
- `src/data/mockWorkspaceCorpus.ts` — Slack/Email/Meeting/Doc mock corpus
- `src/data/mockAanFeed.ts`, `src/data/mockAanPolicies.ts`
- `src/pages/aan/Feed.tsx`, `src/pages/aan/Policies.tsx`
- `src/pages/settings/AanTriggers.tsx`

**Modified**
- `src/features/creative/FloatingActionIsland.tsx` — collapse bell + lightbulb into single Aan glyph, wire unread badge to `AanEventContext`
- `src/contexts/ActivePanelContext.tsx` — add `"aan-inbox"` panel key, deprecate `"insights"` and `"notifications"`
- `src/components/aan/AanArtifactViewer.tsx` — add `ExecutionArtifact` case, keep existing renderers
- `src/components/aan/AanContext.tsx` — add `liveMode` toggle, expose `fireScenario(id)`, integrate `AanEventProvider`
- `src/components/aan/AanInput.tsx` — parse `trigger <id>` and `find:` prefixes
- `src/App.tsx` — routes for `/aan/feed`, `/aan/policies`, `/settings/aan-triggers`
- `src/components/layout/AppTaskbar.tsx` — mount `AanAutonomyBadge`
- `src/features/creative/CommandPalette.tsx` — add entries for every scenario trigger + Live mode toggle

**Deleted**
- `src/components/insights/InsightsPanel.tsx` (and index re-export)
- `src/components/notifications/NotificationsPanel.tsx`
- Any references in `AppLayout` / Floating Island

**Design tokens** — reuse Periwinkle system. AI gradient permitted only on Aan glyph, presence strip accent underline, and lifecycle stage indicator. Green/red/yellow reserved for severity + before/after diff only. Motion capped at 240ms per rules; execution step ticks use opacity fade + 4px shift.

**State scope** — everything in-memory via `AanEventContext`. No DB, no edge functions, no Supabase changes. Live mode uses a single `setInterval` (6s tick) gated by the toggle; scripted mode uses static seeded arrays. This is a mockup — no real API calls anywhere.

**Safety** — every card that is not FYI requires explicit Approve. Reject and Modify never mutate mock state destructively (soft-delete + undo). No auto-execution unless a policy explicitly says so, matching the "autonomous employee, never acts without approval" principle.

**Out of scope (call out)**
- Real integrations (7thGear, Amazon Ads API, Slack API). Everything is UI mockup with simulated latencies.
- Mobile parity for the new Feed / Policies pages — Phase 1 Inbox will work on mobile via existing `MobileRightSheet`; other new surfaces get desktop-only in this scope.
- Persistence across reloads (scripted state resets on refresh; live mode restarts from t=0).

Once you approve, I'll also drop the full trigger keyword list + a step-by-step demo script into chat so you can walk stakeholders through every scenario.
