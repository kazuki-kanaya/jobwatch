// Responsibility: Expose dashboard-scoped query hooks wrapping Orval generated clients.

import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import {
  useListHostsWorkspacesWorkspaceIdHostsGet,
  useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet,
  useListUserWorkspacesUsersMeWorkspacesGet,
} from "@/generated/api";

const getAuthorizedFetchOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } satisfies RequestInit;
};

export const useDashboardWorkspacesQuery = (accessToken: string | undefined, enabled: boolean) => {
  return useListUserWorkspacesUsersMeWorkspacesGet({
    query: {
      queryKey: dashboardQueryKeys.workspaces(),
      enabled,
    },
    fetch: getAuthorizedFetchOptions(accessToken),
  });
};

export const useDashboardHostsQuery = (
  workspaceId: string | null,
  accessToken: string | undefined,
  enabled: boolean,
) => {
  const safeWorkspaceId = workspaceId ?? "";

  return useListHostsWorkspacesWorkspaceIdHostsGet(safeWorkspaceId, {
    query: {
      queryKey: dashboardQueryKeys.hosts(safeWorkspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    fetch: getAuthorizedFetchOptions(accessToken),
  });
};

export const useDashboardJobsQuery = (
  workspaceId: string | null,
  accessToken: string | undefined,
  enabled: boolean,
) => {
  const safeWorkspaceId = workspaceId ?? "";

  return useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet(safeWorkspaceId, {
    query: {
      queryKey: dashboardQueryKeys.jobs(safeWorkspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    fetch: getAuthorizedFetchOptions(accessToken),
  });
};
