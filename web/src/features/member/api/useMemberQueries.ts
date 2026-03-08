import { useQuery } from "@tanstack/react-query";
import { lookupUsersUsersLookupPost, useListMembersWorkspacesWorkspaceIdMembersGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { memberQueryKeys } from "./memberQueryKeys";

type UseMemberQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId: string;
};

export const useMemberQueries = ({ accessToken, enabled, workspaceId }: UseMemberQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  const membersQuery = useListMembersWorkspacesWorkspaceIdMembersGet(workspaceId, {
    query: {
      queryKey: memberQueryKeys.list(workspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    request,
  });

  const memberUserIds = [...new Set((membersQuery.data?.members ?? []).map((member) => member.user_id))].sort();
  const usersLookupQuery = useQuery({
    queryKey: memberQueryKeys.usersLookup(memberUserIds),
    enabled: enabled && Boolean(workspaceId) && memberUserIds.length > 0,
    queryFn: async ({ signal }) => {
      return lookupUsersUsersLookupPost(
        { user_ids: memberUserIds },
        {
          signal,
          ...request,
        },
      );
    },
  });

  return {
    membersQuery,
    usersLookupQuery,
  };
};
