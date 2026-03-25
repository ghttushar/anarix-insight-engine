

## Fix Sidebar Logo/Collapse Layout + Embed SVG Logos + Fix MiniSidebar Navigation

### Issues
1. **MiniSidebar in Aan workspace** — nav clicks don't work (hover popups use `NavLink` but MiniSidebar uses `handleNavClick` which may not trigger properly)
2. **Collapse button placement** — Currently toggle is on LEFT, logo on RIGHT. User wants: Logo LEFT, collapse button RIGHT (like ChatGPT reference)
3. **Logos** — Currently using PNG files. User provided 4 SVG variants that should be embedded:
   - `Anarix_logo_variation-01.svg` → Full logo, dark text (light mode, expanded)
   - `Anarix_logo_variation-02.svg` → Full logo, white text (dark mode, expanded)
   - `Anarix_logo_variation-03.svg` → Symbol only, colored (light mode, collapsed)
   - `Anarix_logo_variation-04.svg` → Symbol only, white (dark mode, collapsed)

### Changes

#### 1. Copy SVG logos into `src/assets/`

Copy all 4 SVGs:
- `src/assets/logo-light-full.svg` (variation-01, colored full logo)
- `src/assets/logo-dark-full.svg` (variation-02, white full logo)
- `src/assets/logo-light-symbol.svg` (variation-03, colored symbol)
- `src/assets/logo-dark-symbol.svg` (variation-04, white symbol)

#### 2. Restructure AppSidebar Header

**Current**: `[Toggle] [Logo]`
**New**: `[Logo] [spacer] [Toggle]`

- Expanded: full logo on left, PanelLeft toggle on right
- Collapsed: symbol logo centered (no toggle button visible — click logo area to expand, or use hover)

Logo selection:
```
expanded + light → logo-light-full.svg
expanded + dark  → logo-dark-full.svg
collapsed + light → logo-light-symbol.svg
collapsed + dark  → logo-dark-symbol.svg
```

#### 3. Fix MiniSidebar Navigation in Aan Workspace

The hover popups render `NavLink` components which navigate via React Router but don't call `closeAan()`. Fix by:
- Passing an `onNavigate` callback to `SidebarHoverPopup`
- When a link is clicked inside the popup, call `closeAan()` then navigate
- Alternatively, wrap MiniSidebar in a click listener that calls `closeAan()` on any `NavLink` click

#### 4. Update MiniSidebar Logo

Use the symbol SVG instead of trying to shrink the full logo into 20px. In collapsed/mini context:
- Light mode: `logo-light-symbol.svg`
- Dark mode: `logo-dark-symbol.svg`

#### 5. Remove old PNG logos

Delete `logo-full.png` and `logo-white.png` after migrating all references.

---

### Files

| File | Change |
|---|---|
| `src/assets/logo-light-full.svg` | **NEW** — copy from variation-01 |
| `src/assets/logo-dark-full.svg` | **NEW** — copy from variation-02 |
| `src/assets/logo-light-symbol.svg` | **NEW** — copy from variation-03 |
| `src/assets/logo-dark-symbol.svg` | **NEW** — copy from variation-04 |
| `AppSidebar.tsx` | Swap header layout (logo left, toggle right), use new SVG imports based on theme+collapsed state |
| `MiniSidebar.tsx` | Use symbol SVGs, fix nav by calling `closeAan()` on link clicks in hover popups |
| `SidebarHoverPopup.tsx` | Add optional `onNavigate` callback prop that fires on link click |
| `AanWorkspace.tsx` | No changes needed (MiniSidebar fix handles it) |

