import { api } from "@/lib/api-client";
import {
  HourlyDataPoint,
  DayPartingSchedule,
  ExecutionHistory,
  DayPartingCampaign,
  HourlyMetricsSummary,
} from "@/types/dayparting";

export interface DayPartingService {
  getHourlyData: () => Promise<HourlyDataPoint[]>;
  getHourlySummary: () => Promise<HourlyMetricsSummary>;
  getCampaigns: () => Promise<DayPartingCampaign[]>;
  getSchedules: () => Promise<DayPartingSchedule[]>;
  getExecutionHistory: () => Promise<ExecutionHistory[]>;
  createSchedule: (schedule: Omit<DayPartingSchedule, "id" | "createdAt" | "updatedAt">) => Promise<DayPartingSchedule>;
  updateSchedule: (id: string, schedule: Partial<DayPartingSchedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

const realService: DayPartingService = {
  getHourlyData: () => api.get<HourlyDataPoint[]>("/day-parting/hourly"),
  getHourlySummary: () => api.get<HourlyMetricsSummary>("/day-parting/summary"),
  getCampaigns: () => api.get<DayPartingCampaign[]>("/day-parting/campaigns"),
  getSchedules: () => api.get<DayPartingSchedule[]>("/day-parting/schedules"),
  getExecutionHistory: () => api.get<ExecutionHistory[]>("/day-parting/history"),
  createSchedule: (schedule) =>
    api.post<DayPartingSchedule>("/day-parting/schedules", schedule),
  updateSchedule: (id, schedule) =>
    api.put<void>(`/day-parting/schedules/${id}`, schedule),
  deleteSchedule: (id) =>
    api.delete<void>(`/day-parting/schedules/${id}`),
};

let currentService: DayPartingService = realService;

export function setDayPartingService(service: DayPartingService) {
  currentService = service;
}

export function getDayPartingService(): DayPartingService {
  return currentService;
}

export const getHourlyData = () => currentService.getHourlyData();
export const getHourlySummary = () => currentService.getHourlySummary();
export const getCampaigns = () => currentService.getCampaigns();
export const getSchedules = () => currentService.getSchedules();
export const getExecutionHistory = () => currentService.getExecutionHistory();
export const createSchedule = (s: Omit<DayPartingSchedule, "id" | "createdAt" | "updatedAt">) =>
  currentService.createSchedule(s);
export const updateSchedule = (id: string, s: Partial<DayPartingSchedule>) =>
  currentService.updateSchedule(id, s);
export const deleteSchedule = (id: string) => currentService.deleteSchedule(id);
