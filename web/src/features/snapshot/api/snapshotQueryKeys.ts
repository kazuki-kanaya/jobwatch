export const snapshotQueryKeys = {
  root: ["snapshot"] as const,
  byWorkspace: (workspaceId: string) => [...snapshotQueryKeys.root, "workspace", workspaceId] as const,
};
