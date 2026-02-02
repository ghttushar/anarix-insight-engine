
# Complete Aan Architecture & Navigation Enhancement Plan

## Overview

This plan implements the complete Aan functionality as a unified AI reasoning layer, along with critical navigation and UI improvements:

1. **Fix Floating Island vs Navbar Aan Behavior** - Island opens Copilot panel, Navbar opens Workspace
2. **Rebuild Aan Workspace Sidebar** - Match the reference design with logo, sections, and chat history
3. **Add Breadcrumbs for Both Anarix and Aan** - Navigation context in all screens
4. **Apply Correct Aan Gradient** - Use the reference purple-indigo gradient
5. **Remove Right-Side Shadow** - Clean up copilot panel styling
6. **Move Marketplace/Account Dropdowns to Navbar** - With popup modal for account selection
7. **Fix Navbar Alignment** - Proper spacing between logo and items
8. **Implement Complete Aan Functionality** - Single chat system with filtered views

---

## Part 1: Aan Entry Point Behavior (Critical Fix)

### Current Issue
- Both the sidebar Aan button and floating island trigger the same `openPanel()` which opens Copilot
- The navbar "Aan" should open the dedicated Workspace mode

### Files to Modify

**`src/components/layout/AppSidebar.tsx`**
- Change sidebar Aan button to open Copilot mode (keep as-is)

**`src/features/creative/FloatingActionIsland.tsx`**
- Keep "Ask Aan" triggering `openPanel()` → Copilot mode (keep as-is)

**`src/components/layout/AppHeader.tsx`**
- Add "Aan" button in the header that triggers `openWorkspace()` → Workspace mode
- This will be styled with the Aan gradient

---

## Part 2: Rebuild Aan Workspace Sidebar (Match Reference)

### Reference Design Elements (from uploaded image-41.png)
```text
┌─────────────────────────┐
│  ✧ Aan                  │  ← Logo with "by Anarix"
│     by Anarix           │
├─────────────────────────┤
│  ▢ New Chat             │  ← Action button
│  📄 Reports             │  ← Filter section
│  ◯ Audit                │
│  ✦ Creative             │
│  🤖 Agent               │
├─────────────────────────┤
│  Chat History           │  ← Section label
│  ⌕ Search history...    │  ← Search input
├─────────────────────────┤
│  ▼ New Conversation     │  ← Chat history items
│    Today                │
│                         │
│  Campaign Performance   │
│    1/8/2026             │
└─────────────────────────┘
```

### New File: `src/components/aan/AanWorkspaceSidebar.tsx` (Complete Rewrite)

```typescript
interface ChatHistoryItem {
  id: string;
  title: string;
  date: Date;
  type: "chat" | "report" | "audit" | "creative" | "agent";
}

// Sidebar structure:
// 1. Aan Logo with "by Anarix" branding (using Allura font)
// 2. "New Chat" button
// 3. Filter sections: Reports, Audit, Creative, Agent
// 4. "Chat History" label
// 5. Search input
// 6. Scrollable list of conversations grouped by date
```

### AanContext Updates
Add chat history management:
```typescript
interface AanContextType {
  // ... existing
  conversations: Conversation[];
  currentConversation: Conversation | null;
  activeFilter: "all" | "reports" | "audit" | "creative" | "agent";
  setActiveFilter: (filter: string) => void;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  searchHistory: (query: string) => Conversation[];
}
```

---

## Part 3: Breadcrumb Navigation for Both Systems

### Anarix Breadcrumbs
Already implemented in `PageBreadcrumb.tsx` - ensure all pages use it

### Aan Breadcrumbs (New Component)
**New File: `src/components/aan/AanBreadcrumb.tsx`**

```typescript
// Shows context within Aan workspace
// Example: Aan > Reports > Campaign Performance Analysis
// Example: Aan > Audit > Q4 2025 Audit

interface AanBreadcrumbProps {
  section?: string; // "reports" | "audit" | "creative" | etc.
  conversationTitle?: string;
}
```

### Update `AanWorkspace.tsx`
- Add breadcrumb below the header
- Shows: "Aan" > [Section] > [Conversation Title]

---

## Part 4: Apply Correct Aan Gradient

### Reference Gradient (from sidebar screenshot)
The gradient in image-41 shows a purple-to-indigo gradient going from left to right.

