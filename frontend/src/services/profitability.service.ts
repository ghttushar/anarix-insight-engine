import { api } from "@/lib/api-client";
import {
  ProfitabilitySummary,
  ProfitabilityProduct,
  ProfitabilityOrder,
  GeographicalData,
  PnLRow,
  TrendDataPoint,
  ScatterDataPoint,
  PnLLineItem,
} from "@/types/profitability";

export interface ProfitabilityService {
  getSummaries: () => Promise<ProfitabilitySummary[]>;
  getProducts: () => Promise<ProfitabilityProduct[]>;
  getOrders: () => Promise<ProfitabilityOrder[]>;
  getGeographicalData: () => Promise<GeographicalData[]>;
  getPnLData: () => Promise<PnLRow[]>;
  getTrendData: () => Promise<TrendDataPoint[]>;
  getTrendDataByPeriod: () => Promise<Record<string, TrendDataPoint[]>>;
  getScatterData: () => Promise<ScatterDataPoint[]>;
  getUnifiedPnL: () => Promise<PnLLineItem[]>;
  updateCogs: (productId: string, newCogs: number) => Promise<void>;
}

const realService: ProfitabilityService = {
  getSummaries: () => api.get<ProfitabilitySummary[]>("/profitability/summaries"),
  getProducts: () => api.get<ProfitabilityProduct[]>("/profitability/products"),
  getOrders: () => api.get<ProfitabilityOrder[]>("/profitability/orders"),
  getGeographicalData: () => api.get<GeographicalData[]>("/profitability/geo"),
  getPnLData: () => api.get<PnLRow[]>("/profitability/pnl"),
  getTrendData: () => api.get<TrendDataPoint[]>("/profitability/trends"),
  getTrendDataByPeriod: () => api.get<Record<string, TrendDataPoint[]>>("/profitability/trends/by-period"),
  getScatterData: () => api.get<ScatterDataPoint[]>("/profitability/scatter"),
  getUnifiedPnL: () => api.get<PnLLineItem[]>("/profitability/unified-pnl"),
  updateCogs: (productId, newCogs) =>
    api.put<void>(`/profitability/products/${productId}/cogs`, { cogs: newCogs }),
};

let currentService: ProfitabilityService = realService;

export function setProfitabilityService(service: ProfitabilityService) {
  currentService = service;
}

export function getProfitabilityService(): ProfitabilityService {
  return currentService;
}

export const getSummaries = () => currentService.getSummaries();
export const getProducts = () => currentService.getProducts();
export const getOrders = () => currentService.getOrders();
export const getGeographicalData = () => currentService.getGeographicalData();
export const getPnLData = () => currentService.getPnLData();
export const getTrendData = () => currentService.getTrendData();
export const getTrendDataByPeriod = () => currentService.getTrendDataByPeriod();
export const getScatterData = () => currentService.getScatterData();
export const getUnifiedPnL = () => currentService.getUnifiedPnL();
export const updateCogs = (productId: string, newCogs: number) =>
  currentService.updateCogs(productId, newCogs);
