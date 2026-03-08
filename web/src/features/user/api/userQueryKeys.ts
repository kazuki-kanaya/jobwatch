import { dashboardQueryKeys } from "@/lib/queryKeys";

export const userQueryKeys = {
  root: [...dashboardQueryKeys.root, "user"] as const,
  current: () => [...userQueryKeys.root, "current"] as const,
};
