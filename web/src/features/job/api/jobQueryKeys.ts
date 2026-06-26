import { dashboardQueryKeys } from "@/lib/queryKeys";

export const jobQueryKeys = {
  root: [...dashboardQueryKeys.root, "job"] as const,
  byWorkspace: (workspaceId: string) => [...jobQueryKeys.root, "workspace", workspaceId] as const,
  search: (workspaceId: string, params: unknown) =>
    [...jobQueryKeys.root, "workspace", workspaceId, "search", params] as const,
};
