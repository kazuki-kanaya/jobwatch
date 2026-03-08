export const jobQueryKeys = {
  root: ["jobs"] as const,
  byWorkspace: (workspaceId: string) => [...jobQueryKeys.root, "workspace", workspaceId] as const,
};
