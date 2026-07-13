
# Living OS Blueprint v1.0

*The single source of truth. No code. No routes. No screens. Just what exists, why, and how it holds together.*

**Rules of engagement for this document:**
1. Previous ideas are editable. Where the Blueprint departs from earlier documents, the departure is named and defended.
2. Confidence is labeled everywhere: **Stable** (survives across scenarios and roles), **Working** (likely correct but under-tested), **Experimental** (must be prototyped before commitment).
3. Where multiple credible answers exist, options are presented with tradeoffs and a recommendation.

**One structural correction that runs through the entire Blueprint.** The Creative Director's pushback on *Concern* is accepted and generalized: the object must exist when nothing is wrong. Living OS is layered as:

> **Domain → State (Concern is one) → Standing (personal posture across all Domains)**

The primary object is the **Domain** (working name — see §1.1 for candidates). *Concern* is one of a Domain's states, alongside *At rest, Watching, Committed, Recovering, Dormant.* This dissolves the ceiling the previous framing had hit.

---

## 1. Complete Object Map

Ten objects, ranked by structural centrality. Anything below the line is deferred to v1.1.

### 1.1 Domain *(primary object — replaces "Concern" as the identity)*

**Definition.** A named, persistent, ownable slice of the business that has its own reality regardless of whether anything currently requires attention. *Advertising* is a Domain. *Cash* is a Domain. *A specific supplier relationship* is a Domain. *A single campaign* is a Domain. Domains nest; the whole business is itself a Domain.

**Purpose.** To give the principal (and every other role) a stable, remembered, spatial thing to inhabit — the referent of every gesture, delegation, contest, and share.

**Responsibilities.** Carry its own current State, its own Standing contribution, its own Evidence chain, its own delegation policy, its own authored proposals when any exist, and its own place in the Relationship Graph.

**Lifecycle.** Domains are declared (by the org, or auto-declared by Aan when a new referent stabilizes), inhabited (used, arranged, delegated), can be split, merged, retired, or archived, and are never deleted (Memory keeps them retrievable).

**Relationships.** Composes upward into parent Domains; contains Signals, Understandings, Proposals, Actions, Memory (§5).

**Permissions.** Every Domain has an owner (role or human), a delegation policy, a visibility set (which other roles can inhabit or observe it), and an authority ladder (§6).

**Behaviors.** Firmness (firm / soft / watching / dormant), tilt (magnitude of recent change), depth (how deep the principal is currently standing inside it), and emotional temperature (calm / attentive / alarmed — §10).

**Emotional role.** *"The part of my business I am responsible for."* The felt sense of *place*.

**Confidence: Working.** Object shape is stable; the *name* is deliberately not locked. Naming candidates to prototype in parallel: **Domain, Territory, Ground, Charge, Post, Watch, Beat, Concern-as-state.** Recommendation: proceed with *Domain* internally and test all seven candidates in the naming toggle on the first prototype (E1 in §14).

### 1.2 State *(replaces "firmness" as its own object)*

**Definition.** The current condition of a Domain. States are named, mutually exclusive, and observable at a glance.

**States (canonical set):** *At Rest, Watching, Attention, Committed, Recovering, Dormant.* Aan may also mark a Domain *Uncertain* — a modifier orthogonal to the six, expressing calibrated humility.

**Purpose.** To let the principal read the health of every Domain without reading numbers.

**Emotional role.** *"How this part of my business feels right now."*

**Confidence: Working.**

### 1.3 Standing

**Definition.** A person's *posture across their Domains* — the integrated, personal, continuously-maintained sense of where they stand.

**Not an object on the surface.** Standing is *felt*, not clicked. It is the sum of Domain States, weighted by the person's authority and delegation. No two people in the same org have the same Standing.

**Emotional role.** *"Where I stand."*

**Confidence: Stable.**

### 1.4 Signal

**Definition.** The smallest observed change in the world before interpretation (marketplace metric shift, calendar event, Slack message, email, external API delta, human input).

