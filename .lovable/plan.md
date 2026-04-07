

## Add Marketplace Section to Sidebar (After Aan)

### What Changes

Add a new "Marketplace" section in the left sidebar, positioned right after the Aan button and before the navigation groups. It shows 4 marketplace options (Amazon, Walmart, Shopify, TikTok) — always visible, not a dropdown. The selected marketplace uses its original brand color. Hovering any marketplace shows a popup listing connected accounts for that marketplace.

### Layout

```text
┌──────────────────────┐
│ Logo        [Toggle]  │
├──────────────────────┤
│ [Ask Aan pill]        │
├──────────────────────┤
│ Marketplace           │  ← NEW SECTION
│  🟠 Amazon            │  ← selected = orange brand color
│  🔵 Walmart           │
│  🟢 Shopify           │
│  ⚫ TikTok            │
├──────────────────────┤
│ Workspace ▾           │
│ Profitability ▾       │
│ ...                   │
└──────────────────────┘
```

Hover on any marketplace item → popup appears to the right showing connected accounts for that marketplace (similar to the reference image's "Dashboards" popup pattern), using the existing `SidebarHoverPopup` portal pattern.

### Brand Colors

| Marketplace | Selected Color | Logo |
|---|---|---|
| Amazon | `#FF9900` | Existing `amazon-logo.png` |
| Walmart | `#0071CE` | Existing `walmart-logo.png` |
| Shopify | `#96BF48` | Inline SVG (bag icon) |
| TikTok | `#000000` (light) / `#FFFFFF` (dark) | Inline SVG (note icon) |

### Technical Changes

**File: `src/contexts/MarketplaceContext.tsx`**
- Extend `Marketplace` type to include `"shopify" | "tiktok"`
- Persist selected marketplace to localStorage

**File: `src/components/layout/MarketplaceSelector.tsx` (new)**
- Renders 4 marketplace items vertically under a "Marketplace" label
- Each item: brand logo (small SVG/img, 16px) + name
- Selected item text + icon in brand color, others in `text-muted-foreground`
- On click: calls `setMarketplace()`
- On hover: shows a popup (portal) listing accounts from `useAccounts()` filtered by that marketplace
- Collapsed sidebar: show only the 4 logos stacked, hover popup still works

**File: `src/components/layout/MarketplaceHoverPopup.tsx` (new)**
- Similar to `SidebarHoverPopup` but shows account cards instead of nav links
- Header: marketplace name
- Body: list of connected accounts with status dot + merchant name
- Empty state: "No accounts connected" + link to Settings > Accounts
- Uses `createPortal` to `document.body`, positioned relative to trigger

**File: `src/components/layout/AppSidebar.tsx`**
- Import and render `<MarketplaceSelector />` between the Aan button divider and the navigation groups `<div>`
- Add a bottom divider after the marketplace section

**File: `src/assets/`**
- Add Shopify and TikTok SVG logo files (inline SVGs in component if small enough)

### Collapsed Sidebar Behavior
- Show only the 4 marketplace logo icons stacked vertically (no text)
- Selected marketplace icon in brand color
- Hover shows the same account popup to the right

### Files Summary

| File | Change |
|---|---|
| `MarketplaceContext.tsx` | Add `"shopify" \| "tiktok"` to type, persist to localStorage |
| `MarketplaceSelector.tsx` (new) | Sidebar marketplace section with 4 always-visible items |
| `MarketplaceHoverPopup.tsx` (new) | Hover popup showing connected accounts per marketplace |
| `AppSidebar.tsx` | Insert `<MarketplaceSelector />` after Aan, before nav groups |

