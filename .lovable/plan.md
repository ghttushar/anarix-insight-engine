

# Reorganize Settings: Move Currency to Preferences, Consolidate Pages

## Current State (6 pages)
- **Preferences** — Theme, Density, Feature Toggle, Shortcuts, Visual Effects
- **Accounts** — Connected marketplaces
- **Users** — Team members table
- **Invitations** — Send/view invites
- **Activity Logs** — Audit trail
- **Configuration** — Defaults, Currency, Notifications, API Keys

## Proposed State (4 pages)

### 1. Preferences (`/settings/appearance`)
Add Currency Display section (between Display Density and New Feature Pages). Remove it from Configuration.

### 2. Accounts (`/settings/accounts`)
No change.

### 3. Team (`/settings/team`) — NEW
Merge Users + Invitations into a single tabbed page.
- **Members tab**: Current Users table + "Invite User" button
- **Invitations tab**: Current Invitations table + send invite form

### 4. System (`/settings/system`) — NEW
Merge remaining Configuration items + Activity Logs.
- Sections (no tabs, stacked): Defaults, Notifications, API Keys, Activity Logs (with search filter)

## Files to Change

| Action | File |
|--------|------|
| Edit | `src/pages/settings/Preferences.tsx` — add Currency Display section with `useCurrency` |
| Create | `src/pages/settings/Team.tsx` — tabbed page combining Users + Invitations |
| Create | `src/pages/settings/System.tsx` — combined Defaults, Notifications, API Keys, Activity Logs |
| Delete | `src/pages/settings/Configuration.tsx` |
| Delete | `src/pages/settings/Users.tsx` |
| Delete | `src/pages/settings/Invites.tsx` |
| Delete | `src/pages/settings/Logs.tsx` |
| Edit | `src/components/layout/AppSidebar.tsx` — update Settings nav: Preferences, Accounts, Team, System |
| Edit | `src/App.tsx` — update routes, remove old imports, add new ones |

**~9 file operations total.**

