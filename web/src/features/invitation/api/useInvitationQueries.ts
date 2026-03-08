import { useQuery } from "@tanstack/react-query";
import { lookupUsersUsersLookupPost, useListInvitationsWorkspacesWorkspaceIdInvitationsGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { invitationQueryKeys } from "./invitationQueryKeys";

type UseInvitationQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId: string;
};

export const useInvitationQueries = ({ accessToken, enabled, workspaceId }: UseInvitationQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  const invitationsQuery = useListInvitationsWorkspacesWorkspaceIdInvitationsGet(workspaceId, {
    query: {
      queryKey: invitationQueryKeys.list(workspaceId),
      enabled: enabled && Boolean(workspaceId),
    },
    request,
  });

  const createdByUserIds = [
    ...new Set((invitationsQuery.data?.invitations ?? []).map((invitation) => invitation.created_by_user_id)),
  ].sort();

  const usersLookupQuery = useQuery({
    queryKey: invitationQueryKeys.usersLookup(createdByUserIds),
    enabled: enabled && Boolean(workspaceId) && createdByUserIds.length > 0,
    queryFn: async ({ signal }) => {
      return lookupUsersUsersLookupPost(
        { user_ids: createdByUserIds },
        {
          signal,
          ...request,
        },
      );
    },
  });

  return {
    invitationsQuery,
    usersLookupQuery,
  };
};
