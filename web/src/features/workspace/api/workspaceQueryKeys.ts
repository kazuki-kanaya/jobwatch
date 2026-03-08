import { dashboardQueryKeys } from "@/lib/queryKeys";

export const workspaceQueryKeys = {
  root: [...dashboardQueryKeys.root, "workspace"] as const,
  list: () => [...workspaceQueryKeys.root, "list"] as const,
  detail: (workspaceId: string) => [...workspaceQueryKeys.root, "detail", workspaceId] as const,
  members: (workspaceId: string) => [...workspaceQueryKeys.root, "members", workspaceId] as const,
  usersLookup: (userIds: string[]) => [...workspaceQueryKeys.root, "users", "lookup", ...userIds] as const,
};
