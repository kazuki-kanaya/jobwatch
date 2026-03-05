import { useListUserWorkspacesUsersMeWorkspacesGet } from "@/generated/api";
import { workspaceQueryKeys } from "./workspaceQueryKeys";

type UseWorkspaceQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
  workspaceId?: string;
};

const getAuthorizedRequestOptions = (accessToken: string | undefined) => {
  if (!accessToken) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const useWorkspaceQueries = ({ accessToken, enabled }: UseWorkspaceQueriesParams) => {
  const request = getAuthorizedRequestOptions(accessToken);

  const workspacesQuery = useListUserWorkspacesUsersMeWorkspacesGet({
    query: {
      queryKey: workspaceQueryKeys.list(),
      enabled,
    },
    request,
  });

  return {
    workspacesQuery,
  };
};
