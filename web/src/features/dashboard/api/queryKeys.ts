// Responsibility: Provide namespaced React Query keys for dashboard-related data.
export const dashboardQueryKeys = {
  root: ["dashboard"] as const,
  workspaces: () => ["dashboard", "workspaces", "list"] as const,
  hosts: (workspaceId: string) => ["dashboard", "hosts", "list", workspaceId] as const,
  jobs: (workspaceId: string) => ["dashboard", "jobs", "list", workspaceId] as const,
};
