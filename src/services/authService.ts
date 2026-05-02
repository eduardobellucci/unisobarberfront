import { apiRequest } from "./api";
import type { User } from "../types";

export const authService = {
  login: (payload: { email: string; password: string }) =>
    apiRequest<User>("/auth/login", { method: "POST", body: payload }),
};

