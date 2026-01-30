export interface ProfitabilitySummary {
  period: "today" | "yesterday" | "this_month" | "last_month";
  dateLabel: string;
  dateRange?: string;
  gmv: number;
  authSales: number;
  orders: number;
  units: number;
  returns: number;
  cancelled: number;
  adCost: number;
  estPayout: number;
  netProfit: number;
  breakdown: {
    organic: number;
    sponsoredProducts: number;
    sponsoredBrands: number;
    sponsoredVideo: number;
    cogs: number;
    totalExpenses: number;
    tacos: number;
    roas: number;
  };
}

export interface ProfitabilityProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
  sku: string;
  price: number;
  cogs: number;
  units: number;
  refundUnits: number;
  cancelledUnits: number;
  gmv: number;
  authSales: number;
  refundSales: number;
  cancelledSales: number;
  adSpend: number;
  commissionProduct: number;
  commissionShipping: number;
  wfsFulfillmentFee: number;
  shippingFees: number;
  netProfit: number;
  additionalFee: number;
  profitMargin?: number;
  totalSales?: number;
  weeklyData?: Record<string, number>;
}

export interface GeographicalData {
  id: string;
  region: string;
  countryCode: string;
  flag: string;
  stocks: number;
  orders: number;
  unitsSold: number;
  refunds: number;
  sales: number;
  amazonFees: number;
  sellableReturns: number;
  children?: GeographicalData[];
}

export interface PnLRow {
  id: string;
  parameter: string;
  isParent: boolean;
  isExpanded?: boolean;
  indent: number;
  weeklyValues: Record<string, number | null>;
  total: number | null;
  children?: PnLRow[];
}

export interface TrendDataPoint {
  week: string;
  orders: number;
  units: number;
}

export interface ScatterDataPoint {
  id: string;
  name: string;
  profitMargin: number;
  totalSales: number;
  quadrant: "winners" | "grow" | "optimize" | "review";
}