**Lifecycle:** *Detected → Corroborated → Contextualized → Interpreted → Resolved (into a Domain's State) → Archived (into Memory).* Every stage is a first-class Entry (see §1.7).

**Confidence: Stable.**

### 1.5 Understanding

**Definition.** A causal claim linking one or more Signals to a change in a Domain, with confidence and evidence attached. An interpreted Signal in isolation is a claim; an Understanding is a claim *with a because*.

**Confidence: Stable.**

### 1.6 Proposal

**Definition.** A specific, executable, reversible course of action authored on a Domain, in response to an Understanding, by an authorized author (Aan or a rule). Comes with tradeoffs, alternatives, and a preview of the resulting Standing.

**Not an "AI suggestion."** A Proposal is a first-class artifact with authorship and provenance.

**Confidence: Stable.**

### 1.7 Entry *(the substrate — invisible to users)*

**Definition.** The immutable ledger record. Every Signal, Understanding, Proposal, Action, Delegation, Contest, and human Judgment becomes an Entry.

**Purpose.** The only source of truth. Everything else in the system is a *view over Entries*.

**Confidence: Stable. Never surfaces as a user object.**

### 1.8 Judgment

**Definition.** A human act that resolves a Proposal into an Action (approve / modify / reject / defer / contest / delegate). Judgments originate from humans, always. Delegations execute prior Judgments; they do not originate new ones.

**Confidence: Stable.**

### 1.9 Delegation

**Definition.** A ruleful transfer of a specific class of future Judgments from a person to Aan (or from one person to another), with scope, ceiling, duration, and confidence floor.

**Not settings.** A Delegation lives *on* the Domain it delegates over, as a face of that Domain.

**Confidence: Stable.**

### 1.10 Memory

**Definition.** The causally-linked, backward-traversable graph of everything that has happened, retrievable only by descent from a current Domain.

**Not a log page.** Memory is never a destination; it is what emerges when the principal descends into a Domain's past.

**Confidence: Stable.**

**Objects deliberately not included in v1.0 (deferred to v1.1):** Goal, Plan, Simulation, Scenario, Client (as an external audience), Report (a shareable snapshot of a Domain — probably a *rendering*, not an object). Each earns its place only if a prototype demands it.

**Objects explicitly rejected:** *Dashboard, Page, Panel, Card, Widget, Alert, Notification, Tab, Modal, Assistant.* Each is a rendering artifact of prior software eras, not an object of Living OS.

---

## 2. Capability Map

Capabilities are *what the system can do*, independent of features. Living OS launches with **eighteen** capabilities, grouped into six families. Each has a stated dependency chain so we know what must exist before what.

**Observation family**
- **Observe** — ingest Signals from any connected source. *Depends on:* connectors. *Extends into:* every industry.
- **Monitor** — sustain observation continuously without the human present.
- **Watch** — hold attention on a specific Domain the human has flagged.

**Understanding family**
- **Understand** — form causal chains from Signals into Understandings.
- **Explain** — expose the causal chain of any Understanding at any depth.
- **Predict** — extend an Understanding forward in time with stated confidence.
- **Simulate** — answer *"what if I did X?"* without executing.

**Decision family**
- **Recommend** — author Proposals from Understandings.
- **Delegate** — receive, hold, and revoke authority for future Judgments.
- **Coordinate** — reconcile Proposals across roles when multiple authorities intersect.

**Execution family**
- **Execute** — carry out approved Proposals against connected systems.
- **Recover** — reverse Actions within their cooling window; degrade gracefully when reversal is no longer possible.
- **Audit** — surface who did what, when, on what basis, on demand.

**Memory family**
- **Remember** — persist every Entry immutably, retrievable by descent.
- **Learn** — adjust future Understandings and thresholds from human Judgments and outcomes.

**Communication family**
- **Communicate** — express Standing, Understandings, and Proposals in honest natural language.
- **Present** — render a Domain as a shareable snapshot for humans outside Living OS.
- **Collaborate** — let multiple roles inhabit, contest, and co-author on the same Domain.

Every capability composes across industries by changing only its *Signals and Actions*, never its shape.

**Confidence: Stable across all eighteen.** *Coordinate* and *Simulate* are the two most experimentally-loaded and should be prototyped earliest (§14).

---

## 3. Feature Inventory *(map of today's Anarix into Living OS)*

Every existing feature keeps its function, changes its form. Nothing is lost; nothing is duplicated. Grouped by Domain family they resolve into:

**Advertising Domain (canonical parent)**
Campaign Manager, Ad Group Detail, Product Ad Detail, Rule Agents / Rule Creation, Applied Rules, Anomaly Alerts, Budget Pacing, Search Harvesting, Targeting Actions, Impact Analysis, Creative Analyzer → **all become faces of the Advertising Domain**, reached by descent. *Alerts* dissolve into State changes on nested Domains. *Rules* become **Delegations** on their scope. *Impact Analysis* becomes a **Simulate** capability invoked on any Domain.

**Profitability Domain**
Dashboard, Trends, P&L, Geographical, Unified P&L → faces of the Cash Domain and its children (per product, per region, per marketplace).

**Business Intelligence Domain**
Brand SOV, Keyword SOV, Product SOV, Keyword Tracker, Competitor Pricing → **Watch** capabilities attached to Customer / Market Domains.

**Catalog Domain**
Products, Inventory Ads → Inventory Domain, child of Operations.

**Reports Domain**
Client Portal, Automated Reports → **Present** capability applied to any Domain; report becomes a *snapshot rendering*, not a place.

**Meetings & Day Parting**
Meetings → **Meeting Intelligence** capability that authors Understandings and Proposals on affected Domains automatically. Day Parting → schedule-shaped Delegations on Advertising sub-Domains.

**AMC**
Instances, Queries, Audiences → **Simulate** and **Understand** capabilities over the Customer Domain.

**Aan (existing surfaces)**
Aan Copilot Panel, Aan Feed, Policies, Workspace, Mascot → dissolve. Aan is not a surface. Aan is the author of Understandings and Proposals, the executor of Delegations, the voice of the Ambient Strip. The word *Copilot* retires.

**Alerts (existing)**
The `/alerts` page dissolves entirely. Its function — surfacing Domain State changes that need judgment — is redistributed: sub-threshold changes tilt Standing quietly; above-threshold changes surface as ambient offers; only accepted-into-attention items enter the person's active focus.

**Settings, Preferences, Profile, Integrations, Team, Billing**
Remain, but re-homed as Domains inside a *Systems* parent (they *are* parts of the business the person is responsible for).

**Visibility model per feature family:**
- *Always Visible:* Standing constellation, Ambient Strip.
- *Contextual:* every Domain surface, appearing on descent.
- *Ambient:* Aan's voice, cooling rings, tilts.
- *Hidden Until Needed:* search, filters, keyboard shortcuts, direct-link URLs, admin controls.
- *Background Only:* Entry ledger, connector polling, learning loops.

**Nothing on the current product is deleted at the code level in v0. It is re-homed at the experience level.**

---

## 4. Information Architecture

Information, not pages. For each *type* of information, its principled home is fixed:

| Information type | Why exists | Who needs it | When appears | When disappears | Depth | Owner |
|---|---|---|---|---|---|---|
| Standing summary (one sentence) | Recognition in <2s | Everyone | Ambient, always | Never | Surface | Aan authors, human owns |
| Domain State | Show health at a glance | Owner + observers | Always in constellation | Never | Surface | Domain owner |
| Tilt (magnitude of change) | Attention allocation | Owner | On the Domain, since last inhabited | Fades over hours | Surface | Aan |
| Understanding narrative | Explain causation | Whoever descends | On descent into a tilted Domain | On withdrawal | Depth 1 | Aan |
| Evidence (Signals, meetings, messages) | Defensibility of Understanding | Whoever contests | On phrase pull or contest | On withdrawal | Depth 2 | Aan, gathered from sources |
| Proposals + alternatives | Enable Judgment | Authorized role | On tilted Domain | On approval/reject | Depth 1 | Aan or Rule author |
| Cooling ring | Visible reversibility | Actor + observers | On any Action | On window close | Surface | System |
| Delegation policy | Show what's handed off | Owner + delegate | On the Domain, as a face | Never | Depth 1 | Owner |
| Memory (causal chain) | Learning + audit | Whoever descends deep | On historical descent | On withdrawal | Depth 3 | System |
| Presence of others (multiplayer) | Collaboration | Everyone in shared Domain | When another role inhabits | On their withdrawal | Surface | System |
| Ask-Aan expansions | On-demand clarification | Contestor | On pulling a phrase | On withdrawal | Depth 1 | Aan |

Every piece of information has *one* home. Duplication is a defect.

**Confidence: Stable, except *Presence of others* which is Working — the exact visual mechanic is E4's territory (§14).**

---

## 5. Relationship Graph

Textual, not visual. **The proposed graph departs from previous documents' Entry-centric framing** — Entries remain the substrate, but the *user-visible graph* has Domain at the center:

```
                       Standing
                          |
                (integrates across)
                          |
                       Domain <──────── Delegation
                     /   |   \
              contains  has  authors
                /       |       \
           Signal   State    Proposal
              \        |        /
               \       |       /
                \      |      /
                 Understanding ── Evidence (Signals, external artifacts)
                       |
                    Judgment (human act) → Action → Memory
                                                     |
                                                (feeds back into)
                                                     |
                                              Domain thresholds
                                                & Understandings
```

- **Domain** is the visible anchor. Everything else is *of a Domain*.
- **Understanding** is the causal joint — the only object that links Signals to changes in State.
- **Memory** closes the loop by feeding learning back into how future Signals are interpreted.
- **Delegation** is a modifier on Domain that changes which Judgments require the human.
- **Entry** (not shown here) is beneath the entire graph — every arrow is realized as an Entry write.

**Departure from earlier framing:** *Situation* is dropped entirely. It was a redundant name for *a Domain currently in an attention-requiring State* — the new model expresses this compositionally without a new object.

**Confidence: Working. Prototype E2 and E4 will pressure-test this.**

---

## 6. User Architecture

Living OS is **multi-tenant, multi-role, single-reality**. All roles share one graph; each has a different view, authority, and Standing.

**Canonical roles for v1.0** (not exhaustive; each org can define more):

| Role | Standing scope | Authority | Default Workspace | Shared Domains | Private Domains |
|---|---|---|---|---|---|
| **Founder / CEO** | Whole business | Ultimate; can override anyone | Top-level constellation | All | Strategy, People-sensitive |
| **CFO / Finance** | Cash + subgraphs | Approve financial commitments; veto over-ceiling actions | Cash constellation | Cash, Ops, Reports | Payroll, Board comms |
| **CMO** | Marketing + Customer | Approve brand & positioning; delegate media | Customer constellation | Advertising, BI, Reports | Brand strategy |
| **Media Buyer** | Advertising sub-tree | Bid, budget, keyword actions within delegated ceilings | Advertising constellation | Advertising, BI | Personal watchlists |
| **Operations Manager** | Inventory + Ops | Approve supplier, logistics, warehouse Actions | Ops constellation | Inventory, Cash (read) | Personal SOPs |
| **Analyst** | Read-most, write-few | Author Understandings, propose (not execute) | Any assigned Domain | Read across many | Working notes |
| **Agency** | Scoped to client Domains | As delegated by client; visibility limited by contract | Client-scoped constellation | Advertising (usually) | None visible to client |
| **Aan (AI author)** | System role | Bounded by every delegation; cannot originate novel Judgment | N/A | Every Domain | None (all Aan Entries are visible) |

**Two structural principles for multi-user:**

1. **Shared reality, personal Standing.** Every role sees the same Domains, Signals, Understandings, Proposals, and Memory (subject to visibility). Their *Standing* differs because their *authority and delegations* differ.
2. **Contest is a first-class org gesture.** When Finance contests Marketing's Understanding, the Domain enters a *Contested* state; Aan re-runs its analysis, may support either side, and the escalation ladder (defined by org policy) surfaces the Domain in whichever role's Standing has final authority.

**Confidence: Working. Roles will evolve per industry; the *shape* of the architecture is stable.**

---

## 7. AI Architecture — What Aan Is

Aan is not an assistant. Aan is **twelve capabilities running continuously**, expressed through the system's own objects. Each capability is separately observable, separately configurable, and separately auditable — but the user never sees them as twelve things.

| Aan capability | What it does | Where it surfaces |
|---|---|---|
| **Observation** | Ingests every Signal from every connector | Never surfaces; feeds everything else |
| **Understanding** | Forms causal chains | As the narrative inside a descended Domain |
| **Reasoning** | Weighs evidence, alternatives, tradeoffs | As Proposals and their alternatives |
| **Memory** | Persists and retrieves the Entry graph | As causal descent |
| **Execution** | Carries out approved Proposals via connectors | As Action + cooling ring on the Domain |
| **Learning** | Adjusts thresholds and interpretations from human Judgments | Silently, but *visible* on descent into the Delegation face |
| **Delegation** | Holds and respects delegation policies | Never authors above its authority |
| **Communication** | Writes the honest sentence | Ambient Strip, Domain narratives, evening line |
| **Planning** | Sequences Proposals over time | As multi-step Proposals with reversible checkpoints |
| **Prediction** | Extends Understandings forward | As "expected trajectory" inside a Proposal |
| **Simulation** | Answers *what if* without executing | As the Simulate capability on any Domain |
| **Explainability** | Exposes the reasoning chain at any depth | As descent, and as Ask-a-phrase |

**Aan has no persona, no name-on-screen, no avatar, no chat window.** Its identity is the *quality of the system's honesty*. This is deliberate and non-negotiable per the emotional architecture. The word *Copilot* and the mascot retire.

**Confidence: Stable structurally.** The most experimental capability is *Learning* — how the system communicates to a human that it has learned from them without becoming eerie. This is a candidate for a future experiment.

---

## 8. Industry Architecture

**What never changes across industries:** Domains, States, Standing, Signals, Understandings, Proposals, Judgments, Actions, Memory, Delegations, the ten user gestures, the twelve Aan capabilities, the emotional architecture.

**What changes per industry:** the connectors that produce Signals, the shape of the Actions those Signals resolve into, the canonical Domain tree, and the regulatory/compliance overlay on Delegations.

| Industry | Canonical Domains | Distinctive Signals | Distinctive Actions | Regulatory overlay |
|---|---|---|---|---|
| Ecommerce (v1) | Advertising, Inventory, Cash, Customer, Ops | Marketplace metrics, listings, reviews | Bid, budget, listing, supplier PO | Marketplace policies |
| FinTech | Portfolios, Risk, Compliance, Clients | Market data, transactions, KYC | Rebalance, alert, freeze | SEC/FINRA; every Action logged |
| Healthcare | Patients, Protocols, Billing, Staff | EHR events, lab, claims | Order, escalate, refer | HIPAA; Delegations cannot cross PHI boundaries |
| Manufacturing | Lines, Batches, Suppliers, Quality | Sensor, defect, throughput | Line adjust, batch hold, PO | ISO/GMP |
| Legal | Matters, Obligations, Deadlines, Clients | Court filings, calendars, emails | Draft, file, respond | Client privilege on Domain visibility |
| HR | People, Roles, Comp, Culture | ATS, HRIS, engagement | Offer, promote, PIP | Employment law; strong privacy per Domain |
| CRM | Accounts, Opportunities, Contacts, Renewals | CRM events, emails, calls | Sequence, propose, escalate | Data residency per region |
| Cybersecurity | Assets, Threats, Incidents, Policies | Telemetry, IOCs, anomalies | Contain, isolate, patch | SOC compliance; immutable audit |

**The Blueprint's claim:** Living OS is not "an ecommerce app that will one day generalize." It is a general operating system whose first tenant is ecommerce because that is where the current research and connectors live. The eighteen capabilities and ten objects are already industry-neutral.

**Confidence: Working. Ecommerce is Stable; the others are architectural claims to be validated when a second-industry design pass happens.**

---

## 9. Interaction Inventory

Purpose only. No visual. Twenty gestures, ranked by expected frequency of use.

| Gesture | Purpose | Objects touched | Emotional outcome | Confidence |
|---|---|---|---|---|
| **Glance** | Read Standing without opening | Standing | Protected | Working |
| **Inhabit** | Enter the constellation | Standing | Clear | Working |
| **Descend** | Deepen into a Domain | Domain | Curious | Working |
| **Withdraw** | Exit depth, return to prior posture | Domain | Calm | Working |
| **Approve** | Commit to a Proposal | Proposal → Action | Confident | Stable |
| **Modify** | Adjust a Proposal before commit | Proposal | Powerful | Stable |
| **Reject** | Refuse a Proposal | Proposal | In control | Stable |
| **Contest** | Disagree with an assumption in an Understanding | Understanding | Respected | Working |
| **Ask (pull a phrase)** | Expand reasoning behind specific words | Understanding | Curious | Experimental |
| **Delegate** | Hand a class of Judgments to Aan | Domain → Delegation | Powerful | Stable |
| **Revoke** | Take a Delegation back | Delegation | In control | Stable |
| **Watch** | Elevate a Domain to persistent attention | Domain | Vigilant | Stable |
| **Follow** | Subscribe another role to a Domain's changes | Domain | Collaborative | Working |
| **Focus** | Temporarily suppress all Domains except one | Standing | Calm | Working |
| **Share** | Snapshot a Domain for humans outside Living OS | Domain → rendered artifact | Powerful | Working |
| **Present** | Real-time inhabit of a Domain with an external viewer | Domain | Confident | Experimental |
| **Compare** | Two Domains side by side at the same depth | Domain × Domain | Insightful | Working |
| **Simulate** | Preview a Proposal's effect without executing | Proposal | Safe | Experimental |
| **Replay** | Traverse a Domain's Memory in time | Memory | Learning | Working |
| **Undo** | Reverse within the cooling window | Action | Safe | Stable |

**Deliberately absent from v1.0:** *Search* is present but as a hidden expert affordance (Cmd-K), never a primary path. *Navigate* does not appear — descent replaces it. *Create, Save, Send, Close* are all absent — the state model handles them implicitly.

**Confidence:** Ten gestures Stable, seven Working, three Experimental — the Experimental three are exactly where prototypes must earn or kill them.

---

## 10. Motion Inventory — Behavioral Meanings

Motion communicates *state change*, never decoration. Each behavior has a fixed meaning:

| Behavior | Means |
|---|---|
| **Arrival** | Recognition — the constellation is where you left it, plus deltas |
| **Recovery** | A Domain returning from Attention → At Rest; softer, slower than tilt |
| **Thinking** | Aan is composing an Understanding; expressed as a slow, non-anxious pulse on the Domain |
| **Watching** | Aan has detected something but cannot yet interpret; faint shimmer, no forward motion |
| **Learning** | Aan has just updated its interpretation because of a Judgment or Contest; brief, warm settling animation on the affected Domain |
| **Delegation active** | A Domain has an active Delegation; a persistent, subtle inner ring |
| **Completion** | An Action's cooling window has closed successfully; the ring fades cleanly |
| **Confidence increasing** | Edge firms visibly |
| **Uncertainty growing** | Edge softens visibly |
| **Memory settling** | A recent Entry ages into the Domain's baseline; foreground mark fades over hours |
| **Attention shifting** | Conservation-of-attention rebalance; one Domain rises, another recedes, in one continuous motion |
| **Contested** | Two authorities visible on the same Domain; the Domain visibly *holds two centers of gravity* until resolved |

Everything else — bounce, decorative easing, celebratory confetti, loading spinners — is prohibited.

**Confidence: Working. Every behavior must survive its own micro-prototype before shipping.**

---

## 11. Navigation Model

There is no navigation. There are **five conceptual movements**, each expressed through the object model, not through menus:

1. **Business ↔ Domain ↔ sub-Domain** — via *Descend / Withdraw*. Same object type at every scale (Law 11).
2. **Now ↔ Then (within a Domain)** — via *Replay*. The same Domain viewed backward in time; Memory unfolds.
3. **Domain ↔ Evidence** — via *Ask (pull a phrase)*. Evidence never lives on a separate surface.
4. **Me ↔ Us (within a Domain)** — via *Follow / Present / Contest*. Other roles' presence becomes visible on the Domain itself.
5. **Domain ↔ Delegation** — via flipping the Domain to its Delegation face. Never a settings page.

**Expert affordances (hidden until invoked):**
- **Cmd-K** — direct-jump search into any Domain by name, tag, or content.
- **Cmd-[ / Cmd-]** — cycle through recently inhabited Domains.
- **Deep links (URLs)** — every Domain at every depth has a permalink, for share/present/multiplayer.
- **Keyboard shortcuts** — full gesture set has key bindings for power users.

Old-world patterns rejected: menus, tabs, breadcrumbs, back button, home button, tab bars, hamburgers, sidebars *as navigation*.

**Confidence: Working. The critical open question: whether five movements are enough. Prototype E2 tests this.**

---

## 12. Current Research Map

Full provenance of every concept produced so far:

| Concept | Origin | Status | Confidence | Dependencies |
|---|---|---|---|---|
| Ledger as internal substrate | Doc 01 | Accepted | Stable | — |
| Entry as technical primitive | Doc 01 | Accepted | Stable | Ledger |
| Standing as human primitive | Doc 02 | Accepted | Stable | Ledger, Entry |
| Four North Stars (TTCU, Trust, Calm, Agency) | Doc 02 (user-authored) | Accepted | Stable | — |
| System Truth vs Human Truth distinction | Doc 02 (user-authored) | Accepted | Stable | — |
| Ten Laws (Physics of Living OS) | Doc 2.5 | Accepted with softening | Working — biology-not-clockwork framing | Ledger, Entry, Standing |
| Law 11 (Identity Persistence) | Doc 2.5 revision (user-authored) | Accepted | Stable | — |
| Law 12 (Spatial Memory) | Doc 2.5 revision (user-authored) | Accepted | Working | Depends on E3 |
| *Concern* as primary object | Doc 03 | **Rejected as identity, retained as one State** | Working | Superseded by Domain |
| **Domain** as primary object | Blueprint v1.0 §1.1 | Proposed | Working | Naming to be prototyped |
| Constellation as spatial arrangement | Doc 03 | Proposed | Experimental | E3 |
| Ten-gesture grammar | Doc 03 | Expanded to twenty (§9) | Working | E-series |
| Ambient Aan surface | Doc 03 | Accepted; starting with monitor strip only | Working | E1 |
| Multi-user, single-reality architecture | Blueprint §6 (from user pushback) | Proposed | Working | E4 |
| Twelve Aan capabilities (§7) | Blueprint §7 | Proposed | Working | Compositional; per-capability testing |
| Eighteen system capabilities (§2) | Blueprint §2 | Proposed | Stable | — |
| Industry-neutrality (§8) | Blueprint §8 | Proposed as architectural claim | Working | Second-industry pass |
| Existing Anarix feature mapping (§3) | Blueprint §3 | Proposed | Working | E-series |
| Copilot / Mascot retirement | Blueprint §7 | Proposed | Working | Requires org buy-in |

---

## 13. Open Questions — Ranked by Blocking Power

**Blocks design (must resolve before pixels):**
1. **Name of the primary object.** *Domain* is the working name; final choice depends on E1's naming toggle results.
2. **Whether the constellation is the primary organization or a mode.** Depends on E3.
3. **The exact gesture for Descend / Withdraw.** Three candidates in E2.
4. **Whether Aan's ambient voice is trusted or annoying** at the strip's tested cadence. Depends on E1.

**Can wait (design can begin without resolving):**
5. Contested-state visual mechanic.
6. Cooling-window duration policy per Action tier.
7. Memory-fade duration.
8. Naming of the six States.

**Requires prototypes to answer honestly:**
9. Whether *Ask (pull a phrase)* feels natural or fiddly.
10. Whether Simulate can be expressed without a numbers-heavy surface.
11. Whether Contest scales past two roles.
12. Whether the emotional temperature colors are legible without becoming a traffic-light system.

**Deliberately deferred until v1.1:**
13. Report as object or rendering.
14. Goal as object.
15. Client-facing Present mode's authentication model.

---

## 14. Prototype Roadmap *(learning order, not implementation order)*

Five experiments, ordered by *maximum reduction in blueprint uncertainty per unit of build effort*.

**E1 — Ambient Presence + Naming Toggle** *(build first)*
- **Hypothesis:** a single always-visible strip of ambient Aan text can carry morning-brief weight without becoming a notification; and users can react to *Domain / Charge / Territory / Watch / Ground / Post / Concern-as-state* to reveal which name feels native.
- **Risk:** low technically, medium philosophically.
- **Reward:** two blocking questions resolved in one prototype (#1 and #4).
- **Success:** testers glance at the strip, feel informed, and pick a naming preference with reasoning.
- **Kill:** if the strip induces anxiety or is ignored, ambient-as-primary is retired.

**E3 — Spatial layout (Constellation vs Considered vs Grid)** *(build second)*
- **Hypothesis:** remembered spatial arrangement outperforms grid/list for returning-day recognition (TTCU).
- **Risk:** high — this is the most radical proposal in the whole document.
- **Reward:** resolves blocking question #2.
- **Success:** on day 2, testers find the tilted Domain in <2s in the constellation vs >4s in the grid.
- **Kill:** if constellation shows no advantage, ship *considered arrangement* as default, constellation becomes a mode.

**E2 — Descent vs Navigation** *(build third)*
- **Hypothesis:** deepening feels categorically different from navigating and reduces "where am I?" reactions to zero.
- **Risk:** medium.
- **Reward:** resolves blocking question #3; validates Law 8.
- **Success:** testers descend and withdraw fluently, never ask *"how do I go back?"*
- **Kill:** if descent causes vertigo or ambiguity, add a lightweight breadcrumb-like affordance.

**E4 — Collaborative Contest** *(build fourth)*
- **Hypothesis:** organizational judgment (Finance contests Marketing) can be expressed on the Domain itself without a chat surface.
- **Risk:** high — multi-user is the most under-explored part of the blueprint.
- **Reward:** validates §6 in full and open questions #11, #5.
- **Success:** two testers with different roles resolve a contest inside Living OS without opening Slack.
- **Kill:** if resolution requires external communication, formalize Living OS as *around* conversation and design the handoff.

**E5 — Uncertainty without percentages** *(build fifth)*
- **Hypothesis:** firm / soft / watching, expressed as edge and breathing, communicates confidence more accurately than numeric probability.
- **Risk:** low technically, high perceptually.
- **Reward:** resolves Law 10 and open question #12.
- **Success:** testers correctly rank three Domains by confidence without labels.
- **Kill:** if consistently misread, adopt a small textual label as a companion.

**Deferred experiments (v1.1):** E6 Meetings-as-organizational-judgment, E7 Simulate without numbers, E8 Learning-loop visibility, E9 Present mode for external audiences, E10 Cross-industry generalization pass.

---

## 15. Collaboration principles going forward

Per the Creative Director's instruction, and adopted for the Design Phase that follows this Blueprint:

- **Prototype over prose.** Every future disagreement is resolved by the smallest prototype that would settle it.
- **The Blueprint serves the product.** When a prototype contradicts the Blueprint, the Blueprint updates within one working day.
- **Options over recommendations, when honest.** Where multiple credible answers exist, present all, mark tradeoffs, recommend one, leave room to dissent.
- **No silent inheritance.** Any pattern that arrives from prior software must be named, defended, or replaced.
- **Confidence labels stay on every claim.** *Stable / Working / Experimental* is a promise, not a decoration.

---

## Three decisions before we close the Architecture Phase

1. **Object naming.** Adopt **Domain** internally now (understanding it will be tested in E1) and use it consistently in every future document, or hold the naming open and refer to it as "the primary object" until E1 concludes?

2. **Contested state.** Accept multi-user contest as a v1.0 architectural pillar (built into E4 from the start), or defer collaboration entirely to v1.1 and ship v1.0 as principal-first with a single-role assumption? (My recommendation: build it in from v1.0. Retrofitting collaboration into a single-user architecture is the single most expensive mistake in enterprise software history.)

3. **What retires publicly.** The Blueprint proposes retiring *Copilot*, *Mascot*, and *Alerts* as concepts inside Living OS. Are we comfortable communicating those retirements externally when the first prototype ships, or do we keep them alive in the Anarix product while Living OS runs as a parallel universe indefinitely? (My recommendation: keep them alive in Anarix; retire them only *inside* Living OS. Living OS earns its way to replacement, if it ever does — it does not demand it.)
