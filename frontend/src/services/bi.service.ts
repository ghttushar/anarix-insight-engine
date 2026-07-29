import { api } from "@/lib/api-client";
import {
  Brand,
  TrackedKeyword,
  SOVDataPoint,
  KeywordSOVData,
  ProductSOVData,
  SOVMetrics,
} from "@/types/bi";

export interface BIService {
  getSOVMetrics: () => Promise<SOVMetrics>;
  getBrands: () => Promise<Brand[]>;
  getSOVTrendData: () => Promise<SOVDataPoint[]>;
  getTrackedKeywords: () => Promise<TrackedKeyword[]>;
  getKeywordSOVData: () => Promise<KeywordSOVData[]>;
  getProductSOVData: () => Promise<ProductSOVData[]>;
}

const realService: BIService = {
  getSOVMetrics: () => api.get<SOVMetrics>("/bi/sov-metrics"),
  getBrands: () => api.get<Brand[]>("/bi/brands"),
  getSOVTrendData: () => api.get<SOVDataPoint[]>("/bi/sov-trend"),
  getTrackedKeywords: () => api.get<TrackedKeyword[]>("/bi/keywords"),
  getKeywordSOVData: () => api.get<KeywordSOVData[]>("/bi/keyword-sov"),
  getProductSOVData: () => api.get<ProductSOVData[]>("/bi/product-sov"),
};

let currentService: BIService = realService;

export function setBIService(service: BIService) {
  currentService = service;
}

export function getBIService(): BIService {
  return currentService;
}

export const getSOVMetrics = () => currentService.getSOVMetrics();
export const getBrands = () => currentService.getBrands();
export const getSOVTrendData = () => currentService.getSOVTrendData();
export const getTrackedKeywords = () => currentService.getTrackedKeywords();
export const getKeywordSOVData = () => currentService.getKeywordSOVData();
export const getProductSOVData = () => currentService.getProductSOVData();
