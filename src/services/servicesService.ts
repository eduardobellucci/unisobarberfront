import { apiRequest } from "./api";
import type { Service } from "../types";

export const servicesService = {
  list: (barberId?: string) => {
    const query = barberId ? `?barberId=${barberId}` : "";
    return apiRequest<Service[]>(`/services${query}`);
  },
  get: (id: string) => apiRequest<Service>(`/services/${id}`),
  create: (payload: Omit<Service, "id">) => apiRequest<Service>("/services", { method: "POST", body: payload }),
  update: (id: string, payload: Partial<Omit<Service, "id">>) =>
    apiRequest<Service>(`/services/${id}`, { method: "PUT", body: payload }),
  remove: (id: string) => apiRequest<void>(`/services/${id}`, { method: "DELETE" }),
};

