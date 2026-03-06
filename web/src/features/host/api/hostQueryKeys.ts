export const hostQueryKeys = {
  root: ["hosts"] as const,
  list: (workspaceId: string) => [...hostQueryKeys.root, "list", workspaceId] as const,
};
