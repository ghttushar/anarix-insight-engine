export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: "campaign" | "targeting";
}

export interface RuleCondition {
  id: string;
  metric: string;
  operator: string;
  valueType: "absolute" | "percentage";
  value: number;
}

export interface RuleAction {
  type: string;
  value: number;
}

export interface RuleCriteria {
  id: string;
  priority: number;
  name: string;
  conditions: RuleCondition[];
  action: RuleAction;
}

export interface AppliedRule {
  id: string;
  name: string;
  ruleType: string;
  entitiesCount: number;
  entityLabel: string;
  frequency: string;
  lastRun: string;
  status: "active" | "paused" | "draft";
}

export const ruleTemplates: RuleTemplate[] = [
  { id: "inventory", name: "Inventory Rule", description: "Adjust bids based on inventory levels and stock status", category: "campaign" },
  { id: "platform", name: "Platform Rule", description: "Optimize campaigns across different platform placements", category: "campaign" },
  { id: "placement", name: "Placement Rule", description: "Control bid modifiers for specific ad placement types", category: "campaign" },
  { id: "sov", name: "Share of Voice Rule", description: "Maintain target share of voice thresholds for brands", category: "campaign" },
  { id: "state-change", name: "State Change Rule", description: "Automate campaign state transitions based on performance", category: "campaign" },
  { id: "budget", name: "Budget Rule", description: "Dynamically adjust daily budgets based on spend velocity", category: "campaign" },
  { id: "bidding-strategy", name: "Bidding Strategy Rule", description: "Switch bidding strategies based on campaign maturity", category: "campaign" },
  { id: "bidder", name: "Bidder Rule", description: "Fine-tune bid amounts using performance-based logic", category: "campaign" },
  { id: "keyword-harvesting", name: "Keyword Harvesting Rule", description: "Auto-harvest converting search terms into keyword targets", category: "campaign" },
  { id: "keyword", name: "Keyword Rule", description: "Manage keyword bids based on ACOS and conversion metrics", category: "targeting" },
  { id: "target", name: "Target Rule", description: "Optimize product targeting bids by performance thresholds", category: "targeting" },
];

export const metricOptions = [
  { value: "acos", label: "ACOS" },
  { value: "roas", label: "ROAS" },
  { value: "cpc", label: "CPC" },
  { value: "ctr", label: "CTR" },
  { value: "cvr", label: "CVR" },
  { value: "impressions", label: "Impressions" },
  { value: "clicks", label: "Clicks" },
  { value: "spend", label: "Spend" },
  { value: "sales", label: "Sales" },
  { value: "orders", label: "Orders" },
];

export const operatorOptions = [
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "greater_equal", label: "Greater than or equal" },
  { value: "less_equal", label: "Less than or equal" },
  { value: "equals", label: "Equals" },
];

export const actionOptions = [
  { value: "set_bid", label: "Set bid to" },
  { value: "increase_bid_percent", label: "Increase bid by %" },
  { value: "decrease_bid_percent", label: "Decrease bid by %" },
  { value: "increase_bid_amount", label: "Increase bid by amount" },
  { value: "decrease_bid_amount", label: "Decrease bid by amount" },
  { value: "pause", label: "Pause" },
  { value: "enable", label: "Enable" },
  { value: "set_budget", label: "Set budget to" },
];

export const lookbackOptions = [
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "60", label: "Last 60 days" },
];

export const frequencyOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const suggestionChips = [
  "Find underperforming products to optimize",
  "Pause keywords with high ACOS and low conversions",
  "Increase bids on top-performing search terms",
  "Reduce budget on campaigns with declining ROAS",
  "Harvest converting search terms from auto campaigns",
  "Adjust bids based on time-of-day performance",
];

export const appliedRules: AppliedRule[] = [
  { id: "ar-1", name: "High ACOS Bid Reducer", ruleType: "Keyword Rule", entitiesCount: 142, entityLabel: "keywords", frequency: "Daily", lastRun: "2026-03-08 14:30", status: "active" },
  { id: "ar-2", name: "Low ROAS Pauser", ruleType: "Campaign Rule", entitiesCount: 8, entityLabel: "campaigns", frequency: "Daily", lastRun: "2026-03-08 14:30", status: "active" },
  { id: "ar-3", name: "Search Term Harvester", ruleType: "Keyword Harvesting Rule", entitiesCount: 24, entityLabel: "campaigns", frequency: "Weekly", lastRun: "2026-03-07 08:00", status: "active" },
  { id: "ar-4", name: "Budget Cap Protection", ruleType: "Budget Rule", entitiesCount: 15, entityLabel: "campaigns", frequency: "Hourly", lastRun: "2026-03-08 15:00", status: "active" },
  { id: "ar-5", name: "Zero Converter Pauser", ruleType: "Target Rule", entitiesCount: 312, entityLabel: "targets", frequency: "Daily", lastRun: "2026-03-08 14:30", status: "paused" },
  { id: "ar-6", name: "Winner Bid Booster", ruleType: "Bidder Rule", entitiesCount: 67, entityLabel: "keywords", frequency: "Daily", lastRun: "2026-03-08 14:30", status: "draft" },
  { id: "ar-7", name: "Placement Bid Modifier", ruleType: "Placement Rule", entitiesCount: 5, entityLabel: "campaigns", frequency: "Weekly", lastRun: "2026-03-04 08:00", status: "active" },
  { id: "ar-8", name: "Inventory Sync Rule", ruleType: "Inventory Rule", entitiesCount: 189, entityLabel: "products", frequency: "Daily", lastRun: "2026-03-08 06:00", status: "active" },
];
