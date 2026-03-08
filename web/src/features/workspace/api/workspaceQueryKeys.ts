import { dashboardQueryKeys } from "@/lib/queryKeys";

export const workspaceQueryKeys = {
  root: [...dashboardQueryKeys.root, "workspace"] as const,
  list: () => [...workspaceQueryKeys.root, "list"] as const,
  detail: (workspaceId: string) => [...workspaceQueryKeys.root, "detail", workspaceId] as const,
};
