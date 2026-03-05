import { useQuery } from "@tanstack/react-query";
import {
  lookupUsersUsersLookupPost,
  useListMembersWorkspacesWorkspaceIdMembersGet,
  useListUserWorkspacesUsersMeWorkspacesGet,
  useReadCurrentUserUsersMeGet,
} from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { workspaceQueryKeys } from "./workspaceQueryKeys";

type UseWorkspaceQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId?: string;
};

export const useWorkspaceQueries = ({ accessToken, enabled, workspaceId }: UseWorkspaceQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);
  const safeWorkspaceId = workspaceId ?? "";
  // TODO: Move current-user query to features/user and inject userId into workspace flows.
  const currentUserQuery = useReadCurrentUserUsersMeGet({
    query: {
      queryKey: workspaceQueryKeys.currentUser(),
      enabled,
    },
    request,
  });

  const workspacesQuery = useListUserWorkspacesUsersMeWorkspacesGet({
    query: {
      queryKey: workspaceQueryKeys.list(),
      enabled,
    },
    request,
  });

  const membersQuery = useListMembersWorkspacesWorkspaceIdMembersGet(safeWorkspaceId, {
    query: {
      queryKey: workspaceQueryKeys.members(safeWorkspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    request,
  });
  const memberUserIds = [...new Set((membersQuery.data?.members ?? []).map((member) => member.user_id))].sort();
  const usersLookupQuery = useQuery({
    queryKey: workspaceQueryKeys.usersLookup(memberUserIds),
    enabled: enabled && Boolean(workspaceId) && memberUserIds.length > 0,
    queryFn: async ({ signal }) => {
      const response = await lookupUsersUsersLookupPost(
        { user_ids: memberUserIds },
        {
          signal,
          ...request,
        },
      );

      return response;
    },
  });

  return {
    currentUserQuery,
    workspacesQuery,
    membersQuery,
    usersLookupQuery,
  };
};
