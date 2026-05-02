import { apiRequest } from "./api";
import type { Appointment, AppointmentStatus } from "../types";

export const appointmentsService = {
  list: () => apiRequest<Appointment[]>("/appointments"),
  create: (payload: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus }) =>
    apiRequest<Appointment>("/appointments", { method: "POST", body: payload }),
  cancel: (id: string) => apiRequest<Appointment>(`/appointments/${id}/cancel`, { method: "PUT" }),
  updateStatus: (id: string, status: AppointmentStatus) =>
    apiRequest<Appointment>(`/appointments/${id}/status`, { method: "PUT", body: { status } }),
};

