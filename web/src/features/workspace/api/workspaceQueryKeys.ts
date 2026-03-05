export const workspaceQueryKeys = {
  root: ["workspaces"] as const,
  list: () => [...workspaceQueryKeys.root, "list"] as const,
};
