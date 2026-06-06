import { apiRequest } from "./api";

export type DashboardSummary = {
  barbers: number;
  services: number;
  appointments: number;
};

export const dashboardService = {
  summary: () => apiRequest<DashboardSummary>("/dashboard/summary"),
};