### Update `src/index.css`
```css
:root {
  /* Updated Aan Gradient - matches reference */
  --aan-gradient-start: 258 90% 66%; /* #8B5CF6 Violet-500 */
  --aan-gradient-mid: 239 84% 67%;   /* #6366F1 Indigo-500 */
  --aan-gradient-end: 217 91% 60%;   /* #3B82F6 Blue-500 */
}

.aan-gradient {
  background: linear-gradient(
    90deg,
    hsl(var(--aan-gradient-start)) 0%,
    hsl(var(--aan-gradient-mid)) 50%,
    hsl(var(--aan-gradient-end)) 100%
  );
}
```

---

## Part 5: Remove Right-Side Shadow

### Current Issue
The copilot panel has `shadow-2xl` which creates a heavy shadow on the left edge

### Fix in `src/components/aan/AanCopilotPanel.tsx`
```tsx
// Change from:
"border-l border-border bg-background shadow-2xl"
// To:
"border-l border-border bg-background shadow-lg"
```

Also update `AanSplitView.tsx` with the same fix.

---

## Part 6: Move Marketplace/Account to Navbar

### Reference Design (from image-42, image-43)
```text
┌────────────────────────────────────────────────────┐
│  ☰  [Anarix Logo]  ... gap ...  [★ Walmart ▼] [● tushar ▼] │
└────────────────────────────────────────────────────┘
```

### Update `src/components/layout/AppHeader.tsx`

1. **Marketplace Selector (Star Icon Badge)**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="gap-2">
      <Star className="h-4 w-4 text-warning fill-warning" />
      <span>Walmart</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {/* Marketplace options */}
  </DropdownMenuContent>
</DropdownMenu>
```

2. **Account Selector (Status Dot)**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="gap-2">
      <div className="h-2 w-2 rounded-full bg-success" />
      <span>tushar</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-80">
    {/* Large scrollable account list */}
    <ScrollArea className="max-h-[300px]">
      {accounts.map(account => (
        <DropdownMenuItem key={account.id}>
          {account.merchantName}
        </DropdownMenuItem>
      ))}
    </ScrollArea>
  </DropdownMenuContent>
</DropdownMenu>
```

### Key Behavior
- Dropdown appears above/below trigger (not pushing nav items)
- Large account list is scrollable
- Selected account shows status indicator

---

## Part 7: Fix Navbar Alignment

### Current Issue
Items are too close to the logo, cramped layout

### Update `src/components/layout/AppHeader.tsx`
```tsx
<header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
  <div className="flex items-center gap-6"> {/* Increased gap */}
    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
      <PanelLeft className="h-5 w-5" />
    </Button>
    
    {/* Aan button in nav with gradient */}
    <Button 
      onClick={openWorkspace}
      className="aan-gradient text-white gap-2"
    >
      <Sparkles className="h-4 w-4" />
      <span style={{ fontFamily: "var(--font-aan)" }}>Aan</span>
    </Button>
  </div>

  <div className="flex items-center gap-3">
    {/* Marketplace & Account selectors */}
  </div>
</header>
```

### Remove Logo from Header
Logo is in the sidebar - header should not duplicate it

---

## Part 8: Complete Aan Functionality

### 8.1 Single Chat System Architecture

**Key Principle**: One chat engine, multiple views

```typescript
interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  type: "general" | "report" | "audit" | "creative" | "rule" | "agent";
  messages: Message[];
  artifacts: Artifact[];
}

interface Artifact {
  id: string;
  type: "report" | "audit" | "rule" | "creative";
  title: string;
  version: number;
  versions: ArtifactVersion[];
  status: "draft" | "applied" | "archived";
  data: any; // Charts, tables, etc.
}
```

### 8.2 Sidebar Tab Filtering

Tabs filter the conversation list, NOT create new chat systems:

```typescript
const filteredConversations = useMemo(() => {
  if (activeFilter === "all") return conversations;
  return conversations.filter(c => c.type === activeFilter);
}, [conversations, activeFilter]);
```

### 8.3 Artifact Cards in Chat

When Aan generates a report/audit:
```tsx
// In AanConversation.tsx
if (message.artifact) {
  return (
    <ArtifactCard
      artifact={message.artifact}
      onClick={() => openSplit(message.artifact)}
    />
  );
}
```

