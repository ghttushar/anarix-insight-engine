

# Fix Total Row, Add Calendar Date Pickers, Add Currency Display Settings

## 1. Fix Campaign Table Total Row Error

**Problem**: `CampaignTableTotalRow` uses `colSpan={4}` for the "Total" label but doesn't account for the conditional "Active" column in edit mode, nor does it know about edit mode at all. The empty cells for Start Date, End Date, Bidding Strategy (3 cells) plus the colSpan(4) = 7 columns, but the header has Status + Campaign Name + Active(conditional) before those — mismatch causes misaligned cells.

**Fix**: Pass `viewMode` prop to `CampaignTableTotalRow`. When `viewMode === "edit"`, add 1 to colSpan to account for the Active column. Also verify the colSpan math: Status(1) + CampaignName(1) = 2 base, then StartDate, EndDate, BiddingStrategy as empty cells. Current colSpan={4} covers Status + Name + 2 extra — should be colSpan={2} with 3 separate empty cells. Will correct.

**Files**: `CampaignTableTotalRow.tsx`, `CampaignTable.tsx`

## 2. Replace `<Input type="date">` with Calendar Popover in Edit Mode

**Problem**: Edit mode uses native `<Input type="date">` for Start Date and End Date — looks inconsistent and lacks the app's calendar styling.

**Fix**: Replace with a `Popover` + `Calendar` component (same pattern used in `AppTaskbar.tsx`). Single date mode. Format display as `MMM dd, yyyy`. On select, call `onCampaignUpdate`.

**File**: `CampaignTable.tsx`

## 3. Create Currency Context + Settings Section

This is the core feature. Here is how it would work in production:

### Production Architecture (for your notes)

```text
┌─────────────────────────────────────────────────┐
│  User selects "Display Currency: INR"           │
│  in Settings > Configuration                    │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  CurrencyContext stores:                        │
│  - baseCurrency: "USD" (from marketplace)       │
│  - displayCurrency: "INR" (user preference)     │
│  - exchangeRate: fetched from API               │
│  - lastUpdated: timestamp                       │
│  - formatCurrency(value): formats with symbol   │
└──────────────────┬──────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
┌──────────────┐    ┌───────────────────────┐
│ Edge Function│    │  All UI components    │
│ /get-rates   │    │  call useCurrency()   │
│              │    │  .formatCurrency(val) │
│ Fetches from │    │  instead of local     │
│ exchangerate │    │  Intl.NumberFormat    │
│ -api.com     │    │                       │
│ Caches 1hr   │    │  Value = raw * rate   │
│ in Supabase  │    │  Symbol = from config │
└──────────────┘    └───────────────────────┘
```

**How it works in production:**
1. An Edge Function (`get-exchange-rates`) calls a free exchange rate API (e.g., `exchangerate-api.com` or `open.er-api.com`) every hour, caches rates in a Supabase table `exchange_rates` with columns: `base_currency`, `target_currency`, `rate`, `updated_at`.
2. The frontend `CurrencyContext` fetches the rate for the user's selected display currency on load and every 60 minutes.
3. Every `formatCurrency()` call multiplies the raw USD value by the exchange rate and formats with the target currency's symbol/locale.
4. The original USD value is always stored — conversion is display-only.
5. A tooltip or small label shows "Rate: 1 USD = 83.42 INR · Updated 5 min ago" so users know the rate is live.

**For the current mock implementation** (no Supabase connected): We store a static rate map with common currencies and a `CurrencyContext` that provides `formatCurrency()` globally. The settings page will note "rates calculated according to international market in realtime" and show the mock rate.

### Implementation

**New file: `src/contexts/CurrencyContext.tsx`**
- Stores `displayCurrency` (default "USD"), persisted to localStorage
- Contains a static exchange rate map (USD base): USD, EUR, GBP, INR, CAD, AUD, JPY, BRL, MXN
- Exposes `formatCurrency(value: number): string` that converts and formats
- Exposes `exchangeRate`, `lastUpdated`, `currencySymbol`

**Supported currencies (initial set):**
| Code | Name | Mock Rate |
|------|------|-----------|
| USD | US Dollar | 1.00 |
| EUR | Euro | 0.92 |
| GBP | British Pound | 0.79 |
| INR | Indian Rupee | 83.42 |
| CAD | Canadian Dollar | 1.36 |
| AUD | Australian Dollar | 1.53 |
| JPY | Japanese Yen | 149.50 |
| BRL | Brazilian Real | 4.97 |
| MXN | Mexican Peso | 17.15 |

**Update `src/pages/settings/Configuration.tsx`**
- Add "Currency Display" section between Defaults and Notifications
- Dropdown to select display currency
- Show current rate: "1 USD = 83.42 INR"
- Note: "Exchange rates are calculated according to international market rates in realtime"

**Update all `formatCurrency` usages across ~29 files**
- Replace local `formatCurrency` functions with `useCurrency().formatCurrency`
- Files include: all table components, KPI strips, profitability components, dashboard pages, etc.

**Update `src/App.tsx`**
- Wrap with `CurrencyProvider`

### Files to create/modify:
1. **Create** `src/contexts/CurrencyContext.tsx`
2. **Edit** `src/App.tsx` — add CurrencyProvider
3. **Edit** `src/pages/settings/Configuration.tsx` — add currency section
4. **Edit** `src/components/tables/CampaignTable.tsx` — calendar + useCurrency
5. **Edit** `src/components/tables/CampaignTableTotalRow.tsx` — fix colSpan + useCurrency
6. **Edit** all 29 files with `formatCurrency` — replace with context hook

**~32 files total.**

