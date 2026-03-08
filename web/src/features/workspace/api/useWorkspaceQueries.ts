import { useListUserWorkspacesUsersMeWorkspacesGet } from "@/generated/api";
import { getAuthorizedRequestOptions } from "@/lib/api";
import { workspaceQueryKeys } from "./workspaceQueryKeys";

type UseWorkspaceQueriesParams = {
  accessToken: string | undefined;
  enabled: boolean;
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