### 8.4 Chat to Summary to Artifact Flow

1. **User Request**: "Generate last 7 day campaign report"
2. **Immediate Response**: Aan shows partial insights, bullets, KPIs inline
3. **Artifact Creation**: Aan creates clickable artifact card
4. **Artifact Interaction**: Click opens Split Task View
5. **Iteration**: Edit button opens mini-chat for refinements

### 8.5 Version Management in Split View

```typescript
interface ArtifactVersion {
  version: number;
  createdAt: Date;
  changes: string; // "Removed ROAS column, grouped by campaign type"
  data: any;
}

// Version selector UI
<DropdownMenu>
  <DropdownMenuTrigger>v{currentVersion}</DropdownMenuTrigger>
  <DropdownMenuContent>
    {artifact.versions.map(v => (
      <DropdownMenuItem onClick={() => setCurrentVersion(v.version)}>
        v{v.version} - {format(v.createdAt, "MMM d, h:mm a")}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Part 9: File Structure Changes

```text
src/
├── components/
│   ├── aan/
│   │   ├── AanContext.tsx (MAJOR UPDATE - add conversations, filtering)
│   │   ├── AanWorkspaceSidebar.tsx (COMPLETE REWRITE - match reference)
│   │   ├── AanWorkspace.tsx (UPDATE - add breadcrumb, improve layout)
│   │   ├── AanBreadcrumb.tsx (NEW)
│   │   ├── AanCopilotPanel.tsx (UPDATE - remove shadow)
│   │   ├── AanSplitView.tsx (UPDATE - remove shadow, enhance versioning)
│   │   ├── ArtifactCard.tsx (NEW - clickable artifact in chat)
│   │   ├── AanConversation.tsx (UPDATE - support artifacts)
│   │   └── index.ts (UPDATE exports)
│   ├── layout/
│   │   ├── AppHeader.tsx (MAJOR UPDATE - Aan button, dropdowns)
│   │   └── AppSidebar.tsx (MINOR - keep copilot trigger)
└── index.css (UPDATE - correct Aan gradient)
```

---

## Part 10: Implementation Sequence

### Phase 1: Navigation & Layout Fixes
1. Update AppHeader - add Aan button (workspace trigger), move dropdowns
2. Fix navbar alignment and spacing
3. Remove duplicate logo from header
4. Fix copilot/split view shadows

### Phase 2: Aan Workspace Sidebar Rebuild
1. Rewrite AanWorkspaceSidebar to match reference
2. Add New Chat, filter sections, chat history
3. Add search functionality
4. Implement date grouping for history

### Phase 3: Context & State Management
1. Extend AanContext with conversations, filtering
2. Add artifact management
3. Implement single chat system with filters

### Phase 4: Breadcrumbs
1. Create AanBreadcrumb component
2. Integrate into AanWorkspace
3. Ensure all Anarix pages have breadcrumbs

### Phase 5: Artifact System
1. Create ArtifactCard component
2. Update AanConversation to render artifacts
3. Enhance AanSplitView with versioning

### Phase 6: Gradient & Polish
1. Update Aan gradient to match reference
2. Final styling pass on all Aan components

---

## Technical Details

### Aan Entry Points Behavior Matrix
| Entry Point | Action | Mode Opened |
|-------------|--------|-------------|
| Floating Island "Ask Aan" | openCopilot() | Copilot (side panel) |
| Sidebar Aan Button | openCopilot() | Copilot (side panel) |
| Header Aan Button | openWorkspace() | Full Workspace |
| "Open in workspace" link | openWorkspace() | Full Workspace |

### Correct Aan Gradient (from reference)
```css
/* Purple → Indigo → Blue gradient (left to right) */
background: linear-gradient(90deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%);
```

### Navbar Layout Specification
```text
┌─────────────────────────────────────────────────────────────────┐
│ [☰] ←8px→ [✧ Aan] ←flex grow→ [★ Walmart ▼] ←12px→ [● tushar ▼]│
└─────────────────────────────────────────────────────────────────┘
         ^                                ^
         gap-6                           gap-3
```

### Account Dropdown Popup
- Width: 320px
- Max Height: 300px with ScrollArea
- Shows: Account name, marketplace, status
- Search field at top for large lists
