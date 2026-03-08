import { dashboardQueryKeys } from "@/lib/queryKeys";

export const memberQueryKeys = {
  root: [...dashboardQueryKeys.root, "member"] as const,
  list: (workspaceId: string) => [...memberQueryKeys.root, "list", workspaceId] as const,
  usersLookup: (userIds: string[]) => [...memberQueryKeys.root, "users", "lookup", ...userIds] as const,
};
