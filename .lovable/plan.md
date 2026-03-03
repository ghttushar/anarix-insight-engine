

# AMC Module, Missing Settings Pages, and Functional Preferences

## Audit: What exists vs. what's needed

### From the repo sidebar, AMC has 6 sub-pages:
1. **Queries** — `/amc/queries`
2. **Executed Queries** — `/amc/executed`
3. **Schedules** — `/amc/schedules`
4. **Audiences** — `/amc/audiences`
5. **Created Audiences** — `/amc/created-audiences`
6. **Instances** — `/amc/instances`

### Settings pages in repo vs. current app:

| Page | Repo | Current App |
|------|------|-------------|
| Accounts | Yes | Yes |
| Preferences | N/A (new) | Yes |
| Users | Yes | **Missing** |
| Invites | Yes | **Missing** |
| Logs | Yes | **Missing** (sidebar link exists but no page) |
| Configuration | Yes | **Missing** |

### Also from approved plan:
- Conditional taskbar (hide on `/settings`, `/login`, `/onboarding`)
- Visual Effects context (functional toggles)
- Editable keyboard shortcuts
- Enhanced density CSS

---

## Implementation

### 1. New files to create

**AMC pages** (6 placeholder pages with AppLayout, tables, and mock data):

| File | Content |
|------|---------|
| `src/pages/amc/Queries.tsx` | Table: query name, status, last run, actions. Mock 5 rows. |
| `src/pages/amc/ExecutedQueries.tsx` | Table: query name, execution time, status, results count. |
| `src/pages/amc/Schedules.tsx` | Table: schedule name, frequency, next run, status. |
| `src/pages/amc/Audiences.tsx` | Table: audience name, size, created date, status. |
| `src/pages/amc/CreatedAudiences.tsx` | Table: audience name, type, size, last updated. |
| `src/pages/amc/Instances.tsx` | Table: instance ID, region, status, created. |
| `src/data/mockAMC.ts` | Mock data for all 6 AMC tables. |

**Missing Settings pages** (4):

| File | Content |
|------|---------|
| `src/pages/settings/Users.tsx` | Table: name, email, role, status, last login. Invite button. |
| `src/pages/settings/Invites.tsx` | Table: email, role, status (pending/accepted), sent date. Send invite form. |
| `src/pages/settings/Logs.tsx` | Table: timestamp, user, action, module, details. Filterable. |
| `src/pages/settings/Configuration.tsx` | Form sections: default marketplace, default date range, notification preferences, API keys display. |

**Visual Effects Context:**

| File | Content |
|------|---------|
| `src/contexts/VisualEffectsContext.tsx` | Context with `ambientBackground`, `numberAnimations`, `floatingIsland` booleans. Persisted to localStorage. `toggle(key)` function. |

### 2. Files to modify

**`src/components/layout/AppSidebar.tsx`** — Add AMC group between Catalog and BI. Add missing settings sub-items (Invites, Configuration).

```text
Current sidebar order:
  Workspace → Profitability → Advertising → Catalog → BI → DayParting → Settings

New order:
  Workspace → Profitability → Advertising → Catalog → AMC → BI → DayParting → Settings

Settings items:
  Preferences, Accounts, Users, Invites, Logs, Configuration
```

**`src/components/layout/AppLayout.tsx`** — Add `useLocation()`, conditionally hide `<AppTaskbar />` on settings/login/onboarding routes. Use `useDensity()` for dynamic main padding.

**`src/App.tsx`** — Add all new route imports and `<Route>` entries. Wrap with `VisualEffectsProvider`.

**`src/features/creative/CreativeFeatures.tsx`** — Read from `useVisualEffects()` context to conditionally render `AmbientBackground`, `FloatingActionIsland`.

**`src/features/creative/KeyboardNavigation.tsx`** — On mount, read custom shortcut overrides from `localStorage('anarix-custom-shortcuts')`. Merge with defaults. Custom shortcuts take priority.

**`src/pages/settings/Preferences.tsx`** — Replace `<input type="checkbox">` with `<Switch>` wired to `useVisualEffects()`. Add per-shortcut "Edit" button that captures next keypress. Add "Reset to Defaults" per category. 

**`src/index.css`** — Expand `.density-compact` rules:
- Body font: 13px
- Page main padding: 16px (vs 24px)
- H1: 28px, H2: 20px, H3: 16px
- Button height: 36px
- Card gap: 12px
- Sidebar item padding: `py-1.5`
- KPI card internal spacing tighter
- Section gaps reduced

---

## Files summary

| File | Action |
|------|--------|
| `src/contexts/VisualEffectsContext.tsx` | Create |
| `src/data/mockAMC.ts` | Create |
| `src/pages/amc/Queries.tsx` | Create |
| `src/pages/amc/ExecutedQueries.tsx` | Create |
| `src/pages/amc/Schedules.tsx` | Create |
| `src/pages/amc/Audiences.tsx` | Create |
| `src/pages/amc/CreatedAudiences.tsx` | Create |
| `src/pages/amc/Instances.tsx` | Create |
| `src/pages/settings/Users.tsx` | Create |
| `src/pages/settings/Invites.tsx` | Create |
| `src/pages/settings/Logs.tsx` | Create |
| `src/pages/settings/Configuration.tsx` | Create |
| `src/components/layout/AppSidebar.tsx` | Modify — add AMC group + settings items |
| `src/components/layout/AppLayout.tsx` | Modify — conditional taskbar + density padding |
| `src/App.tsx` | Modify — add routes + VisualEffectsProvider |
| `src/features/creative/CreativeFeatures.tsx` | Modify — consume visual effects context |
| `src/features/creative/KeyboardNavigation.tsx` | Modify — custom shortcuts from localStorage |
| `src/pages/settings/Preferences.tsx` | Modify — functional Switch toggles + editable shortcuts |
| `src/index.css` | Modify — expanded density rules |

## Implementation order
1. Create `VisualEffectsContext`
2. Create all AMC pages + mock data
3. Create all missing Settings pages
4. Update `AppSidebar` (AMC group + settings items)
5. Update `AppLayout` (conditional taskbar + density padding)
6. Update `App.tsx` (routes + provider)
7. Update `CreativeFeatures` + `KeyboardNavigation`
8. Rewrite `Preferences` page
9. Expand density CSS

