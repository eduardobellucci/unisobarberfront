import { apiRequest } from "./api";
import type { Barber } from "../types";

export const barbersService = {
  list: () => apiRequest<Barber[]>("/barbers"),
  get: (id: string) => apiRequest<Barber>(`/barbers/${id}`),
  create: (payload: Omit<Barber, "id">) => apiRequest<Barber>("/barbers", { method: "POST", body: payload }),
  update: (id: string, payload: Partial<Omit<Barber, "id">>) =>
    apiRequest<Barber>(`/barbers/${id}`, { method: "PUT", body: payload }),
  remove: (id: string) => apiRequest<void>(`/barbers/${id}`, { method: "DELETE" }),
};

