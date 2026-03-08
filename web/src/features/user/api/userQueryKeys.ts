export const userQueryKeys = {
  root: ["user"] as const,
  current: () => [...userQueryKeys.root, "current"] as const,
};
