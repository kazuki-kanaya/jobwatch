import { dashboardQueryKeys } from "@/lib/queryKeys";

export const hostQueryKeys = {
  root: [...dashboardQueryKeys.root, "host"] as const,
  list: (workspaceId: string) => [...hostQueryKeys.root, "list", workspaceId] as const,
};
