import { api } from "@/lib/api-client";
import type { TargetingAction, ImpactComparison, SearchTerm, ProductTarget, PlatformData, PageTypeData, HarvestCandidate, PacingCampaign, AnomalyAlert } from "@/types/advertising";

export interface AdvertisingService {
  getTargetingActions: () => Promise<TargetingAction[]>;
  getTargetingCampaigns: () => Promise<{ id: string; name: string }[]>;
  getTargetingAdGroups: () => Promise<{ id: string; name: string; campaignId: string }[]>;
  getSearchHarvesting: () => Promise<HarvestCandidate[]>;
  getPacingCampaigns: () => Promise<PacingCampaign[]>;
  getPacingAlerts: () => Promise<{ id: string; campaignId: string; message: string; severity: string; timestamp: string }[]>;
  getAnomalyAlerts: () => Promise<AnomalyAlert[]>;
  getImpactCampaigns: () => Promise<ImpactComparison[]>;
  getImpactAdGroups: () => Promise<ImpactComparison[]>;
  getImpactProducts: () => Promise<ImpactComparison[]>;
  getCreativeAssets: () => Promise<{ id: string; name: string; type: string; thumbnail?: string }[]>;
  getCreativeInsights: () => Promise<{ id: string; assetId: string; metric: string; value: number; benchmark: number }[]>;
}

const realService: AdvertisingService = {
  getTargetingActions: () => api.get<TargetingAction[]>("/advertising/targeting-actions"),
  getTargetingCampaigns: () => api.get<{ id: string; name: string }[]>("/advertising/targeting-campaigns"),
  getTargetingAdGroups: () => api.get<{ id: string; name: string; campaignId: string }[]>("/advertising/targeting-ad-groups"),
  getSearchHarvesting: () => api.get<HarvestCandidate[]>("/advertising/search-harvesting"),
  getPacingCampaigns: () => api.get<PacingCampaign[]>("/advertising/pacing-campaigns"),
  getPacingAlerts: () => api.get<{ id: string; campaignId: string; message: string; severity: string; timestamp: string }[]>("/advertising/pacing-alerts"),
  getAnomalyAlerts: () => api.get<AnomalyAlert[]>("/advertising/anomaly-alerts"),
  getImpactCampaigns: () => api.get<ImpactComparison[]>("/advertising/impact-campaigns"),
  getImpactAdGroups: () => api.get<ImpactComparison[]>("/advertising/impact-ad-groups"),
  getImpactProducts: () => api.get<ImpactComparison[]>("/advertising/impact-products"),
  getCreativeAssets: () => api.get<{ id: string; name: string; type: string; thumbnail?: string }[]>("/advertising/creative-assets"),
  getCreativeInsights: () => api.get<{ id: string; assetId: string; metric: string; value: number; benchmark: number }[]>("/advertising/creative-insights"),
};

let currentService: AdvertisingService = realService;

export function setAdvertisingService(service: AdvertisingService) {
  currentService = service;
}

export function getAdvertisingService(): AdvertisingService {
  return currentService;
}

export const getTargetingActions = () => currentService.getTargetingActions();
export const getTargetingCampaigns = () => currentService.getTargetingCampaigns();
export const getTargetingAdGroups = () => currentService.getTargetingAdGroups();
export const getSearchHarvesting = () => currentService.getSearchHarvesting();
export const getPacingCampaigns = () => currentService.getPacingCampaigns();
export const getPacingAlerts = () => currentService.getPacingAlerts();
export const getAnomalyAlerts = () => currentService.getAnomalyAlerts();
export const getImpactCampaigns = () => currentService.getImpactCampaigns();
export const getImpactAdGroups = () => currentService.getImpactAdGroups();
export const getImpactProducts = () => currentService.getImpactProducts();
export const getCreativeAssets = () => currentService.getCreativeAssets();
export const getCreativeInsights = () => currentService.getCreativeInsights();
