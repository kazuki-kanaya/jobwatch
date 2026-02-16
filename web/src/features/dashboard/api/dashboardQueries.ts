// Responsibility: Expose dashboard-scoped query hooks wrapping Orval generated clients.

import { useQuery } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/api/queryKeys";
import {
  lookupUsersUsersLookupPost,
  useListHostsWorkspacesWorkspaceIdHostsGet,
  useListInvitationsWorkspacesWorkspaceIdInvitationsGet,
  useListJobsByHostWorkspacesWorkspaceIdHostsHostIdJobsGet,
  useListJobsByWorkspaceWorkspacesWorkspaceIdJobsGet,
  useListMembersWorkspacesWorkspaceIdMembersGet,
  useListUserWorkspacesUsersMeWorkspacesGet,
  useReadCurrentUserUsersMeGet,
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

export const useDashboardUsersLookupQuery = (userIds: string[], accessToken: string | undefined, enabled: boolean) => {
  const normalizedUserIds = [...new Set(userIds)].sort();
  const fetch = getAuthorizedFetchOptions(accessToken);

  return useQuery({
    queryKey: dashboardQueryKeys.usersLookup(normalizedUserIds),
    enabled: enabled && normalizedUserIds.length > 0,
    queryFn: async ({ signal }) => {
      const response = await lookupUsersUsersLookupPost(
        { user_ids: normalizedUserIds },
        {
          signal,
          ...fetch,
        },
      );
      if (response.status !== 200) {
        throw new Error("Failed to lookup users");
      }
      return response;
    },
  });
};

export const useDashboardCurrentUserQuery = (accessToken: string | undefined, enabled: boolean) => {
  return useReadCurrentUserUsersMeGet({
    query: {
      queryKey: dashboardQueryKeys.currentUser(),
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

export const useDashboardMembersQuery = (
  workspaceId: string | null,
  accessToken: string | undefined,
  enabled: boolean,
) => {
  const safeWorkspaceId = workspaceId ?? "";

  return useListMembersWorkspacesWorkspaceIdMembersGet(safeWorkspaceId, {
    query: {
      queryKey: dashboardQueryKeys.members(safeWorkspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    fetch: getAuthorizedFetchOptions(accessToken),
  });
};

export const useDashboardInvitationsQuery = (
  workspaceId: string | null,
  accessToken: string | undefined,
  enabled: boolean,
) => {
  const safeWorkspaceId = workspaceId ?? "";

  return useListInvitationsWorkspacesWorkspaceIdInvitationsGet(safeWorkspaceId, {
    query: {
      queryKey: dashboardQueryKeys.invitations(safeWorkspaceId),
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

export const useDashboardJobsByHostQuery = (
  workspaceId: string | null,
  hostId: string | null,
  accessToken: string | undefined,
  enabled: boolean,
) => {
  const safeWorkspaceId = workspaceId ?? "";
  const safeHostId = hostId ?? "";

  return useListJobsByHostWorkspacesWorkspaceIdHostsHostIdJobsGet(safeWorkspaceId, safeHostId, {
    query: {
      queryKey: dashboardQueryKeys.jobsByHost(safeWorkspaceId, safeHostId),
      enabled: enabled && Boolean(workspaceId) && Boolean(hostId),
    },
    fetch: getAuthorizedFetchOptions(accessToken),
  });
};
