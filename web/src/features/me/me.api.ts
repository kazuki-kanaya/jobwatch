import type { MeResponse } from "@/features/me/me.types";
import { apiClient } from "@/lib/apiClient";

export const getMe = () => {
  return apiClient.get<MeResponse>("/users/me");
};
