export const workspaceQueryKeys = {
  root: ["workspaces"] as const,
  list: () => [...workspaceQueryKeys.root, "list"] as const,
  detail: (workspaceId: string) => [...workspaceQueryKeys.root, "detail", workspaceId] as const,
  members: (workspaceId: string) => [...workspaceQueryKeys.root, "members", workspaceId] as const,
  usersLookup: (userIds: string[]) => [...workspaceQueryKeys.root, "users", "lookup", ...userIds] as const,
};
