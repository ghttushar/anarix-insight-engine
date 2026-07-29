// Single critical alert shown when Aan Live/Assisted mode is OFF.
// Replaces the full mock feed on /alerts so the user only sees one signal.
import type { Decision } from "@/data/mockDecisions";

const now = Date.now();

export const CRITICAL_ONLY_ID = "critical-b0csh8tcc6";

export const CRITICAL_ONLY_DECISION: Decision = {
  id: CRITICAL_ONLY_ID,
  source: "anarix",
  sourceRef: { label: "Amazon · Inventory", ts: now - 30 * 60 * 1000 },
  valueCents: 688_500,
  valueKind: "at_risk",
  cadence: "weekly",
  valueCaption: "revenue at risk · next 7 days",
  valueBasis:
    "Advertising eligibility was lost on 07 Jun 2026. Estimated 300 units at risk over the next 7 days at current sell-through, with 2,810 units of healthy inventory on hand (~140 days of coverage). Confidence 82%.",
  valueInputs: [
    "Estimated units at risk: 300 (next 7 days)",
    "Inventory available: 2,810 units",
    "Days of coverage: 140+",
    "Confidence: 82%",
  ],
  insight:
    "ASIN B0CSH8TCC6 · Sampler – Decaf 40 Count lost advertising eligibility on 07 Jun 2026.",
  insightDetail:
    "Amazon disabled ads on this ASIN, citing a listing-content issue. Inventory is healthy (140+ days), so the fix is content — not stock.",
  actionVerb: "Analyze Listing",
  domain: "retail",
  severity: "critical",
  status: "open",
  createdAt: now - 45 * 60 * 1000,
  updatedAt: now - 30 * 60 * 1000,
  steps: [
    { label: "Review listing history & sentiment", etaSec: 45, why: "Aan diffs recent listing changes against the last eligible version." },
    { label: "Identify the failing field", etaSec: 30, why: "Locate the specific attribute Amazon flagged." },
    { label: "Draft compliant listing edit", etaSec: 60, why: "Prepare the exact change for your approval before it goes live." },
  ],
  deepLink: { label: "Open in Amazon Seller Central", href: "#" },
  detailContent: {
    title: "Critical Advertising Eligibility Alert",
    asin: "B0CSH8TCC6",
    productName: "Sampler – Decaf 40 Count",
    sections: [
      {
        heading: "What Happened",
        body: "Advertising eligibility was lost on 2026-07-18. This is the 2nd occurrence in the past 30 days — the same warning hit this ASIN 2026-06-27 to 2026-07-03, recovered fully 2026-07-04 to 2026-07-17, then relapsed on 2026-07-18 and is still active as of today (2026-07-22).",
      },
      {
        heading: "Root Cause",
        body: `"This product's cost to Amazon does not allow us to meet customers' pricing expectations. Consider reducing the cost. It may take a few weeks for your product to become eligible to advertise after you reduce the cost."\n\nConfirmed as a Vendor Central cost-to-Amazon flag, not a listing/content issue: retail list price held flat at $18.69 the entire time and BSR stayed steady (~11.5K-12.1K in Grocery), so nothing on the customer-facing listing changed.`,
      },
      {
        heading: "Business Impact",
        body: "Opportunity Window: 30 Days\nASIN Ad Sales (30D): $135.97 | Total Sales (30D): $1,651.14\nEstimated Units at Risk: ~8 Units (at $16.98 avg. realized unit price)\nEstimated Revenue at Risk: $135.97\nASIN's Share of Account Ad Sales: 8.24%",
      },
      {
        heading: "Inventory Status",
        body: "Not Inventory Constrained\n273 units currently available (Manufacturing/Sourcing view) vs. ~3.3 units/day recent sell-through → ~82 days of cover. Inventory is not the bottleneck here.",
      },
      {
        heading: "Recommended Action",
        body: "✓ Draft Amazon/Vendor Manager Support Ticket\nNo catalog, pricing-display, or content defect was found — price and rank were both stable through the flag. This is Amazon's wholesale-cost algorithm, which only your vendor-cost terms can resolve. Escalating to the vendor manager is the right lever (the team used this same path on 2026-06-03 for a different Decaf SKU's eligibility issue).",
      },
      {
        heading: "AI Summary",
        body: "No account-team discussion was found specifically on this SKU. But related context exists: on 2026-07-02 the team flagged rising price volatility and margin pressure on 40-count packs and called Amazon's ~21-point margin-cut request \"untenable\" — pointing to a broader, account-wide cost-to-Amazon squeeze rather than an isolated glitch on this ASIN. Given this is the 2nd flare-up in 3 weeks, a one-off cost tweak may only produce a temporary fix; worth raising the recurrence pattern with the vendor manager directly.",
      },
    ],
  },
};
