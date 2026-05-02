import { apiRequest } from "./api";
import type { AppSettings } from "../types";

export const settingsService = {
  get: () => apiRequest<AppSettings>("/settings"),
  update: (payload: AppSettings) => apiRequest<AppSettings>("/settings", { method: "PUT", body: payload }),
};

