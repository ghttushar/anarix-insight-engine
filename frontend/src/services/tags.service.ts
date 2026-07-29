import { api } from "@/lib/api-client";

export interface TagsService {
  getAllTags: () => Promise<string[]>;
  createTag: (name: string) => Promise<string>;
  renameTag: (oldName: string, newName: string) => Promise<void>;
  deleteTag: (name: string) => Promise<void>;
  getCampaignTags: (campaignId: string) => Promise<string[]>;
  setCampaignTags: (campaignId: string, tags: string[]) => Promise<void>;
}

const realService: TagsService = {
  getAllTags: () => api.get<string[]>("/tags"),
  createTag: (name) => api.post<string>("/tags", { name }),
  renameTag: (oldName, newName) => api.put<void>("/tags", { oldName, newName }),
  deleteTag: (name) => api.delete<void>(`/tags/${encodeURIComponent(name)}`),
  getCampaignTags: (campaignId) => api.get<string[]>(`/campaigns/${campaignId}/tags`),
  setCampaignTags: (campaignId, tags) =>
    api.put<void>(`/campaigns/${campaignId}/tags`, { tags }),
};

let currentService: TagsService = realService;

export function setTagsService(service: TagsService) {
  currentService = service;
}

export function getTagsService(): TagsService {
  return currentService;
}

export const getAllTags = () => currentService.getAllTags();
export const createTag = (name: string) => currentService.createTag(name);
export const renameTag = (oldName: string, newName: string) =>
  currentService.renameTag(oldName, newName);
export const deleteTag = (name: string) => currentService.deleteTag(name);
export const getCampaignTags = (campaignId: string) =>
  currentService.getCampaignTags(campaignId);
export const setCampaignTags = (campaignId: string, tags: string[]) =>
  currentService.setCampaignTags(campaignId, tags);
