import { dashboardQueryKeys } from "@/lib/queryKeys";

export const invitationQueryKeys = {
  root: [...dashboardQueryKeys.root, "invitation"] as const,
  list: (workspaceId: string) => [...invitationQueryKeys.root, "list", workspaceId] as const,
  usersLookup: (userIds: string[]) => [...invitationQueryKeys.root, "users", "lookup", ...userIds] as const,
};
