import { apiRequest } from "./api";
import type { ScheduleSlot } from "../types";

export const schedulesService = {
  list: (barberId?: string) => {
    const query = barberId ? `?barberId=${barberId}` : "";
    return apiRequest<ScheduleSlot[]>(`/schedules${query}`);
  },
  create: (payload: Omit<ScheduleSlot, "id">) => apiRequest<ScheduleSlot>("/schedules", { method: "POST", body: payload }),
  remove: (id: string) => apiRequest<void>(`/schedules/${id}`, { method: "DELETE" }),
};

