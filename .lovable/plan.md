# Plan — Website Pages, Live Aan, Real UI Embeds

## 1. Navigation cleanup
- `Navbar.tsx`: remove Pricing link (keep route reachable but hidden from nav).
- Verify all nav links point to `/website/...` and active states work in light + dark.

## 2. Aan launcher — fix overlap, make it feel alive
Problem: `WebsiteAanLauncher` (bottom-right) overlaps `ScrollToTop` button on Home.
- Stack vertically: ScrollToTop sits above launcher with 16px gap, both pinned bottom-right. Hide ScrollToTop on mobile when launcher open.
- Replace static button with live `AanMascot` (reuse `src/components/aan/AanMascot.tsx` — diamond/circle/cube states, cursor tracking, idle breathing) inside a 64px floating pill.
- Add subtle gradient ring (brand.primary → brand.accent) using AI-only gradient rule (≤400ms shimmer, single pass on idle every 8s).
- Label "Talk to Aan" appears on hover; mascot transitions: idle → listening (on open) → thinking (on stream) → idle.
- Same launcher persists across all `/website/*` pages.

## 3. Live Talk-to-Aan (already wired) — upgrade
- Keep `supabase/functions/website-aan` (Lovable AI Gateway, gemini-3-flash-preview, streaming).
- Update `WebsiteAanChat.tsx`:
  - Replace static avatar with mini `AanMascot` (state synced to streaming/idle).
  - System prompt expanded with concrete Anarix product knowledge (Profitability SKU P&L, Advertising AI+rule bidder, Dayparting, Rule Agents, AMC, Aan workspace, marketplaces, pricing tiers, integrations).
  - Suggested prompt chips: "What does Anarix do?", "How does Aan create rules?", "Show me the dayparting flow", "Pricing".
  - Markdown render via `react-markdown` (already in deps; add if missing).
  - 429/402 inline error banners (no toasts — toasts forbidden on website).

## 4. Aan AI page — full rebuild
`src/website/pages/AanAI.tsx`
- Hero: large `AanMascot` (200px) center-stage, headline "Aan. Intelligence by Anarix.", live state cycling (diamond → circle → cube → anchor on a 6s loop demonstrating moods).
- Section: "What Aan does" — 4 columns (Diagnose, Draft, Explain, Confirm) each with mini app screenshot.
- Section: "Aan in your workflow" — embed read-only snippets:
  - `InsightCard` from `src/components/insights/InsightCard.tsx` (mock data)
  - Mini conversation card mimicking `AanConversation` layout
  - Rule draft preview (static JSX matching `RuleAgents` styling)
- Section: "Talk to Aan now" — full-width embedded `WebsiteAanChat` (not floating, inline 600px).
- Section: "Safety first" — explains never-auto-execute, version history, audit trail (per project knowledge).

## 5. Documentation page — full rebuild
`src/website/pages/Documentation.tsx`
- Three-column layout: left sidebar nav (sticky), center content, right sticky `WebsiteAanChat` (docs-scoped system prompt).
- Sections (real content, ~300–500 words each):
  1. Quickstart
  2. Connecting Amazon
  3. Connecting Walmart
  4. Profitability & SKU P&L
  5. Advertising — AI+Rule bidder
  6. Dayparting
  7. Rule Agents (creating, previewing, applying)
  8. Impact Analysis
  9. AMC queries & audiences
  10. Reports & client portal
  11. Aan workspace (chat, audits, drafts)
  12. Settings & integrations
- Each section anchors via hash; sidebar highlights active section on scroll.
- Docs Aan chat system prompt grounded in same content + cites section names.

## 6. Company pages — populate with real content
- **About** (`company/About.tsx`): keep current shell, add real mission paragraph, 4 values rewritten in Anarix tone (per Section 10), founders blurb, `HallOfFame` component already exists — embed it.
- **Career** (`company/Career.tsx`): real role list (Sr Frontend Eng, Data Eng, Account Strategist, Product Designer), location/remote tags, "How we hire" 4-step timeline, mailto careers@anarix.ai.
- **Contact** (`company/Contact.tsx`): keep form layout, add real office (NYC), support hours, SLA note, link to docs + Aan.

## 7. Embed real app UI on Product pages
Create `src/website/components/AppUIEmbed/` with read-only wrappers (mock data, pointer-events disabled, scaled 0.85):
- `EmbedProfitabilityHero.tsx` — wraps `ProfitabilityHeroCard`
- `EmbedScatter.tsx` — wraps `ScatterPlotChart`
- `EmbedCampaignTable.tsx` — wraps `CampaignTable` (truncated to 5 rows)
- `EmbedRuleAgent.tsx` — static rule card matching `RuleAgents` styling
- `EmbedDayparting.tsx` — wraps `HourlyHeatmap`

Mount on:
- `Profitability.tsx` → replace mock dashboard with EmbedProfitabilityHero + EmbedScatter
- `Advertising.tsx` → add EmbedCampaignTable below feature grid
- `Automation.tsx` → add EmbedRuleAgent + EmbedDayparting
- `ManagedServices.tsx` → add EmbedProfitabilityHero (illustrative)

All embeds wrapped in browser-chrome card (existing pattern from current Profitability page) and labeled "Live from the Anarix app".

## 8. Hide app chrome on /website
Already done via `FloatingActionIsland.tsx` hiddenRoutes — verify `/website` prefix matches every subpath. Also ensure `<Toaster />` instances are not rendered inside `WebsiteLayout`.

## 9. Theme toggle
Already in navbar (`WebsiteThemeToggle`). Verify Periwinkle tokens applied via `website.css` for both modes; no custom hex in components.

## Open question
For embedded app components — I'll wrap real components with mock data and `pointer-events-none` so they render exactly like the app (richest demo). Confirm if you'd rather have static screenshots instead (lighter, but less impressive). I'll proceed with live read-only embeds unless you say otherwise.

## Files
**Edit**: `Navbar.tsx`, `WebsiteAanLauncher.tsx`, `WebsiteAanChat.tsx`, `ScrollToTop.tsx`, `AanAI.tsx`, `Documentation.tsx`, `company/About.tsx`, `company/Career.tsx`, `company/Contact.tsx`, `Profitability.tsx`, `Advertising.tsx`, `Automation.tsx`, `ManagedServices.tsx`, `supabase/functions/website-aan/index.ts` (expanded prompt).
**Create**: `src/website/components/AppUIEmbed/{EmbedProfitabilityHero,EmbedScatter,EmbedCampaignTable,EmbedRuleAgent,EmbedDayparting}.tsx`, `src/website/docs/sections.ts` (docs content data).
