// Responsibility: Provide namespaced React Query keys for dashboard-related data.
export const dashboardQueryKeys = {
  root: ["dashboard"] as const,
  currentUser: () => ["dashboard", "users", "me"] as const,
  workspaces: () => ["dashboard", "workspaces", "list"] as const,
  invitations: (workspaceId: string) => ["dashboard", "invitations", "list", workspaceId] as const,
  usersLookup: (userIds: string[]) => ["dashboard", "users", "lookup", ...userIds] as const,
  hosts: (workspaceId: string) => ["dashboard", "hosts", "list", workspaceId] as const,
  members: (workspaceId: string) => ["dashboard", "members", "list", workspaceId] as const,
  jobs: (workspaceId: string) => ["dashboard", "jobs", "list", workspaceId] as const,
  jobsByHost: (workspaceId: string, hostId: string) => ["dashboard", "jobs", "host", workspaceId, hostId] as const,
};
