# End-to-End Audit: Incomplete Features, Dead Buttons, and Missing Pages

After scanning all routes, navigation links, button handlers, and page logic, here is every gap found.

---

## Category 1: Dead Buttons (No Action / No Navigation)


| Location                      | Element                               | Issue                                                                 |
| ----------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| **Login page**                | "Forgot Password?" button             | No `onClick` handler — does nothing                                   |
| **Login page**                | "Start a Free Trial" button           | No `onClick` handler — does nothing                                   |
| **Login page**                | "Terms of Service" link               | `href="#"` — goes nowhere                                             |
| **Login page**                | "Privacy Policy" link                 | `href="#"` — goes nowhere                                             |
| **Sidebar profile dropdown**  | "Profile" menu item                   | No `onClick` / no route — does nothing                                |
| **Sidebar profile dropdown**  | "Logout" menu item                    | No `onClick` — does nothing                                           |
| **Campaign Manager**          | Download button in toolbar            | `onDownload={() => {}}` — empty handler                               |
| **Impact Analysis**           | Filter button in toolbar              | `onFilter={() => {}}` — empty handler                                 |
| **Targeting Actions**         | Filter button in toolbar              | `onFilter={() => {}}` — empty handler                                 |
| **AMC Queries**               | "Edit" and "Duplicate" dropdown items | No `onClick` handlers                                                 |
| **Client Portal**             | "Create Report" button                | Shows toast only ("Opening report builder...") — no actual page/modal |
| **Client Portal**             | "Eye" preview button on reports       | Toast only — no preview page                                          |
| **Client Portal**             | "Download" button on reports          | Toast only — no actual download                                       |
| **Creative Analyzer**         | "Upload Creatives" button             | Toast only — no upload flow                                           |
| **Catalog > Inventory & Ads** | "Apply All Suggestions" button        | Toast only — no actual logic                                          |
| **Catalog > Inventory & Ads** | "Sync Inventory" button               | Toast only — no actual logic                                          |


## Category 2: Missing Pages / Routes


| Expected Page                          | How User Reaches It             | Issue                           |
| -------------------------------------- | ------------------------------- | ------------------------------- |
| **Profile page** (`/settings/profile`) | Sidebar dropdown → "Profile"    | No route exists, no page file   |
| **Signup / Free Trial page**           | Login → "Start a Free Trial"    | No route or page                |
| **Forgot Password page**               | Login → "Forgot Password?"      | No route or page                |
| **Report Builder / Editor**            | Client Portal → "Create Report" | No route or page — just a toast |


## create all the missing thing other than ai implementation,  download butons,  and anything that is in added new page, and remove all the hide butons there should be no hide option anywhere throughout the app   
  
  
  
Category 3: Logout Not Functional

The "Logout" button in the sidebar dropdown has no handler. It should:

- Clear account state / localStorage
- Navigate to `/login`

## Category 4: No Confirmation on Destructive Actions

Several delete/remove actions across the app lack confirmation modals (per spec, Section 7.4):

- **Settings > Accounts**: `removeAccount` called directly — no confirmation dialog
- **AMC Queries**: "Delete" dropdown item — no handler at all
- **Scheduled Jobs**: `onDelete` passed but no confirmation gate

---

## Proposed Implementation Plan

### Phase 1: Fix Dead Buttons & Missing Handlers (High Priority)

1. **Login page**: Wire "Forgot Password?" and "Start a Free Trial" to show toast messages ("Coming soon — contact support") since these are auth flows that need a backend. Same for Terms/Privacy links.
2. **Sidebar "Profile"**: Add navigation to `/settings/appearance` (reuse Preferences as profile landing) or create a dedicated `/settings/profile` page with basic user info display.
3. **Sidebar "Logout"**: Add `onClick` that calls `clearAccounts()`, clears localStorage, and navigates to `/login`.
4. **Campaign Manager toolbar**: Wire `onDownload` to trigger CSV export toast (consistent with other pages).
5. **Impact Analysis & Targeting Actions toolbars**: Wire `onFilter` to open a filter popover or show toast placeholder.
6. **AMC Queries dropdown**: Wire "Edit" and "Duplicate" with toast feedback, wire "Delete" with confirmation modal.

### Phase 2: Missing Pages (Medium Priority)

7. **Create `/settings/profile` page**: Simple read-only profile card showing name, email, role, and account info from `AccountContext`. Edit capability via inline fields.
8. **Client Portal "Create Report"**: Build a basic report creation modal/form with report name, client, period, and sections selection — saves to mock data and shows in table.

### Phase 3: Safety & Confirmation Gates

9. **Add confirmation dialogs** before all destructive actions:
  - Account removal (Settings > Accounts)
  - Schedule deletion (Day Parting)
  - AMC query deletion  
    


### Summary of Files to Create/Modify


| File                                         | Action                                           |
| -------------------------------------------- | ------------------------------------------------ |
| `src/pages/settings/Profile.tsx`             | **Create** — new Profile page                    |
| `src/pages/auth/Login.tsx`                   | **Modify** — wire dead buttons                   |
| `src/components/layout/AppSidebar.tsx`       | **Modify** — wire Profile nav + Logout handler   |
| `src/App.tsx`                                | **Modify** — add `/settings/profile` route       |
| `src/pages/advertising/CampaignManager.tsx`  | **Modify** — wire download handler               |
| `src/pages/advertising/ImpactAnalysis.tsx`   | **Modify** — wire filter handler                 |
| `src/pages/advertising/TargetingActions.tsx` | **Modify** — wire filter handler                 |
| `src/pages/amc/Queries.tsx`                  | **Modify** — wire Edit/Duplicate/Delete handlers |
| `src/pages/reports/ClientPortal.tsx`         | **Modify** — add create report modal             |
| `src/pages/settings/Accounts.tsx`            | **Modify** — add delete confirmation dialog      |
| ## `src/pages/dayparting/ScheduledJobs.tsx`  | **Modify** — add delete confirmation             |
